
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  where,
  increment,
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
  likes?: number;
  status?: "draft" | "published";
  createdAt?: any;
  updatedAt?: any;
  publishedAt?: any;
};

export interface BlogComment {
  id: string;
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: any;
  status?: "published" | "pending";
}
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
  try {
    const q = query(blogsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (err: any) {
    console.warn("Notice fetching all blogs (check Firestore security rules if unauthenticated):", err?.message || err);
    return [];
  }
}

export async function getPublishedBlogs() {
  try {
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
  } catch (err: any) {
    console.warn("Notice fetching published blogs (falling back to unordered query):", err?.message || err);
    try {
      const fallbackQ = query(blogsRef, where("status", "==", "published"));
      const snap = await getDocs(fallbackQ);
      return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
    } catch (secondErr: any) {
      console.warn("Firestore blogs query error:", secondErr?.message || secondErr);
      return [];
    }
  }
}

export async function getBlogBySlug(
  slug: string
): Promise<Blog | null> {
  try {
    const q = query(
      blogsRef,
      where("slug", "==", slug),
      where("status", "==", "published")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const item = snapshot.docs[0];

    return {
      id: item.id,
      ...item.data(),
    } as Blog;
  } catch (err: any) {
    console.warn("Notice fetching blog by slug (check Firestore security rules):", err?.message || err);
    return null;
  }
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

export async function getMediaById(id: string): Promise<string | null> {
  try {
    const mediaDoc = await getDoc(doc(db, "media", id));

    if (!mediaDoc.exists()) return null;

    const mediaData = mediaDoc.data();

    return mediaData.url || mediaData.downloadUrl || mediaData.data || null;
  } catch (err) {
    console.error("Error fetching media by ID:", err);
    return null;
  }
}

/**
 * Toggle like/unlike on a blog article.
 */
export async function toggleBlogLike(
  blogId: string,
  action: "like" | "unlike",
  currentCount = 0
): Promise<number> {
  const delta = action === "like" ? 1 : -1;
  const expectedCount = Math.max(0, currentCount + delta);

  try {
    const blogRef = doc(db, "blogs", blogId);
    await updateDoc(blogRef, {
      likes: increment(delta),
    });
    const snap = await getDoc(blogRef);
    const updatedLikes = snap.data()?.likes ?? expectedCount;
    return Math.max(0, updatedLikes);
  } catch (err: any) {
    // If Firestore rules restrict unauthenticated public updates, handle gracefully
    console.warn("Firestore like sync notice (using local persistence):", err?.message || err);
    return expectedCount;
  }
}

/**
 * Create a new user comment on a blog.
 */
export async function createComment(data: {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  authorName: string;
  authorEmail: string;
  content: string;
}): Promise<BlogComment> {
  const localComment: BlogComment = {
    id: "comm_" + Date.now(),
    ...data,
    status: "published",
    createdAt: new Date(),
  };

  try {
    const docRef = await addDoc(collection(db, "comments"), {
      ...data,
      status: "published",
      createdAt: serverTimestamp(),
    });
    return {
      ...localComment,
      id: docRef.id,
    };
  } catch (err: any) {
    console.warn("Firestore comment sync notice (caching locally):", err?.message || err);

    // Save to local storage cache so comment remains visible to this user
    if (typeof window !== "undefined") {
      try {
        const cacheKey = `growth_local_comments_${data.blogId}`;
        const existing = JSON.parse(localStorage.getItem(cacheKey) || "[]");
        localStorage.setItem(cacheKey, JSON.stringify([localComment, ...existing]));
      } catch {
        // ignore storage error
      }
    }

    return localComment;
  }
}

/**
 * Retrieve comments for a specific blog (visible to all users).
 */
export async function getCommentsByBlogId(
  blogId: string
): Promise<BlogComment[]> {
  let serverComments: BlogComment[] = [];

  try {
    let snap;
    try {
      const q = query(
        collection(db, "comments"),
        where("blogId", "==", blogId),
        orderBy("createdAt", "desc")
      );
      snap = await getDocs(q);
    } catch {
      // Fallback query if composite index is pending or restricted
      const q = query(
        collection(db, "comments"),
        where("blogId", "==", blogId)
      );
      snap = await getDocs(q);
    }

    serverComments = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as BlogComment[];
  } catch (err: any) {
    console.warn("Firestore comments fetch notice (reading local cache):", err?.message || err);
  }

  // Merge with any locally cached comments
  let localComments: BlogComment[] = [];
  if (typeof window !== "undefined") {
    try {
      const cacheKey = `growth_local_comments_${blogId}`;
      localComments = JSON.parse(localStorage.getItem(cacheKey) || "[]");
    } catch {
      // ignore
    }
  }

  const combined = [...serverComments];
  localComments.forEach((lc) => {
    if (!combined.some((sc) => sc.id === lc.id)) {
      combined.push(lc);
    }
  });

  return combined.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Retrieve all comments across all blogs (for Admin CMS).
 */
export async function getAllComments(): Promise<BlogComment[]> {
  try {
    let snap;
    try {
      const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(collection(db, "comments"));
    }

    const comments = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as BlogComment[];

    return comments.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } catch (err) {
    console.error("Error retrieving all comments:", err);
    return [];
  }
}

/**
 * Delete a comment by ID (Admin operation).
 */
export async function deleteComment(id: string, blogId?: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "comments", id));
  } catch (err: any) {
    console.warn("Delete comment notice (check permissions if unauthenticated):", err?.message || err);
  }

  // Also remove from local storage cache so it doesn't linger locally
  if (typeof window !== "undefined") {
    try {
      if (blogId) {
        const cacheKey = `growth_local_comments_${blogId}`;
        const existing = JSON.parse(localStorage.getItem(cacheKey) || "[]");
        const filtered = existing.filter((c: any) => c.id !== id);
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
      } else {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("growth_local_comments_")) {
            const existing = JSON.parse(localStorage.getItem(key) || "[]");
            const filtered = existing.filter((c: any) => c.id !== id);
            localStorage.setItem(key, JSON.stringify(filtered));
          }
        }
      }
    } catch {
      // ignore storage errors
    }
  }
}
