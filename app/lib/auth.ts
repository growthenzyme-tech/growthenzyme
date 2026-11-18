
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

  try {
    const userRef = doc(db, "users", result.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found.");
    }

    const profile = userSnap.data();

    // Check account status
    if (profile.isActive !== true) {
      throw new Error("Your account is inactive.");
    }

    // Support existing legacy administrator accounts
    if (profile.role === "admin") {
      return {
        user: result.user,
        profile,
      };
    }

    // Support legacy writer accounts
    if (profile.role === "writer" && !profile.roleId) {
      return {
        user: result.user,
        profile,
      };
    }

    // Validate custom role
    if (!profile.roleId) {
      throw new Error(
        "No valid role is assigned to your account."
      );
    }

    const roleRef = doc(db, "roles", profile.roleId);
    const roleSnap = await getDoc(roleRef);

    if (!roleSnap.exists()) {
      throw new Error("Your assigned role was not found.");
    }

    const role = roleSnap.data();

    // Check whether the assigned role is active
    if (role.isActive !== true) {
      throw new Error(
        "Your assigned role is inactive. Contact the administrator."
      );
    }

    // Check whether the role has at least one CMS permission
    const permissions = role.permissions || {};

    const hasPermission = Object.values(permissions).some(
      (permission) => permission === true
    );

    if (!hasPermission) {
      throw new Error(
        "You do not have permission to access the CMS."
      );
    }

    return {
      user: result.user,
      profile: {
        ...profile,
        roleName: role.name,
        permissions,
      },
    };

  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
