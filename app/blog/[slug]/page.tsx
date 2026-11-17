
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { getBlogBySlug } from "@/app/lib/blog";

type Blog = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  content?: string;
  authorName?: string;
  coverImageId?: string;
  createdAt?: any;
  publishedAt?: any;
  status?: string;
};

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        setError("");

        const data = await getBlogBySlug(slug);

        if (!data || data.status !== "published") {
          setBlog(null);
          return;
        }

        setBlog(data as Blog);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Unable to load this article. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  function formatDate(timestamp: any) {
    if (!timestamp) return "";

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f7]">
        <p className="text-sm text-gray-500">Loading article...</p>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f8f7] px-6 text-center">
        <h1 className="font-serif text-4xl text-[#29382F]">
          Article not found
        </h1>

        <p className="mt-4 text-sm text-gray-500">
          {error || "This article may have been removed or is not published."}
        </p>

        <Link
          href="/blog"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#405C48] px-5 py-3 text-sm text-white transition hover:bg-[#304737]"
        >
          <ArrowLeft size={16} />
          Back to Articles
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f7]">

      {/* Article Header */}
      <section className="px-6 pb-12 pt-32 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl">

          <Link
            href="/blog"
            className="mb-12 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#405C48]"
          >
            <ArrowLeft size={16} />
            Back to Journal
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#829181]">
            {blog.category || "GrowthEnzyme Journal"}
          </p>

          <h1 className="mt-6 font-serif text-4xl leading-tight text-[#29382F] md:text-6xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 max-w-3xl text-base leading-8 text-gray-500 md:text-lg">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[#e5e7e2] py-5 text-xs text-gray-500">

            {blog.authorName && (
              <span>By {blog.authorName}</span>
            )}

            {blog.publishedAt && (
              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                {formatDate(blog.publishedAt)}
              </span>
            )}

          </div>
        </div>
      </section>

      {/* Cover Image Placeholder */}
      <section className="px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex aspect-[16/8] items-center justify-center overflow-hidden rounded-2xl bg-[#e9ece7]">
            <span className="font-serif text-2xl text-[#829181]">
              GrowthEnzyme
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="px-6 pb-24 pt-16 md:px-12 lg:px-20">
        <div className="blog-article-content mx-auto max-w-3xl">

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content || "<p>No article content available.</p>",
            }}
          />

        </div>
      </article>

      {/* Back to Blogs */}
      <section className="border-t border-[#e5e7e2] px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#405C48] transition hover:gap-3"
          >
            <ArrowLeft size={16} />
            Explore More Articles
          </Link>
        </div>
      </section>

    </main>
  );
}
