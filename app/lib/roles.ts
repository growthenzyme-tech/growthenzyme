
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { db, auth } from "./firebase";

// Role permissions
export type RolePermissions = {
  dashboard: boolean;
  blogs: boolean;
  blogsCreate: boolean;
  blogsEdit: boolean;
  blogsPublish: boolean;
  blogsDelete: boolean;
  comments: boolean;
  media: boolean;
  caseStudies: boolean;
  users: boolean;
  settings: boolean;
};

// Role structure
export type CMSRole = {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
};

// Firestore roles collection
const rolesRef = collection(db, "roles");

// Default permissions
export const defaultPermissions: RolePermissions = {
  dashboard: true,
  blogs: false,
  blogsCreate: false,
  blogsEdit: false,
  blogsPublish: false,
  blogsDelete: false,
  comments: false,
  media: false,
  caseStudies: false,
  users: false,
  settings: false,
};

// Get authentication headers for API requests
async function getAuthHeaders() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be logged in.");
  }

  const token = await currentUser.getIdToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Handle API responses
async function handleResponse(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Something went wrong.");
  }

  return result;
}

// GET: Fetch all roles
export async function getAllRoles(): Promise<CMSRole[]> {
  const q = query(rolesRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as CMSRole[];
}

// GET: Fetch a single role
export async function getRoleById(
  id: string
): Promise<CMSRole | null> {
  const roleSnap = await getDoc(doc(db, "roles", id));

  if (!roleSnap.exists()) {
    return null;
  }

  return {
    id: roleSnap.id,
    ...roleSnap.data(),
  } as CMSRole;
}

// POST: Create a role through the API
export async function createRole(
  data: Omit<CMSRole, "id" | "createdAt" | "updatedAt">
) {
  const headers = await getAuthHeaders();

  const response = await fetch("/api/admin/roles", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// PATCH: Update a role through the API
export async function updateRole(
  id: string,
  data: Partial<Omit<CMSRole, "id" | "createdAt">>
) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `/api/admin/roles/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    }
  );

  return handleResponse(response);
}

// DELETE: Delete a role through the API
export async function deleteRole(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `/api/admin/roles/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers,
    }
  );

  return handleResponse(response);
}
