
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
     <h1 className="whitespace-nowrap font-heading text-[clamp(2.6rem,11vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.065em] text-[#29382F] sm:text-[clamp(3.5rem,9vw,5rem)] lg:text-[clamp(3rem,5.4vw,5.6rem)]">
  The
  <span className="ml-2 inline-block rounded-full bg-[#29382F] px-4 py-2.5 text-white sm:ml-3 sm:px-8">
    Blog.
  </span>
</h1>

      <p className="mx-auto mt-5 max-w-xl text-xs leading-7 text-[#29382F]/75 sm:text-sm">
        Discover ideas, insights and strategies to help your
        business grow in the digital world.
      </p>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
  href="/"
  className="group inline-flex items-center justify-center gap-4 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)]"
>
  Back to Home
  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/50 bg-white/35">
    <ArrowUpRight
      size={16}
      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  </span>
</a>

      <span className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/30 px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-[#29382F]">
        <BookOpen size={13} />
        Explore Our Articles
      </span>
    </div>

  </div>

  {/* Bottom fade */}
<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-b from-transparent to-[#FFFDF8]" />
</section>



      {/* ================= CATEGORY FILTERS ================= */}
 <section className="border-b border-[#29382F]/10 bg-[#FFFDF8] px-6 py-7 md:px-12 lg:px-20">
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
    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">

      {remainingBlogs.map((blog) => (
        <article
          key={blog.id}
          className="group flex min-w-0 flex-col"
        >
          {/* Larger Article Image */}
          <Link
            href={`/blog/${blog.slug || blog.id}`}
            className="relative mb-6 block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#E9E5DA]"
          >
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={blog.title || "Blog article"}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#B6CBA9] text-xs font-bold uppercase tracking-widest text-[#29382F]">
                GrowthEnzyme Journal
              </div>
            )}

            {/* Category Badge */}
            <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-[#FFFDF8]/95 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-[#29382F] backdrop-blur-sm">
              {blog.category || "Insights"}
            </span>
          </Link>

          {/* Article Content */}
          <div className="flex flex-1 flex-col items-start">

            <div className="mb-3 flex items-center gap-2 text-[10px] font-medium text-[#829181]">
              <CalendarDays size={13} />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </div>

            <Link href={`/blog/${blog.slug || blog.id}`}>
              <h3 className="font-heading line-clamp-2 text-2xl font-bold leading-tight tracking-tight text-[#29382F] transition-colors duration-300 group-hover:text-[#506B59] sm:text-3xl">
                {blog.title}
              </h3>
            </Link>

            <p className="mt-3 line-clamp-3 text-xs leading-6 text-[#667267] sm:text-sm">
              {blog.excerpt}
            </p>

            {/* Read More Button */}
            <Link
              href={`/blog/${blog.slug || blog.id}`}
              className="group/button mt-6 inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#29382F] shadow-[0_4px_0_#6F9259,0_7px_14px_rgba(41,56,47,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_0_#6F9259,0_10px_18px_rgba(41,56,47,0.15)]"
            >
              Read Article
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/50 bg-white/35">
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                />
              </span>
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
