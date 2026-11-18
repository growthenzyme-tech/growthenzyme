
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
    // Local Next.js development can use process.env.
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

async function getFirestoreDocument(
  projectId: string,
  token: string,
  collectionName: string,
  documentId: string
): Promise<FirestoreDocument | null> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/${collectionName}/${encodeURIComponent(documentId)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Unable to read Firestore document.");
  }

  return (await response.json()) as FirestoreDocument;
}

async function verifyUserManagementPermission(
  idToken: string,
  apiKey: string,
  projectId: string,
  serviceToken: string
): Promise<boolean> {
  const authResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!authResponse.ok) return false;

  const authData = (await authResponse.json()) as {
    users?: Array<{
      localId: string;
      disabled?: boolean;
    }>;
  };

  const admin = authData.users?.[0];

  if (!admin || admin.disabled) return false;

  const profile = await getFirestoreDocument(
    projectId,
    serviceToken,
    "users",
    admin.localId
  );

  if (!profile?.fields) return false;

  const fields = profile.fields;

  if (!booleanField(fields, "isActive")) return false;

  // Existing administrator account.
  if (stringField(fields, "role") === "admin") {
    return true;
  }

  // Custom roles must explicitly have user-management permission.
  const roleId = stringField(fields, "roleId");

  if (!roleId) return false;

  const role = await getFirestoreDocument(
    projectId,
    serviceToken,
    "roles",
    roleId
  );

  if (!role?.fields) return false;

  const permissions =
    role.fields.permissions?.mapValue?.fields;

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

    const { NEXT_PUBLIC_FIREBASE_API_KEY: apiKey, NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId } =
      getEnv();

    if (!apiKey || !projectId) {
      return NextResponse.json(
        { error: "Firebase configuration is incomplete." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as {
      password?: string;
    };

    const password = body.password ?? "";

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must contain at least 6 characters." },
        { status: 400 }
      );
    }

    const serviceToken = await getFirebaseAccessToken();

    const authorized = await verifyUserManagementPermission(
      idToken,
      apiKey,
      projectId,
      serviceToken
    );

    if (!authorized) {
      return NextResponse.json(
        { error: "You do not have permission to change user passwords." },
        { status: 403 }
      );
    }

    // Do not allow this endpoint to change the current admin's password
    // or the protected system administrator account through this screen.
    const targetProfile = await getFirestoreDocument(
      projectId,
      serviceToken,
      "users",
      uid
    );

    if (!targetProfile?.fields) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    if (stringField(targetProfile.fields, "role") === "admin" ||
        stringField(targetProfile.fields, "roleId") === "system-admin") {
      return NextResponse.json(
        { error: "The protected administrator account cannot be changed here." },
        { status: 403 }
      );
    }

    // Update the target user's Firebase Authentication password.
    const updateResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          localId: uid,
          password,
        }),
      }
    );

  if (!updateResponse.ok) {
  const errorData = await updateResponse.json().catch(() => null);

  const firebaseError =
    errorData?.error?.message || "UNKNOWN_ERROR";

  console.error("Firebase password update failed:", {
    status: updateResponse.status,
    error: firebaseError,
  });

  return NextResponse.json(
    {
      error: "Unable to update the user's password.",
      details:
        process.env.NODE_ENV === "development"
          ? firebaseError
          : undefined,
    },
    { status: 400 }
  );
}

    return NextResponse.json({
      success: true,
      message: "User password updated successfully.",
    });
  } catch (error) {
    console.error(
      "CMS password update error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to update the password. Please try again." },
      { status: 500 }
    );
  }
}
