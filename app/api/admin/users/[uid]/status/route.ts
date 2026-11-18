
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getFirebaseAccessToken } from "@/app/lib/firebase-admin";

type Env = {
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
};

type FirestoreDocument = {
  fields?: Record<string, any>;
};

function getEnv(): Env {
  let cloudflareEnv: Env = {};

  try {
    cloudflareEnv = getCloudflareContext().env as Env;
  } catch {
    // Local development fallback.
  }

  return {
    NEXT_PUBLIC_FIREBASE_API_KEY:
      cloudflareEnv.NEXT_PUBLIC_FIREBASE_API_KEY ||
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      cloudflareEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
}

function stringField(
  fields: Record<string, any> | undefined,
  name: string
): string {
  return fields?.[name]?.stringValue ?? "";
}

function booleanField(
  fields: Record<string, any> | undefined,
  name: string
): boolean {
  return fields?.[name]?.booleanValue === true;
}

async function getDocument(
  projectId: string,
  token: string,
  collectionName: string,
  documentId: string
): Promise<FirestoreDocument | null> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/${collectionName}/${encodeURIComponent(documentId)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Unable to read Firestore document.");
  }

  return response.json() as Promise<FirestoreDocument>;
}

async function verifyPermission(
  idToken: string,
  apiKey: string,
  projectId: string,
  serviceToken: string
): Promise<boolean> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) return false;

  const data = await response.json() as {
    users?: Array<{ localId: string; disabled?: boolean }>;
  };

  const admin = data.users?.[0];

  if (!admin || admin.disabled) return false;

  const profile = await getDocument(
    projectId,
    serviceToken,
    "users",
    admin.localId
  );

  if (!profile?.fields || !booleanField(profile.fields, "isActive")) {
    return false;
  }

  if (stringField(profile.fields, "role") === "admin") {
    return true;
  }

  const roleId = stringField(profile.fields, "roleId");
  if (!roleId) return false;

  const role = await getDocument(
    projectId,
    serviceToken,
    "roles",
    roleId
  );

  if (!role?.fields) return false;

  const permissions = role.fields.permissions?.mapValue?.fields;

  return (
    booleanField(role.fields, "isActive") &&
    booleanField(permissions, "users")
  );
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await context.params;

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const authorization = request.headers.get("Authorization");
    const idToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : "";

    if (!idToken) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const {
      NEXT_PUBLIC_FIREBASE_API_KEY: apiKey,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId,
    } = getEnv();

    if (!apiKey || !projectId) {
      return NextResponse.json(
        { error: "Firebase configuration is incomplete." },
        { status: 500 }
      );
    }

    const body = await request.json() as { isActive?: boolean };

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { error: "A valid account status is required." },
        { status: 400 }
      );
    }

    const serviceToken = await getFirebaseAccessToken();

    const authorized = await verifyPermission(
      idToken,
      apiKey,
      projectId,
      serviceToken
    );

    if (!authorized) {
      return NextResponse.json(
        { error: "You do not have permission to manage users." },
        { status: 403 }
      );
    }

    // Read the target user's profile.
    const target = await getDocument(
      projectId,
      serviceToken,
      "users",
      uid
    );

    if (!target?.fields) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    // Do not allow changing protected administrator accounts.
    const targetRoleId = stringField(target.fields, "roleId");
    const targetRole = targetRoleId
      ? await getDocument(projectId, serviceToken, "roles", targetRoleId)
      : null;

    const targetRoleName = stringField(targetRole?.fields, "name")
      .trim()
      .toLowerCase();

    if (
      stringField(target.fields, "role") === "admin" ||
      targetRoleId === "system-admin" ||
      targetRoleName === "admin" ||
      targetRoleName === "administrator"
    ) {
      return NextResponse.json(
        { error: "Protected administrator accounts cannot be changed here." },
        { status: 403 }
      );
    }

    const timestamp = new Date().toISOString();

    // Update Firebase Authentication first.
    const authResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          localId: uid,
          disableUser: !body.isActive,
        }),
      }
    );

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => null);

      console.error("Firebase account status update failed:", {
        status: authResponse.status,
        error: errorData?.error?.message,
      });

      return NextResponse.json(
        { error: "Unable to update Firebase account status." },
        { status: 400 }
      );
    }

    // Update the Firestore profile.
    const firestoreUrl =
      `https://firestore.googleapis.com/v1/projects/${projectId}` +
      `/databases/(default)/documents/users/${encodeURIComponent(uid)}` +
      `?updateMask.fieldPaths=isActive&updateMask.fieldPaths=updatedAt`;

    const firestoreResponse = await fetch(firestoreUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          isActive: { booleanValue: body.isActive },
          updatedAt: { timestampValue: timestamp },
        },
      }),
    });

    if (!firestoreResponse.ok) {
      // Roll back the Auth status if Firestore update fails.
      await fetch(
        `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            localId: uid,
            disableUser: !booleanField(target.fields, "isActive"),
          }),
        }
      ).catch(() => null);

      return NextResponse.json(
        { error: "Unable to save the account status." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isActive: body.isActive,
      message: body.isActive
        ? "User activated successfully."
        : "User deactivated successfully.",
    });
  } catch (error) {
    console.error(
      "User status update error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to update user status. Please try again." },
      { status: 500 }
    );
  }
}
