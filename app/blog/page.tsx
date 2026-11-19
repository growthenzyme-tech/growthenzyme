
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

  // Fetch published blogs and the admin-selected Lead Article
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await getPublishedBlogs();

        // Settings are fetched separately so a settings error
        // does not prevent published blogs from loading.
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

  return (
    <>
    <main className="min-h-screen overflow-hidden bg-[#FFFDF8]">

      {/* ================= BLOG HERO ================= */}
     
<section className="relative overflow-hidden bg-[#B6CBA9] px-6 pb-16 pt-32 md:px-12 md:pb-20 lg:px-20">

  <div className="relative mx-auto max-w-7xl">

    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-10 bg-[#29382F]/50" />
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#29382F]">
        GrowthEnzyme Journal
      </p>
      <span className="h-px w-10 bg-[#29382F]/50" />
    </div>

    <div className="py-10 text-center md:py-14">
      <h1 className="font-heading text-6xl font-bold tracking-tight text-[#29382F] sm:text-7xl md:text-8xl">
        The Blog
        <span className="text-[#FFFDF8]">.</span>
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-xs leading-7 text-[#29382F]/75 sm:text-sm">
        Discover ideas, insights and strategies to help your
        business grow in the digital world.
      </p>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-[#29382F] px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-white transition hover:bg-[#506B59]"
      >
        Back to Home
        <ArrowUpRight size={13} />
      </a>

      <span className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/30 px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-[#29382F]">
        <BookOpen size={13} />
        Explore Our Articles
      </span>
    </div>

  </div>
</section>



      {/* ================= CATEGORY FILTERS ================= */}
      <section className="border-b border-[#29382F]/10 bg-[#FFFDF8] px-6 py-7 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-[10px] font-bold uppercase tracking-[0.13em] transition ${
                  activeCategory === category
                    ? "text-[#29382F]"
                    : "text-[#829181] hover:text-[#29382F]"
                }`}
              >
                {category}

                {activeCategory === category && (
                  <span className="mt-2 block h-[2px] w-full bg-[#8DA77F]" />
                )}
              </button>
            ))}
          </div>

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
              className="w-full border-b border-[#29382F]/20 bg-transparent py-2 pl-7 text-xs text-[#29382F] outline-none placeholder:text-[#829181] focus:border-[#506B59]"
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
          <ArrowUpRight size={14} />
        </Link>

      </div>
    </article>
  </div>
)}



            {/* ================= LATEST ARTICLES ================= */}
            <div>
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#829181]">
                    Explore Our Journal
                  </p>

                  <h2
                    className="text-4xl text-[#29382F] sm:text-5xl"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    Latest Articles
                  </h2>
                </div>

                <span className="hidden text-[10px] text-[#829181] sm:block">
                  {remainingBlogs.length} Articles
                </span>
              </div>

              {remainingBlogs.length === 0 ? (
                <div className="border border-[#29382F]/10 bg-[#F5F0E5] px-6 py-12 text-center">
                  <p className="text-sm text-[#667267]">
                    No more articles to display.
                  </p>
                </div>
              ) : (
                <div className="grid gap-x-8 gap-y-9 md:grid-cols-2">
                  {remainingBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="group flex min-w-0 gap-4 border-b border-[#29382F]/10 pb-8 sm:gap-5"
                    >
                      <Link
                        href={`/blog/${blog.slug || blog.id}`}
                        className="relative block h-[145px] w-[112px] shrink-0 overflow-hidden bg-[#E9E5DA] sm:h-[165px] sm:w-[135px]"
                      >
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title || "Blog article"}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#B6CBA9] text-[10px] text-[#29382F]">
                            Article
                          </div>
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col items-start py-1">

                        <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-[#8DA77F]">
                          {blog.category || "Insights"}
                        </p>

                        <Link
                          href={`/blog/${blog.slug || blog.id}`}
                        >
                          <h3
                            className="line-clamp-3 text-xl leading-tight text-[#29382F] transition group-hover:text-[#506B59] sm:text-2xl"
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                            }}
                          >
                            {blog.title}
                          </h3>
                        </Link>

                        <div className="mt-3 flex items-center gap-2 text-[9px] text-[#829181]">
                          <CalendarDays size={11} />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </div>

                        <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-[#667267] sm:text-xs">
                          {blog.excerpt}
                        </p>

                        <Link
                          href={`/blog/${blog.slug || blog.id}`}
                          className="mt-auto inline-flex items-center gap-2 pt-4 text-[9px] font-bold uppercase tracking-widest text-[#405C48]"
                        >
                          Read More
                          <ArrowRight
                            size={12}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </Link>

                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      )}


      {/* ================= BOTTOM CTA ================= */}
      {/* <section className="bg-[#29382F] px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">

          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B6CBA9]">
              Ready to grow?
            </p>

            <h2
              className="max-w-2xl text-4xl leading-tight text-[#FFFDF8] sm:text-5xl md:text-6xl"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Let's create something
              <span className="italic text-[#B6CBA9]">
                {" "}meaningful.
              </span>
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-4 rounded-full bg-[#B6CBA9] px-7 py-4 text-[10px] font-bold uppercase tracking-widest text-[#29382F] transition hover:bg-[#FFFDF8]"
          >
            Let's Talk
            <ArrowUpRight size={16} />
          </Link>

        </div>
      </section> */}

    </main>
    <Footer />
    </>
  );
}
