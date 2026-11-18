"use client";
import { db } from "@/app/lib/firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ThumbsUp,
  Link2,
  CalendarDays,
  User,
} from "lucide-react";
import {
  getApprovedComments,
  type PublicComment,
} from "@/app/lib/comments";

import { getBlogBySlug, getPublishedBlogs, getMediaById, type Blog } from "@/app/lib/blog";
import Footer from "@/app/components/sections/Footer";

const TwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22a1.64 1.64 0 0 0-1.64 1.64c0 .9.74 1.64 1.64 1.64s1.64-.74 1.64-1.64c0-.9-.74-1.64-1.64-1.64z" />
  </svg>
);

const sidebarCategories = [
  "Performance Marketing",
  "SEO",
  "Web Design & Dev",
  "Business Automation",
  "Design Creatives",
  "Video Production",
  "Technology",
  "Insights",
];

const fallbackTopPosts = [
  {
    id: "1",
    category: "PERFORMANCE",
    title: "8 growth strategies to scale Meta Ads profitably in 2026",
    slug: "meta-ads-scaling",
    image: "/services/img1.webp",
    date: "Nov 17, 2026",
  },
  {
    id: "2",
    category: "AUTOMATION",
    title: "How automation delivers marketing campaign assets faster",
    slug: "automation-workflow",
    image: "/services/img2.webp",
    date: "Nov 16, 2026",
  },
  {
    id: "3",
    category: "WEB DEV",
    title: "Designing high-conversion landing pages that turn visitors into buyers",
    slug: "conversion-design",
    image: "/services/img3.webp",
    date: "Nov 15, 2026",
  },
  {
    id: "4",
    category: "B2B BRANDING",
    title: "B2B brand authority: how industrial manufacturers win online",
    slug: "b2b-brand-authority",
    image: "/services/img4.webp",
    date: "Nov 14, 2026",
  },
  {
    id: "5",
    category: "ANALYTICS",
    title: "10 essential metrics modern marketing teams track beyond CTR",
    slug: "marketing-metrics",
    image: "/services/img1.webp",
    date: "Nov 13, 2026",
  },
];

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(206);
  const [hasLiked, setHasLiked] = useState(false);

  // Comment box state
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
const [commentError, setCommentError] = useState("");
const [approvedComments, setApprovedComments] = useState<PublicComment[]>([]);
const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const currentData = await getBlogBySlug(slug);

        if (!currentData || currentData.status !== "published") {
          setBlog(null);
          return;
        }

        setBlog(currentData as Blog);

        try {
  setCommentsLoading(true);

  const publicComments = await getApprovedComments(currentData.id);
  setApprovedComments(publicComments);
} catch (commentFetchError) {
  console.error("Error fetching approved comments:", commentFetchError);
  setApprovedComments([]);
} finally {
  setCommentsLoading(false);
}

        if (currentData.coverImageId) {
          const imgUrl = await getMediaById(currentData.coverImageId);
          setCoverImage(imgUrl);
        } else {
          setCoverImage(null);
        }

        try {
          const list = await getPublishedBlogs();
          setAllBlogs((list as Blog[]) || []);
        } catch {
          // fallback
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Unable to load this article. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  function formatDate(timestamp: any) {
    if (!timestamp) return "17 November 2026";

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "17 November 2026";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function handleCopyLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleLike() {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  }

 async function handleCommentSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!comment.trim() || !authorName.trim() || !authorEmail.trim()) {
    setCommentError("Please complete all fields.");
    return;
  }

  if (!blog?.id || !blog.slug) {
    setCommentError("Unable to identify this article.");
    return;
  }

  setCommentSubmitting(true);
  setCommentError("");

  try {
    await addDoc(collection(db, "comments"), {
      blogId: blog.id,
      blogSlug: blog.slug,
      comment: comment.trim(),
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim().toLowerCase(),
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setComment("");
    setAuthorName("");
    setAuthorEmail("");
    setCommentSubmitted(true);
  } catch (error) {
    console.error("Comment submission error:", error);
    setCommentError("Unable to submit your comment. Please try again.");
  } finally {
    setCommentSubmitting(false);
  }
}

  // Calculate previous and next posts
  const currentIndex = allBlogs.findIndex((b) => b.slug === slug);
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog =
    currentIndex >= 0 && currentIndex < allBlogs.length - 1
      ? allBlogs[currentIndex + 1]
      : null;

  // Determine top posts: other blogs from DB or fallback
  const topPostsList =
    allBlogs.length > 1
      ? allBlogs.filter((b) => b.slug !== slug).slice(0, 5)
      : fallbackTopPosts;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white pt-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#173D32] border-t-transparent" />
          <p className="text-sm text-gray-500 font-medium">Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 pt-24 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#171717]">
          Article not found
        </h1>
        <p className="mt-4 max-w-md text-sm text-gray-500">
          {error || "This article may have been removed or is currently being edited."}
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#173D32] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D78359]"
        >
          <ArrowLeft size={16} />
          Explore More Articles
        </Link>
      </main>
    );
  }

  const categoryName = blog.category || "Technology";
  const authorDisplay = blog.authorName || "growthenzymetech@gmail.com";
  const publishedDateDisplay = formatDate(blog.publishedAt);
