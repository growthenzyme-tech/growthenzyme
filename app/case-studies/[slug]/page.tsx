import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  Layers,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  CaseStudy,
  getAllCaseStudies,
  getCaseStudyBySlug,
  INITIAL_CASE_STUDIES,
} from "@/app/lib/case-studies";
import Footer from "@/app/components/sections/Footer";

export async function generateStaticParams() {
  return INITIAL_CASE_STUDIES.map((cs) => ({
    slug: cs.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Case Study Not Found | Growth Enzyme",
    };
  }

  return {
    title: `${study.title} | Growth Enzyme Editorial Case Study`,
    description: study.shortDescription,
    openGraph: {
      title: `${study.client} Case Study | Growth Enzyme`,
      description: study.shortDescription,
      images: [study.coverImage],
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const allStudies = await getAllCaseStudies();
  const publishedStudies = allStudies.filter(
    (cs) => cs.status === "published"
  );
  const currentIndex = publishedStudies.findIndex(
    (cs) => cs.slug === study.slug
  );
  const nextStudy =
    publishedStudies[(currentIndex + 1) % publishedStudies.length];

  const galleryImages =
    study.gallery && study.gallery.length > 0
      ? study.gallery
      : [study.coverImage];

  const secondaryImage = galleryImages[1] || study.coverImage;
  const tertiaryImage = galleryImages[2] || galleryImages[0] || study.coverImage;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#29382F] antialiased selection:bg-[#B6CBA9]/30">
      {/* ─── TOP EDITORIAL HEADER & BREADCRUMB ─── */}
      <nav className="border-b border-[#29382F]/10 bg-[#FFFDF8]/80 pt-28 pb-4 backdrop-blur-md sm:pt-32">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 text-xs font-semibold sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-[#506B59]">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 transition hover:text-[#29382F]"
            >
              <ArrowLeft size={14} />
              Portfolio Index
            </Link>
            <ChevronRight size={14} className="text-[#29382F]/30" />
            <span className="text-[#29382F]/60">{study.industry}</span>
            <ChevronRight size={14} className="text-[#29382F]/30" />
            <span className="truncate font-bold text-[#29382F]">
              {study.client}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#506B59]">
            <span>Verified Impact</span>
            <span className="h-1 w-1 rounded-full bg-[#D78359]" />
            <span>Growth Enzyme Studio</span>
          </div>
        </div>
      </nav>

      {/* ─── HERO: MAGAZINE COVER SPLIT-SCREEN ─── */}
      <header className="relative border-b border-[#29382F]/10 bg-gradient-to-b from-[#F3F7F1] via-[#F8FAF7] to-[#FFFDF8] py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Big Editorial Typography & Metadata */}
            <div className="space-y-8 lg:col-span-7">
              {/* Monogram / Client Index Stamp */}
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#29382F]/20 bg-[#29382F] text-base font-black text-[#B6CBA9]">
                  {study.client.charAt(0)}
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#29382F]">
                    {study.client}
                  </p>
                  <p className="text-xs font-semibold text-[#D78359]">
                    Client Case Study · {study.industry}
                  </p>
                </div>
              </div>

              {/* Massive Serif Title */}
              <h1
                className="font-heading text-3xl font-bold tracking-tight text-[#29382F] sm:text-5xl lg:text-6xl leading-[1.04]"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                {study.title}
              </h1>

              {/* Standfirst / Short Description */}
              <p className="font-instrument text-base leading-relaxed text-[#506B59] sm:text-xl font-normal max-w-2xl">
                {study.shortDescription}
              </p>

              {/* Editorial Metadata Table */}
              <div className="grid grid-cols-2 gap-6 border-t border-b border-[#29382F]/15 py-6 text-xs sm:grid-cols-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#506B59]">
                    Client
                  </p>
                  <p className="mt-1 font-bold text-[#29382F] text-sm">
                    {study.client}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#506B59]">
                    Sector
                  </p>
                  <p className="mt-1 font-bold text-[#29382F] text-sm">
                    {study.industry}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#506B59]">
                    Execution
                  </p>
                  <p className="mt-1 font-bold text-[#29382F] text-sm">
                    Growth Enzyme
                  </p>
                </div>
              </div>

              {/* Key Metrics Ribbon */}
              {study.metrics && study.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {study.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#29382F]/10 bg-white/90 p-4 shadow-2xs backdrop-blur-xs"
                    >
                      <p className="font-heading text-2xl font-black text-[#29382F] sm:text-3xl">
                        {m.value}
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#506B59]">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: High-Impact 4K Magazine Cover Image */}
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-3xl border border-[#29382F]/15 bg-[#E8EDE3] shadow-[0_25px_60px_rgba(41,56,47,0.18)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={study.coverImage}
                    alt={study.coverImageAlt || study.title}
                    fill
                    unoptimized
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Magazine Caption Bar */}
                <div className="absolute bottom-0 inset-x-0 p-6 text-white backdrop-blur-xs bg-black/25 flex items-center justify-between border-t border-white/20">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#B6CBA9]">
                      Featured Archive
                    </span>
                    <p className="text-xs font-bold text-white mt-0.5">
                      {study.client} · 4K Master Showcase
                    </p>
                  </div>
                  <span className="rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white backdrop-blur-md">
                    4K UHD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── SECTION 1: THE BRIEF & OVERVIEW (SPLIT-SCREEN) ─── */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Editorial Overview Narrative */}
          <div className="space-y-6 lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D78359]">
              <span>Chapter 01</span>
              <span className="h-px w-8 bg-[#D78359]" />
              <span>The Background</span>
            </div>

            <h2
              className="font-heading text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Project Overview & Context
            </h2>

            <div className="prose prose-lg text-[#506B59] font-instrument">
              <p className="text-base sm:text-lg leading-relaxed">
                {study.projectOverview || study.shortDescription}
              </p>
            </div>

            {/* Scope / Services Badges */}
            <div className="pt-4 border-t border-[#29382F]/10">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#29382F] mb-3">
                Services Provided in this Engagement
              </p>
              <div className="flex flex-wrap gap-2">
                {study.servicesProvided.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-[#29382F]/15 bg-white px-3.5 py-1 text-xs font-semibold text-[#29382F] shadow-2xs"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Framed Editorial 4K Detail Photograph */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#29382F]/15 bg-[#E8EDE3] shadow-lg">
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <Image
                  src={secondaryImage}
                  alt={`${study.client} context showcase`}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              <div className="p-4 bg-white/90 border-t border-[#29382F]/10 flex items-center justify-between text-xs text-[#506B59]">
                <span className="font-semibold">{study.client} Project Asset</span>
                <span className="text-[10px] uppercase tracking-wider">Editorial Capture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: THE CHALLENGE (FULL-WIDTH EDITORIAL PULL-QUOTE) ─── */}
      <section className="relative overflow-hidden bg-[#29382F] py-20 text-[#FFFDF8] sm:py-28">
        {/* Subtle decorative background watermarks */}
        <div className="pointer-events-none absolute left-8 top-8 opacity-10">
          <Quote size={180} />
        </div>
        <div className="pointer-events-none absolute right-[-50px] bottom-[-50px] h-96 w-96 rounded-full bg-[#B6CBA9]/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#B6CBA9]">
            <Sparkles size={14} className="text-[#D78359]" />
            Chapter 02 · The Challenge
          </div>

          <h2 className="sr-only">The Challenge</h2>

          <blockquote className="mt-8 font-heading text-2xl font-bold leading-snug tracking-tight text-[#FFFDF8] sm:text-4xl lg:text-5xl">
            "{study.theChallenge}"
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#B6CBA9]/40" />
            <p className="font-instrument text-xs uppercase tracking-[0.22em] text-[#B6CBA9]">
              The Problem We Solved
            </p>
            <span className="h-px w-12 bg-[#B6CBA9]/40" />
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: THE STRATEGIC SOLUTION (INVERTED SPLIT-SCREEN) ─── */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Visual Print Showcase */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#29382F]/15 bg-[#E8EDE3] shadow-lg">
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <Image
                  src={tertiaryImage}
                  alt={`${study.client} execution visual`}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              <div className="p-4 bg-white/90 border-t border-[#29382F]/10 flex items-center justify-between text-xs text-[#506B59]">
                <span className="font-semibold">Strategic Intervention</span>
                <span className="text-[10px] uppercase tracking-wider">Growth Engine Setup</span>
              </div>
            </div>
          </div>

          {/* Right Column: The Ask & What We Delivered */}
          <div className="order-1 space-y-8 lg:order-2 lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D78359]">
              <span>Chapter 03</span>
              <span className="h-px w-8 bg-[#D78359]" />
              <span>The Solutions</span>
            </div>

            <h2
              className="font-heading text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              The Ask & Strategic Execution
            </h2>

            {/* The Ask Card */}
            <div className="rounded-3xl border border-[#29382F]/15 bg-white p-7 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D78359]">
                <Target size={16} />
                The Mandate
              </div>
              <p className="mt-3 font-heading text-lg font-bold text-[#29382F] sm:text-xl leading-snug">
                "{study.theAsk}"
              </p>
            </div>

            {/* What We Did Card */}
            <div className="rounded-3xl border border-[#29382F]/15 bg-white p-7 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#506B59]">
                <Layers size={16} />
                What Growth Enzyme Delivered
              </div>
              <p className="mt-3 font-instrument text-base leading-relaxed text-[#29382F] sm:text-lg">
                {study.whatWeDid}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: STRATEGIC APPROACH (MAGAZINE CHAPTERS) ─── */}
      <section className="border-t border-b border-[#29382F]/10 bg-[#F6FAF3] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D78359]">
              <span>Chapter 04</span>
              <span className="h-px w-8 bg-[#D78359]" />
              <span>Methodology</span>
            </div>

            <h2
              className="font-heading text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Our Strategic Approach
            </h2>

            <p className="font-instrument text-base text-[#506B59] sm:text-lg">
              A structured roadmap executed step-by-step to transition brand awareness into dependable commercial pipeline.
            </p>
          </div>

          {/* Numbered Strategic Chapters */}
          <div className="mt-12 divide-y divide-[#29382F]/15 border-t border-b border-[#29382F]/15">
            {study.ourApproach.map((step, index) => (
              <div
                key={index}
                className="group grid grid-cols-1 items-baseline gap-4 py-8 sm:grid-cols-12 sm:gap-8 transition-colors hover:bg-white/60 px-4 rounded-xl"
              >
                <div className="font-heading text-xl font-black text-[#506B59] sm:col-span-2 sm:text-2xl group-hover:text-[#29382F]">
                  /{String(index + 1).padStart(2, "0")}
                </div>

                <div className="font-heading text-lg font-bold text-[#29382F] sm:col-span-4 sm:text-xl">
                  {step.split("–")[0] || step.split("&")[0] || `Phase ${index + 1}`}
                </div>

                <div className="font-instrument text-base leading-relaxed text-[#506B59] sm:col-span-6">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: VERIFIED RESULTS & EXECUTIVE IMPACT ─── */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D78359]">
              <span>Chapter 05</span>
              <span className="h-px w-8 bg-[#D78359]" />
              <span>Impact</span>
            </div>

            <h2
              className="font-heading text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              The Measurable Outcome
            </h2>
          </div>

          {/* Big Editorial Stat Numbers */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {study.metrics.map((m, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[#29382F]/15 bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <p className="font-heading text-4xl font-black text-[#29382F] sm:text-5xl lg:text-6xl">
                  {m.value}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#506B59]">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Executive Verified Results Highlight */}
          <div className="rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-[#F3F9F1] to-white p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <CheckCircle2 size={18} />
              Verified Results Summary
            </div>
            <p className="mt-4 font-heading text-xl font-bold leading-relaxed text-emerald-950 sm:text-2xl lg:text-3xl">
              {study.theResults}
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: PROJECT GALLERY IN 4K ─── */}
      {galleryImages.length > 0 && (
        <section className="border-t border-[#29382F]/10 bg-[#F9FAF8] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D78359]">
                  Visual Proof
                </p>
                <h3
                  className="font-heading mt-2 text-3xl font-bold text-[#29382F] sm:text-4xl"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Project Visual Archive in 4K
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#506B59]">
                Shot & Mastered in Ultra-High Definition
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {galleryImages.map((imgUrl, i) => (
                <div
                  key={i}
                  className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-[#29382F]/15 bg-[#E8EDE3] shadow-md transition-all duration-500 hover:shadow-2xl"
                >
                  <Image
                    src={imgUrl}
                    alt={`${study.client} archive asset ${i + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {study.client} · 4K Visual {i + 1}
                    </span>
                    <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md">
                      4K UHD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SECTION 7: NEXT STORY BANNER (MAGAZINE STYLE) ─── */}
      {nextStudy && (
        <section className="border-t border-[#29382F]/10 bg-white">
          <Link
            href={`/case-studies/${nextStudy.slug}`}
            className="group block py-16 sm:py-24 transition-colors hover:bg-[#F2F7F0]/60"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D78359]">
                    Next Client Story
                  </p>
                  <h4
                    className="font-heading mt-2 text-2xl font-bold text-[#29382F] sm:text-4xl lg:text-5xl transition-colors group-hover:text-[#1E2B23]"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    {nextStudy.title}
                  </h4>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#506B59]">
                    Client: {nextStudy.client} · {nextStudy.industry}
                  </p>
                </div>

                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#29382F]/20 bg-white text-[#29382F] shadow-sm transition-all duration-300 group-hover:translate-x-2 group-hover:bg-[#29382F] group-hover:text-white">
                  <ArrowRight size={22} />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ─── BOTTOM CTA SECTION ─── */}
      <section className="border-t border-[#29382F]/10 bg-[#29382F] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B6CBA9]">
            <Sparkles size={14} className="text-[#D78359]" />
            Growth Strategy Inquiries
          </div>

          <h2
            className="font-heading mt-6 text-3xl font-bold tracking-tight text-[#FFFDF8] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Ready to Build Your Brand’s Next Growth Story?
          </h2>

          <p className="font-instrument mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#B6CBA9] sm:text-lg">
            Whether scaling direct consumer sales, dominating local search, or
            preserving a generational legacy — let’s engineer your tailored
            growth engine.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D78359] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#c3734a] hover:shadow-lg"
            >
              Start Your Project
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              View All Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
