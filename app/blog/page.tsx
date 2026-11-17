
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedBlogs } from "@/app/lib/blog";

type Blog = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  coverImageId?: string;
  createdAt?: any;
  publishedAt?: any;
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await getPublishedBlogs();
        setBlogs(data as Blog[]);
      } catch (err) {
        console.error("Error fetching published blogs:", err);
        setError("Unable to load articles at the moment.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

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

  return (
    <main className="min-h-screen bg-[#f8f8f7]">

      {/* Hero */}
      <section className="px-6 pb-16 pt-32 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#829181]">
            GrowthEnzyme Journal
          </p>

          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight text-[#29382F] md:text-7xl">
            Ideas that inspire
            <span className="text-[#829181]"> growth.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-500">
            Insights, strategies and perspectives to help
            businesses grow in an ever-changing digital world.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-center justify-between border-b border-[#e5e7e2] pb-5">
            <h2 className="font-serif text-3xl text-[#29382F]">
              Latest Articles
            </h2>

            <span className="text-sm text-gray-400">
              {blogs.length} Articles
            </span>
          </div>

          {loading ? (
            <p className="py-16 text-center text-gray-500">
              Loading articles...
            </p>
          ) : error ? (
            <p className="py-16 text-center text-red-500">
              {error}
            </p>
          ) : blogs.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="font-serif text-3xl text-[#29382F]">
                No articles published yet
              </h3>
              <p className="mt-3 text-sm text-gray-500">
                Check back soon for our latest insights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group block"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#e9ece7]">
                    <div className="flex h-full items-center justify-center text-sm text-[#829181]">
                      GrowthEnzyme
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#829181]">
                      {blog.category || "Insights"}
                    </span>

                    <span className="text-xs text-gray-400">
                      {formatDate(blog.publishedAt)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <h3 className="font-serif text-2xl leading-snug text-[#29382F] transition group-hover:text-[#829181]">
                      {blog.title}
                    </h3>

                    <ArrowUpRight
                      size={20}
                      className="mt-1 shrink-0 text-[#829181] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">
                    {blog.excerpt}
                  </p>

                  <span className="mt-5 inline-block text-sm font-medium text-[#405C48]">
                    Read Article →
                  </span>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