const sanitizedContent = DOMPurify.sanitize(
  blog.content || "",
  {
    ALLOWED_TAGS: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "a",
      "img",
      "br",
      "hr",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "title",
      "width",
      "height",
    ],
  }
);
  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col justify-between">
      <div>

        {/* ========================================================= */}
        {/* DARK NAVY/FOREST HERO SECTION (Top Half)                  */}
        {/* ========================================================= */}
        <header className="relative bg-[#173D32] pt-32 pb-36 sm:pt-36 sm:pb-44 lg:pt-40 lg:pb-52 px-5 sm:px-8 text-white">
          {/* Subtle soft gradient light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40"
          />

          <div className="relative mx-auto max-w-4xl text-center">
            {/* Small centered category & date */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#D78359]">
              <span>{categoryName}</span>
              <span className="text-white/40">•</span>
              <span>{publishedDateDisplay}</span>
            </div>

            {/* Big Centered Headline (White) */}
            <h1 className="mt-4 font-heading text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.14]">
              {blog.title}
            </h1>

            {/* Author Byline */}
            <p className="mt-4 text-xs sm:text-sm font-medium tracking-wide text-white/70">
              By {authorDisplay}
            </p>
          </div>

          {/* Floating Social Icons on Right Edge */}
          <aside
            aria-label="Social Share"
            className="absolute right-5 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3.5 z-20"
          >
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-[#1877F2] hover:text-white hover:scale-110 shadow-sm backdrop-blur-sm"
              aria-label="Share on Facebook"
            >
              <FacebookIcon size={14} />
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title || "")}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-black hover:text-white hover:scale-110 shadow-sm backdrop-blur-sm"
              aria-label="Share on X (Twitter)"
            >
              <TwitterIcon size={14} />
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-[#0A66C2] hover:text-white hover:scale-110 shadow-sm backdrop-blur-sm"
              aria-label="Share on LinkedIn"
            >
              <LinkedinIcon size={14} />
            </a>

            <button
              onClick={handleCopyLink}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-[#D78359] hover:text-white hover:scale-110 shadow-sm backdrop-blur-sm"
              aria-label="Copy Link"
            >
              {copied ? <Check size={14} className="text-[#D78359]" /> : <Link2 size={14} />}
            </button>
          </aside>
        </header>

        {/* ========================================================= */}
        {/* OVERLAPPING HERO IMAGE (Straddles Dark Top & White Bottom) */}
        {/* ========================================================= */}
        <section aria-label="Featured Image" className="relative -mt-24 sm:-mt-32 lg:-mt-40 mx-auto max-w-5xl px-5 sm:px-8 z-10">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl shadow-[0_25px_60px_rgba(23,61,50,0.22)] bg-[#E8EEE5] border border-white/20">
            {coverImage ? (
              <img
                src={coverImage}
                alt={blog.title || "Blog cover"}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src="/services/img3.webp"
                alt={blog.title || "Blog featured visual"}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* ARTICLE CONTENT ON CLEAN WHITE BACKGROUND                 */}
        {/* ========================================================= */}
        <main className="bg-white pt-10 sm:pt-14 pb-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">

              {/* LEFT COLUMN: MAIN ARTICLE (8 COLS) */}
              <article className="lg:col-span-8">

                {/* Lead Excerpt Paragraph */}
                {blog.excerpt && (
                  <p className="text-lg sm:text-xl font-serif italic text-gray-700 leading-relaxed pb-6 border-b border-gray-100">
                    {blog.excerpt}
                  </p>
                )}

                {/* Article Body */}
             {/* Article Body */}
<div
  className="blog-article-content mt-8"
  dangerouslySetInnerHTML={{
    __html: sanitizedContent,
  }}
/>

                {/* LIKE & ACTION BAR */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLike}
                      className={`inline-flex items-center gap-2 rounded px-3.5 py-1.5 text-xs font-bold transition ${
                        hasLiked
                          ? "bg-[#173D32] text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <ThumbsUp size={13} />
                      <span>{hasLiked ? "Liked" : "Like"}</span>
                    </button>

                   <button
  onClick={handleCopyLink}
  className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
>
  <span>Share</span>
</button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C26233] transition"
                    >
                      <span>{copied ? "Link Copied!" : "Share Link"}</span>
                    </button>
                  </div>
                </div>



{/* COMMENTS SECTION */}
<section className="mt-16 border-t border-[#E8EEE5] pt-12">

  {/* SECTION HEADING */}
  <div className="mb-8">
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#829181]">
      Community Discussion
    </p>

    <h3
      className="mt-2 text-3xl sm:text-4xl text-[#29382F]"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      Join the conversation.
    </h3>

    <p className="mt-2 text-sm text-[#747D73]">
      Share your thoughts and connect with our community.
    </p>
  </div>

  {/* COMMENT FORM */}
  <div className="rounded-2xl border border-[#E4E9E0] bg-[#F7F8F4] p-5 sm:p-7">

    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29382F] text-white">
        <User size={18} />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-[#29382F]">
          Write a Comment
        </h4>
        <p className="text-xs text-[#829181]">
          Your feedback matters to us.
        </p>
      </div>
    </div>

    {!commentOpen ? (
      <button
        type="button"
        onClick={() => setCommentOpen(true)}
        className="w-full rounded-xl border border-[#DDE4D9] bg-white px-5 py-5 text-left text-sm text-[#92998F] transition hover:border-[#829181]"
      >
        Share your thoughts about this article...
      </button>
    ) : commentSubmitted ? (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <div className="flex items-center gap-2">
          <Check size={17} />
          Thank you! Your comment has been submitted for review.
        </div>
      </div>
    ) : (
      <form
        onSubmit={handleCommentSubmit}
        className="flex flex-col gap-4"
      >
        <textarea
          rows={4}
          autoFocus
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full resize-y rounded-xl border border-[#E1E6DD] bg-white p-4 text-sm text-[#29382F] placeholder:text-[#A1A99F] outline-none transition focus:border-[#829181] focus:ring-2 focus:ring-[#829181]/10"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="rounded-xl border border-[#E1E6DD] bg-white px-4 py-3 text-sm text-[#29382F] placeholder:text-[#A1A99F] outline-none focus:border-[#829181]"
          />

          <input
            type="email"
            required
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="Your email address"
            className="rounded-xl border border-[#E1E6DD] bg-white px-4 py-3 text-sm text-[#29382F] placeholder:text-[#A1A99F] outline-none focus:border-[#829181]"
          />
        </div>

        {commentError && (
          <p className="text-xs text-red-600">
            {commentError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#92998F]">
            Your comment will appear after approval.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCommentOpen(false);
                setCommentError("");
              }}
              className="text-xs font-medium text-[#747D73] hover:text-[#29382F]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={commentSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#29382F] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#405C48] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {commentSubmitting ? "Submitting..." : "Post Comment"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </form>
    )}
  </div>

  {/* APPROVED COMMENTS */}
  <div className="mt-12">

    <div className="mb-6 flex items-center justify-between border-b border-[#E8EEE5] pb-4">
      <div>
        <h4
          className="text-2xl text-[#29382F]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Comments & Discussion
        </h4>

        <p className="mt-1 text-xs text-[#92998F]">
          Thoughts shared by our readers
        </p>
      </div>

      <span className="rounded-full bg-[#EEF3EA] px-3 py-1.5 text-xs font-semibold text-[#405C48]">
        {approvedComments.length} Comments
      </span>
    </div>

    {commentsLoading ? (
      <p className="py-8 text-center text-sm text-[#829181]">
        Loading comments...
      </p>
    ) : approvedComments.length === 0 ? (
      <div className="rounded-xl border border-dashed border-[#DDE4D9] bg-[#FAFBF9] px-5 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3EA]">
          <User size={20} className="text-[#657365]" />
        </div>

        <p className="mt-4 text-base font-semibold text-[#29382F]">
          No comments yet
        </p>

        <p className="mt-2 text-sm text-[#92998F]">
          Be the first to share your thoughts!
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {approvedComments.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-[#E8EEE5] bg-white p-5 transition hover:border-[#C8D5C3] hover:bg-[#FAFBF9]"
          >
            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8EEE5] text-sm font-semibold text-[#405C48]">
                {item.authorName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#29382F]">
                    {item.authorName}
                  </p>

                  <span className="text-[11px] text-[#92998F]">
                    {item.createdAt?.toDate
                      ? item.createdAt.toDate().toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#657365]">
                  {item.comment}
                </p>

              </div>
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
</section>


                {/* POST NAVIGATION & EXPLORE MORE */}
                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/blog"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-[#173D32] hover:text-[#C26233] transition-colors"
                  >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Explore More Articles
                  </Link>

                  <div className="flex items-center gap-2">
                    {prevBlog && (
                      <Link
                        href={`/blog/${prevBlog.slug}`}
                        className="rounded border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:border-[#173D32] hover:text-[#173D32] transition"
                      >
                        ← Previous Article
                      </Link>
                    )}
                    {nextBlog && (
                      <Link
                        href={`/blog/${nextBlog.slug}`}
                        className="rounded border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:border-[#173D32] hover:text-[#173D32] transition"
                      >
                        Next Article →
                      </Link>
                    )}
                  </div>
                </div>

              </article>

              {/* RIGHT COLUMN: SIDEBAR (4 COLS) */}
              <aside className="lg:col-span-4 flex flex-col gap-8">

                {/* PROMO CARD */}
                <div className="rounded-xl bg-gradient-to-br from-[#D78359] via-[#C26233] to-[#B55224] p-6 text-white shadow-md">
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    Engineered for Growth
                  </span>

                  <h4 className="mt-4 font-serif text-xl sm:text-2xl font-bold leading-snug">
                    Experience measurable scale with GrowthEnzyme.
                  </h4>

                  <p className="mt-2.5 text-xs leading-relaxed text-white/90">
                    Full-service performance marketing, web development, SEO, and business automation built to turn attention into revenue.
                  </p>

                  <Link
                    href="/#contact"
                    className="mt-5 inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#C26233] transition hover:bg-[#173D32] hover:text-white"
                  >
                    <span>Start a project</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* TOP STORIES WIDGET */}
                <div className="rounded-xl border border-gray-100 bg-[#FAFBF9] p-6 shadow-sm">
                  <h4 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#171717] pb-2.5 border-b-2 border-[#171717]">
                    TOP STORIES
                  </h4>

                  <div className="mt-4 flex flex-col divide-y divide-gray-100">
                    {topPostsList.map((item: any, index) => {
                      const postImage =
                        item.coverImage ||
                        item.image ||
                        (index === 0
                          ? "/services/img1.webp"
                          : index === 1
                          ? "/services/img2.webp"
                          : index === 2
                          ? "/services/img3.webp"
                          : "/services/img4.webp");

                      const postCategory = item.category || "GROWTH";
                      const postDate = item.publishedAt
                        ? formatDate(item.publishedAt)
                        : item.date || "Nov 2026";

                      return (
                        <Link
                          key={item.id}
                          href={`/blog/${item.slug || "article"}`}
                          className="group flex items-start gap-3.5 py-3.5 transition"
                        >
                          {/* Thumbnail Image */}
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                            <img
                              src={postImage}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            {/* Category Badge */}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C26233]">
                              {postCategory}
                            </span>

                            {/* Headline */}
                            <p className="mt-1 text-xs sm:text-sm font-bold leading-snug text-[#171717] group-hover:text-[#C26233] transition-colors line-clamp-2">
                              {item.title}
                            </p>

                            {/* Meta info: Date */}
                            <div className="mt-1.5 text-[11px] font-medium text-gray-400">
                              <span>{postDate}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORIES WIDGET */}
                <div className="rounded-xl border border-gray-100 bg-[#FAFBF9] p-6 shadow-sm">
                  <h4 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#171717] pb-2.5 border-b-2 border-[#171717]">
                    CATEGORIES
                  </h4>

                  <div className="mt-3 flex flex-col divide-y divide-gray-100">
                    {sidebarCategories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/blog?category=${encodeURIComponent(cat)}`}
                        className="group flex items-center justify-between py-2 text-xs sm:text-sm text-[#4E6255] transition hover:text-[#D78359]"
                      >
                        <span>{cat}</span>
                        <span className="text-xs text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-[#D78359]">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

              </aside>

            </div>
          </div>
        </main>

      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
