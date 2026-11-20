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
  <div className="w-full max-w-none space-y-8">
      {/* HEADER */}
     
{/* HERO SECTION */}
<section className="relative isolate overflow-hidden rounded-2xl bg-[#B6CBA9] px-6 py-8 text-[#29382F] sm:px-9 sm:py-10">
  <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFFDF8]/30 blur-3xl" />

  <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
    <div>
      <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#29382F]">
        <span className="h-2 w-2 rounded-full bg-[#D78359]" />
        Reader Engagement
      </div>

      <h1 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-5xl lg:text-6xl">Comments <span className="text-[#6F9259]">Management</span></h1>

      <p className="mt-3 max-w-xl text-sm leading-7 text-[#29382F]/80">
        Manage your reader community with ease. Review feedback, approve
        meaningful conversations, and keep your articles engaging.
      </p>
    </div>

    <div className="relative shrink-0">
      <button
        type="button"
        onClick={loadAllComments}
        disabled={loading}
        className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RotateCw size={17} className={loading ? "animate-spin" : ""} />
        Refresh Comments
      </button>
    </div>
  </div>

  <div className="relative mt-7 flex flex-wrap items-center gap-2 border-t border-[#29382F]/15 pt-5">
    <span className="rounded-full bg-[#29382F] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FFFDF8]">
      Content Studio
    </span>
    <span className="text-xs font-medium text-[#29382F]/70">
      Manage your reader feedback and conversations
    </span>
  </div>
</section>


      {/* FEEDBACK BANNERS */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="ml-auto rounded-lg p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#B6CBA9] bg-[#E8EDE3] p-4 text-sm text-[#29382F]">
          <Check size={18} className="shrink-0 text-[#506B59]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#506B59]">
              Total Comments
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F0E5]">
              <MessageSquare size={19} className="text-[#D78359]" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-[#29382F]">
            {counts.all}
          </p>
          <p className="mt-1 text-xs text-[#506B59]">All reader comments</p>
        </div>

        <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#506B59]">
              Pending
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F0E5]">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-amber-700">
            {counts.pending}
          </p>
          <p className="mt-1 text-xs text-[#506B59]">Awaiting moderation</p>
        </div>

        <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#506B59]">
              Approved
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EDE3]">
              <CheckCircle2 size={19} className="text-[#506B59]" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-[#29382F]">
            {counts.approved}
          </p>
          <p className="mt-1 text-xs text-[#506B59]">Published reader comments</p>
        </div>

        <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#506B59]">
              Articles
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F0E5]">
              <FileText size={19} className="text-[#D78359]" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-[#29382F]">
            {uniqueArticles}
          </p>
          <p className="mt-1 text-xs text-[#506B59]">Articles with comments</p>
        </div>
      </div>

      {/* FILTERS AND SEARCH */}
      <div className="flex flex-col gap-5 rounded-2xl border border-[#DDE4D9] bg-[#F5F0E5]/60 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="mb-3 text-sm font-bold text-[#29382F]">
            Filter Comments
          </h3>

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
                type="button"
                onClick={() => setFilter(t.value)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                  filter === t.value
                    ? "bg-[#29382F] text-white shadow-sm"
                    : "border border-[#DDE4D9] bg-white text-[#506B59] hover:border-[#A5B59F] hover:bg-[#E8EDE3]"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                    filter === t.value
                      ? "bg-white/15 text-white"
                      : "bg-[#E8EDE3] text-[#506B59]"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:max-w-sm">
          <label className="mb-2 block text-xs font-semibold text-[#506B59]">
            Search comments
          </label>
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82917F]"
            />
            <input
              type="text"
              placeholder="Search by author, email, article..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#DDE4D9] bg-white py-3 pl-11 pr-4 text-sm text-[#29382F] placeholder:text-[#92998F] outline-none transition focus:border-[#506B59] focus:ring-4 focus:ring-[#B6CBA9]/20"
            />
          </div>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#29382F]">
              Reader Comments
            </h2>
            <p className="mt-1 text-xs text-[#506B59]">
              Review and manage comments submitted by readers.
            </p>
          </div>

          <span className="rounded-lg bg-[#E8EDE3] px-3 py-1.5 text-xs font-semibold text-[#29382F]">
            {filteredComments.length} results
          </span>
        </div>

        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-[#DDE4D9] bg-white">
            <Loader2 size={28} className="animate-spin text-[#506B59]" />
            <p className="text-sm font-medium text-[#506B59]">
              Loading comments...
            </p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#B6CBA9] bg-[#FAFBF9] p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8EDE3]">
              <MessageSquare size={30} className="text-[#506B59]" />
            </div>

            <h3 className="font-heading text-xl font-bold text-[#29382F]">
              No comments found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#506B59]">
              {search
                ? "No comments matched your search criteria."
                : `No comments in "${filter}" status.`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
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
                  className="rounded-2xl border border-[#DDE4D9] bg-white p-5 shadow-sm transition hover:border-[#B6CBA9] hover:shadow-md sm:p-7"
                >
                  {/* AUTHOR AND ACTIONS */}
                  <div className="flex flex-col gap-5 border-b border-[#DDE4D9] pb-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#29382F] text-sm font-bold text-white shadow-sm">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-[#29382F] sm:text-base">
                            {comm.authorName}
                          </h4>

                          <span
                            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              comm.status === "approved"
                                ? "border-[#B6CBA9] bg-[#E8EDE3] text-[#405C48]"
                                : comm.status === "rejected"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                          >
                            {comm.status || "approved"}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#506B59]">
                          <span className="inline-flex items-center gap-1.5">
                            <Mail size={13} className="text-[#D78359]" />
                            {comm.authorEmail}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={13} className="text-[#D78359]" />
                            {formatDate(comm.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/blog/${comm.blogSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#DDE4D9] bg-[#FAFBF9] px-3.5 py-2.5 text-xs font-semibold text-[#29382F] transition hover:border-[#29382F] hover:bg-[#29382F] hover:text-white"
                      >
                        <span
                          className="max-w-[150px] truncate"
                          title={comm.blogSlug}
                        >
                          View Article
                        </span>
                        <ExternalLink size={13} />
                      </Link>

                      {comm.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(comm.id, "approved")}
                          disabled={processingId === comm.id}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#29382F] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#506B59] disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                      )}

                      {comm.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(comm.id, "rejected")}
                          disabled={processingId === comm.id}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(comm)}
                        title="Delete Comment"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* COMMENT BODY */}
                  <div className="mt-5 rounded-xl border border-[#DDE4D9] bg-[#FAFBF9] p-5">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#82917F]">
                      <MessageSquare size={13} />
                      Comment
                    </div>

                    <p className="whitespace-pre-line text-sm leading-7 text-[#38493F]">
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17251C]/60 p-4 backdrop-blur-sm">
        <div className="relative flex w-full max-w-md flex-col rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] p-6 shadow-2xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={21} />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D78359]">
                Confirm Action
              </span>
              <h3 className="font-heading text-xl font-bold text-[#29382F]">
                Delete Comment?
              </h3>
            </div>
          </div>

          <p className="text-sm leading-7 text-[#506B59]">
            Are you sure you want to permanently remove the comment from{" "}
            <strong className="text-[#29382F]">
              {deleteTarget.authorName}
            </strong>{" "}
            on article{" "}
            <em className="break-all text-[#29382F]">
              &ldquo;{deleteTarget.blogSlug}&rdquo;
            </em>
            ? This action cannot be undone.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#DDE4D9] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border border-[#DDE4D9] bg-white px-5 py-3 text-xs font-semibold text-[#506B59] transition hover:bg-[#E8EDE3] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={handleDeleteConfirmed}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Confirm Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
