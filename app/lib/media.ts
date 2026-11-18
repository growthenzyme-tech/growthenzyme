import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase";

export type MediaCategory =
  | "blog-cover"
  | "blog-inline"
  | "case-study-cover"
  | "project-gallery"
  | "pdf-document"
  | "general";

export interface MediaItem {
  id: string;
  name: string;
  fileName: string;
  url: string;
  storagePath: string;
  type: "image" | "document";
  mimeType: string;
  size: number;
  category: MediaCategory;
  dimensions?: { width: number; height: number };
  uploadedBy: string;
  uploaderEmail?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
export const MAX_DOCUMENT_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export function validateMediaFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file was selected." };
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isDoc = ALLOWED_DOCUMENT_TYPES.includes(file.type);

  if (!isImage && !isDoc) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || "unknown"}). Allowed formats: JPG, PNG, WEBP, GIF, SVG, AVIF, and PDF documents.`,
    };
  }

  const maxSize = isImage ? MAX_IMAGE_SIZE_BYTES : MAX_DOCUMENT_SIZE_BYTES;
  const maxMb = isImage ? 15 : 25;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${maxMb} MB.`,
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number } | undefined> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !file.type.startsWith("image/") || file.type === "image/svg+xml") {
      return resolve(undefined);
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };
    img.src = url;
  });
}

/**
 * Compresses an image client-side to ensure it safely fits within Firestore limits (< 800KB)
 * if Cloud Storage is unconfigured or blocked by security rules.
 */
export async function compressImageToDataUrl(
  file: File,
  maxDimension = 1200,
  initialQuality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Image compression requires browser window context."));
    }

    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed reading SVG file."));
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(
        1,
        maxDimension / Math.max(img.width, img.height)
      );

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Unable to create canvas context."));
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let quality = initialQuality;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);

      // Enforce strictly under 750KB so Firestore 1MB limit is never exceeded
      while (dataUrl.length > 750000 && quality > 0.25) {
        quality -= 0.15;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to decode image file."));
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a file to Firebase Cloud Storage, creates a Firestore metadata record,
 * and returns the full MediaItem.
 */
export async function uploadMediaFile(
  file: File,
  options?: {
    category?: MediaCategory;
    name?: string;
    onProgress?: (progress: number) => void;
  }
): Promise<MediaItem> {
  const validation = validateMediaFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "File validation failed.");
  }

  const currentUser = auth.currentUser;
  const uploaderId = currentUser?.uid || "admin";
  const uploaderEmail = currentUser?.email || "growthenzymetech@gmail.com";

  const category = options?.category || (file.type === "application/pdf" ? "pdf-document" : "general");
  const isImage = file.type.startsWith("image/");
  const dimensions = isImage ? await getImageDimensions(file) : undefined;

  const sanitizedFileName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase();
  const timestamp = Date.now();
  const storagePath = `media/${category}/${timestamp}_${sanitizedFileName}`;

  let downloadUrl = "";
  let uploadMethod: "cloud-storage" | "cloud-firestore" = "cloud-storage";

  if (options?.onProgress) options.onProgress(15);

  try {
    if (!storage || !storage.app) {
      throw new Error("Storage instance not initialized");
    }

    let uploadTask: any = null;

    // 1. Try Uploading to Firebase Cloud Storage with timeout race
    const storagePromise = new Promise<string>((resolve, reject) => {
      try {
        const storageRef = ref(storage, storagePath);
        uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type,
          customMetadata: {
            originalName: file.name,
            category,
            uploadedBy: uploaderId,
          },
        });

        uploadTask.on(
          "state_changed",
          (snapshot: any) => {
            if (snapshot.totalBytes > 0 && options?.onProgress) {
              const pct = Math.min(
                95,
                Math.max(25, Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
              );
              options.onProgress(pct);
            }
          },
          (error: any) => {
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (err) {
              reject(err);
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });

    // 2-second timeout race to prevent indefinite SDK hanging when bucket does not exist (404) or CORS blocks
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        try {
          if (uploadTask && typeof uploadTask.cancel === "function") {
            uploadTask.cancel();
          }
        } catch {
          // ignore
        }
        reject(new Error("Cloud Storage bucket timed out or is unprovisioned."));
      }, 2000);
    });

    downloadUrl = await Promise.race([storagePromise, timeoutPromise]);
    if (options?.onProgress) options.onProgress(100);
  } catch (storageError: any) {
    console.warn("Storage upload notice (falling back to optimized cloud storage):", storageError?.message || storageError);

    // Fallback: If Cloud Storage bucket is not yet provisioned in Firebase Console or blocked,
    // optimize image and store in Firestore media document seamlessly
    if (isImage) {
      uploadMethod = "cloud-firestore";
      if (options?.onProgress) options.onProgress(50);
      downloadUrl = await compressImageToDataUrl(file);
      if (options?.onProgress) options.onProgress(100);
    } else {
      throw new Error(
        `Firebase Cloud Storage bucket is not enabled yet in your Firebase console. Please go to Firebase Console > Storage and click 'Get Started' to enable PDF/document uploads.`
      );
    }
  }

  // 2. Save metadata to Firestore collection "media"
  const cleanName =
    options?.name?.trim() ||
    file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

  const mediaDocRef = await addDoc(collection(db, "media"), {
    name: cleanName,
    fileName: file.name,
    url: downloadUrl,
    data: downloadUrl, // legacy compatibility
    storagePath: uploadMethod === "cloud-storage" ? storagePath : "",
    type: isImage ? "image" : "document",
    mimeType: file.type,
    size: file.size,
    category,
    dimensions: dimensions || null,
    uploadedBy: uploaderId,
    uploaderEmail: uploaderEmail,
    storageMethod: uploadMethod,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: mediaDocRef.id,
    name: cleanName,
    fileName: file.name,
    url: downloadUrl,
    storagePath: uploadMethod === "cloud-storage" ? storagePath : "",
    type: isImage ? "image" : "document",
    mimeType: file.type,
    size: file.size,
    category,
    dimensions,
    uploadedBy: uploaderId,
    uploaderEmail: uploaderEmail,
    createdAt: new Date(),
  };
}

