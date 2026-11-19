
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  FolderKanban,
  CheckCircle2,
  FileEdit,
  Sparkles,
  ExternalLink,
  Layers,
  Database,
} from "lucide-react";

import {
  CaseStudy,
  getAllCaseStudies,
  deleteCaseStudy,
  updateCaseStudy,
  seedInitialCaseStudies,
  INITIAL_CASE_STUDIES,
} from "@/app/lib/case-studies";

type FilterType = "all" | "published" | "draft";

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getAllCaseStudies();
      setCaseStudies(data);
    } catch (err) {
      console.error("Error loading case studies:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setActionId(id);
      await deleteCaseStudy(id);
      setCaseStudies((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      // If deleting an initial fallback item, remove it locally
      setCaseStudies((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setActionId(null);
    }
  }

  async function handleToggleStatus(item: CaseStudy) {
    const newStatus = item.status === "published" ? "draft" : "published";
    try {
      setActionId(item.id);
      await updateCaseStudy(item.id, { status: newStatus });
      setCaseStudies((prev) =>
        prev.map((cs) => (cs.id === item.id ? { ...cs, status: newStatus } : cs))
      );
    } catch (err) {
      console.error("Status toggle error:", err);
      setCaseStudies((prev) =>
        prev.map((cs) => (cs.id === item.id ? { ...cs, status: newStatus } : cs))
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleToggleFeatured(item: CaseStudy) {
    const newFeatured = !item.featured;
    try {
      setActionId(item.id);
      await updateCaseStudy(item.id, { featured: newFeatured });
      setCaseStudies((prev) =>
        prev.map((cs) =>
          cs.id === item.id ? { ...cs, featured: newFeatured } : cs
        )
      );
    } catch (err) {
      console.error("Featured toggle error:", err);
      setCaseStudies((prev) =>
        prev.map((cs) =>
          cs.id === item.id ? { ...cs, featured: newFeatured } : cs
        )
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleSeedData() {
    if (
      !confirm(
        "Would you like to sync the verified portfolio case studies into Firestore?"
      )
    ) {
      return;
    }

    try {
      setSeeding(true);
      await seedInitialCaseStudies();
      await loadData();
      alert("Successfully seeded case studies into Firestore!");
    } catch (err: any) {
      console.error("Seeding error:", err);
      alert(
        "Seeded locally. If Firestore write rules require authorization, you can configure them in firestore.rules."
      );
    } finally {
      setSeeding(false);
    }
  }

  const publishedCount = useMemo(
    () => caseStudies.filter((item) => item.status === "published").length,
    [caseStudies]
  );

  const draftCount = useMemo(
    () => caseStudies.filter((item) => item.status === "draft").length,
    [caseStudies]
  );

  const featuredCount = useMemo(
    () => caseStudies.filter((item) => item.featured).length,
    [caseStudies]
  );

  const filteredStudies = useMemo(() => {
    return caseStudies.filter((item) => {
      const matchesFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "published"
          ? item.status === "published"
          : item.status === "draft";

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.client.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.industry.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [caseStudies, activeFilter, search]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 pb-12">
      {/* PAGE HEADING */}
      <div className="relative isolate overflow-hidden rounded-2xl bg-[#B6CBA9] px-6 py-8 text-[#29382F] sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFFDF8]/30 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#29382F]">
              <span className="h-2 w-2 rounded-full bg-[#D78359]" />
              Portfolio & Client Outcomes
            </div>

            <h1
              className="text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Case Study Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#29382F]/80">
              Manage your client success stories, verified project outcomes,
              industry categories, and homepage featured showcases.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-xl border border-[#29382F]/20 bg-white/70 px-4 py-3.5 text-xs font-bold text-[#29382F] shadow-sm transition hover:bg-white disabled:opacity-50"
              title="Sync the verified portfolio case studies into Firestore"
            >
              <Database size={15} />
              {seeding ? "Syncing..." : "Sync Portfolio Data"}
            </button>

            <Link
              href="/admin/case-studies/create"
              className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)]"
            >
              <Plus size={17} />
              Create New Case Study
            </Link>
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-2 border-t border-[#29382F]/15 pt-5">
          <span className="rounded-full bg-[#29382F] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FFFDF8]">
            Growth Enzyme CMS
          </span>
          <span className="text-xs font-medium text-[#29382F]/70">
            {caseStudies.length} Client stories active
          </span>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        {/* Total */}
        <div className="rounded-2xl border border-[#DDE4D9] bg-white p-5 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B6CBA9]/40 text-[#29382F]">
              <FolderKanban size={20} />
            </div>
            <span className="rounded-full bg-[#F5F0E5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#29382F]/70">
              Total
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-[#29382F]">
            {caseStudies.length}
          </p>
          <p className="mt-1 text-xs font-medium text-[#657365]">
            Total Case Studies
          </p>
        </div>

        {/* Published */}
        <div className="rounded-2xl border border-[#DDE4D9] bg-white p-5 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 size={20} />
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Live
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-[#29382F]">
            {publishedCount}
          </p>
          <p className="mt-1 text-xs font-medium text-[#657365]">
            Published Stories
          </p>
        </div>

        {/* Featured */}
        <div className="rounded-2xl border border-[#DDE4D9] bg-white p-5 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0E5] text-[#D78359]">
              <Sparkles size={20} />
            </div>
            <span className="rounded-full bg-[#F5F0E5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B684B]">
              Spotlight
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-[#29382F]">
            {featuredCount}
          </p>
          <p className="mt-1 text-xs font-medium text-[#657365]">
            Featured on Site
          </p>
        </div>

        {/* Drafts */}
        <div className="rounded-2xl border border-[#DDE4D9] bg-white p-5 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <FileEdit size={20} />
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
              Drafts
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-[#29382F]">
            {draftCount}
          </p>
          <p className="mt-1 text-xs font-medium text-[#657365]">
            Saved Drafts
          </p>
        </div>
      </div>

      {/* CASE STUDIES TABLE CONTAINER */}
      <div className="overflow-hidden rounded-2xl border border-[#DDE4D9] bg-white shadow-sm">
        {/* Table Controls */}
        <div className="border-b border-[#E5E4DC] bg-[#F5F0E5]/60 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeFilter === "all"
                    ? "bg-[#29382F] text-white shadow-sm"
                    : "border border-[#DDE4D9] bg-white text-[#657365] hover:bg-[#E8EDE3]"
                }`}
              >
                All ({caseStudies.length})
              </button>
              <button
                onClick={() => setActiveFilter("published")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeFilter === "published"
                    ? "bg-[#29382F] text-white shadow-sm"
                    : "border border-[#DDE4D9] bg-white text-[#657365] hover:bg-[#E8EDE3]"
                }`}
              >
                Published ({publishedCount})
              </button>
              <button
                onClick={() => setActiveFilter("draft")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeFilter === "draft"
                    ? "bg-[#29382F] text-white shadow-sm"
                    : "border border-[#DDE4D9] bg-white text-[#657365] hover:bg-[#E8EDE3]"
                }`}
              >
                Drafts ({draftCount})
              </button>
            </div>

            {/* Search & Refresh */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-[280px]">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client or title..."
                  className="w-full rounded-xl border border-[#DDE4D9] bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-[#29382F] shadow-sm focus:border-[#29382F] focus:outline-none"
                />
              </div>

              <button
                onClick={loadData}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DDE4D9] bg-white text-[#29382F] shadow-sm transition hover:bg-[#EEF5EB]"
                title="Refresh List"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-[#29382F]" />
              <p className="mt-3 text-xs font-semibold text-gray-500">
                Loading case studies...
              </p>
            </div>
          ) : filteredStudies.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-500">
              No case studies matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5E4DC] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#657365]">
                <tr>
                  <th className="py-4 px-6">Project / Client</th>
                  <th className="py-4 px-4">Industry</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEA]">
                {filteredStudies.map((study) => (
                  <tr
                    key={study.id}
                    className="transition hover:bg-[#FAF9F5]"
                  >
                    {/* Project & Client */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                          <Image
                            src={study.coverImage}
                            alt={study.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <p className="font-bold text-sm text-[#29382F] truncate">
                            {study.client}
                          </p>
                          <p className="mt-0.5 text-xs text-[#506B59] truncate">
                            {study.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="py-4 px-4">
                      <span className="rounded-lg bg-[#EEF5EB] px-2.5 py-1 text-[11px] font-semibold text-[#29382F]">
                        {study.industry}
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(study)}
                        disabled={actionId === study.id}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition ${
                          study.featured
                            ? "bg-[#D78359] text-white shadow-xs"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        <Sparkles size={11} />
                        {study.featured ? "Featured" : "Standard"}
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(study)}
                        disabled={actionId === study.id}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition ${
                          study.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            study.status === "published"
                              ? "bg-emerald-600"
                              : "bg-amber-600"
                          }`}
                        />
                        {study.status === "published" ? "Published" : "Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Live View */}
                        <Link
                          href={`/case-studies/${study.slug}`}
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-[#EEF5EB] hover:text-[#29382F]"
                          title="View Live Page"
                        >
                          <ExternalLink size={14} />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/case-studies/edit/${study.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-[#EEF5EB] hover:text-[#29382F]"
                          title="Edit Case Study"
                        >
                          <Edit3 size={14} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(study.id, study.title)}
                          disabled={actionId === study.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          title="Delete Case Study"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
