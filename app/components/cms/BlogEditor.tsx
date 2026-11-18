
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { auth, db } from "@/app/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";


import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  ImagePlus,
  FileText,
  Search,
  X,
  Save,
  Send,
  Sparkles,
  FolderOpen,
  Image as ImageIconLucide,
  Loader2,
  Upload,
} from "lucide-react";
import MediaPickerModal from "@/app/components/cms/MediaPickerModal";
import { uploadMediaFile } from "@/app/lib/media";

const categories = [
  "Digital Marketing",
  "Web Development",
  "Branding",
  "Technology",
  "Business",
  "Insights",
];

type BlogEditorProps = {
  blogId?: string;
};

export default function BlogEditor({ blogId }: BlogEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [coverImage, setCoverImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(Boolean(blogId));
  const [existingPublishedAt, setExistingPublishedAt] =
    useState<any>(null);

  const [existingCoverImageId, setExistingCoverImageId] =
    useState<string | null>(null);

  const [coverImageChanged, setCoverImageChanged] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [inlinePickerOpen, setInlinePickerOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image,
    ],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[320px] p-6 focus:outline-none text-[#405C48]",
      },
    },
  });

  useEffect(() => {
    if (!slugEdited) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [title, slugEdited]);



  useEffect(() => {
  if (!blogId || !editor) return;

  async function loadBlog() {
    try {
      setLoadingBlog(true);

      const blogRef = doc(db, "blogs", blogId!);
      const blogSnap = await getDoc(blogRef);

      if (!blogSnap.exists()) {
        setError("Blog not found.");
        return;
      }

      const data = blogSnap.data();
      setExistingPublishedAt(data.publishedAt || null);

      setTitle(data.title || "");
      setSlug(data.slug || "");
      setSlugEdited(true);

      setExcerpt(data.excerpt || "");
      setCategory(data.category || categories[0]);

      setSeoTitle(data.seoTitle || "");
      setMetaDescription(data.metaDescription || "");

      setExistingCoverImageId(data.coverImageId || null);

      if (data.coverImageId) {
        const mediaSnap = await getDoc(
          doc(db, "media", data.coverImageId)
        );

        if (mediaSnap.exists()) {
          const mData = mediaSnap.data();
          setCoverImage(mData.url || mData.downloadUrl || mData.data || "");
        }
      }

      editor?.commands.setContent(
  data.content || "<p></p>"
);
    } catch (err) {
      console.error("Error loading blog:", err);
      setError("Unable to load this blog.");
    } finally {
      setLoadingBlog(false);
    }
  }

  loadBlog();
}, [blogId, editor]);

  async function handleCoverImage(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Please select an image smaller than 15 MB.");
      return;
    }

    try {
      setUploadingCover(true);
      setError("");
      const mediaItem = await uploadMediaFile(file, {
        category: "blog-cover",
      });
      setCoverImage(mediaItem.url);
      setExistingCoverImageId(mediaItem.id);
      setCoverImageChanged(false);
    } catch (err: any) {
      console.error("Cover image upload error:", err);
      setError(err.message || "Failed to upload cover image.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(status: "draft" | "published") {
    setError("");

    const user = auth.currentUser;

    if (!user) {
      setError("Your session has expired. Please log in again.");
      router.replace("/admin/login");
      return;
    }

    if (!title.trim() || !slug.trim() || !excerpt.trim()) {
      setError("Please complete the title, slug and short description.");
      return;
    }

    if (!editor || editor.isEmpty) {
      setError("Please write your blog content.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Please use a valid URL slug.");
      return;
    }

    setSaving(true);

    try {
  let coverImageId = coverImage ? existingCoverImageId : null;

  // If a raw image was chosen without a mediaId, persist it to media collection
  if (coverImageChanged && coverImage && !coverImageId) {
    const mediaRef = await addDoc(collection(db, "media"), {
      url: coverImage,
      data: coverImage,
      type: "image",
      mimeType: "image/jpeg",
      fileName: `${slug}-cover.jpg`,
      category: "blog-cover",
      uploadedBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    coverImageId = mediaRef.id;
  }

const blogData = {
  title: title.trim(),
  slug: slug.trim(),
  excerpt: excerpt.trim(),
  category,
  content: editor.getHTML(),
  coverImageId,
  seoTitle: seoTitle.trim() || title.trim(),
  metaDescription: metaDescription.trim() || excerpt.trim(),
  status,
  updatedAt: serverTimestamp(),
 publishedAt:
  status === "published"
    ? existingPublishedAt || serverTimestamp()
    : null,
};

if (blogId) {
  // EDIT EXISTING BLOG
  await updateDoc(doc(db, "blogs", blogId), blogData);
} else {
  // CREATE NEW BLOG
  await addDoc(collection(db, "blogs"), {
    ...blogData,
    authorId: user.uid,
    authorName:
      user.displayName || user.email || "GrowthEnzyme Team",
    createdAt: serverTimestamp(),
  });
}

router.push("/admin/blogs");
router.refresh();

    } catch (err) {
      console.error("Blog save error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the blog. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#DCE5D8] bg-[#FCFDFB] px-4 py-3.5 text-sm text-[#29382F] outline-none transition-all placeholder:text-[#91A092] hover:border-[#B6CBA9] focus:border-[#405C48] focus:ring-2 focus:ring-[#B6CBA9]/30";

  const labelClass =
    "mb-2.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#405C48]";

  const toolbarButtonClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-[#E3E9DF] bg-white text-[#405C48] transition-all duration-200 hover:border-[#B6CBA9] hover:bg-[#EEF3EA] hover:text-[#29382F]";
if (loadingBlog) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-[#405C48]">
        Loading blog details...
      </p>
    </div>
  );
}

if (blogId && error === "Blog not found.") {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg font-semibold text-[#29382F]">
        Blog not found
      </p>

      <button
        onClick={() => router.push("/admin/blogs")}
        className="rounded-xl bg-[#29382F] px-5 py-3 text-sm text-white"
      >
        Back to Blogs
      </button>
    </div>
  );
}
  return (
    <div
      className="mx-auto max-w-5xl space-y-7 pb-14 pt-8 sm:pt-15 "
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
        
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#657365] transition-colors hover:text-[#29382F]"
          >
            <ArrowLeft size={15} />
            Back to Blogs
          </button>

          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#405C48]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
            GrowthEnzyme CMS
          </p>

          <h1
            className="text-4xl font-semibold leading-tight tracking-tight text-[#29382F] sm:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {blogId ? "Edit Blog" : "Create New Blog"}
          </h1>

          <p className="mt-2 text-sm text-[#657365]">
            {blogId
  ? "Update your article and save your changes."
  : "Create, manage and publish your articles."}
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E1E9DC] bg-[#EEF3EA] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#405C48]">
          <Sparkles size={14} />
          {blogId ? "Editing Workspace" : "Blog Workspace"}
        </div>
      </div>

      {/* BASIC INFORMATION */}
      <section className="space-y-6 rounded-2xl border border-[#E2E9DE] bg-white p-5 shadow-[0_8px_30px_rgba(41,56,47,0.035)] sm:p-7">
        <div className="flex items-center gap-3 border-b border-[#EDF1E9] pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3EA] text-[#405C48]">
            <FileText size={19} />
          </div>
          <div>
            <h2
              className="text-2xl font-semibold text-[#29382F]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Basic Information
            </h2>
            <p className="text-xs text-[#819080]">
              Add the essential details of your article.
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Blog Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>URL Slug *</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "")
                  .replace(/--+/g, "-")
              );
            }}
            placeholder="your-blog-url"
            className={inputClass}
          />
          <p className="mt-2 text-xs text-[#819080]">
            Public URL:{" "}
            <span className="font-medium text-[#405C48]">
              /blog/{slug || "your-blog-url"}
            </span>
          </p>
        </div>

        <div>
          <label className={labelClass}>Short Description *</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Write a short introduction..."
            className={`${inputClass} resize-y`}
          />
          <p className="mt-2 text-right text-xs text-[#819080]">
            {excerpt.length}/300
          </p>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* COVER IMAGE */}
      <section className="space-y-5 rounded-2xl border border-[#E2E9DE] bg-white p-5 shadow-[0_8px_30px_rgba(41,56,47,0.035)] sm:p-7">
        <div className="flex items-center gap-3 border-b border-[#EDF1E9] pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9EF] text-[#B87950]">
            <ImagePlus size={19} />
          </div>
          <div>
            <h2
              className="text-2xl font-semibold text-[#29382F]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Cover Image
            </h2>
            <p className="text-xs text-[#819080]">
              Choose or upload an image from the Media Library for your article.
            </p>
          </div>
        </div>

        {uploadingCover ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#B6CBA9] rounded-xl bg-[#F8FAF6]">
            <Loader2 size={24} className="animate-spin text-[#29382F] mb-2" />
            <p className="text-xs font-semibold text-[#29382F]">Uploading to Cloud Storage...</p>
          </div>
        ) : !coverImage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Option 1: Choose from Media Library */}
            <button
              type="button"
              onClick={() => setCoverPickerOpen(true)}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-[#B6CBA9] bg-[#F8FAF6] hover:bg-[#EEF3EA] transition text-center group"
            >
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EEE5] text-[#29382F] group-hover:scale-110 transition-transform">
                <FolderOpen size={19} />
              </div>
              <span className="text-xs font-bold text-[#29382F]">
                Choose from Media Library
              </span>
              <span className="mt-0.5 text-[11px] text-[#819080]">
                Select an existing cloud asset
              </span>
            </button>

            {/* Option 2: Upload Direct */}
            <label className="flex cursor-pointer flex-col items-center justify-center p-6 rounded-xl border border-dashed border-[#B6CBA9] bg-[#F8FAF6] hover:bg-[#EEF3EA] transition text-center group">
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EEE5] text-[#D78359] group-hover:scale-110 transition-transform">
                <ImagePlus size={19} />
              </div>
              <span className="text-xs font-bold text-[#29382F]">
                Upload from Device
              </span>
              <span className="mt-0.5 text-[11px] text-[#819080]">
                Upload new file to Cloud Storage
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleCoverImage(e.target.files?.[0])}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl border border-[#E2E9DE]">
            <img
              src={coverImage}
              alt="Blog cover preview"
              className="max-h-72 w-full object-cover"
            />
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCoverPickerOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#29382F]/90 backdrop-blur-xs px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#29382F]"
              >
                <FolderOpen size={13} />
                Change
              </button>
              <button
                type="button"
                onClick={() => {
                  setCoverImage("");
                  setExistingCoverImageId(null);
                  setCoverImageChanged(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-red-600/90 backdrop-blur-xs px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
              >
                <X size={13} />
                Remove
              </button>
            </div>
          </div>
        )}
      </section>

      {/* BLOG CONTENT EDITOR */}
      <section className="overflow-hidden rounded-2xl border border-[#E2E9DE] bg-white shadow-[0_8px_30px_rgba(41,56,47,0.035)]">
        <div className="border-b border-[#E8EDE5] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3EA] text-[#405C48]">
              <FileText size={19} />
            </div>
            <div>
              <h2
                className="text-2xl font-semibold text-[#29382F]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Blog Content *
              </h2>
              <p className="text-xs text-[#819080]">
                Write and format your article.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 rounded-xl bg-[#F7F8F4] p-3">
            <button
              type="button"
              title="Bold"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={toolbarButtonClass}
            >
              <Bold size={16} />
            </button>

            <button
              type="button"
              title="Italic"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={toolbarButtonClass}
            >
              <Italic size={16} />
            </button>

            <button
              type="button"
              title="Underline"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={toolbarButtonClass}
            >
              <UnderlineIcon size={16} />
            </button>

            <span className="mx-1 hidden h-9 w-px bg-[#DCE5D8] sm:block" />

            <button
              type="button"
              title="Heading 2"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={toolbarButtonClass}
            >
              <Heading2 size={17} />
            </button>

            <button
              type="button"
              title="Heading 3"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={toolbarButtonClass}
            >
              <Heading3 size={17} />
            </button>

            <span className="mx-1 hidden h-9 w-px bg-[#DCE5D8] sm:block" />

            <button
              type="button"
              title="Bullet list"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={toolbarButtonClass}
            >
              <List size={17} />
            </button>

            <button
              type="button"
              title="Numbered list"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={toolbarButtonClass}
            >
              <ListOrdered size={17} />
            </button>

            <span className="mx-1 hidden h-9 w-px bg-[#DCE5D8] sm:block" />

            {/* Insert Media from Library */}
            <button
              type="button"
              title="Insert Image from Media Library"
              onClick={() => setInlinePickerOpen(true)}
              className={`${toolbarButtonClass} text-[#D78359] hover:bg-[#EEF3EA]`}
            >
              <ImageIconLucide size={17} />
            </button>

            <span className="mx-1 hidden h-9 w-px bg-[#DCE5D8] sm:block" />

            <button
              type="button"
              title="Undo"
              onClick={() => editor?.chain().focus().undo().run()}
              className={toolbarButtonClass}
            >
              <Undo2 size={16} />
            </button>

            <button
              type="button"
              title="Redo"
              onClick={() => editor?.chain().focus().redo().run()}
              className={toolbarButtonClass}
            >
              <Redo2 size={16} />
            </button>
          </div>
        </div>

        <div className="blog-editor-content min-h-[350px] bg-white">
          <EditorContent editor={editor} />
        </div>

        <div className="border-t border-[#EDF1E9] bg-[#FAFBF8] px-5 py-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#91A092]">
            Writing workspace · GrowthEnzyme
          </p>
        </div>
      </section>

      {/* SEO SETTINGS */}
      <section className="space-y-6 rounded-2xl border border-[#E2E9DE] bg-white p-5 shadow-[0_8px_30px_rgba(41,56,47,0.035)] sm:p-7">
        <div className="flex items-center gap-3 border-b border-[#EDF1E9] pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9EF] text-[#B87950]">
            <Search size={19} />
          </div>
          <div>
            <h2
              className="text-2xl font-semibold text-[#29382F]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              SEO Settings
            </h2>
            <p className="text-xs text-[#819080]">
              Optimise how your article appears in search results.
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>SEO Title</label>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            maxLength={70}
            placeholder="SEO title"
            className={inputClass}
          />
          <p className="mt-2 text-right text-xs text-[#819080]">
            {seoTitle.length}/70
          </p>
        </div>

        <div>
          <label className={labelClass}>Meta Description</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            maxLength={160}
            rows={3}
            placeholder="SEO meta description"
            className={`${inputClass} resize-y`}
          />
          <p className="mt-2 text-right text-xs text-[#819080]">
            {metaDescription.length}/160
          </p>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-col-reverse gap-3 border-t border-[#E2E9DE] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE5D8] bg-white px-6 py-3.5 text-sm font-semibold text-[#405C48] transition-all hover:bg-[#F7F8F4]"
        >
          <ArrowLeft size={16} />
          Cancel
        </button>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit("draft")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B6CBA9] bg-[#EEF3EA] px-6 py-3.5 text-sm font-bold text-[#29382F] transition-all hover:bg-[#E3EBDD] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit("published")}
            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#29382F] px-7 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#17291F] transition-all hover:-translate-y-0.5 hover:bg-[#405C48] hover:shadow-[0_6px_0_#17291F] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={15} />
            {saving ? "Publishing..." : "Publish Blog"}
            {!saving && (
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            )}
          </button>
        </div>
      </div>

      {/* COVER IMAGE PICKER MODAL */}
      <MediaPickerModal
        isOpen={coverPickerOpen}
        onClose={() => setCoverPickerOpen(false)}
        allowedType="image"
        defaultCategory="blog-cover"
        title="Select Cover Image"
        onSelect={(item) => {
          setCoverImage(item.url);
          setExistingCoverImageId(item.id);
          setCoverImageChanged(false);
        }}
      />

      {/* INLINE CONTENT IMAGE PICKER MODAL */}
      <MediaPickerModal
        isOpen={inlinePickerOpen}
        onClose={() => setInlinePickerOpen(false)}
        allowedType="image"
        defaultCategory="blog-inline"
        title="Insert Inline Article Image"
        onSelect={(item) => {
          editor?.chain().focus().setImage({ src: item.url, alt: item.name }).run();
        }}
      />
    </div>
  );
}