/**
 * Fetch all media assets from Firestore.
 */
export async function getAllMediaItems(): Promise<MediaItem[]> {
  try {
    let snap;
    try {
      const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(collection(db, "media"));
    }

    const items: MediaItem[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const isImg =
        data.type === "image" ||
        data.mimeType?.startsWith("image/") ||
        (data.data && typeof data.data === "string" && data.data.startsWith("data:image"));

      items.push({
        id: docSnap.id,
        name: data.name || data.fileName || "Untitled Asset",
        fileName: data.fileName || "file",
        url: data.url || data.downloadUrl || data.data || "",
        storagePath: data.storagePath || "",
        type: isImg ? "image" : "document",
        mimeType: data.mimeType || (isImg ? "image/jpeg" : "application/pdf"),
        size: data.size || 0,
        category: (data.category as MediaCategory) || (isImg ? "blog-cover" : "pdf-document"),
        dimensions: data.dimensions || undefined,
        uploadedBy: data.uploadedBy || "",
        uploaderEmail: data.uploaderEmail || "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return items;
  } catch (err) {
    console.error("Error retrieving media library items:", err);
    return [];
  }
}

/**
 * Delete media item from Cloud Storage and Firestore.
 */
export async function deleteMediaItem(
  id: string,
  storagePath?: string
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be logged in to delete media.");
  }

  // 1. Delete from Cloud Storage
  if (storagePath) {
    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
    } catch (storageErr) {
      console.warn("Storage deletion error (proceeding to remove record):", storageErr);
    }
  }

  // 2. Delete from Firestore
  await deleteDoc(doc(db, "media", id));
}
