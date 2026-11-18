
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getFirebaseAccessToken } from "@/app/lib/firebase-admin";

type Env = {
  FIREBASE_SERVICE_ACCOUNT_JSON?: string;
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
};

type FirestoreDocument = {
  fields?: Record<string, any>;
};

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

async function verifyAdministrator(
  idToken: string,
  apiKey: string,
  projectId: string,
  serviceToken: string
): Promise<boolean> {
  // Verify the Firebase ID token with Firebase Authentication.
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

  const authenticatedUser = authData.users?.[0];

  if (!authenticatedUser || authenticatedUser.disabled) {
    return false;
  }

  // Read the administrator's profile using the server credential.
  const profile = await getFirestoreDocument(
    projectId,
    serviceToken,
    "users",
    authenticatedUser.localId
  );

  if (!profile?.fields) return false;

  const fields = profile.fields;

  if (!booleanField(fields, "isActive")) return false;

  // Preserve compatibility with the existing administrator account.
  if (stringField(fields, "role") === "admin") {
    return true;
  }

  // Check custom role permissions.
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

export async function POST(request: NextRequest) {
  let createdUserId = "";
  let createdUserToken = "";

  try {
    const { env } = getCloudflareContext();

    const cloudflareEnv = env as Env;

    const apiKey = cloudflareEnv.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = cloudflareEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!apiKey || !projectId) {
      return NextResponse.json(
        { error: "Firebase configuration is incomplete." },
        { status: 500 }
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

    // Obtain server-side Firestore authorization.
    const serviceToken = await getFirebaseAccessToken();

    // Verify the current administrator and their permission.
    const isAuthorized = await verifyAdministrator(
      idToken,
      apiKey,
      projectId,
      serviceToken
    );

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "You do not have permission to create CMS users." },
        { status: 403 }
      );
    }

    const body = await request.json() as {
      name?: string;
      email?: string;
      password?: string;
      roleId?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const roleId = body.roleId?.trim() ?? "";

    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        { error: "Name cannot exceed 80 characters." },
        { status: 400 }
      );
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must contain at least 6 characters." },
        { status: 400 }
      );
    }

    if (roleId === "system-admin") {
      return NextResponse.json(
        { error: "The system administrator role cannot be assigned here." },
        { status: 400 }
      );
    }

    // Confirm that the selected role exists and is active.
    const role = await getFirestoreDocument(
      projectId,
      serviceToken,
      "roles",
      roleId
    );

    if (
      !role?.fields ||
      !booleanField(role.fields, "isActive")
    ) {
      return NextResponse.json(
        { error: "Selected role is unavailable or inactive." },
        { status: 400 }
      );
    }

    // Create the Firebase Authentication account.
    const createResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const createData = await createResponse.json() as {
      localId?: string;
      idToken?: string;
      error?: {
        message?: string;
      };
    };

    if (!createResponse.ok || !createData.localId || !createData.idToken) {
      const authError = createData.error?.message;

      if (authError === "EMAIL_EXISTS") {
        return NextResponse.json(
          { error: "This email address is already registered." },
          { status: 409 }
        );
      }

      if (authError === "WEAK_PASSWORD") {
        return NextResponse.json(
          { error: "The password must contain at least 6 characters." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Unable to create the authentication account." },
        { status: 400 }
      );
    }

    createdUserId = createData.localId;
    createdUserToken = createData.idToken;

    // Create the Firestore user profile.
    const timestamp = new Date().toISOString();

    const profileResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}` +
        `/databases/(default)/documents/users/${encodeURIComponent(createdUserId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            name: { stringValue: name },
            email: { stringValue: email },
            roleId: { stringValue: roleId },
            isActive: { booleanValue: true },
           
            createdAt: { timestampValue: timestamp },
            updatedAt: { timestampValue: timestamp },
          },
        }),
      }
    );

    if (!profileResponse.ok) {
      throw new Error("Unable to create the Firestore user profile.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "CMS user created successfully.",
        user: {
          uid: createdUserId,
          name,
          email,
          roleId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CMS user creation error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    // Roll back the Auth account if profile creation failed.
    if (createdUserId && createdUserToken) {
      try {
        const { env } = getCloudflareContext();
        const cloudflareEnv = env as Env;

        await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${cloudflareEnv.NEXT_PUBLIC_FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: createdUserToken,
            }),
          }
        );
      } catch (cleanupError) {
        console.error(
          "Unable to roll back incomplete Auth account:",
          cleanupError instanceof Error
            ? cleanupError.message
            : "Unknown cleanup error"
        );
      }
    }

    return NextResponse.json(
      { error: "Unable to create the CMS user. Please try again." },
      { status: 500 }
    );
  }
}
