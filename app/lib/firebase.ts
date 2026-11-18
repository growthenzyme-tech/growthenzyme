
import {
  initializeApp,
  getApps,
  getApp,
  deleteApp,
  type FirebaseApp,
} from "firebase/app";

import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyB5OVrLYAR5zJAmm422lKgvGgbIS40U7w8",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "growthenzyme-cms.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "growthenzyme-cms",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "growthenzyme-cms.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "978032210326",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:978032210326:web:0efd042ec4e6bbcdfa6db7",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-QQWB2LP1X4",
};

let app: FirebaseApp;
const existingApps = getApps();

if (existingApps.length > 0) {
  const current = getApp();

  if (current.options.apiKey !== firebaseConfig.apiKey) {
    try {
      deleteApp(current);
    } catch {
      // Ignore cleanup errors.
    }

    app = initializeApp(firebaseConfig);
  } else {
    app = current;
  }
} else {
  app = initializeApp(firebaseConfig);
}

let auth: Auth;
try {
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase Auth Warning:", error);
  auth = {} as Auth;
}

let db: Firestore;
try {
  db = getFirestore(app);
} catch (error) {
  console.warn("Firestore Warning:", error);
  db = {} as Firestore;
}

/**
 * Separate Firebase Auth instance for creating CMS users.
 * This keeps the currently logged-in Admin session intact.
 */
export function getSecondaryAuth(): Auth {
  const secondaryAppName = "cms-user-creation";

  const secondaryApp =
    getApps().find((firebaseApp) => firebaseApp.name === secondaryAppName) ||
    initializeApp(firebaseConfig, secondaryAppName);

  return getAuth(secondaryApp);
}

export { auth, db };
export default app;
