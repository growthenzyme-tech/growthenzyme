import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";



export type CMSUser = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  isActive: boolean;
  createdAt?: any;
  role?: string
};

const usersRef = collection(db, "users");

// Get all CMS users
export async function getAllUsers(): Promise<CMSUser[]> {
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as CMSUser[];
}

// Create a CMS user using a separate Firebase Auth instance
export async function createCMSUser(data: {
  name: string;
  email: string;
  password: string;
  roleId: string;
}) {
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password;
  const roleId = data.roleId;

  if (!name || !email || !password || !roleId) {
    throw new Error("Please complete all required fields.");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters.");
  }

  if (roleId === "system-admin") {
    throw new Error(
      "The system administrator role cannot be assigned here."
    );
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Please log in again to create a user.");
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch("/api/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      name,
      email,
      password,
      roleId,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Unable to create CMS user."
    );
  }

  return result.user as {
    uid: string;
    name: string;
    email: string;
    roleId: string;
  };
}

// Assign a custom role to a user
export async function assignUserRole(userId: string, roleId: string) {
  return await updateDoc(doc(db, "users", userId), {
    roleId,
    updatedAt: serverTimestamp(),
  });
}

// Activate or deactivate a user

export async function updateUserStatus(
  userId: string,
  isActive: boolean
) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Please log in again.");
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(
    `/api/admin/users/${encodeURIComponent(userId)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ isActive }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Unable to update user status."
    );
  }

  return result;
}


export async function deleteCMSUser(userId: string) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Please log in again.");
  }

  const idToken = await currentUser.getIdToken();
  const response = await fetch(
    `/api/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to delete the user.");
  }

  return result;
}



export async function changeCMSUserPassword(
  userId: string,
  password: string
) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters.");
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Please log in again.");
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(
    `/api/admin/users/${encodeURIComponent(userId)}/password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ password }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Unable to update the user's password."
    );
  }

  return result;
}
