
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

// Comment status
export type CommentStatus = "pending" | "approved" | "rejected";

// Admin comment type
export type BlogComment = {
  id: string;
  blogId: string;
  blogSlug: string;
  comment: string;
  authorName: string;
  authorEmail: string;
  status: CommentStatus;
  createdAt?: any;
};

// Public comment type
export type PublicComment = {
  id: string;
  blogId: string;
  blogSlug: string;
  comment: string;
  authorName: string;
  status: "approved";
  createdAt?: any;
};

const commentsRef = collection(db, "comments");

// 1. Get all comments for Admin moderation
export async function getAllComments(): Promise<BlogComment[]> {
  try {
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as BlogComment[];
  } catch (err: any) {
    console.warn("Notice fetching comments (check Firestore rules if unauthenticated):", err?.message || err);
    try {
      const snap = await getDocs(commentsRef);
      return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as BlogComment[];
    } catch {
      return [];
    }
  }
}

// 2. Approve or reject a comment
export async function updateCommentStatus(
  id: string,
  status: CommentStatus
) {
  return await updateDoc(doc(db, "comments", id), {
    status,
    moderatedAt: serverTimestamp(),
  });
}

// 3. Delete a comment
export async function deleteComment(id: string) {
  try {
    return await deleteDoc(doc(db, "comments", id));
  } catch (err: any) {
    console.warn("Notice deleting comment:", err?.message || err);
  }
}

// 4. Get approved comments for public blog pages
export async function getApprovedComments(
  blogId: string
): Promise<PublicComment[]> {
  try {
    const q = query(
      commentsRef,
      where("blogId", "==", blogId),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as PublicComment[];
  } catch (err: any) {
    console.warn("Notice fetching approved comments (falling back to simple query):", err?.message || err);
    try {
      const fallbackQ = query(
        commentsRef,
        where("blogId", "==", blogId),
        where("status", "==", "approved")
      );
      const snapshot = await getDocs(fallbackQ);
      return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as PublicComment[];
    } catch {
      return [];
    }
  }
}
