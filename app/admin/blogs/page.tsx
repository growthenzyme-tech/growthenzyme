
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Plus,
  FileText,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  CalendarDays,
  FolderOpen,
  CheckCircle2,
  FileEdit,
  MoreHorizontal,
   Star,
} from "lucide-react";

import {
  getAllBlogs,
  deleteBlog,
  updateBlogStatus,
} from "@/app/lib/blog";

import {
  getGeneralSettings,
  updateFeaturedBlogId,
} from "@/app/lib/settings";

type Blog = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  authorName?: string;
  status?: "draft" | "published";
  createdAt?: any;
  publishedAt?: any;
};

type FilterType = "all" | "published" | "draft";

export default function BlogManagementPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [featuredBlogId, setFeaturedBlogId] = useState("");


const fetchBlogs = useCallback(async () => {
  try {
    setError("");
    setLoading(true);

    const [data, settings] = await Promise.all([
      getAllBlogs(),
      getGeneralSettings(),
    ]);

    setBlogs(data as Blog[]);
    setFeaturedBlogId(settings.featuredBlogId || "");
  } catch (err) {
    console.error("Error fetching blogs:", err);
    setError(
      "Unable to load blogs. Please check your connection and permissions."
    );
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const publishedCount = blogs.filter(
    (blog) => blog.status === "published"
  ).length;

  const draftCount = blogs.filter(
    (blog) => blog.status === "draft"
  ).length;

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(search.toLowerCase()) ||
        blog.category?.toLowerCase().includes(search.toLowerCase()) ||
        blog.authorName?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "all" || blog.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [blogs, search, activeFilter]);

  function formatDate(timestamp: any) {
    if (!timestamp) return "—";

    const date = timestamp?.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }


  async function handleSetLeadArticle(blog: Blog) {
  if (blog.status !== "published") return;

  try {
    setActionId(blog.id);

    await updateFeaturedBlogId(blog.id);

    setFeaturedBlogId(blog.id);
  } catch (err) {
    console.error("Error setting Lead Article:", err);
    alert("Unable to set this blog as the Lead Article.");
  } finally {
    setActionId(null);
  }
}

  async function handleDelete(blog: Blog) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog.title || "this blog"}"?`
    );

    if (!confirmed) return;

    try {
      setActionId(blog.id);
      await deleteBlog(blog.id);

      setBlogs((current) =>
        current.filter((item) => item.id !== blog.id)
      );
} catch (err: any) {
  console.error("Delete error details:", {
    code: err?.code,
    message: err?.message,
    error: err,
  });

  alert(
    `Unable to delete blog.\n\nError: ${err?.code || "Unknown"}\n${err?.message || "Please try again."}`
  );
} finally {
      setActionId(null);
    }
  }

  async function handleStatusChange(blog: Blog) {
    const newStatus =
      blog.status === "published" ? "draft" : "published";

    const confirmed = window.confirm(
      newStatus === "published"
        ? `Publish "${blog.title}"?`
        : `Move "${blog.title}" back to drafts?`
    );

    if (!confirmed) return;

    try {
      setActionId(blog.id);

      await updateBlogStatus(blog.id, newStatus);

      setBlogs((current) =>
        current.map((item) =>
          item.id === blog.id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Unable to update the blog status.");
    } finally {
      setActionId(null);
    }
  }

  const filters: {
    label: string;
    value: FilterType;
    count: number;
  }[] = [
    { label: "All Blogs", value: "all", count: blogs.length },
    {
      label: "Published",
      value: "published",
      count: publishedCount,
    },
    { label: "Drafts", value: "draft", count: draftCount },
  ];


return (
  <div className="mx-auto max-w-[1400px] space-y-8 pb-12">

    {/* Page Heading */}
    <div className="relative isolate overflow-hidden rounded-2xl bg-[#B6CBA9] px-6 py-8 text-[#29382F] sm:px-9 sm:py-10">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFFDF8]/30 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#29382F]">
            <span className="h-2 w-2 rounded-full bg-[#D78359]" />
            Content Workspace
          </div>

          <h1
            className="text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Blog Management
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#29382F]/80">
            Create, organize and manage your website articles. Keep your
            content fresh and your ideas moving forward.
          </p>
        </div>

        <Link
          href="/admin/blogs/create"
          className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)]"
        >
          <Plus size={17} />
          Create New Blog
        </Link>
      </div>

      <div className="relative mt-7 flex flex-wrap items-center gap-2 border-t border-[#29382F]/15 pt-5">
        <span className="rounded-full bg-[#29382F] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FFFDF8]">
          Content Studio
        </span>
        <span className="text-xs font-medium text-[#29382F]/70">
          Manage your articles and publications
        </span>
      </div>
    </div>

    {/* Statistics */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

      {/* Total Blogs */}
      <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(41,56,47,0.07)]">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B6CBA9]/40 text-[#29382F]">
            <FileText size={20} />
          </div>
          <span className="rounded-full bg-[#F5F0E5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#29382F]/65">
            Total Content
          </span>
        </div>

        <p className="mt-5 text-3xl font-bold text-[#29382F]">
          {blogs.length}
        </p>
        <p className="mt-1 text-xs font-medium text-[#657365]">
          Total blogs
        </p>
      </div>

      {/* Published Blogs */}
      <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(41,56,47,0.07)]">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EDE3] text-[#405C48]">
            <CheckCircle2 size={20} />
          </div>
          <span className="rounded-full bg-[#E8EDE3] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#405C48]">
            Live Content
          </span>
        </div>

        <p className="mt-5 text-3xl font-bold text-[#29382F]">
          {publishedCount}
        </p>
        <p className="mt-1 text-xs font-medium text-[#657365]">
          Published blogs
        </p>
      </div>

      {/* Draft Blogs */}
      <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(41,56,47,0.07)]">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0E5] text-[#D78359]">
            <FileEdit size={20} />
          </div>
          <span className="rounded-full bg-[#F5F0E5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9B684B]">
            In Progress
          </span>
        </div>

        <p className="mt-5 text-3xl font-bold text-[#29382F]">
          {draftCount}
        </p>
        <p className="mt-1 text-xs font-medium text-[#657365]">
          Saved drafts
        </p>
      </div>
    </div>

    {/* Blog Table Container */}
    <div className="overflow-hidden rounded-2xl border border-[#DDE4D9] bg-white shadow-[0_5px_25px_rgba(41,56,47,0.035)]">

      {/* Table Heading */}
      <div className="border-b border-[#E5E4DC] bg-[#F5F0E5]/60 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                  activeFilter === filter.value
                    ? "bg-[#29382F] text-white shadow-[0_3px_8px_rgba(41,56,47,0.16)]"
                    : "border border-[#DDE4D9] bg-[#FFFDF8] text-[#657365] hover:border-[#A5B59F] hover:bg-[#E8EDE3] hover:text-[#29382F]"
                }`}
              >
                {filter.label}
                <span className={`ml-2 ${activeFilter === filter.value ? "text-[#B6CBA9]" : "text-[#29382F]/50"}`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative w-full lg:w-[270px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#657365]"
              />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#DDE4D9] bg-[#FFFDF8] pl-9 pr-3 text-xs font-medium text-[#29382F] outline-none transition placeholder:text-[#92998F] focus:border-[#506B59] focus:ring-4 focus:ring-[#B6CBA9]/20"
              />
            </div>

            <button
              onClick={fetchBlogs}
              disabled={loading}
              title="Refresh blogs"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DDE4D9] bg-[#FFFDF8] text-[#405C48] transition hover:border-[#A5B59F] hover:bg-[#E8EDE3] disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">

          <thead>
            <tr className="border-b border-[#E5E4DC] bg-[#FFFDF8]">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#657365]">
                Blog Details
              </th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#657365]">
                Category
              </th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#657365]">
                Author
              </th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#657365]">
                Date
              </th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#657365]">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-[#657365]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EDEFE9]">

            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <RefreshCw
                    size={23}
                    className="mx-auto animate-spin text-[#506B59]"
                  />
                  <p className="mt-3 text-xs font-medium text-[#657365]">
                    Loading your blogs...
                  </p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <p className="text-sm text-red-500">{error}</p>
                  <button
                    onClick={fetchBlogs}
                    className="mt-3 text-xs font-bold text-[#405C48] underline underline-offset-4"
                  >
                    Try again
                  </button>
                </td>
              </tr>
            ) : filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EDE3] text-[#405C48]">
                    <FolderOpen size={24} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-[#29382F]">
                    {search || activeFilter !== "all"
                      ? "No matching blogs found"
                      : "No blogs created yet"}
                  </h3>

                  <p className="mt-2 text-xs text-[#657365]">
                    {search || activeFilter !== "all"
                      ? "Try changing your search or filter."
                      : "Start by creating your first blog article."}
                  </p>

                  {!search && activeFilter === "all" && (
                    <Link
                      href="/admin/blogs/create"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#29382F] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#405C48]"
                    >
                      <Plus size={15} />
                      Create Your First Blog
                    </Link>
                  )}
                </td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="transition-colors duration-200 hover:bg-[#F5F7F2]"
                >
                  {/* Blog Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#DDE4D9] bg-[#E8EDE3] text-[#405C48]">
                        <FileText size={19} />
                      </div>

                      <div className="max-w-[280px]">
                        <p className="truncate text-[13px] font-bold text-[#29382F]">
                          {blog.title || "Untitled Blog"}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-[#657365]">
                          /{blog.slug || "no-slug"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="inline-block rounded-lg border border-[#DDE4D9] bg-[#F5F0E5] px-2.5 py-1.5 text-[11px] font-medium text-[#405C48]">
                      {blog.category || "Uncategorized"}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-[#405C48]">
                      {blog.authorName || "Unknown"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#657365]">
                      <CalendarDays size={14} className="text-[#A5B59F]" />
                      {formatDate(blog.createdAt)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                        blog.status === "published"
                          ? "border border-[#B6CBA9] bg-[#E8EDE3] text-[#405C48]"
                          : "border border-[#E8D8C7] bg-[#F5F0E5] text-[#9B684B]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          blog.status === "published"
                            ? "bg-[#506B59]"
                            : "bg-[#D78359]"
                        }`}
                      />
                      {blog.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">

                                            {blog.status === "published" && (
  <button
    onClick={() => handleSetLeadArticle(blog)}
    disabled={actionId === blog.id}
    title={
      featuredBlogId === blog.id
        ? "Currently selected as Lead Article"
        : "Set as Lead Article"
    }
    className={`flex h-9 items-center gap-1.5 rounded-lg px-2 text-[10px] font-bold transition disabled:opacity-40 ${
      featuredBlogId === blog.id
        ? "bg-[#E8EDE3] text-[#405C48]"
        : "text-[#657365] hover:bg-[#E8EDE3] hover:text-[#29382F]"
    }`}
  >
    <Star
      size={15}
      fill={featuredBlogId === blog.id ? "currentColor" : "none"}
    />
    {featuredBlogId === blog.id ? "Lead Article" : "Set Lead"}
  </button>
)}

                      {blog.status === "published" && blog.slug && (
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          title="View blog"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#657365] transition hover:bg-[#E8EDE3] hover:text-[#29382F]"
                        >
                          <Eye size={16} />
                        </Link>
                      )}

                      <button
                        onClick={() =>
                          router.push(`/admin/edit/${blog.id}`)
                        }
                        title="Edit blog"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#657365] transition hover:bg-[#E8EDE3] hover:text-[#29382F]"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        onClick={() => handleStatusChange(blog)}
                        disabled={actionId === blog.id}
                        title={
                          blog.status === "published"
                            ? "Move to draft"
                            : "Publish blog"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#657365] transition hover:bg-[#F5F0E5] hover:text-[#D78359] disabled:opacity-40"
                      >
                        {blog.status === "published" ? (
                          <FileEdit size={16} />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(blog)}
                        disabled={actionId === blog.id}
                        title="Delete blog"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#657365] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!loading && !error && (
        <div className="flex flex-col gap-2 border-t border-[#E5E4DC] bg-[#FFFDF8] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-medium text-[#657365]">
            Showing {filteredBlogs.length} of {blogs.length} blogs
          </p>

          <p className="text-[10px] font-medium tracking-wide text-[#657365]/70">
            GrowthEnzyme Content Studio
          </p>
        </div>
      )}
    </div>
  </div>
);

}
