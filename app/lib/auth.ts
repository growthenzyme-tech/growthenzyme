
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

export async function loginUser(email: string, password: string) {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const userRef = doc(db, "users", result.user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await signOut(auth);
    throw new Error("User profile not found.");
  }

  const profile = userSnap.data();

  if (profile.isActive !== true) {
    await signOut(auth);
    throw new Error("Your account is inactive.");
  }

  if (!["admin", "writer"].includes(profile.role)) {
    await signOut(auth);
    throw new Error("You do not have permission to access the CMS.");
  }

  return {
    user: result.user,
    profile,
  };
}

export async function logoutUser() {
  await signOut(auth);
}

export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
