
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, CalendarDays, ArrowRight } from "lucide-react";
import {
  getPublishedBlogs,
  getMediaById,
} from "@/app/lib/blog";

type Blog = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  coverImageId?: string;
  coverImage?: string | null;
  authorName?: string;
  createdAt?: any;
  publishedAt?: any;
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await getPublishedBlogs();

        const blogsWithImages = await Promise.all(
          data.map(async (blog: any) => {
            try {
              const coverImage = blog.coverImageId
                ? await getMediaById(blog.coverImageId)
                : null;

              return { ...blog, coverImage };
            } catch (imageError) {
              console.error("Cover image error:", imageError);
              return { ...blog, coverImage: null };
            }
          })
        );

        setBlogs(blogsWithImages as Blog[]);
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

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          blogs
            .map((blog) => blog.category)
            .filter((category): category is string => Boolean(category))
        )
      ),
    ];
  }, [blogs]);

  const featuredBlog = blogs[0];

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog, index) => {
      if (blog.id === featuredBlog?.id) return false;

      const matchesCategory =
        activeCategory === "All" || blog.category === activeCategory;

      const matchesSearch =
        blog.title?.toLowerCase().includes(search.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, search, featuredBlog]);

  return (
    <main className="min-h-screen bg-[#F8F8F5]">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pb-28 lg:px-20">
        <div className="absolute right-[-100px] top-10 h-[350px] w-[350px] rounded-full bg-[#E8EDE4] opacity-60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#829181]">
            <span className="h-px w-8 bg-[#829181]" />
            GrowthEnzyme Journal
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_350px] lg:items-end">
            <h1
              className="max-w-4xl text-5xl leading-[1.08] tracking-tight text-[#29382F] md:text-7xl lg:text-[82px]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Ideas that inspire
              <span className="block italic text-[#829181]">
                growth.
              </span>
            </h1>

            <div className="pb-2">
              <p className="max-w-sm text-sm leading-8 text-[#747D73]">
                Insights, strategies and perspectives to help businesses
                grow in an ever-changing digital world.
              </p>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-[#405C48]">
                Ideas · Innovation · Growth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-7 flex items-center justify-between border-b border-[#E4E7DF] pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#405C48]">
              Featured Story
            </p>
            <span className="text-xs text-[#92998F]">
              01 / Latest
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-[#EEF0EA]">
              <p className="text-sm text-gray-500">Loading featured story...</p>
            </div>
          ) : error ? (
            <p className="py-12 text-center text-sm text-red-500">{error}</p>
          ) : featuredBlog ? (
            <Link
              href={`/blog/${featuredBlog.slug}`}
              className="group grid overflow-hidden rounded-2xl bg-[#EDEFE8] lg:grid-cols-2"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#E0E5DC] lg:aspect-auto lg:min-h-[430px]">
                {featuredBlog.coverImage ? (
                  <img
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title || "Featured article"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[300px] items-center justify-center font-serif text-3xl text-[#829181]">
                    GrowthEnzyme
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
                <span className="w-fit rounded-full border border-[#D5DDCF] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#405C48]">
                  {featuredBlog.category || "Insights"}
                </span>

                <h2
                  className="mt-7 text-4xl leading-tight text-[#29382F] transition group-hover:text-[#627D65] md:text-5xl"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {featuredBlog.title}
                </h2>

                <p className="mt-5 line-clamp-3 text-sm leading-8 text-[#747D73]">
                  {featuredBlog.excerpt}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-[#858D83]">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={14} />
                    {formatDate(featuredBlog.publishedAt)}
                  </span>
                  {featuredBlog.authorName && (
                    <span>By {featuredBlog.authorName}</span>
                  )}
                </div>

                <span className="mt-9 inline-flex w-fit items-center gap-3 border-b border-[#405C48] pb-2 text-sm font-semibold text-[#405C48]">
                  Read Featured Story
                  <ArrowUpRight size={17} className="transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl bg-[#EDEFE8] px-6 py-20 text-center">
              <h2
                className="text-3xl text-[#29382F]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Our journal is just getting started.
              </h2>
              <p className="mt-3 text-sm text-[#747D73]">
                Check back soon for our latest insights.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LATEST ARTICLES */}
      {!loading && !error && blogs.length > 0 && (
        <section className="px-6 pb-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-7xl">

            <div className="mb-10 flex flex-col gap-5 border-b border-[#E4E7DF] pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#829181]">
                  Explore Our Journal
                </p>
                <h2
                  className="mt-3 text-4xl text-[#29382F] md:text-5xl"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Latest Articles
                </h2>
              </div>

              <p className="text-sm text-[#92998F]">
                {blogs.length} Published {blogs.length === 1 ? "Article" : "Articles"}
              </p>
            </div>

            {/* Search */}
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      activeCategory === category
                        ? "bg-[#405C48] text-white"
                        : "border border-[#DDE3D8] bg-transparent text-[#6D786C] hover:bg-[#EDF1E9]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:max-w-[260px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92998F]"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="h-10 w-full rounded-full border border-[#DDE3D8] bg-white pl-9 pr-4 text-xs text-[#29382F] outline-none focus:border-[#829181]"
                />
              </div>
            </div>

            {filteredBlogs.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-2xl text-[#29382F]">
                  No matching articles
                </p>
                <p className="mt-2 text-sm text-[#92998F]">
                  Try another category or search term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {filteredBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[#E9ECE7]">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title || "Blog cover"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-serif text-xl text-[#829181]">
                          GrowthEnzyme
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#829181]">
                        {blog.category || "Insights"}
                      </span>
                      <span className="text-[11px] text-[#92998F]">
                        {formatDate(blog.publishedAt)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-3">
                      <h3
                        className="text-2xl leading-snug text-[#29382F] transition group-hover:text-[#829181]"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        {blog.title}
                      </h3>
                      <ArrowUpRight
                        size={19}
                        className="mt-1 shrink-0 text-[#829181] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#747D73]">
                      {blog.excerpt}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#405C48]">
                      Read Article
                      <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FOOTER CTA */}
      <section className="bg-[#29382F] px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A8B7A5]">
              Keep Growing
            </p>
            <h2
              className="mt-3 text-4xl text-white md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
              Let's grow your business.
            </h2>
          </div>

          <Link
            href="/#contact"
            className="inline-flex w-fit items-center gap-3 rounded-full bg-[#F2F3EC] px-6 py-3.5 text-sm font-semibold text-[#29382F] transition hover:bg-white"
          >
            Get in Touch
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

    </main>
  );
}
