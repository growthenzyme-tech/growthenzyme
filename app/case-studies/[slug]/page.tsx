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
  Compass,
  FileText,
  Layers,
  LayoutGrid,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
  Zap,
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
    title: `${study.title} | Growth Enzyme Bento Case Study`,
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
      {/* ─── BREADCRUMB NAVIGATION ─── */}
      <nav className="border-b border-[#29382F]/10 bg-white/80 pt-28 pb-4 backdrop-blur-md sm:pt-32">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 text-xs font-semibold sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-[#506B59]">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 transition hover:text-[#29382F]"
            >
              <ArrowLeft size={14} />
              All Case Studies
            </Link>
            <ChevronRight size={14} className="text-[#29382F]/30" />
            <span className="text-[#29382F]/60">{study.industry}</span>
            <ChevronRight size={14} className="text-[#29382F]/30" />
            <span className="truncate font-bold text-[#29382F]">
              {study.client}
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#29382F]/15 bg-[#EEF5EB] px-3 py-1 text-[11px] font-bold text-[#29382F]">
            <LayoutGrid size={12} className="text-[#D78359]" />
            Bento Case Study
          </div>
        </div>
      </nav>

      {/* ─── HEADER: TITLE & BADGES ─── */}
      <header className="relative bg-gradient-to-b from-[#F3F7F1] via-[#F8FAF7] to-[#FFFDF8] pt-12 pb-8 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#29382F] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-2xs">
                <Building2 size={13} className="text-[#B6CBA9]" />
                Client: {study.client}
              </span>
              <span className="rounded-full border border-[#29382F]/15 bg-white px-3.5 py-1 text-xs font-bold text-[#506B59]">
                {study.industry}
              </span>
              {study.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D78359] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  <Sparkles size={12} /> Spotlight
                </span>
              )}
            </div>

            <h1
              className="font-heading text-3xl font-extrabold tracking-tight text-[#29382F] sm:text-5xl lg:text-6xl leading-[1.08]"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              {study.title}
            </h1>

            <p className="font-instrument text-base leading-relaxed text-[#506B59] sm:text-lg max-w-3xl">
              {study.shortDescription}
            </p>
          </div>
        </div>
      </header>

      {/* ─── MAIN BENTO GRID SHOWCASE ─── */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 space-y-12">
        {/* ─── BENTO ROW 1: HERO VISUAL + QUICK PROFILE + METRICS ─── */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Tile 1: 4K Master Cover Image (8 Cols) */}
          <div className="group relative min-h-[360px] overflow-hidden rounded-3xl border border-[#29382F]/15 bg-[#E8EDE3] shadow-md transition-all duration-500 hover:shadow-xl sm:min-h-[460px] lg:col-span-8">
            <Image
              src={study.coverImage}
              alt={study.coverImageAlt || study.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Bottom Floating Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B6CBA9]">
                  Primary Project Showcase
                </span>
                <p className="font-heading text-lg font-bold text-white sm:text-xl mt-0.5">
                  {study.client}
                </p>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wider text-white backdrop-blur-md">
                4K UHD
              </span>
            </div>
          </div>

          {/* Tile 2: Project Overview & Profile (4 Cols) */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#29382F]/15 bg-white p-7 shadow-xs lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D78359]">
                <FileText size={15} />
                Project Overview
              </div>
              <h3
                className="font-heading text-xl font-bold leading-snug text-[#29382F] sm:text-2xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                The Engagement
              </h3>
              <p className="font-instrument text-sm leading-relaxed text-[#506B59]">
                {study.projectOverview || study.shortDescription}
              </p>
            </div>

            {/* Services Tags */}
            <div className="border-t border-[#29382F]/10 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#29382F] mb-2.5">
                Capabilities Applied
              </p>
              <div className="flex flex-wrap gap-1.5">
                {study.servicesProvided.map((service) => (
                  <span
                    key={service}
                    className="rounded-lg border border-[#29382F]/10 bg-[#F6FAF3] px-2.5 py-1 text-xs font-semibold text-[#29382F]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Metric Tiles (Spread Across 12 Cols) */}
          {study.metrics && study.metrics.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-12">
              {study.metrics.map((metric, idx) => {
                const isFirst = idx === 0;
                return (
                  <div
                    key={idx}
                    className={`rounded-3xl border p-7 shadow-xs transition-all duration-300 hover:shadow-md ${
                      isFirst
                        ? "border-[#29382F]/15 bg-gradient-to-br from-[#EEF5EB] to-white"
                        : "border-[#29382F]/10 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#506B59]">
                        Impact Metric 0{idx + 1}
                      </span>
                      {isFirst ? (
                        <TrendingUp size={16} className="text-[#D78359]" />
                      ) : (
                        <Sparkles size={16} className="text-[#B6CBA9]" />
                      )}
                    </div>
                    <p className="font-heading mt-4 text-4xl font-black tracking-tight text-[#29382F] sm:text-5xl">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#506B59]">
                      {metric.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── BENTO ROW 2: THE CHALLENGE + STRATEGY TILES ─── */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Tile 1: The Challenge Callout (7 Cols) */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-[#D78359]/30 bg-gradient-to-br from-[#FFF9F3] via-white to-[#FFFDF8] p-8 shadow-xs lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D78359]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D78359]">
                <Quote size={13} />
                The Core Challenge
              </div>
              <h3
                className="font-heading text-2xl font-bold leading-tight text-[#29382F] sm:text-3xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Obstacle & Problem Statement
              </h3>
              <p className="font-instrument text-base font-medium leading-relaxed text-[#5A4526] sm:text-xl">
                "{study.theChallenge}"
              </p>
            </div>

            <div className="border-t border-[#D78359]/20 pt-4 flex items-center justify-between text-xs text-[#5A4526]">
              <span className="font-bold uppercase tracking-wider">Target Obstacle</span>
              <span className="font-semibold">{study.client} · Pre-Growth State</span>
            </div>
          </div>

          {/* Tile 2: The Mandate / The Ask (5 Cols) */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#29382F]/15 bg-white p-8 shadow-xs lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D78359]">
                <Target size={15} />
                The Mandate
              </div>
              <h3
                className="font-heading text-xl font-bold text-[#29382F] sm:text-2xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                The Client's Ask
              </h3>
              <p className="font-heading text-lg font-bold leading-snug text-[#29382F] sm:text-xl">
                "{study.theAsk}"
              </p>
            </div>

            <p className="text-xs text-[#506B59] font-medium leading-relaxed border-t border-[#29382F]/10 pt-4">
              Defined clear objectives to turn digital visibility into verified commercial results.
            </p>
          </div>

          {/* Tile 3: What We Did (What Growth Enzyme Delivered) (7 Cols) */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#29382F]/15 bg-white p-8 shadow-xs lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#506B59]">
                <Layers size={15} />
                Execution Blueprint
              </div>
              <h3
                className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                What We Delivered
              </h3>
              <p className="font-instrument text-base leading-relaxed text-[#29382F] sm:text-lg">
                {study.whatWeDid}
              </p>
            </div>

            <div className="border-t border-[#29382F]/10 pt-4 flex items-center justify-between text-xs text-[#506B59]">
              <span className="font-bold uppercase tracking-wider">Engine Architecture</span>
              <span>100% Tailored Setup</span>
            </div>
          </div>

          {/* Tile 4: Secondary 4K Detail Photograph Tile (5 Cols) */}
          <div className="group relative min-h-[280px] overflow-hidden rounded-3xl border border-[#29382F]/15 bg-[#E8EDE3] shadow-xs lg:col-span-5">
            <Image
              src={secondaryImage}
              alt={`${study.client} strategic detail`}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-bold">{study.client} Execution Asset</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
                Verified
              </span>
            </div>
          </div>
        </section>

        {/* ─── BENTO ROW 3: OUR STRATEGIC APPROACH (MODULAR BENTO TILES) ─── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D78359]">
                <Compass size={14} />
                Implementation Phases
              </div>
              <h2
                className="font-heading mt-2 text-2xl font-bold text-[#29382F] sm:text-3xl lg:text-4xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Our Strategic Approach
              </h2>
            </div>
            <p className="text-xs font-medium text-[#506B59] sm:text-right max-w-sm">
              Each strategic step designed to engineer consistent visibility and inbound demand.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {study.ourApproach.map((step, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-3xl border border-[#29382F]/15 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#B6CBA9]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF5EB] font-heading text-xs font-black text-[#29382F] transition group-hover:bg-[#29382F] group-hover:text-white">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#506B59]">
                      Phase 0{idx + 1}
                    </span>
                  </div>
                  <h4
                    className="font-heading mt-4 text-lg font-bold text-[#29382F]"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                  >
                    {step.split("–")[0] || step.split("&")[0] || `Phase ${idx + 1}`}
                  </h4>
                  <p className="font-instrument mt-2 text-sm leading-relaxed text-[#506B59]">
                    {step}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#29382F]/10 pt-3 flex items-center justify-between text-[11px] font-semibold text-[#506B59]">
                  <span>Execution Milestone</span>
                  <CheckCircle2 size={13} className="text-emerald-700" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── BENTO ROW 4: VERIFIED OUTCOME SHOWCASE ─── */}
        <section className="rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-[#F5FAF2] to-white p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Award size={16} />
            Verified Business Impact
          </div>

          <h3
            className="font-heading text-2xl font-bold text-emerald-950 sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            The Documented Results
          </h3>

          <p className="font-heading text-xl font-bold leading-relaxed text-emerald-950 sm:text-2xl lg:text-3xl max-w-4xl">
            "{study.theResults}"
          </p>

          <div className="border-t border-emerald-200/80 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-emerald-900">
            <span>Client: {study.client}</span>
            <span>Documented Portfolio Growth Story</span>
          </div>
        </section>

        {/* ─── BENTO ROW 5: 4K VISUAL ARCHIVE TILES ─── */}
        {galleryImages.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#D78359]">
                  Asset Showcase
                </p>
                <h3
                  className="font-heading mt-1 text-2xl font-bold text-[#29382F] sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  4K Visual Archive
                </h3>
              </div>
              <span className="text-xs font-bold text-[#506B59]">
                Ultra-High Definition Assets
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
              {galleryImages.map((imgUrl, i) => {
                const isWide = i === 0 && galleryImages.length % 2 !== 0;
                return (
                  <div
                    key={i}
                    className={`group relative min-h-[300px] overflow-hidden rounded-3xl border border-[#29382F]/15 bg-[#E8EDE3] shadow-sm transition-all duration-500 hover:shadow-xl ${
                      isWide ? "lg:col-span-12" : "lg:col-span-6"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${study.client} archive asset ${i + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-xs">
                      <span className="font-bold">
                        {study.client} · Asset {i + 1}
                      </span>
                      <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md">
                        4K UHD
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── BENTO ROW 6: NEXT CLIENT STORY BANNER ─── */}
        {nextStudy && (
          <section className="rounded-3xl border border-[#29382F]/15 bg-white p-8 sm:p-12 shadow-sm transition hover:shadow-md">
            <Link
              href={`/case-studies/${nextStudy.slug}`}
              className="group flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D78359]">
                  Next Client Case Study
                </p>
                <h4
                  className="font-heading mt-2 text-2xl font-bold text-[#29382F] sm:text-3xl transition group-hover:text-[#1E2B23]"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  {nextStudy.title}
                </h4>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#506B59]">
                  {nextStudy.client} · {nextStudy.industry}
                </p>
              </div>

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#29382F] text-white shadow-md transition-all duration-300 group-hover:translate-x-2 group-hover:bg-[#3d5446]">
                <ArrowRight size={20} />
              </span>
            </Link>
          </section>
        )}
      </main>

      {/* ─── BOTTOM CTA ─── */}
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
