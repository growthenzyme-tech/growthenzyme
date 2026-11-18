import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

export async function loginUser(email: string, password: string) {
  const cleanEmail = email.trim();

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

    const userRef = doc(db, "users", result.user.uid);
    let userSnap = await getDoc(userRef);

    // If the authenticated user has no profile record yet, auto-initialize as admin
    if (!userSnap.exists()) {
      const autoProfile = {
        email: cleanEmail,
        name: result.user.displayName || cleanEmail.split("@")[0] || "Admin",
        role: "admin",
        roleId: "system-admin",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userRef, autoProfile);
      return {
        user: result.user,
        profile: {
          ...autoProfile,
          roleName: "Administrator",
          permissions: {
            dashboard: true,
            blogs: true,
            comments: true,
            media: true,
            caseStudies: true,
            users: true,
            settings: true,
          },
        },
      };
    }

    const profile = userSnap.data();

    // Check account status
    if (profile.isActive !== true) {
      await signOut(auth);
      throw new Error("Your account has been deactivated. Please contact an administrator.");
    }

    // Support Administrator accounts (legacy role or system-admin roleId)
    const rawRole = (profile.role || profile.roleId || "").toString().toLowerCase();
    const isSystemAdmin =
      profile.role === "admin" ||
      profile.role === "administrator" ||
      profile.roleId === "system-admin" ||
      rawRole.includes("admin") ||
      rawRole.includes("super");

    if (isSystemAdmin) {
      return {
        user: result.user,
        profile: {
          ...profile,
          role: "admin",
          roleId: profile.roleId || "system-admin",
          roleName: "Administrator",
          permissions: {
            dashboard: true,
            blogs: true,
            comments: true,
            media: true,
            caseStudies: true,
            users: true,
            settings: true,
          },
        },
      };
    }

    // Support legacy writer accounts without custom roleId
    if (profile.role === "writer" && !profile.roleId) {
      return {
        user: result.user,
        profile: {
          ...profile,
          role: "writer",
          roleName: "Writer",
          permissions: {
            dashboard: true,
            blogs: true,
            comments: false,
            media: true,
            caseStudies: false,
            users: false,
            settings: false,
          },
        },
      };
    }

    // Validate custom role
    if (!profile.roleId) {
      await signOut(auth);
      throw new Error("No valid role is assigned to your account.");
    }

    const roleRef = doc(db, "roles", profile.roleId);
    const roleSnap = await getDoc(roleRef);

    if (!roleSnap.exists()) {
      await signOut(auth);
      throw new Error("Your assigned role was not found.");
    }

    const roleData = roleSnap.data();

    if (roleData.isActive !== true) {
      await signOut(auth);
      throw new Error("Your assigned role is inactive. Contact the administrator.");
    }

    const permissions = roleData.permissions || {};
    const hasPermission = Object.values(permissions).some(
      (permission) => permission === true
    );

    if (!hasPermission) {
      await signOut(auth);
      throw new Error("You do not have permission to access the CMS.");
    }

    return {
      user: result.user,
      profile: {
        ...profile,
        roleName: roleData.name,
        permissions,
      },
    };

  } catch (err: any) {
    console.warn("Firebase Auth Notice:", err?.code || err?.message || err);

    if (
      err?.code === "auth/invalid-credential" ||
      err?.code === "auth/invalid-login-credentials" ||
      err?.message?.includes("auth/invalid-credential")
    ) {
      throw new Error(
        "Invalid email or password. If you haven't created your admin account yet, switch to the 'Create Admin' tab below."
      );
    }
    if (err?.code === "auth/user-not-found") {
      throw new Error("No account found with this email. Please register on the 'Create Admin' tab.");
    }
    if (err?.code === "auth/wrong-password") {
      throw new Error("Incorrect password. Please verify and try again.");
    }
    if (err?.code === "auth/too-many-requests") {
      throw new Error(
        "Access temporarily restricted due to many failed login attempts. Please wait a few minutes or reset your password."
      );
    }
    if (err?.code === "auth/operation-not-allowed") {
      throw new Error(
        "Email/Password provider is disabled in Firebase Console. Go to Authentication > Sign-in method and enable Email/Password."
      );
    }
    if (err?.code === "auth/network-request-failed") {
      throw new Error("Network connection error. Please check your internet connectivity.");
    }

    throw err;
  }
}

/**
 * Register a new Admin user directly via Firebase client Auth,
 * creating both the authentication record and the Firestore admin profile.
 */
export async function registerInitialAdmin(
  email: string,
  password: string,
  name?: string
) {
  const cleanEmail = email.trim();
  if (!cleanEmail) {
    throw new Error("Please enter your email address.");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

    if (name?.trim()) {
      try {
        await updateProfile(result.user, { displayName: name.trim() });
      } catch {
        // ignore profile update non-fatal error
      }
    }

    const adminProfile = {
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split("@")[0] || "Admin",
      role: "admin",
      roleId: "system-admin",
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, adminProfile);

    return {
      user: result.user,
      profile: adminProfile,
    };
  } catch (err: any) {
    console.warn("Register Admin Error:", err?.code || err?.message || err);

    if (err?.code === "auth/email-already-in-use") {
      throw new Error(
        "This email address already exists. Please switch to the 'Sign In' tab or use 'Forgot password?'."
      );
    }
    if (err?.code === "auth/weak-password") {
      throw new Error("Password is too weak. Please use at least 6 characters.");
    }
    if (err?.code === "auth/operation-not-allowed") {
      throw new Error(
        "Email/Password sign-in provider is disabled in Firebase Console. Please go to Firebase Console > Authentication > Sign-in method and enable Email/Password."
      );
    }

    throw err;
  }
}

export async function resetUserPassword(email: string) {
  const cleanEmail = email.trim();
  if (!cleanEmail) throw new Error("Please enter your email address.");
  return await sendPasswordResetEmail(auth, cleanEmail);
}

export async function logoutUser() {
  await signOut(auth);
}

export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
