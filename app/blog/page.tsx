"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  CalendarDays,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

import {
  getPublishedBlogs,
  getMediaById,
} from "@/app/lib/blog";

import { getGeneralSettings } from "@/app/lib/settings";
import Footer from "@/app/components/sections/Footer";

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
  const [featuredBlogId, setFeaturedBlogId] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  // Fetch published blogs and the admin-selected Lead Article
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await getPublishedBlogs();

        try {
          const settings = await getGeneralSettings();
          setFeaturedBlogId(settings.featuredBlogId || "");
        } catch (settingsError) {
          console.error("Error fetching blog settings:", settingsError);
        }

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

  useEffect(() => {
    setVisibleCount(4);
  }, [activeCategory, search]);

  // Format Firebase dates
  function formatDate(timestamp: any) {
    if (!timestamp) return "";

    const date = timestamp?.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Generate categories dynamically
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        blogs
          .map((blog) => blog.category)
          .filter((category): category is string => Boolean(category))
      )
    );

    return ["All", ...uniqueCategories];
  }, [blogs]);

  // Category and search filtering
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory =
        activeCategory === "All" ||
        blog.category === activeCategory;

      const searchText = search.toLowerCase();

      const matchesSearch =
        (blog.title || "").toLowerCase().includes(searchText) ||
        (blog.excerpt || "").toLowerCase().includes(searchText) ||
        (blog.category || "").toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, search]);

  // Admin-selected Lead Article
  const leadBlog = filteredBlogs.find(
    (blog) => blog.id === featuredBlogId
  );

  // All other articles
  const remainingBlogs = leadBlog
    ? filteredBlogs.filter((blog) => blog.id !== leadBlog.id)
    : filteredBlogs;

  // Sort Latest Articles by newest publication date
  const sortedLatestBlogs = useMemo(() => {
    return [...remainingBlogs].sort((a, b) => {
      const getDate = (blog: Blog) => {
        const timestamp = blog.publishedAt || blog.createdAt;
        if (!timestamp) return 0;
        const date = timestamp?.toDate
          ? timestamp.toDate()
          : new Date(timestamp);
        return date.getTime() || 0;
      };

      return getDate(b) - getDate(a);
    });
  }, [remainingBlogs]);

  // Top 3 published articles for the Hero right-side collage
  const heroSpotlights = useMemo(() => {
    const sortedAll = [...blogs].sort((a, b) => {
      const getDate = (blog: Blog) => {
        const timestamp = blog.publishedAt || blog.createdAt;
        if (!timestamp) return 0;
        const date = timestamp?.toDate
          ? timestamp.toDate()
          : new Date(timestamp);
        return date.getTime() || 0;
      };
      return getDate(b) - getDate(a);
    });
    return sortedAll.slice(0, 3);
  }, [blogs]);

  // Display 4 articles initially
  const visibleBlogs = sortedLatestBlogs.slice(0, visibleCount);

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#FFFDF8]">
        {/* ================= BLOG HERO ================= */}
     {/* ================= BLOG HERO ================= */}
        <section className="relative overflow-hidden bg-[#B6CBA9] px-6 pb-12 pt-16 md:px-12 md:pb-14 md:pt-20 lg:px-20">
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* LEFT COLUMN: Title, Copy & Actions */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#29382F]/50" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#29382F]">
                  GrowthEnzyme Journal
                </p>
              </div>

              <div className="py-5 md:py-6">
                <h1 className="whitespace-nowrap font-heading text-[clamp(2.5rem,10vw,4rem)] font-bold leading-[0.98] tracking-[-0.065em] text-[#29382F] sm:text-[clamp(3.2rem,7vw,4.4rem)] lg:text-[clamp(3rem,4.6vw,4.6rem)]">
                  The
                  <span className="ml-2 inline-block rounded-full bg-[#29382F] px-5 py-2 text-white sm:ml-3 sm:px-7">
                    Blog.
                  </span>
                </h1>

                <p className="mt-4 max-w-md text-xs leading-6 text-[#29382F]/80 sm:text-sm">
                  Discover ideas, insights and strategies to help your business
                  grow in the digital world.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-4 py-2.5 text-xs font-bold text-[#29382F] shadow-[0_4px_0_#6F9259,0_8px_16px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#6F9259,0_10px_20px_rgba(41,56,47,0.18)] sm:text-sm"
                >
                  Back to Home
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/50 bg-white/35">
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>

                <a
                  href="#blog-feed"
                  className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/30 bg-white/30 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#29382F] backdrop-blur-xs transition hover:bg-[#F5F0E5]"
                >
                  <BookOpen size={13} />
                  Explore Our Articles
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Compact Staggered 2 Published Article Image Cards */}
            <div className="relative lg:col-span-6">
              {loading ? (
                <div className="relative mx-auto h-[280px] max-w-md animate-pulse rounded-3xl bg-[#F5F0E5]" />
              ) : heroSpotlights.length > 0 ? (
                <div className="relative mx-auto max-w-lg">
                  {/* ================= IMAGE CARD 1 (Top-Left + Floating Card 1) ================= */}
                  {heroSpotlights[0] && (
                    <Link
                      href={`/blog/${heroSpotlights[0].slug || heroSpotlights[0].id}`}
                      className="group relative z-20 block w-[70%] sm:w-[56%]"
                    >
                      <div className="aspect-[16/10] overflow-hidden rounded-2xl border-2 border-[#29382F] bg-[#E9E5DA] shadow-[0_12px_24px_rgba(41,56,47,0.14)]">
                        {heroSpotlights[0].coverImage ? (
                          <img
                            src={heroSpotlights[0].coverImage}
                            alt={heroSpotlights[0].title || "Featured insight"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#D5E1CC] text-xs font-bold text-[#29382F]">
                            GrowthEnzyme
                          </div>
                        )}
                      </div>

                      {/* Floating Card 1 */}
                      <div className="relative z-30 -mt-6 ml-3 mr-3 rounded-xl border border-[#29382F]/15 bg-white p-2.5 shadow-[0_10px_22px_rgba(41,56,47,0.13)] transition-transform duration-300 group-hover:-translate-y-0.5 sm:p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[#D5E1CC] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#29382F]">
                            {heroSpotlights[0].category || "Insights"}
                          </span>
                          <span className="text-[8px] font-medium text-[#829181]">
                            {formatDate(
                              heroSpotlights[0].publishedAt ||
                                heroSpotlights[0].createdAt
                            )}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-1 font-heading text-xs font-bold text-[#29382F]">
                          {heroSpotlights[0].title}
                        </p>
                      </div>
                    </Link>
                  )}

                  {/* ================= IMAGE CARD 2 (Bottom-Right + Floating Card 2) ================= */}
                  {heroSpotlights[1] && (
                    <Link
                      href={`/blog/${heroSpotlights[1].slug || heroSpotlights[1].id}`}
                      className="group relative z-20 ml-auto mt-3 block w-[70%] sm:-mt-16 sm:w-[56%]"
                    >
                      <div className="aspect-[16/10] overflow-hidden rounded-2xl border-2 border-[#29382F] bg-[#E9E5DA] shadow-[0_14px_28px_rgba(41,56,47,0.16)]">
                        {heroSpotlights[1].coverImage ? (
                          <img
                            src={heroSpotlights[1].coverImage}
                            alt={heroSpotlights[1].title || "Latest insight"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#29382F] text-xs font-bold text-[#B6CBA9]">
                            Latest Story
                          </div>
                        )}
                      </div>

                      {/* Floating Card 2 */}
                      <div className="relative z-30 -mt-6 -ml-5 mr-5 rounded-xl border border-[#29382F]/15 bg-white p-2.5 shadow-[0_10px_22px_rgba(41,56,47,0.13)] transition-transform duration-300 group-hover:-translate-y-0.5 sm:p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[#29382F] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#B6CBA9]">
                            {heroSpotlights[1].category || "Strategy"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#29382F]">
                            Read <ArrowUpRight size={11} />
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-1 font-heading text-xs font-bold text-[#29382F]">
                          {heroSpotlights[1].title}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mx-auto flex aspect-[16/10] max-w-md flex-col items-center justify-center rounded-3xl border-2 border-[#29382F] bg-[#FFFDF8] p-6 text-center shadow-[0_14px_28px_rgba(41,56,47,0.12)]">
                  <span className="rounded-full bg-[#D5E1CC] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#29382F]">
                    Editorial Hub
                  </span>
                  <p className="mt-3 font-heading text-xl font-bold text-[#29382F]">
                    Fresh playbooks & growth stories coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-b from-transparent to-[#FFFDF8]" />
        </section>

        {/* ================= CATEGORY FILTERS ================= */}
        <section
          id="blog-feed"
          className="border-b border-[#29382F]/10 bg-[#FFFDF8] px-6 py-7 md:px-12 lg:px-20"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Tabs */}
            <div className="flex w-fit max-w-full items-center overflow-x-auto rounded-xl border border-[#29382F]/[0.06] bg-white p-1 shadow-[0_4px_18px_rgba(41,56,47,0.06)]">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative shrink-0 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:px-7 ${
                    activeCategory === category
                      ? "text-[#29382F]"
                      : "text-[#829181] hover:text-[#29382F]"
                  }`}
                >
                  {category}

                  {activeCategory === category && (
                    <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#8DA77F] sm:inset-x-5" />
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-[240px]">
              <Search
                size={15}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#829181]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full border-b border-[#29382F]/20 bg-transparent py-3 pl-7 text-xs text-[#29382F] outline-none placeholder:text-[#829181] transition-colors focus:border-[#506B59]"
              />
            </div>
          </div>
        </section>

        {/* ================= BLOG CONTENT ================= */}
        {loading ? (
          <section className="bg-[#FFFDF8] px-6 py-28 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#B6CBA9] border-t-[#29382F]" />
            <p className="mt-4 text-xs text-[#667267]">
              Loading articles...
            </p>
          </section>
        ) : error ? (
          <section className="bg-[#FFFDF8] px-6 py-28 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </section>
        ) : filteredBlogs.length === 0 ? (
          <section className="bg-[#FFFDF8] px-6 py-28 text-center">
            <h2
              className="text-4xl text-[#29382F]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              No articles found
            </h2>

            <p className="mt-3 text-xs text-[#667267]">
              Try another category or search term.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#506B59] underline underline-offset-4"
            >
              Clear Filters
            </button>
          </section>
        ) : (
          <section className="bg-[#FFFDF8] px-6 py-16 md:px-12 md:py-20 lg:px-20">
            <div className="mx-auto max-w-7xl">
              {/* ================= LEAD ARTICLE ================= */}
              {leadBlog && (
                <div className="mb-20">
                  <div className="mb-8 flex items-center gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#829181]">
                      Editor's Pick
                    </p>
                    <span className="h-px flex-1 bg-[#29382F]/15" />
                  </div>

                  <article className="relative grid items-center lg:grid-cols-[1.35fr_0.65fr]">
                    {/* Article Image */}
                    <Link
                      href={`/blog/${leadBlog.slug || leadBlog.id}`}
                      className="group relative block h-[280px] overflow-hidden bg-[#E9E5DA] sm:h-[380px] lg:h-[460px]"
                    >
                      {leadBlog.coverImage ? (
                        <img
                          src={leadBlog.coverImage}
                          alt={leadBlog.title || "Featured article"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#B6CBA9] text-sm text-[#29382F]">
                          Featured Article
                        </div>
                      )}

                      <span className="absolute left-5 top-5 bg-[#29382F] px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-white">
                        {leadBlog.category || "Featured"}
                      </span>
                    </Link>

                    {/* Overlapping Content Card */}
                    <div className="relative z-10 -mt-8 ml-4 bg-white p-7 shadow-[0_20px_55px_rgba(41,56,47,0.12)] sm:ml-10 sm:p-10 lg:-ml-20 lg:mt-0 lg:p-12">
                      <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8DA77F]">
                        Featured Article
                      </p>

                      <h2 className="font-heading text-3xl font-semibold leading-tight text-[#29382F] sm:text-4xl lg:text-5xl">
                        {leadBlog.title}
                      </h2>

                      <p className="mt-5 line-clamp-4 text-xs leading-7 text-[#667267] sm:text-sm">
                        {leadBlog.excerpt ||
                          "Discover our latest insights and ideas."}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] text-[#829181]">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={13} />
                          {formatDate(
                            leadBlog.publishedAt || leadBlog.createdAt
                          )}
                        </span>

                        {leadBlog.authorName && (
                          <span>By {leadBlog.authorName}</span>
                        )}
                      </div>

                      <Link
                        href={`/blog/${leadBlog.slug || leadBlog.id}`}
                        className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#29382F] px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-white transition hover:bg-[#506B59]"
                      >
                        Read Article
                      </Link>
                    </div>
                  </article>
                </div>
              )}

              {/* ================= LATEST ARTICLES ================= */}
              <div>
                {/* Section Heading */}
                <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#829181]">
                      <span className="h-px w-8 bg-[#8DA77F]" />
                      Explore Our Journal
                    </p>

                    <h2 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.055em] text-[#29382F]">
                      Latest
                      <span className="ml-2 inline-block rounded-full bg-[#29382F] px-5 py-2 text-white sm:ml-3 sm:px-7">
                        Articles.
                      </span>
                    </h2>
                  </div>

                  <span className="pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829181]">
                    {remainingBlogs.length} Articles
                  </span>
                </div>

                {/* Articles Grid */}
                {remainingBlogs.length === 0 ? (
                  <div className="border border-[#29382F]/10 bg-[#F5F0E5] px-6 py-16 text-center">
                    <p className="font-heading text-2xl text-[#29382F]">
                      No more articles to display.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
                    {visibleBlogs.map((blog) => (
                      <article
                        key={blog.id}
                        className="group grid min-w-0 grid-cols-[0.9fr_1.1fr] items-center"
                      >
                        {/* Left: Cover Image */}
                        <Link
                          href={`/blog/${blog.slug || blog.id}`}
                          className="relative z-10 block aspect-[4/5] min-w-0 overflow-hidden rounded-2xl bg-[#E9E5DA]"
                        >
                          {blog.coverImage ? (
                            <img
                              src={blog.coverImage}
                              alt={blog.title || "Blog article"}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#B6CBA9] text-xs font-bold text-[#29382F]">
                              GrowthEnzyme
                            </div>
                          )}
                        </Link>

                        {/* Right: Article Details */}
                        <div className="relative z-20 -ml-5 flex min-h-[220px] min-w-0 flex-col items-start rounded-2xl border border-[#29382F]/[0.06] bg-[#FFFDF8] p-4 shadow-[0_15px_40px_rgba(41,56,47,0.09)] sm:-ml-8 sm:min-h-[260px] sm:p-6">
                          <span className="mb-3 rounded-full bg-[#D5E1CC] px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest text-[#405C48]">
                            {blog.category || "Insights"}
                          </span>

                          <div className="mb-3 flex items-center gap-1.5 text-[9px] text-[#829181]">
                            <CalendarDays size={11} />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </div>

                          <Link href={`/blog/${blog.slug || blog.id}`}>
                            <h3 className="font-heading line-clamp-3 text-lg font-bold leading-tight tracking-tight text-[#29382F] transition-colors group-hover:text-[#506B59] sm:text-xl xl:text-2xl">
                              {blog.title}
                            </h3>
                          </Link>

                          <p className="mt-3 line-clamp-3 text-[10px] leading-5 text-[#667267] sm:text-xs">
                            {blog.excerpt}
                          </p>

                          <Link
                            href={`/blog/${blog.slug || blog.id}`}
                            className="group/button mt-auto inline-flex items-center justify-center gap-2 pt-5 text-[9px] font-bold uppercase tracking-wider text-[#405C48]"
                          >
                            Read Article
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D5E1CC] bg-[#D5E1CC]/50 transition-all duration-300 group-hover/button:bg-[#29382F] group-hover/button:text-white">
                              <ArrowUpRight
                                size={13}
                                className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                              />
                            </span>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* View More Button */}
                {sortedLatestBlogs.length > visibleCount && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={() => setVisibleCount((current) => current + 4)}
                      className="group inline-flex items-center gap-4 rounded-full bg-[#29382F] px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#506B59]"
                    >
                      View More Articles
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight size={15} />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}