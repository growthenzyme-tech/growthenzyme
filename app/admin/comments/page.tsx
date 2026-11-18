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
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getAllComments,
  updateCommentStatus,
  deleteComment,
  type BlogComment,
  type CommentStatus,
} from "@/app/lib/comments";

type FilterStatus = "all" | CommentStatus;

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
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

  async function handleStatusChange(id: string, status: CommentStatus) {
    try {
      setProcessingId(id);
      await updateCommentStatus(id, status);

      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      setSuccessMsg(`Comment marked as ${status}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Status update error:", err);
      setErrorMsg("Unable to update comment status.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteComment(deleteTarget.id);
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

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  };

  const filteredComments = comments.filter((c) => {
    // Status filter
    if (filter !== "all" && c.status !== filter) return false;

    // Search query
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchName = (c.authorName || "").toLowerCase().includes(q);
    const matchEmail = (c.authorEmail || "").toLowerCase().includes(q);
    const matchSlug = (c.blogSlug || "").toLowerCase().includes(q);
    const commentText = c.comment || (c as any).content || "";
    const matchContent = commentText.toLowerCase().includes(q);
    return matchName || matchEmail || matchSlug || matchContent;
  });

  const uniqueArticles = new Set(comments.map((c) => c.blogId || c.blogSlug)).size;
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
              Moderate, approve, reject, and manage reader comments across all articles.
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">Total</span>
              <MessageSquare size={16} className="text-[#D78359]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{counts.all}</p>
          </div>

          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending</span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-800">{counts.pending}</p>
          </div>

          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#405C48] uppercase tracking-wider">Approved</span>
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{counts.approved}</p>
          </div>

          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">Articles</span>
              <FileText size={16} className="text-[#506B59]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{uniqueArticles}</p>
          </div>
        </div>

        {/* TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9]">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { label: "All", value: "all", count: counts.all },
                { label: "Pending", value: "pending", count: counts.pending },
                { label: "Approved", value: "approved", count: counts.approved },
                { label: "Rejected", value: "rejected", count: counts.rejected },
              ] as const
            ).map((t) => (
              <button
                key={t.value}
                onClick={() => setFilter(t.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  filter === t.value
                    ? "bg-[#29382F] text-white shadow-xs"
                    : "bg-white text-[#506B59] hover:bg-black/5 border border-black/5"
                }`}
              >
                <span>{t.label}</span>
                <span className="opacity-75">({t.count})</span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#29382F]/15 bg-white text-[#29382F] placeholder-gray-400 focus:outline-none focus:border-[#29382F]"
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
                : `No comments in "${filter}" status.`}
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
              const commentText = comm.comment || (comm as any).content || "";

              return (
                <div
                  key={comm.id}
                  className="p-5 sm:p-6 rounded-2xl border border-[#29382F]/12 bg-white shadow-xs hover:shadow-sm transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-[#29382F]/8">
                    {/* Author Info */}
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
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              comm.status === "approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : comm.status === "rejected"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {comm.status || "approved"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#506B59] mt-0.5">
                          <Mail size={12} className="text-[#D78359]" />
                          <span>{comm.authorEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Link & Status Actions */}
                    <div className="flex items-center flex-wrap gap-2">
                      <Link
                        href={`/blog/${comm.blogSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#29382F]/15 bg-[#FAFBF9] px-3.5 py-1.5 text-xs font-semibold text-[#29382F] hover:bg-[#29382F] hover:text-white transition shadow-xs"
                      >
                        <span className="max-w-[150px] truncate" title={comm.blogSlug}>
                          {comm.blogSlug}
                        </span>
                        <ExternalLink size={12} />
                      </Link>

                      {comm.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(comm.id, "approved")}
                          disabled={processingId === comm.id}
                          className="inline-flex items-center gap-1 rounded-full bg-[#29382F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#D78359] transition shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 size={12} />
                          <span>Approve</span>
                        </button>
                      )}

                      {comm.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(comm.id, "rejected")}
                          disabled={processingId === comm.id}
                          className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                        >
                          <XCircle size={12} />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(comm)}
                        title="Delete Comment"
                        className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="mt-3.5">
                    <p className="text-xs sm:text-sm text-[#38493F] leading-relaxed whitespace-pre-line">
                      {commentText}
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
              Are you sure you want to permanently remove the comment from{" "}
              <strong className="text-[#29382F]">{deleteTarget.authorName}</strong> on article{" "}
              <em>&ldquo;{deleteTarget.blogSlug}&rdquo;</em>? This cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-[#506B59] hover:bg-black/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirmed}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-700 transition shadow-xs cursor-pointer"
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
