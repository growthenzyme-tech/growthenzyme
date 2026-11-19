
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

function getFirestoreUrl(path = "") {
  if (!PROJECT_ID) {
    throw new Error("Firebase project ID is missing.");
  }

  return `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents${path}`;
}

// Convert Firestore REST values into normal JavaScript values.
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

// Convert JavaScript values into Firestore REST values.
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

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(toFirestoreValue),
      },
    };
  }

  if (typeof value === "object") {
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

// Verify the Firebase user and administrator permissions.
async function verifyAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");

  if (!token || !API_KEY) {
    return false;
  }

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

  if (!authResponse.ok) {
    return false;
  }

  const authData = await authResponse.json();
  const firebaseUser = authData.users?.[0];
  const uid = firebaseUser?.localId;

  if (!uid || firebaseUser.disabled === true) {
    return false;
  }

  const accessToken = await getFirebaseAccessToken();

  // Get the user's Firestore profile.
  const profileResponse = await fetch(
    getFirestoreUrl(`/users/${encodeURIComponent(uid)}`),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!profileResponse.ok) {
    return false;
  }

  const profileDocument = await profileResponse.json();
  const profile = fromFirestoreFields(profileDocument.fields || {});

  if (profile.isActive !== true) {
    return false;
  }

  // Legacy administrator account.
  if (profile.role === "admin") {
    return true;
  }

  // Check custom administrator role.
  if (typeof profile.roleId !== "string" || !profile.roleId) {
    return false;
  }

  const roleResponse = await fetch(
    getFirestoreUrl(`/roles/${encodeURIComponent(profile.roleId)}`),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!roleResponse.ok) {
    return false;
  }

  const roleDocument = await roleResponse.json();
  const role = fromFirestoreFields(roleDocument.fields || {});

  return (
    role.isActive === true &&
    typeof role.name === "string" &&
    ["admin", "administrator"].includes(role.name.toLowerCase())
  );
}

// Validate role information before saving.
function validateRole(body: any) {
  if (
    !body ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.trim().length > 50
  ) {
    throw new Error("Role name must be between 1 and 50 characters.");
  }

  if (
    typeof body.description !== "string" ||
    body.description.length > 160
  ) {
    throw new Error("Description must not exceed 160 characters.");
  }

  if (
    ["admin", "administrator"].includes(body.name.trim().toLowerCase())
  ) {
    throw new Error("This role name is reserved.");
  }

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
    throw new Error("Please provide all valid role permissions.");
  }

  if (typeof body.isActive !== "boolean") {
    throw new Error("Invalid role status.");
  }

  return {
    name: body.name.trim(),
    description: body.description.trim(),
    permissions,
    isActive: body.isActive,
  };
}

// GET: Retrieve all roles.
export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const accessToken = await getFirebaseAccessToken();

    let pageToken = "";
    const roles: any[] = [];

    do {
      const query = new URLSearchParams({
        pageSize: "100",
      });

      if (pageToken) {
        query.set("pageToken", pageToken);
      }

      const response = await fetch(
        `${getFirestoreUrl("/roles")}?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to retrieve roles.");
      }

      const result = await response.json();

      for (const document of result.documents || []) {
        const id = document.name.split("/").pop();

        roles.push({
          id,
          ...fromFirestoreFields(document.fields || {}),
        });
      }

      pageToken = result.nextPageToken || "";
    } while (pageToken);

    roles.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    });

    return NextResponse.json({ roles });
  } catch (error: any) {
    console.error("GET roles error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to retrieve roles." },
      { status: 500 }
    );
  }
}

// POST: Create a new role.
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const role = validateRole(body);

    const accessToken = await getFirebaseAccessToken();
    const now = new Date().toISOString();

    const fields = {
      ...Object.fromEntries(
        Object.entries(role).map(([key, value]) => [
          key,
          toFirestoreValue(value),
        ])
      ),
      createdAt: { timestampValue: now },
      updatedAt: { timestampValue: now },
    };

    const response = await fetch(getFirestoreUrl("/roles"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Firestore create role error:", errorData);

      throw new Error("Failed to create role.");
    }

    const result = await response.json();
    const id = result.name.split("/").pop();

    return NextResponse.json(
      {
        message: "Role created successfully.",
        id,
        role: {
          id,
          ...role,
          createdAt: now,
          updatedAt: now,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST roles error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create role." },
      { status: 400 }
    );
  }
}
