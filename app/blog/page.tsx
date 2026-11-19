
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getPublishedBlogs,
  getMediaById,
} from "@/app/lib/blog";

import BlogHero from "@/app/components/sections/blog/BlogHero";
import BlogFilters from "@/app/components/sections/blog/BlogFilters";
import LeadArticle from "@/app/components/sections/blog/LeadArticle";
import BlogGrid from "@/app/components/sections/blog/BlogGrid";
import BlogCTA from "@/app/components/sections/blog/BlogCTA";
import { getGeneralSettings } from "@/app/lib/settings";

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

 useEffect(() => {
  async function fetchBlogs() {
    try {
      const [data, settings] = await Promise.all([
        getPublishedBlogs(),
        getGeneralSettings(),
      ]);

      setFeaturedBlogId(settings.featuredBlogId || "");

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

 const leadBlog = filteredBlogs.find(
  (blog) => blog.id === featuredBlogId
);

const remainingBlogs = leadBlog
  ? filteredBlogs.filter((blog) => blog.id !== leadBlog.id)
  : filteredBlogs;

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFFDF8]">
      <BlogHero />

      <BlogFilters
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <section className="bg-[#FFFDF8] px-6 py-24 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#B6CBA9] border-t-[#29382F]" />
          <p className="mt-4 text-xs text-[#667267]">
            Loading articles...
          </p>
        </section>
      ) : error ? (
        <section className="bg-[#FFFDF8] px-6 py-24 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </section>
      ) : filteredBlogs.length === 0 ? (
        <section className="bg-[#FFFDF8] px-6 py-24 text-center">
          <h2
            className="text-3xl text-[#29382F]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
          >
            No articles found
          </h2>
          <p className="mt-3 text-xs text-[#667267]">
            Try another category or search term.
          </p>
        </section>
      ) : (
    <>
  {leadBlog && (
    <LeadArticle
      blog={leadBlog}
      formatDate={formatDate}
    />
  )}

  <BlogGrid
    blogs={remainingBlogs}
    formatDate={formatDate}
  />
</>
      )}

      <BlogCTA />
    </main>
  );
}
