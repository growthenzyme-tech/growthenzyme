import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getFirebaseAccessToken } from "@/app/lib/firebase-admin";

type Env = {
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
};

type FirestoreValue = {
  stringValue?: string;
  booleanValue?: boolean;
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

type FirestoreDocument = {
  fields?: Record<string, FirestoreValue>;
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
  fields: Record<string, FirestoreValue> | undefined,
  name: string
): string {
  return fields?.[name]?.stringValue ?? "";
}

function booleanField(
  fields: Record<string, FirestoreValue> | undefined,
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

async function getAuthorizedAdminUid(
  idToken: string,
  apiKey: string,
  projectId: string,
  serviceToken: string
): Promise<string | null> {
  const authResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!authResponse.ok) return null;

  const authData = await authResponse.json() as {
    users?: Array<{ localId: string; disabled?: boolean }>;
  };
  const admin = authData.users?.[0];

  if (!admin || admin.disabled) return null;

  const profile = await getDocument(
    projectId,
    serviceToken,
    "users",
    admin.localId
  );

  if (!profile?.fields || !booleanField(profile.fields, "isActive")) {
    return null;
  }

  if (stringField(profile.fields, "role") === "admin") {
    return admin.localId;
  }

  const roleId = stringField(profile.fields, "roleId");

  if (!roleId) return null;

  const role = await getDocument(projectId, serviceToken, "roles", roleId);

  if (!role?.fields) return null;

  const permissions = role.fields.permissions?.mapValue?.fields;

  return booleanField(role.fields, "isActive") &&
    booleanField(permissions, "users")
    ? admin.localId
    : null;
}

export async function DELETE(
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

    const serviceToken = await getFirebaseAccessToken();
    const adminUid = await getAuthorizedAdminUid(
      idToken,
      apiKey,
      projectId,
      serviceToken
    );

    if (!adminUid) {
      return NextResponse.json(
        { error: "You do not have permission to delete users." },
        { status: 403 }
      );
    }

    if (adminUid === uid) {
      return NextResponse.json(
        { error: "You cannot delete your own administrator account." },
        { status: 403 }
      );
    }

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

    const targetRoleId = stringField(target.fields, "roleId");
    const targetRole = targetRoleId
      ? await getDocument(projectId, serviceToken, "roles", targetRoleId)
      : null;
    const targetRoleName = stringField(targetRole?.fields, "name")
      .trim()
      .toLowerCase();

    if (
      stringField(target.fields, "role").trim().toLowerCase() === "admin" ||
      targetRoleId === "system-admin" ||
      targetRoleName === "admin" ||
      targetRoleName === "administrator"
    ) {
      return NextResponse.json(
        { error: "Protected administrator accounts cannot be deleted here." },
        { status: 403 }
      );
    }

    const authDeleteResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:delete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ localId: uid }),
      }
    );

    if (!authDeleteResponse.ok) {
      const authDeleteError = await authDeleteResponse.json().catch(() => null);
      const errorCode = authDeleteError?.error?.message;

      if (
        authDeleteResponse.status !== 404 &&
        errorCode !== "USER_NOT_FOUND"
      ) {
        console.error("Firebase Auth user deletion failed:", {
          status: authDeleteResponse.status,
          error: errorCode || "UNKNOWN_ERROR",
        });
        return NextResponse.json(
          { error: "Unable to delete the user's authentication account." },
          { status: 502 }
        );
      }
    }

    const profileDeleteResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}` +
        `/databases/(default)/documents/users/${encodeURIComponent(uid)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${serviceToken}` },
      }
    );

    if (!profileDeleteResponse.ok && profileDeleteResponse.status !== 404) {
      console.error("Firestore user profile deletion failed:", {
        status: profileDeleteResponse.status,
      });
      return NextResponse.json(
        {
          error:
            "The authentication account was deleted, but its profile could not be removed. Retry to finish cleanup.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User account and profile deleted permanently.",
    });
  } catch (error) {
    console.error(
      "CMS user deletion error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to delete the user. Please try again." },
      { status: 500 }
    );
  }
}
