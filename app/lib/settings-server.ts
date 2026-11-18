
import "server-only";

import {
  getFirebaseAccessToken,
  hasFirebaseServiceAccount,
} from "@/app/lib/firebase-admin";

type FirestoreStringValue = {
  stringValue?: string;
};

export async function getDefaultSeoDescription(): Promise<string> {
  if (!hasFirebaseServiceAccount()) {
    return "";
  }

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "growthenzyme-cms";

  try {
    const accessToken = await getFirebaseAccessToken();

    const endpoint =
      `https://firestore.googleapis.com/v1/projects/${projectId}` +
      `/databases/(default)/documents/settings/general`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return "";
    }

    const document = await response.json();

    const fields = document.fields || {};

    const description = (
      fields.defaultMetaDescription as FirestoreStringValue | undefined
    )?.stringValue;

    return description?.trim() || "";
  } catch {
    return "";
  }
}

export async function getDefaultSocialImage(): Promise<string> {
  if (!hasFirebaseServiceAccount()) {
    return "";
  }

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "growthenzyme-cms";

  try {
    const accessToken = await getFirebaseAccessToken();

    const endpoint =
      `https://firestore.googleapis.com/v1/projects/${projectId}` +
      `/databases/(default)/documents/settings/general`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return "";
    }

    const document = await response.json();

    return (
      document.fields?.defaultSocialImage?.stringValue?.trim() || ""
    );
  } catch {
    return "";
  }
}