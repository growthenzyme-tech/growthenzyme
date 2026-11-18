
import "server-only";

import { getFirebaseAccessToken } from "@/app/lib/firebase-admin";

type FirestoreStringValue = {
  stringValue?: string;
};

export async function getDefaultSeoDescription(): Promise<string> {
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
      console.error(
        "Unable to fetch general settings for SEO:",
        response.status
      );
      return "";
    }

    const document = await response.json();

    const fields = document.fields || {};

    const description = (
      fields.defaultMetaDescription as FirestoreStringValue | undefined
    )?.stringValue;

    return description?.trim() || "";
  } catch (error) {
    console.error("SEO settings error:", error);
    return "";
  }
}

export async function getDefaultSocialImage(): Promise<string> {
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
      console.error(
        "Unable to fetch social share image:",
        response.status
      );
      return "";
    }

    const document = await response.json();

    return (
      document.fields?.defaultSocialImage?.stringValue?.trim() || ""
    );
  } catch (error) {
    console.error("Social image settings error:", error);
    return "";
  }
}