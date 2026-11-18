
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export type RolePermissions = {
  dashboard: boolean;
  blogs: boolean;
  comments: boolean;
  media: boolean;
  caseStudies: boolean;
  users: boolean;
  settings: boolean;
};

export type CMSRole = {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
};

const rolesRef = collection(db, "roles");

// Default permissions for a new role
export const defaultPermissions: RolePermissions = {
  dashboard: true,
  blogs: false,
  comments: false,
  media: false,
  caseStudies: false,
  users: false,
  settings: false,
};

// Get all custom roles
export async function getAllRoles(): Promise<CMSRole[]> {
  const q = query(rolesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as CMSRole[];
}

// Get one role
export async function getRoleById(
  id: string
): Promise<CMSRole | null> {
  const roleSnap = await getDoc(doc(db, "roles", id));

  if (!roleSnap.exists()) return null;

  return {
    id: roleSnap.id,
    ...roleSnap.data(),
  } as CMSRole;
}

// Create a custom role
export async function createRole(
  data: Omit<CMSRole, "id" | "createdAt" | "updatedAt">
) {
  return await addDoc(rolesRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Update a custom role
export async function updateRole(
  id: string,
  data: Partial<Omit<CMSRole, "id" | "createdAt">>
) {
  if (id === "system-admin") {
    throw new Error("The System Admin role cannot be modified.");
  }

  return await updateDoc(doc(db, "roles", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a custom role
export async function deleteRole(id: string) {
  if (id === "system-admin") {
    throw new Error("The System Admin role cannot be deleted.");
  }

  // Prevent deleting a role assigned to existing users
  const assignedUsersQuery = query(
    collection(db, "users"),
    where("roleId", "==", id)
  );

  const assignedUsers = await getDocs(assignedUsersQuery);

  if (!assignedUsers.empty) {
    throw new Error(
      "This role is assigned to users. Reassign those users before deleting it."
    );
  }

  return await deleteDoc(doc(db, "roles", id));
}
