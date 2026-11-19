
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Layers,
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
    title: `${study.title} | Growth Enzyme Case Studies`,
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

  // Related projects (other case studies)
  const allStudies = await getAllCaseStudies();
  const relatedStudies = allStudies
    .filter((cs) => cs.slug !== study.slug && cs.status === "published")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#29382F] antialiased">
      {/* 1. BREADCRUMBS & TOP NAV */}
      <nav className="border-b border-[#29382F]/10 bg-white/70 pt-28 pb-4 backdrop-blur-md sm:pt-32">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 text-xs font-semibold text-[#506B59] sm:px-8 lg:px-12">
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
          <span className="truncate text-[#29382F] font-bold">{study.client}</span>
        </div>
      </nav>

      {/* 1. PROJECT HERO */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#EEF5EB] via-[#F6FAF3] to-[#FFFDF8] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#29382F] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <Building2 size={13} className="text-[#B6CBA9]" />
                Client: {study.client}
              </span>
              <span className="rounded-full border border-[#29382F]/15 bg-white px-3 py-1 text-xs font-bold text-[#506B59]">
                {study.industry}
              </span>
              {study.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D78359] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  <Sparkles size={12} /> Featured Project
                </span>
              )}
            </div>

            <h1
              className="font-heading text-3xl font-extrabold tracking-tight text-[#29382F] sm:text-4xl lg:text-5xl leading-tight"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              {study.title}
            </h1>

            <p className="font-instrument text-base leading-relaxed text-[#506B59] sm:text-xl">
              {study.shortDescription}
            </p>

            {/* Quick Metrics Banner */}
            {study.metrics && study.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#29382F]/10 bg-white/90 p-5 shadow-sm sm:grid-cols-3 sm:gap-6">
                {study.metrics.map((metric, i) => (
                  <div key={i}>
                    <p className="font-heading text-2xl font-black text-[#29382F] sm:text-3xl">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#506B59]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Large Hero Cover Image */}
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[#29382F]/10 bg-[#E8EDE3] shadow-xl sm:aspect-[21/9]">
            <Image
              src={study.coverImage}
              alt={study.coverImageAlt || study.title}
              fill
              unoptimized
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT BODY */}
      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* LEFT 8 COLUMNS: DETAILED CASE STUDY SECTIONS */}
          <div className="space-y-14 lg:col-span-8">
            {/* 2. PROJECT OVERVIEW */}
            <section className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D78359]">
                <span className="h-2 w-2 rounded-full bg-[#D78359]" />
                Section 01 · Background
              </div>
              <h2
                className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Project Overview
              </h2>
              <p className="font-instrument text-base leading-relaxed text-[#506B59] sm:text-lg">
                {study.projectOverview || study.shortDescription}
              </p>
            </section>

            {/* 3. THE CHALLENGE */}
            <section className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D78359]">
                <span className="h-2 w-2 rounded-full bg-[#D78359]" />
                Section 02 · The Challenge
              </div>
              <h2
                className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                The Challenge
              </h2>
              <div className="rounded-2xl border-l-4 border-amber-500 bg-[#FFF9F2] p-6 text-base leading-relaxed text-[#5A4526] shadow-sm sm:p-7">
                <p className="font-medium text-lg leading-relaxed">
                  "{study.theChallenge}"
                </p>
              </div>
            </section>

            {/* 4. OUR APPROACH */}
            <section className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D78359]">
                <span className="h-2 w-2 rounded-full bg-[#D78359]" />
                Section 03 · Strategy
              </div>
              <h2
                className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Our Approach
              </h2>
              <div className="space-y-3.5">
                {study.ourApproach.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-2xl border border-[#29382F]/10 bg-white p-4 shadow-sm transition hover:border-[#B6CBA9]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#EEF5EB] text-xs font-black text-[#29382F]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="font-instrument text-sm font-medium leading-relaxed text-[#29382F] sm:text-base">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. WHAT WE DID & 7. RESULTS BREAKDOWN */}
            <section className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D78359]">
                <span className="h-2 w-2 rounded-full bg-[#D78359]" />
                Section 04 · Execution & Outcomes
              </div>
              <h2
                className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Results Breakdown
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* The Ask */}
                <div className="rounded-2xl border border-[#29382F]/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D78359]">
                    <Target size={16} />
                    The Ask
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#29382F] font-semibold">
                    {study.theAsk}
                  </p>
                </div>

                {/* What We Did */}
                <div className="rounded-2xl border border-[#29382F]/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#506B59]">
                    <Layers size={16} />
                    What We Did
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#29382F]">
                    {study.whatWeDid}
                  </p>
                </div>

                {/* The Results */}
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 size={16} />
                    The Results
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-emerald-950 font-bold">
                    {study.theResults}
                  </p>
                </div>
              </div>
            </section>

            {/* 8. PROJECT GALLERY */}
            {study.gallery && study.gallery.length > 0 && (
              <section className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D78359]">
                  <span className="h-2 w-2 rounded-full bg-[#D78359]" />
                  Section 05 · Visual Showcase
                </div>
                <h2
                  className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Project Gallery
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {study.gallery.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative aspect-video overflow-hidden rounded-2xl border border-[#29382F]/10 bg-[#E8EDE3] shadow-sm transition-transform hover:scale-[1.02]"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${study.client} showcase ${i + 1}`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT 4 COLUMNS: SIDEBAR SUMMARY & SERVICES */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Project Summary Card */}
            <div className="sticky top-28 rounded-3xl border border-[#29382F]/10 bg-white p-6 shadow-sm space-y-6">
              <h3 className="font-heading text-xl font-bold text-[#29382F]">
                Project Details
              </h3>

              <div className="space-y-4 border-t border-[#29382F]/10 pt-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#506B59]">
                    Client
                  </p>
                  <p className="mt-0.5 font-bold text-[#29382F]">
                    {study.client}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#506B59]">
                    Industry
                  </p>
                  <p className="mt-0.5 font-bold text-[#29382F]">
                    {study.industry}
                  </p>
                </div>

                {/* 6. SERVICES PROVIDED */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#506B59] mb-2">
                    Services Provided
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {study.servicesProvided.map((service) => (
                      <span
                        key={service}
                        className="rounded-lg bg-[#EEF5EB] px-2.5 py-1 text-xs font-semibold text-[#29382F]"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-2xl bg-[#29382F] p-5 text-white space-y-3">
                <p className="text-xs uppercase tracking-wider text-[#B6CBA9] font-bold">
                  Need Similar Results?
                </p>
                <p className="text-sm text-white/90 leading-snug">
                  Let's discuss how we can tailor our strategies for your business.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#B9D99C] to-[#8DB76D] py-3 text-xs font-bold text-[#29382F] shadow-sm transition hover:brightness-105"
                >
                  Start a Conversation
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* 9. RELATED PROJECTS */}
        {relatedStudies.length > 0 && (
          <section className="mt-20 border-t border-[#29382F]/10 pt-16">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D78359]">
                  <TrendingUp size={14} />
                  More Case Studies
                </div>
                <h2
                  className="font-heading mt-2 text-2xl font-bold text-[#29382F] sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Related Client Success Stories
                </h2>
              </div>
              <Link
                href="/case-studies"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#29382F] hover:text-[#D78359]"
              >
                View All Case Studies
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedStudies.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/case-studies/${rel.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#29382F]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8EDE3]">
                    <Image
                      src={rel.coverImage}
                      alt={rel.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-[#29382F]">
                        {rel.industry}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#506B59]">
                      {rel.client}
                    </p>
                    <h3 className="font-heading mt-1 text-base font-bold text-[#29382F] transition-colors group-hover:text-[#D78359] line-clamp-2">
                      {rel.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
