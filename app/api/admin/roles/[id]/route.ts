
import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAccessToken } from "@/app/lib/firebase-admin";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const PERMISSION_KEYS = [
  "dashboard",
  "blogs",
  "blogsCreate",
  "blogsEdit",
  "blogsPublish",
  "blogsDelete",
  "comments",
  "media",
  "caseStudies",
  "users",
  "settings",
] as const;

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getFirestoreUrl(path = "") {
  if (!PROJECT_ID) {
    throw new Error("Firebase project ID is missing.");
  }

  return `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents${path}`;
}

function fromFirestoreValue(value: any): any {
  if (!value) return null;

  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;

  if ("mapValue" in value) {
    return fromFirestoreFields(value.mapValue.fields || {});
  }

  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(fromFirestoreValue);
  }

  return null;
}

function fromFirestoreFields(fields: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      fromFirestoreValue(value),
    ])
  );
}

function toFirestoreValue(value: any): any {
  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }

  if (value === null) {
    return { nullValue: null };
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value).map(([key, item]) => [
            key,
            toFirestoreValue(item),
          ])
        ),
      },
    };
  }

  throw new Error("Invalid Firestore value.");
}

// Verify the logged-in administrator.
async function verifyAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");

  if (!token || !API_KEY) return false;

  const authResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: token }),
      cache: "no-store",
    }
  );

  if (!authResponse.ok) return false;

  const authData = await authResponse.json();
  const firebaseUser = authData.users?.[0];
  const uid = firebaseUser?.localId;

  if (!uid || firebaseUser.disabled === true) return false;

  const accessToken = await getFirebaseAccessToken();

  const profileResponse = await fetch(
    getFirestoreUrl(`/users/${encodeURIComponent(uid)}`),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!profileResponse.ok) return false;

  const profileDocument = await profileResponse.json();
  const profile = fromFirestoreFields(profileDocument.fields || {});

  if (profile.isActive !== true) return false;

  if (profile.role === "admin") return true;

  const roleId = profile.roleId;

  if (typeof roleId !== "string" || !roleId) return false;

  const roleResponse = await fetch(
    getFirestoreUrl(`/roles/${encodeURIComponent(roleId)}`),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!roleResponse.ok) return false;

  const roleDocument = await roleResponse.json();
  const role = fromFirestoreFields(roleDocument.fields || {});

  return (
    role.isActive === true &&
    typeof role.name === "string" &&
    ["admin", "administrator"].includes(role.name.toLowerCase())
  );
}

// Validate only the fields supplied in PATCH.
function validateUpdate(body: any) {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    throw new Error("Invalid request body.");
  }

  const allowedFields = [
    "name",
    "description",
    "permissions",
    "isActive",
  ];

  const keys = Object.keys(body);

  if (
    keys.length === 0 ||
    keys.some((key) => !allowedFields.includes(key))
  ) {
    throw new Error("Invalid or empty update.");
  }

  const update: Record<string, any> = {};

  if (body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      !body.name.trim() ||
      body.name.trim().length > 50
    ) {
      throw new Error("Invalid role name.");
    }

    if (
      ["admin", "administrator"].includes(
        body.name.trim().toLowerCase()
      )
    ) {
      throw new Error("This role name is reserved.");
    }

    update.name = body.name.trim();
  }

  if (body.description !== undefined) {
    if (
      typeof body.description !== "string" ||
      body.description.length > 160
    ) {
      throw new Error("Invalid role description.");
    }

    update.description = body.description.trim();
  }

  if (body.permissions !== undefined) {
    const permissions = body.permissions;

    if (
      !permissions ||
      typeof permissions !== "object" ||
      Array.isArray(permissions)
    ) {
      throw new Error("Invalid permissions.");
    }

    const keys = Object.keys(permissions);

    if (
      keys.length !== PERMISSION_KEYS.length ||
      !PERMISSION_KEYS.every((key) => keys.includes(key)) ||
      !PERMISSION_KEYS.every(
        (key) => typeof permissions[key] === "boolean"
      )
    ) {
      throw new Error("Invalid role permissions.");
    }

    update.permissions = permissions;
  }

  if (body.isActive !== undefined) {
    if (typeof body.isActive !== "boolean") {
      throw new Error("Invalid role status.");
    }

    update.isActive = body.isActive;
  }

  return update;
}

// PATCH: Update a role.
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id || id === "system-admin") {
      return NextResponse.json(
        { error: "The System Admin role cannot be modified." },
        { status: 403 }
      );
    }

    const accessToken = await getFirebaseAccessToken();

    const roleResponse = await fetch(
      getFirestoreUrl(`/roles/${encodeURIComponent(id)}`),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!roleResponse.ok) {
      return NextResponse.json(
        { error: "Role not found." },
        { status: 404 }
      );
    }

    const roleDocument = await roleResponse.json();
    const existingRole = fromFirestoreFields(
      roleDocument.fields || {}
    );

    if (
      ["admin", "administrator"].includes(
        String(existingRole.name || "").toLowerCase()
      )
    ) {
      return NextResponse.json(
        { error: "Administrator roles cannot be modified." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const update = validateUpdate(body);

    const fields = {
      ...Object.fromEntries(
        Object.entries(update).map(([key, value]) => [
          key,
          toFirestoreValue(value),
        ])
      ),
      updatedAt: {
        timestampValue: new Date().toISOString(),
      },
    };

    const updateFields = Object.keys(fields);

    const query = new URLSearchParams();

    updateFields.forEach((field) => {
      query.append("updateMask.fieldPaths", field);
    });

    const response = await fetch(
      `${getFirestoreUrl(`/roles/${encodeURIComponent(id)}`)}?${query.toString()}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update role.");
    }

    return NextResponse.json({
      message: "Role updated successfully.",
    });
  } catch (error: any) {
    console.error("PATCH role error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update role." },
      { status: 400 }
    );
  }
}

// DELETE: Delete a role.
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id || id === "system-admin") {
      return NextResponse.json(
        { error: "The System Admin role cannot be deleted." },
        { status: 403 }
      );
    }

    const accessToken = await getFirebaseAccessToken();

    // Check whether the role exists.
    const roleResponse = await fetch(
      getFirestoreUrl(`/roles/${encodeURIComponent(id)}`),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!roleResponse.ok) {
      return NextResponse.json(
        { error: "Role not found." },
        { status: 404 }
      );
    }

    const roleDocument = await roleResponse.json();
    const role = fromFirestoreFields(roleDocument.fields || {});

    if (
      ["admin", "administrator"].includes(
        String(role.name || "").toLowerCase()
      )
    ) {
      return NextResponse.json(
        { error: "Administrator roles cannot be deleted." },
        { status: 403 }
      );
    }

    // Check whether users are assigned to this role.
    const queryResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "users" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "roleId" },
                op: "EQUAL",
                value: { stringValue: id },
              },
            },
            limit: 1,
          },
        }),
        cache: "no-store",
      }
    );

    if (!queryResponse.ok) {
      throw new Error("Failed to check assigned users.");
    }

    const queryResult = await queryResponse.json();

    const hasAssignedUsers = queryResult.some(
      (item: any) => item.document
    );

    if (hasAssignedUsers) {
      return NextResponse.json(
        {
          error:
            "This role is assigned to users. Reassign those users before deleting it.",
        },
        { status: 409 }
      );
    }

    // Delete the role.
    const deleteResponse = await fetch(
      getFirestoreUrl(`/roles/${encodeURIComponent(id)}`),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete role.");
    }

    return NextResponse.json({
      message: "Role deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE role error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to delete role." },
      { status: 400 }
    );
  }
}
