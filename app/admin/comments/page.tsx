
"use client";

import { useEffect, useState } from "react";
import {
  getAllComments,
  updateCommentStatus,
  deleteComment,
  type BlogComment,
  type CommentStatus,
} from "@/app/lib/comments";

type FilterStatus = "all" | CommentStatus;

export default function CommentsPage() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadComments() {
    try {
      setError("");
      setLoading(true);
      const data = await getAllComments();
      setComments(data);
    } catch (err) {
      console.error("Error loading comments:", err);
      setError("Unable to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, []);

  async function handleStatusChange(
    id: string,
    status: CommentStatus
  ) {
    try {
      setProcessingId(id);
      await updateCommentStatus(id, status);

      setComments((previous) =>
        previous.map((comment) =>
          comment.id === id ? { ...comment, status } : comment
        )
      );
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Unable to update comment status.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this comment?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      await deleteComment(id);

      setComments((previous) =>
        previous.filter((comment) => comment.id !== id)
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Unable to delete comment.");
    } finally {
      setProcessingId(null);
    }
  }

  const filteredComments =
    filter === "all"
      ? comments
      : comments.filter((comment) => comment.status === filter);

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  };

  function formatDate(timestamp: any) {
    if (!timestamp) return "Date unavailable";

    const date =
      typeof timestamp.toDate === "function"
        ? timestamp.toDate()
        : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const filters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#829080]">
            Content Management
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#252B25]">
            Comment Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review and manage comments submitted by website visitors.
          </p>
        </div>

        <button
          onClick={loadComments}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Refresh Comments
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Comments", value: counts.all },
          { label: "Pending Review", value: counts.pending },
          { label: "Approved", value: counts.approved },
          { label: "Rejected", value: counts.rejected },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#29382F]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap gap-2 border-b border-gray-100 p-4">
          {filters.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-[#405C48] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.label}
              <span className="ml-2 opacity-75">
                {counts[item.value]}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="m-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading comments...
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="font-medium text-gray-800">
              No comments found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              There are no comments in this category yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="space-y-4 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {comment.authorName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {comment.authorEmail}
                    </p>
                  </div>

                  <span
                    className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      comment.status === "approved"
                        ? "bg-green-50 text-green-700"
                        : comment.status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {comment.status}
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {comment.comment}
                </p>

                <div className="flex flex-col justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center">
                  <div className="text-xs text-gray-400">
                    <p>Blog: {comment.blogSlug}</p>
                    <p className="mt-1">
                      Submitted: {formatDate(comment.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {comment.status !== "approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(comment.id, "approved")
                        }
                        disabled={processingId === comment.id}
                        className="rounded-lg bg-[#405C48] px-3 py-2 text-xs font-medium text-white hover:bg-[#29382F] disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}

                    {comment.status !== "rejected" && (
                      <button
                        onClick={() =>
                          handleStatusChange(comment.id, "rejected")
                        }
                        disabled={processingId === comment.id}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={processingId === comment.id}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
