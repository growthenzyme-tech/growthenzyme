
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Building2,
  FolderKanban,
  Target,
  Layers,
  CheckCircle2,
} from "lucide-react";

import { createCaseStudy } from "@/app/lib/case-studies";

export default function CreateCaseStudyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    title: "",
    slug: "",
    industry: "Home Decor",
    coverImage: "/services/img2.webp",
    shortDescription: "",
    projectOverview: "",
    theChallenge: "",
    ourApproach: "",
    theAsk: "",
    whatWeDid: "",
    theResults: "",
    servicesProvided: "Social Media Strategy, Lead Generation, Brand Visibility",
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

  function handleClientChange(val: string) {
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      client: val,
      slug: prev.slug ? prev.slug : generatedSlug,
    }));
  }

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
        slug:
          formData.slug.trim() ||
          formData.client.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
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
        order: 99,
      };

      await createCaseStudy(payload);
      router.push("/admin/case-studies");
    } catch (err: any) {
      console.error("Save error:", err);
      alert("Failed to create case study. Please check console or try again.");
    } finally {
      setSaving(false);
    }
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
        <span className="rounded-full bg-[#B6CBA9]/30 px-3 py-1 text-xs font-bold text-[#29382F]">
          New Project
        </span>
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#D78359]">
          <FolderKanban size={16} />
          Module 2 · Case Study Management
        </div>
        <h1
          className="mt-2 text-2xl font-bold text-[#29382F] sm:text-3xl"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          Create New Client Case Study
        </h1>
        <p className="mt-1 text-xs text-[#506B59]">
          Fill in the client challenges, solutions, services, and verified outcomes.
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
                onChange={(e) => handleClientChange(e.target.value)}
                placeholder="e.g. Dream Decor"
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
                placeholder="e.g. Home Decor, Healthcare, Automotive"
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
              placeholder="e.g. Dream Decor – Transforming Social Presence Into High-Intent Lead Pipeline"
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
                placeholder="e.g. dream-decor"
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
                placeholder="e.g. /services/img2.webp"
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
              placeholder="Brief 1-2 sentence overview for listing cards..."
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
              placeholder="Background of the client, where they were, and their market context..."
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
              placeholder="What problems or roadblocks did the client face?"
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
              placeholder={`Strategic social media content\nAudience-focused lead generation\nConsistent brand visibility\nOrganic growth & engagement`}
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
              placeholder="e.g. Social Media Strategy, Lead Generation, Brand Visibility"
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
              placeholder="e.g. Get noticed. Attract the right audience. Generate quality leads."
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
              placeholder="e.g. Built a focused social strategy that turned content into visibility, engagement and genuine enquiries."
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
              placeholder="e.g. Stronger social presence, better audience reach and a steady flow of quality enquiries."
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
                  placeholder="Metric 1 Value (e.g. 36+)"
                  value={formData.metric1Value}
                  onChange={(e) =>
                    setFormData({ ...formData, metric1Value: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Metric 1 Label (e.g. Direct Inquiries)"
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
                  placeholder="Metric 2 Value (e.g. 47K+)"
                  value={formData.metric2Value}
                  onChange={(e) =>
                    setFormData({ ...formData, metric2Value: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Metric 2 Label (e.g. Views)"
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
                  placeholder="Metric 3 Value (e.g. Steady Flow)"
                  value={formData.metric3Value}
                  onChange={(e) =>
                    setFormData({ ...formData, metric3Value: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#DDE4D9] p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Metric 3 Label (e.g. Quality Leads)"
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
              {saving ? "Creating Case Study..." : "Create Case Study"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
