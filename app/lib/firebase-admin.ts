
import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

type FirebaseServiceAccount = {
  type: string;
  project_id: string;
  private_key: string;
  private_key_id: string;
  client_email: string;
  token_uri?: string;
};

type CloudflareSecrets = {
  FIREBASE_SERVICE_ACCOUNT_JSON_BASE64?: string;
  FIREBASE_SERVICE_ACCOUNT_JSON?: string;
};

function base64UrlEncode(input: Uint8Array): string {
  let binary = "";

  for (const byte of input) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function encodeJson(value: unknown): string {
  return base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(value))
  );
}

function getPrivateKeyBytes(
  privateKey: string
): Uint8Array<ArrayBuffer> {
  const pem = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  const binary = atob(pem);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function getServiceAccount(): FirebaseServiceAccount {
  const env = getCloudflareContext().env as CloudflareSecrets;

  const encodedCredentials =
    env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;

  const rawCredentials =
    env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  try {
    let credentialsText = "";

    if (encodedCredentials) {
      const binary = atob(encodedCredentials.trim());

      const bytes = Uint8Array.from(
        binary,
        (character) => character.charCodeAt(0)
      );

      credentialsText = new TextDecoder().decode(bytes);
    } else if (rawCredentials) {
      credentialsText = rawCredentials;
    } else {
      throw new Error("Credentials missing");
    }

    const credentials = JSON.parse(
      credentialsText
    ) as FirebaseServiceAccount;

    if (
      credentials.type !== "service_account" ||
      !credentials.project_id ||
      !credentials.client_email ||
      !credentials.private_key
    ) {
      throw new Error("Credentials incomplete");
    }

    return credentials;
  } catch {
    throw new Error(
      "Firebase service-account credentials are missing, invalid, or incomplete."
    );
  }
}

export async function getFirebaseAccessToken(): Promise<string> {
  const credentials = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: credentials.private_key_id,
  };

  const claims = {
    iss: credentials.client_email,
   scope: [
  "https://www.googleapis.com/auth/datastore",
  "https://www.googleapis.com/auth/identitytoolkit",
].join(" "),
    aud:
      credentials.token_uri ||
      "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const unsignedToken =
    `${encodeJson(header)}.${encodeJson(claims)}`;

  // Import the service-account private key
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    getPrivateKeyBytes(credentials.private_key),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  // Sign the JWT
  const payloadBytes = new TextEncoder().encode(unsignedToken);

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new Uint8Array(payloadBytes).buffer
  );

  const signedJwt =
    `${unsignedToken}.${base64UrlEncode(
      new Uint8Array(signature)
    )}`;

  // Exchange the signed JWT for a Google access token
  const tokenUri =
    credentials.token_uri ||
    "https://oauth2.googleapis.com/token";

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type:
        "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedJwt,
    }),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to authenticate with Google. Check the service-account configuration."
    );
  }

  const tokenData = (await response.json()) as {
    access_token?: string;
  };

  if (!tokenData.access_token) {
    throw new Error("Google did not return an access token.");
  }

  return tokenData.access_token;
}
