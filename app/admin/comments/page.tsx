"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/app/components/cms/AdminShell";
import {
  MessageSquare,
  Search,
  Trash2,
  ExternalLink,
  CalendarDays,
  User,
  AlertCircle,
  Check,
  Loader2,
  Mail,
  FileText,
  X,
  RotateCw,
} from "lucide-react";
import {
  getAllComments,
  deleteComment,
  type BlogComment,
} from "@/app/lib/blog";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<BlogComment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadAllComments();
  }, []);

  async function loadAllComments() {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getAllComments();
      setComments(data);
    } catch (err: any) {
      console.error("Error loading comments:", err);
      setErrorMsg("Failed to load comments from database.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(timestamp: any) {
    if (!timestamp) return "Recent";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "Recent";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteComment(deleteTarget.id, deleteTarget.blogId);
      setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setSuccessMsg("Comment deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3500);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete comment error:", err);
      setErrorMsg("Unable to delete comment. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const filteredComments = comments.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchName = (c.authorName || "").toLowerCase().includes(q);
    const matchEmail = (c.authorEmail || "").toLowerCase().includes(q);
    const matchTitle = (c.blogTitle || "").toLowerCase().includes(q);
    const matchContent = (c.content || "").toLowerCase().includes(q);
    return matchName || matchEmail || matchTitle || matchContent;
  });

  const totalComments = comments.length;
  const uniqueArticles = new Set(comments.map((c) => c.blogId)).size;
  const uniqueReaders = new Set(comments.map((c) => c.authorEmail?.toLowerCase())).size;

  return (
    <AdminShell>
      <div className="space-y-7">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#29382F]/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D78359]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
              Reader Engagement
            </div>
            <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#29382F]">
              Comments Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#506B59]">
              View, moderate, and manage user comments across all published blog articles.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadAllComments}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/15 bg-white px-4 py-2 text-xs font-semibold text-[#29382F] hover:bg-[#29382F] hover:text-white transition shadow-xs cursor-pointer"
            >
              <RotateCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh Comments</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK BANNERS */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="ml-auto text-red-500 hover:text-red-700">
              <X size={14} />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#B6CBA9] bg-[#E8EEE5] p-4 text-xs sm:text-sm text-[#29382F]">
            <Check size={16} className="shrink-0 text-[#29382F]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">Total Comments</span>
              <MessageSquare size={16} className="text-[#D78359]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{totalComments}</p>
          </div>

          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">Articles with Comments</span>
              <FileText size={16} className="text-[#29382F]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{uniqueArticles}</p>
          </div>

          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">Unique Readers</span>
              <User size={16} className="text-[#506B59]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{uniqueReaders}</p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4 rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9]">
          <div className="relative max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search comments by reader, email, article, or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#29382F]/15 bg-white text-[#29382F] placeholder-gray-400 focus:outline-none focus:border-[#29382F]"
            />
          </div>
        </div>

        {/* COMMENTS LIST */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-[#29382F]/10 bg-white">
            <Loader2 size={24} className="animate-spin text-[#29382F]" />
            <p className="text-xs text-[#506B59]">Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-[#29382F]/15 bg-[#FAFBF9]">
            <MessageSquare size={36} className="text-[#506B59]/40 mb-2" />
            <h3 className="font-heading text-base font-bold text-[#29382F]">
              No comments found
            </h3>
            <p className="mt-1 text-xs text-[#506B59] max-w-sm">
              {search
                ? "No comments matched your search criteria."
                : "No reader comments have been submitted yet. They will appear here once posted."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comm) => {
              const initials = (comm.authorName || "Reader")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={comm.id}
                  className="p-5 sm:p-6 rounded-2xl border border-[#29382F]/12 bg-white shadow-xs hover:shadow-sm transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-[#29382F]/8">
                    {/* Author info */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#29382F] text-xs font-bold text-white shadow-xs">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#29382F]">
                            {comm.authorName}
                          </h4>
                          <span className="text-[11px] text-[#506B59]">•</span>
                          <span className="text-xs text-[#506B59]">
                            {formatDate(comm.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#506B59] mt-0.5">
                          <Mail size={12} className="text-[#D78359]" />
                          <span>{comm.authorEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Blog link & Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${comm.blogSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#29382F]/15 bg-[#FAFBF9] px-3.5 py-1.5 text-xs font-semibold text-[#29382F] hover:bg-[#29382F] hover:text-white transition shadow-xs"
                      >
                        <span className="max-w-[180px] sm:max-w-[220px] truncate" title={comm.blogTitle}>
                          {comm.blogTitle}
                        </span>
                        <ExternalLink size={12} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(comm)}
                        title="Delete Comment"
                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="mt-3.5">
                    <p className="text-xs sm:text-sm text-[#38493F] leading-relaxed whitespace-pre-line">
                      {comm.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative flex flex-col w-full max-w-md bg-white rounded-2xl shadow-2xl border border-red-200 p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <Trash2 size={20} />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#29382F]">
                Delete Comment?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#506B59] leading-relaxed">
              Are you sure you want to remove the comment from{" "}
              <strong className="text-[#29382F]">{deleteTarget.authorName}</strong> on article{" "}
              <em>&ldquo;{deleteTarget.blogTitle}&rdquo;</em>? This cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-[#506B59] hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirmed}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-700 transition shadow-xs"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
