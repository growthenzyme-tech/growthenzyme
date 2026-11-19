
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FolderKanban,
  ExternalLink,
} from "lucide-react";

import {
  CaseStudy,
  getCaseStudyById,
  updateCaseStudy,
} from "@/app/lib/case-studies";

export default function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    title: "",
    slug: "",
    industry: "",
    coverImage: "",
    shortDescription: "",
    projectOverview: "",
    theChallenge: "",
    ourApproach: "",
    theAsk: "",
    whatWeDid: "",
    theResults: "",
    servicesProvided: "",
    metric1Value: "",
    metric1Label: "",
    metric2Value: "",
    metric2Label: "",
    metric3Value: "",
    metric3Label: "",
    gallery: "",
    status: "published" as "published" | "draft",
    featured: false,
  });

  useEffect(() => {
    async function fetchStudy() {
      try {
        setLoading(true);
        const data = await getCaseStudyById(id);
        if (data) {
          setFormData({
            client: data.client || "",
            title: data.title || "",
            slug: data.slug || "",
            industry: data.industry || "",
            coverImage: data.coverImage || "",
            shortDescription: data.shortDescription || "",
            projectOverview: data.projectOverview || "",
            theChallenge: data.theChallenge || "",
            ourApproach: Array.isArray(data.ourApproach)
              ? data.ourApproach.join("\n")
              : "",
            theAsk: data.theAsk || "",
            whatWeDid: data.whatWeDid || "",
            theResults: data.theResults || "",
            servicesProvided: Array.isArray(data.servicesProvided)
              ? data.servicesProvided.join(", ")
              : "",
            metric1Value: data.metrics?.[0]?.value || "",
            metric1Label: data.metrics?.[0]?.label || "",
            metric2Value: data.metrics?.[1]?.value || "",
            metric2Label: data.metrics?.[1]?.label || "",
            metric3Value: data.metrics?.[2]?.value || "",
            metric3Label: data.metrics?.[2]?.label || "",
            gallery: Array.isArray(data.gallery)
              ? data.gallery.join("\n")
              : "",
            status: data.status || "published",
            featured: Boolean(data.featured),
          });
        }
      } catch (err) {
        console.error("Failed to load study for edit:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudy();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.client.trim() || !formData.title.trim()) {
      alert("Please fill in the client name and project title.");
      return;
    }

    try {
      setSaving(true);

      const approachList = formData.ourApproach
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const servicesList = formData.servicesProvided
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const galleryList = formData.gallery
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const metrics = [];
      if (formData.metric1Value) {
        metrics.push({
          value: formData.metric1Value,
          label: formData.metric1Label || "Metric 1",
        });
      }
      if (formData.metric2Value) {
        metrics.push({
          value: formData.metric2Value,
          label: formData.metric2Label || "Metric 2",
        });
      }
      if (formData.metric3Value) {
        metrics.push({
          value: formData.metric3Value,
          label: formData.metric3Label || "Metric 3",
        });
      }

      const payload = {
        client: formData.client.trim(),
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        industry: formData.industry.trim(),
        coverImage: formData.coverImage.trim() || "/services/img1.webp",
        shortDescription: formData.shortDescription.trim(),
        projectOverview: formData.projectOverview.trim(),
        theChallenge: formData.theChallenge.trim(),
        ourApproach: approachList,
        theAsk: formData.theAsk.trim(),
        whatWeDid: formData.whatWeDid.trim(),
        theResults: formData.theResults.trim(),
        servicesProvided: servicesList,
        metrics,
        gallery: galleryList,
        status: formData.status,
        featured: formData.featured,
      };

      await updateCaseStudy(id, payload);
      router.push("/admin/case-studies");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update case study.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#29382F]" />
        <p className="mt-3 text-xs font-semibold text-gray-500">
          Loading case study details...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/case-studies"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#506B59] hover:text-[#29382F]"
        >
          <ArrowLeft size={15} />
          Back to Case Studies
        </Link>
        {formData.slug && (
          <Link
            href={`/case-studies/${formData.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#29382F] hover:underline"
          >
            View Live Page
            <ExternalLink size={13} />
          </Link>
        )}
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#D78359]">
          <FolderKanban size={16} />
          Edit Case Study
        </div>
        <h1
          className="mt-2 text-2xl font-bold text-[#29382F] sm:text-3xl"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          Edit: {formData.client || "Case Study"}
        </h1>
        <p className="mt-1 text-xs text-[#506B59]">
          Update client details, challenge descriptions, strategy, and results.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6 shadow-sm sm:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#29382F]">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#29382F] mb-1.5">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29382F] mb-1.5">
                Industry Category *
              </label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#29382F] mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29382F] mb-1.5">
                Cover Image URL / Path *
              </label>
              <input
                type="text"
                required
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              Short Description (Card Excerpt) *
            </label>
            <textarea
              rows={2}
              required
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              Project Overview (Client Background)
            </label>
            <textarea
              rows={3}
              value={formData.projectOverview}
              onChange={(e) =>
                setFormData({ ...formData, projectOverview: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>
        </div>

        {/* Challenge & Strategy */}
        <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6 shadow-sm sm:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#29382F]">
            2. Challenge & Our Approach
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              The Challenge *
            </label>
            <textarea
              rows={3}
              required
              value={formData.theChallenge}
              onChange={(e) =>
                setFormData({ ...formData, theChallenge: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              Our Approach (One strategy point per line) *
            </label>
            <textarea
              rows={5}
              required
              value={formData.ourApproach}
              onChange={(e) =>
                setFormData({ ...formData, ourApproach: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              Services Provided (Comma-separated) *
            </label>
            <input
              type="text"
              required
              value={formData.servicesProvided}
              onChange={(e) =>
                setFormData({ ...formData, servicesProvided: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>
        </div>

        {/* 3 Pillars Results Breakdown */}
        <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6 shadow-sm sm:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#29382F]">
            3. Results & Execution (3 Pillars)
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              The Ask *
            </label>
            <textarea
              rows={2}
              required
              value={formData.theAsk}
              onChange={(e) =>
                setFormData({ ...formData, theAsk: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              What We Did *
            </label>
            <textarea
              rows={2}
              required
              value={formData.whatWeDid}
              onChange={(e) =>
                setFormData({ ...formData, whatWeDid: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29382F] mb-1.5">
              The Results *
            </label>
            <textarea
              rows={2}
              required
              value={formData.theResults}
              onChange={(e) =>
                setFormData({ ...formData, theResults: e.target.value })
              }
              className="w-full rounded-xl border border-[#DDE4D9] p-3 text-sm focus:border-[#29382F] focus:outline-none"
            />
          </div>

          {/* Key Metrics */}
          <div className="pt-2">
            <p className="text-xs font-bold text-[#29382F] mb-3">
              Key Metrics (Optional highlights)
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Metric 1 Value"
                  value={formData.metric1Value}
                  onChange={(e) =>
                    setFormData({ ...formData, metric1Value: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Metric 1 Label"
                  value={formData.metric1Label}
                  onChange={(e) =>
                    setFormData({ ...formData, metric1Label: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Metric 2 Value"
                  value={formData.metric2Value}
                  onChange={(e) =>
                    setFormData({ ...formData, metric2Value: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Metric 2 Label"
                  value={formData.metric2Label}
                  onChange={(e) =>
                    setFormData({ ...formData, metric2Label: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Metric 3 Value"
                  value={formData.metric3Value}
                  onChange={(e) =>
                    setFormData({ ...formData, metric3Value: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Metric 3 Label"
                  value={formData.metric3Label}
                  onChange={(e) =>
                    setFormData({ ...formData, metric3Label: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Publishing & Settings */}
        <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6 shadow-sm sm:p-8 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#29382F]">
            4. Publishing Options
          </h2>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-[#29382F] focus:ring-[#B6CBA9]"
              />
              <span className="text-xs font-bold text-[#29382F]">
                Feature as Spotlight Story
              </span>
            </label>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#29382F]">Status:</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === "published"}
                  onChange={() => setFormData({ ...formData, status: "published" })}
                />
                Published
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === "draft"}
                  onChange={() => setFormData({ ...formData, status: "draft" })}
                />
                Draft
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDE4D9]">
            <Link
              href="/admin/case-studies"
              className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#29382F] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#3d5446] disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
