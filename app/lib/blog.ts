
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const blogsRef = collection(db, "blogs");

export type Blog = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  content?: string;
  authorName?: string;
  coverImageId?: string;
  status?: "draft" | "published";
  createdAt?: any;
  updatedAt?: any;
  publishedAt?: any;
};
export async function createBlog(data: Record<string, any>) {
  return await addDoc(blogsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt:
      data.status === "published" ? serverTimestamp() : null,
  });
}

export async function getAllBlogs() {
  const q = query(blogsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getPublishedBlogs() {
  const q = query(
    blogsRef,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getBlogBySlug(
  slug: string
): Promise<Blog | null> {
  const q = query(blogsRef, where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const item = snapshot.docs[0];

  return {
    id: item.id,
    ...item.data(),
  } as Blog;
}

export async function updateBlog(
  id: string,
  data: Record<string, any>
) {
  return await updateDoc(doc(db, "blogs", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlog(id: string) {
  const { deleteDoc } = await import("firebase/firestore");
  return await deleteDoc(doc(db, "blogs", id));
}



export async function updateBlogStatus(
  id: string,
  status: "draft" | "published"
) {
  return await updateDoc(doc(db, "blogs", id), {
    status,
    publishedAt:
      status === "published" ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}
