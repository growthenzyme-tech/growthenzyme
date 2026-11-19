import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export type GeneralSettings = {
  websiteName: string;
  featuredBlogId?: string;

  defaultMetaDescription: string;
  defaultSocialImage: string;
  footerCopyright: string;

  contactEmail: string;
  phone: string;
  address: string;

 socialLinks: {
  linkedin: string;
  instagram: string;
  facebook: string;
  threads: string;
  x: string;
};

  commentsEnabled: boolean;
  requireCommentApproval: boolean;
  postsPerPage: number;

  maxFeaturedCaseStudies: number;
  showLeadCapture: boolean;

  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
};

export const defaultGeneralSettings: GeneralSettings = {
  websiteName: "GrowthEnzyme",
  featuredBlogId: "",
 
  defaultMetaDescription: "",
  defaultSocialImage: "",
  footerCopyright: "",

  contactEmail: "",
  phone: "",
  address: "",

socialLinks: {
  linkedin: "",
  instagram: "",
  facebook: "",
  threads: "",
  x: "",
},

  commentsEnabled: true,
  requireCommentApproval: true,
  postsPerPage: 9,

  maxFeaturedCaseStudies: 3,
  showLeadCapture: true,

  announcementEnabled: false,
  announcementText: "",
  announcementLink: "",
};

const settingsRef = doc(db, "settings", "general");

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const snapshot = await getDoc(settingsRef);

  if (!snapshot.exists()) {
    return defaultGeneralSettings;
  }

  const data = snapshot.data();

  return {
    ...defaultGeneralSettings,
    ...data,
    socialLinks: {
      ...defaultGeneralSettings.socialLinks,
      ...(data.socialLinks || {}),
    },
  } as GeneralSettings;
}

export async function updateGeneralSettings(
  data: GeneralSettings
): Promise<void> {
  await setDoc(
    settingsRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}


export async function updateFeaturedBlogId(
  blogId: string
): Promise<void> {
  await setDoc(
    settingsRef,
    {
      featuredBlogId: blogId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}