
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Sparkles,
  Building2,
  TrendingUp,
  CheckCircle2,
  Target,
  Layers,
} from "lucide-react";
import { CaseStudy, getPublishedCaseStudies } from "@/app/lib/case-studies";
import Footer from "@/app/components/sections/Footer";

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPublishedCaseStudies();
        setCaseStudies(data);
      } catch (err) {
        console.error("Failed to load case studies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const industries = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          caseStudies
            .map((item) => item.industry)
            .filter((ind): ind is string => Boolean(ind))
        )
      ),
    ];
  }, [caseStudies]);

  const featuredStudy = useMemo(() => {
    return caseStudies.find((item) => item.featured) || caseStudies[0];
  }, [caseStudies]);

  const filteredStudies = useMemo(() => {
    return caseStudies.filter((item) => {
      const matchesIndustry =
        activeIndustry === "All" || item.industry === activeIndustry;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.client.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.industry.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.servicesProvided.some((s) => s.toLowerCase().includes(q));

      return matchesIndustry && matchesSearch;
    });
  }, [caseStudies, activeIndustry, search]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#29382F] antialiased">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF5EB] via-[#F6FAF3] to-[#FFFDF8] pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#B6CBA9]/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#29382F]/15 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#29382F] shadow-sm backdrop-blur-md">
              <Sparkles size={14} className="text-[#D78359]" />
              Client Success Stories
            </div>

            <h1
              className="font-heading text-4xl font-bold tracking-tight text-[#29382F] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Real Growth. Real Stories. Verified Impact.
            </h1>

            <p className="font-instrument mt-5 text-base leading-relaxed text-[#506B59] sm:text-lg">
              Explore how Growth Enzyme helps ambitious founders, legacy
              enterprises, and healthcare institutions turn brand presence into
              sustainable lead pipelines and digital authority.
            </p>
          </div>

          {/* SEARCH & INDUSTRY FILTER BAR */}
          <div className="mt-12 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#29382F]/40"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by client, industry, or service..."
                  className="font-instrument w-full rounded-2xl border border-[#29382F]/15 bg-white py-3 pl-11 pr-4 text-sm text-[#29382F] shadow-sm transition placeholder:text-[#29382F]/40 focus:border-[#29382F] focus:outline-none focus:ring-2 focus:ring-[#B6CBA9]/50"
                />
              </div>

              {/* Total count badge */}
              <p className="text-xs font-semibold uppercase tracking-wider text-[#506B59]">
                Showing {filteredStudies.length} of {caseStudies.length} Client
                Stories
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {industries.map((industry) => {
                const active = activeIndustry === industry;
                return (
                  <button
                    key={industry}
                    onClick={() => setActiveIndustry(industry)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${active
                      ? "bg-[#29382F] text-white shadow-md shadow-[#29382F]/15"
                      : "border border-[#29382F]/15 bg-white text-[#29382F]/80 hover:bg-[#EEF5EB] hover:text-[#29382F]"
                      }`}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SPOTLIGHT CASE STUDY */}
      {featuredStudy && activeIndustry === "All" && !search && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pb-16">
          <div className="relative overflow-hidden rounded-3xl border border-[#D5E1CC] bg-gradient-to-br from-[#EEF5EB] via-white to-[#F5F0E5] p-6 shadow-sm transition-all duration-300 hover:shadow-xl sm:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
              <div className="space-y-6 lg:w-1/2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D78359] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    <Sparkles size={12} />
                    Featured Project
                  </span>
                  <span className="rounded-full border border-[#29382F]/15 bg-white px-3 py-1 text-xs font-bold text-[#29382F]">
                    {featuredStudy.industry}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#506B59]">
                    Client: {featuredStudy.client}
                  </p>
                  <h2
                    className="font-heading mt-2 text-2xl font-bold leading-tight text-[#29382F] sm:text-3xl lg:text-4xl"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    {featuredStudy.title}
                  </h2>
                </div>

                <p className="font-instrument text-sm leading-relaxed text-[#506B59] sm:text-base">
                  {featuredStudy.shortDescription}
                </p>

                {/* Key Metrics */}
                {featuredStudy.metrics && (
                  <div className="grid grid-cols-3 gap-3 border-y border-[#29382F]/10 py-4">
                    {featuredStudy.metrics.map((metric, i) => (
                      <div key={i}>
                        <p className="font-heading text-xl font-extrabold text-[#29382F] sm:text-2xl">
                          {metric.value}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-[#506B59]">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={`/case-studies/${featuredStudy.slug}`}
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#29382F] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#3d5446] hover:shadow-lg"
                  >
                    View Full Case Study
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <div className="flex flex-wrap gap-1.5">
                    {featuredStudy.servicesProvided.slice(0, 3).map((service) => (
                      <span
                        key={service}
                        className="rounded-lg bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#29382F] border border-[#29382F]/10"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-[#29382F]/10 bg-[#E8EDE3] shadow-md lg:mt-0 lg:w-1/2">
                <Image
                  src={featuredStudy.coverImage}
                  alt={featuredStudy.coverImageAlt || featuredStudy.title}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CASE STUDIES GRID */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pb-24">
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#29382F]/20 border-t-[#29382F]" />
            <p className="mt-4 text-sm font-semibold text-[#506B59]">
              Loading client success stories...
            </p>
          </div>
        ) : filteredStudies.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#29382F]/20 bg-white p-12 text-center">
            <Building2
              size={36}
              className="mx-auto text-[#29382F]/40"
            />
            <h3 className="mt-3 text-lg font-bold text-[#29382F]">
              No case studies found
            </h3>
            <p className="mt-1 text-sm text-[#506B59]">
              Try adjusting your search query or selecting a different industry.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveIndustry("All");
              }}
              className="mt-4 rounded-xl bg-[#29382F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#3d5446]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudies.map((study) => (
              <article
                key={study.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[#29382F]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#B6CBA9]"
              >
                {/* Cover Image */}
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8EDE3]"
                >
                  <Image
                    src={study.coverImage}
                    alt={study.coverImageAlt || study.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#29382F] shadow-sm backdrop-blur-md">
                      {study.industry}
                    </span>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#506B59]">
                      {study.client}
                    </span>
                    {study.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#D78359]">
                        <Sparkles size={11} /> Featured
                      </span>
                    )}
                  </div>

                  <Link href={`/case-studies/${study.slug}`}>
                    <h3
                      className="font-heading text-xl font-bold leading-snug text-[#29382F] line-clamp-3 min-h-[4.2rem] sm:min-h-[4.5rem] transition-colors duration-200"
                      style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                    >
                      {study.title}
                    </h3>
                  </Link>

                  <p className="font-instrument mt-3 line-clamp-3 text-xs leading-relaxed text-[#506B59] min-h-[3.6rem]">
                    {study.shortDescription}
                  </p>

                  {/* 3 Pillars Summary: The Ask, What We Did, The Results */}
                  <div className="mt-5 space-y-2 rounded-2xl bg-[#EEF5EB]/60 p-3.5 text-[11px]">
                    <div className="flex items-start gap-2">
                      <Target size={13} className="shrink-0 text-[#D78359] mt-0.5" />
                      <p className="line-clamp-1 text-[#29382F]">
                        <strong className="font-semibold text-[#29382F]">The Ask:</strong>{" "}
                        {study.theAsk}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Layers size={13} className="shrink-0 text-[#506B59] mt-0.5" />
                      <p className="line-clamp-1 text-[#29382F]">
                        <strong className="font-semibold text-[#29382F]">What We Did:</strong>{" "}
                        {study.whatWeDid}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="shrink-0 text-emerald-700 mt-0.5" />
                      <p className="line-clamp-1 text-emerald-900 font-medium">
                        <strong className="font-semibold text-emerald-950">Results:</strong>{" "}
                        {study.theResults}
                      </p>
                    </div>
                  </div>

                  {/* Services Provided Badges */}
                  <div className="mt-5 flex flex-wrap gap-1.5 min-h-[3.25rem] content-start">
                    {study.servicesProvided.slice(0, 3).map((svc) => (
                      <span
                        key={svc}
                        className="rounded-lg bg-[#F5F0E5] px-2 py-0.5 text-[10px] font-semibold text-[#29382F]/80"
                      >
                        {svc}
                      </span>
                    ))}
                    {study.servicesProvided.length > 3 && (
                      <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                        +{study.servicesProvided.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer Link */}
                  <div className="mt-auto pt-5 border-t border-[#29382F]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#29382F] transition-colors">
                      Read Full Story
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF5EB] text-[#29382F] transition-all group-hover:bg-[#29382F] group-hover:text-white">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="relative w-full bg-transparent py-16 sm:py-20 lg:py-24 text-[#29382F]">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/15 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#29382F] shadow-sm backdrop-blur-sm">
            <TrendingUp size={14} className="text-[#D78359]" />
            Next Success Story
          </div>
          <h2
            className="font-heading mt-5 text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Ready to scale your business with measurable results?
          </h2>
          <p className="font-instrument mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#506B59] sm:text-base lg:text-lg">
            Whether you need to dominate local search, launch high-ROI performance ads, or build custom business management systems, we are ready to partner with you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-3 rounded-xl bg-[#29382F] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-[#29382F]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1A4538] hover:shadow-lg hover:shadow-[#29382F]/30"
            >
              Start a Project
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 rounded-xl border border-[#29382F]/20 bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#29382F] shadow-sm transition-all duration-300 hover:bg-[#29382F] hover:text-white hover:-translate-y-0.5"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
