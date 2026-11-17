
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
} from "lucide-react";

import {
  getAllBlogs,
  deleteBlog,
  updateBlogStatus,
} from "@/app/lib/blog";

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

  const fetchBlogs = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getAllBlogs();
      setBlogs(data as Blog[]);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Unable to load blogs. Please check your connection and permissions.");
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
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unable to delete this blog. Please try again.");
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
    <div className="mx-auto max-w-[1400px] space-y-8">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#849487]">
            Content Workspace
          </p>

          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#252D27] md:text-[38px]">
            Blog Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create, organize and manage your website articles.
          </p>
        </div>

        <Link
          href="/admin/blogs/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#405C48] px-5 text-sm font-medium text-white transition hover:bg-[#304737]"
        >
          <Plus size={17} />
          Create New Blog
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-[#E9EAE5] bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0F3EF] text-[#405C48]">
              <FileText size={19} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Total Content
            </span>
          </div>

          <p className="mt-5 text-3xl font-semibold text-[#252D27]">
            {blogs.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">Total blogs</p>
        </div>

        <div className="rounded-xl border border-[#E9EAE5] bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF3EC] text-[#477653]">
              <CheckCircle2 size={19} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Live Content
            </span>
          </div>

          <p className="mt-5 text-3xl font-semibold text-[#252D27]">
            {publishedCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">Published blogs</p>
        </div>

        <div className="rounded-xl border border-[#E9EAE5] bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8F2E8] text-[#A17B43]">
              <FileEdit size={19} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              In Progress
            </span>
          </div>

          <p className="mt-5 text-3xl font-semibold text-[#252D27]">
            {draftCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">Saved drafts</p>
        </div>
      </div>

      {/* Blog Table Container */}
      <div className="overflow-hidden rounded-xl border border-[#E9EAE5] bg-white">

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                  activeFilter === filter.value
                    ? "bg-[#405C48] text-white"
                    : "bg-[#F6F7F4] text-gray-500 hover:bg-[#EDF0EB]"
                }`}
              >
                {filter.label}
                <span className="ml-2 opacity-70">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full lg:w-[270px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#809482]"
              />
            </div>

            <button
              onClick={fetchBlogs}
              disabled={loading}
              title="Refresh blogs"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAF8]">
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Blog Details
                </th>
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Category
                </th>
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Author
                </th>
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Date
                </th>
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <RefreshCw
                      size={22}
                      className="mx-auto animate-spin text-[#405C48]"
                    />
                    <p className="mt-3 text-xs text-gray-400">
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
                      className="mt-3 text-xs font-medium text-[#405C48] underline"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F3EF] text-[#405C48]">
                      <FolderOpen size={22} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-gray-800">
                      {search || activeFilter !== "all"
                        ? "No matching blogs found"
                        : "No blogs created yet"}
                    </h3>

                    <p className="mt-2 text-xs text-gray-400">
                      {search || activeFilter !== "all"
                        ? "Try changing your search or filter."
                        : "Start by creating your first blog article."}
                    </p>

                    {!search && activeFilter === "all" && (
                      <Link
                        href="/admin/blogs/create"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#405C48] px-4 py-2.5 text-xs font-medium text-white"
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
                    className="transition hover:bg-[#FAFBF9]"
                  >
                    {/* Blog Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F0F3EF] text-[#718574]">
                          <FileText size={19} />
                        </div>

                        <div className="max-w-[280px]">
                          <p className="truncate text-[13px] font-semibold text-[#303832]">
                            {blog.title || "Untitled Blog"}
                          </p>
                          <p className="mt-1 truncate text-[11px] text-gray-400">
                            /{blog.slug || "no-slug"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[#F4F5F1] px-2.5 py-1.5 text-[11px] text-[#667568]">
                        {blog.category || "Uncategorized"}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-600">
                        {blog.authorName || "Unknown"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDays size={14} className="text-gray-400" />
                        {formatDate(blog.createdAt)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-medium ${
                          blog.status === "published"
                            ? "bg-[#EAF3EC] text-[#477653]"
                            : "bg-[#F8F1E7] text-[#A17B43]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            blog.status === "published"
                              ? "bg-[#5C9A68]"
                              : "bg-[#C69A55]"
                          }`}
                        />
                        {blog.status === "published"
                          ? "Published"
                          : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">

                        {blog.status === "published" && blog.slug && (
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            title="View blog"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-[#405C48]"
                          >
                            <Eye size={15} />
                          </Link>
                        )}

                        <button
                          onClick={() =>
                            router.push(`/admin/edit/${blog.id}`)
                          }
                          title="Edit blog"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#EDF2ED] hover:text-[#405C48]"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => handleStatusChange(blog)}
                          disabled={actionId === blog.id}
                          title={
                            blog.status === "published"
                              ? "Move to draft"
                              : "Publish blog"
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#EDF2ED] hover:text-[#405C48] disabled:opacity-40"
                        >
                          {blog.status === "published" ? (
                            <FileEdit size={15} />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(blog)}
                          disabled={actionId === blog.id}
                          title="Delete blog"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        >
                          <Trash2 size={15} />
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
          <div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-gray-400">
              Showing {filteredBlogs.length} of {blogs.length} blogs
            </p>

            <p className="text-[10px] text-gray-400">
              GrowthEnzyme Content Studio
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
