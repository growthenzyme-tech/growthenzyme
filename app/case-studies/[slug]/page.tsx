import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Eye,
  FileText,
  Heart,
  HeartHandshake,
  Layers,
  Lightbulb,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
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

/* Smartphone Mockup Frame Component */
function PhoneMockup({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[36px] border-[5px] border-[#29382F] bg-[#1E2B23] p-1.5 shadow-[0_20px_45px_rgba(41,56,47,0.22)] ${className}`}
    >
      {/* Top Dynamic Island / Speaker Pill */}
      <div className="absolute left-1/2 top-3 z-20 h-3.5 w-16 -translate-x-1/2 rounded-full bg-[#1E2B23]" />

      {/* Screen Container */}
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[28px] bg-[#E8EDE3]">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
    </div>
  );
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
  const relatedStudies = allStudies
    .filter((cs) => cs.slug !== study.slug && cs.status === "published")
    .slice(0, 3);

  // Gallery fallback if missing
  const galleryImages =
    study.gallery && study.gallery.length > 0
      ? study.gallery
      : [study.coverImage];

  const secondaryImage = galleryImages[1] || galleryImages[0] || study.coverImage;
  const tertiaryImage = galleryImages[2] || galleryImages[0] || study.coverImage;

  // Process mapping based on ourApproach
  const processSteps = [
    {
      num: "01",
      title: "Empathize & Audit",
      icon: Heart,
      fallbackTasks: [
        "Stakeholder Discovery",
        "Audience Persona Mapping",
        "Competitor Landscape",
      ],
      customTask: study.ourApproach[0] || "Deep operational & audience audit",
    },
    {
      num: "02",
      title: "Define & Strategize",
      icon: Search,
      fallbackTasks: [
        "Core Problem Framing",
        "Channel Strategy",
        "Target Positioning",
      ],
      customTask: study.ourApproach[1] || "Positioning and growth strategy",
    },
    {
      num: "03",
      title: "Ideate & Creative",
      icon: Lightbulb,
      fallbackTasks: [
        "Content Conceptualization",
        "Brand Storytelling",
        "Asset Architecture",
      ],
      customTask: study.ourApproach[2] || "Creative direction and lead funnels",
    },
    {
      num: "04",
      title: "Design & Deploy",
      icon: Palette,
      fallbackTasks: [
        "High-Fidelity Assets",
        "Campaign Launch",
        "Platform Integration",
      ],
      customTask: study.ourApproach[3] || "Omnichannel deployment and distribution",
    },
    {
      num: "05",
      title: "Scale & Optimize",
      icon: CheckCircle2,
      fallbackTasks: [
        "Real-Time Analytics",
        "Conversion Optimization",
        "Lead Pipeline Growth",
      ],
      customTask: study.ourApproach[4] || "Scaling inquiries and long-term brand equity",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#29382F] antialiased selection:bg-[#B6CBA9]/30">
      {/* TOP NAVIGATION BREADCRUMB */}
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

      {/* SECTION 1: HERO (BEHANCE / DRIBBBLE EDITORIAL STYLE) */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#F2F7F0] via-[#F8FAF7] to-[#FFFDF8] py-14 sm:py-20 lg:py-24">
        {/* Soft Organic Sage Backdrop Pill */}
        <div className="pointer-events-none absolute right-[-5%] top-[10%] h-[550px] w-[650px] rounded-[70px] bg-[#DCE8D8]/50 blur-3xl lg:right-[5%]" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Branding, Title, Meta Columns */}
            <div className="space-y-7 lg:col-span-7">
              {/* Client Monogram / Logo Mark */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#29382F] text-white shadow-md">
                  <span className="font-heading text-xl font-black text-[#B6CBA9]">
                    {study.client.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#506B59]">
                    {study.client}
                  </p>
                  <p className="text-xs font-bold text-[#D78359]">
                    Case Study · {study.industry}
                  </p>
                </div>
              </div>

              {/* Main Headline */}
              <h1
                className="font-heading text-3xl font-extrabold tracking-tight text-[#29382F] sm:text-4xl lg:text-5xl leading-[1.12]"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                {study.title}
              </h1>

              {/* Subtitle / Short Description */}
              <p className="font-instrument text-base leading-relaxed text-[#506B59] sm:text-lg">
                {study.shortDescription}
              </p>

              {/* Two Meta Columns: Tools/Services & Metrics */}
              <div className="grid grid-cols-1 gap-6 border-t border-[#29382F]/10 pt-6 sm:grid-cols-2">
                {/* Tools & Services */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#29382F]">
                    <Wrench size={13} className="text-[#D78359]" />
                    Services & Tools
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {study.servicesProvided.map((service) => (
                      <span
                        key={service}
                        className="rounded-lg border border-[#29382F]/10 bg-white px-2.5 py-1 text-xs font-semibold text-[#29382F] shadow-2xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Metrics / Timeline */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#29382F]">
                    <Award size={13} className="text-[#D78359]" />
                    Verified Outcomes
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {study.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#29382F]/10 bg-white/80 p-2.5 shadow-2xs"
                      >
                        <p className="font-heading text-lg font-black text-[#29382F]">
                          {metric.value}
                        </p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#506B59]">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Triple-Device 3D Presentation */}
            <div className="relative flex justify-center lg:col-span-5">
              {/* Organic shape backdrop */}
              <div className="absolute inset-0 m-auto h-[380px] w-[320px] rounded-[50px] bg-[#D6E4D1]/70 sm:h-[440px] sm:w-[380px]" />

              <div className="relative flex w-full max-w-[420px] items-center justify-center py-6">
                {/* Left Device (Angled/Offset) */}
                <div className="relative z-0 -mr-16 w-44 -rotate-6 opacity-85 transition-transform duration-500 hover:rotate-0 hover:opacity-100 sm:w-52">
                  <PhoneMockup
                    src={secondaryImage}
                    alt={`${study.client} secondary preview`}
                  />
                </div>

                {/* Center Device (Hero Foreground) */}
                <div className="relative z-10 w-52 shadow-2xl transition-transform duration-500 hover:scale-105 sm:w-60">
                  <PhoneMockup
                    src={study.coverImage}
                    alt={study.coverImageAlt || study.title}
                    priority
                  />
                </div>

                {/* Right Device (Angled/Offset) */}
                <div className="relative z-0 -ml-16 w-44 rotate-6 opacity-85 transition-transform duration-500 hover:rotate-0 hover:opacity-100 sm:w-52">
                  <PhoneMockup
                    src={tertiaryImage}
                    alt={`${study.client} tertiary preview`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN BODY SECTIONS */}
      <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 space-y-24 sm:space-y-32">
        {/* SECTION 2: OVERVIEW */}
        <section className="relative">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12">
            {/* Left: Dual Preview Cards */}
            <div className="flex items-center justify-center gap-4 md:col-span-5">
              <div className="w-36 rotate-[-4deg] transition hover:rotate-0 sm:w-44">
                <PhoneMockup src={study.coverImage} alt="Overview preview 1" />
              </div>
              <div className="mt-8 w-36 rotate-[4deg] transition hover:rotate-0 sm:w-44">
                <PhoneMockup src={secondaryImage} alt="Overview preview 2" />
              </div>
            </div>

            {/* Right: Overview Text with Section Badge */}
            <div className="space-y-5 md:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#29382F]/15 bg-[#EEF5EB] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#29382F] shadow-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#29382F] text-white">
                  <Eye size={12} />
                </span>
                Overview
              </div>

              <h2
                className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl lg:text-4xl leading-tight"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Project Background & Scope
              </h2>

              <p className="font-instrument text-base leading-relaxed text-[#506B59] sm:text-lg">
                {study.projectOverview || study.shortDescription}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROBLEM STATEMENT */}
        <section className="relative">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12">
            {/* Left: Stylized Silhouette & Puzzle Illustration */}
            <div className="flex items-center justify-center md:col-span-5">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-[#E6EFE3] via-[#EEF5EB] to-[#FFFDF8] p-8 shadow-inner sm:h-72 sm:w-72">
                {/* SVG Silhouette Head with Maze / Problem Motif */}
                <svg
                  viewBox="0 0 200 200"
                  className="h-full w-full text-[#29382F]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Maze circles */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="#B6CBA9"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    stroke="#29382F"
                    strokeWidth="2.5"
                    strokeDasharray="12 4"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="40"
                    stroke="#D78359"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                  />

                  {/* Silhouette Human Contemplating */}
                  <path
                    d="M60 160 C60 120, 80 110, 95 105 C85 98, 80 88, 80 75 C80 58, 93 45, 110 45 C127 45, 140 58, 140 75 C140 88, 135 98, 125 105 C140 110, 160 120, 160 160 Z"
                    fill="#29382F"
                    opacity="0.88"
                  />

                  {/* Glowing Idea / Question Lightbulb Center */}
                  <circle cx="110" cy="75" r="10" fill="#D78359" />
                  <path
                    d="M106 72 L114 78 M114 72 L106 78"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Right: Problem Statement Text */}
            <div className="space-y-5 md:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#29382F]/15 bg-[#EEF5EB] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#29382F] shadow-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#29382F] text-white">
                  <FileText size={12} />
                </span>
                Problem Statement
              </div>

              <h2
                className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl lg:text-4xl leading-tight"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                The Core Challenge
              </h2>

              <div className="rounded-2xl border-l-4 border-[#D78359] bg-[#FFF8F2] p-6 shadow-xs sm:p-7">
                <p className="font-instrument text-base font-medium leading-relaxed text-[#5A4526] sm:text-lg">
                  "{study.theChallenge}"
                </p>
              </div>
            </div>
          </div>

          {/* Curved Dashed Connector Line to Solutions */}
          <div className="pointer-events-none hidden md:block mt-8 w-full">
            <svg
              className="h-20 w-full"
              viewBox="0 0 800 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M150 10 C 250 80, 550 0, 680 70"
                stroke="#B6CBA9"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
            </svg>
          </div>
        </section>

        {/* SECTION 4: SOLUTIONS */}
        <section className="relative">
          {/* Subtle background lightbulb motif watermark */}
          <div className="pointer-events-none absolute right-4 top-0 -z-10 opacity-10">
            <Lightbulb size={240} className="text-[#29382F]" />
          </div>

          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#29382F]/15 bg-[#EEF5EB] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#29382F] shadow-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#29382F] text-white">
                <HeartHandshake size={12} />
              </span>
              Solutions
            </div>

            <h2
              className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl lg:text-4xl leading-tight"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Strategic Execution & Interventions
            </h2>

            {/* Checklist / Solutions Breakdown */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Card 1: The Ask */}
              <div className="rounded-3xl border border-[#29382F]/10 bg-white p-7 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#D78359]">
                  <Target size={16} />
                  The Client's Ask
                </div>
                <p className="mt-3 font-instrument text-base leading-relaxed text-[#29382F] font-semibold">
                  {study.theAsk}
                </p>
              </div>

              {/* Card 2: What We Did */}
              <div className="rounded-3xl border border-[#29382F]/10 bg-white p-7 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#506B59]">
                  <Layers size={16} />
                  What We Delivered
                </div>
                <p className="mt-3 font-instrument text-base leading-relaxed text-[#29382F]">
                  {study.whatWeDid}
                </p>
              </div>
            </div>

            {/* Detailed Actionable Solutions List */}
            <div className="rounded-3xl border border-[#29382F]/10 bg-white/80 p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#506B59] mb-4">
                Core Initiatives Executed
              </p>
              <ul className="space-y-3">
                {study.ourApproach.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF5EB] text-[#29382F]">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="font-instrument text-sm sm:text-base leading-relaxed text-[#29382F]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 5: STRATEGIC PROCESS (5 CONNECTED CIRCLES LIKE REFERENCE) */}
        <section className="relative">
          <div className="space-y-12 text-center">
            {/* Centered Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#29382F]/15 bg-[#EEF5EB] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#29382F] shadow-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#29382F] text-white">
                <Compass size={12} />
              </span>
              Strategic Process
            </div>

            <h2
              className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              End-To-End Growth Methodology
            </h2>

            {/* 5 Circular Connected Steps */}
            <div className="relative">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
                {processSteps.map((step, idx) => {
                  const IconComp = step.icon;
                  return (
                    <div key={idx} className="relative flex flex-col items-center">
                      {/* Circle Icon */}
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#B6CBA9] bg-white text-[#29382F] shadow-md transition-transform duration-300 hover:scale-110 hover:border-[#29382F]">
                        <IconComp size={28} className="text-[#29382F]" />
                      </div>

                      {/* Directional Chevrons between steps on Desktop */}
                      {idx < processSteps.length - 1 && (
                        <div className="pointer-events-none absolute left-[70%] top-8 hidden tracking-widest text-[#B6CBA9] lg:block text-xs font-bold">
                          &gt;&gt;&gt;&gt;
                        </div>
                      )}

                      {/* Step Title */}
                      <p className="font-heading mt-4 text-base font-bold text-[#29382F]">
                        {step.title}
                      </p>

                      {/* Custom Point from ourApproach */}
                      <p className="font-instrument mt-2 text-xs leading-relaxed text-[#506B59] px-2">
                        {step.customTask}
                      </p>

                      {/* Sub-Bullets List */}
                      <div className="mt-3 space-y-1 text-left text-[11px] text-[#506B59]">
                        {step.fallbackTasks.map((t, tidx) => (
                          <div key={tidx} className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-[#D78359]" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: VERIFIED RESULTS BREAKDOWN */}
        <section className="relative">
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#29382F]/15 bg-[#EEF5EB] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#29382F] shadow-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#29382F] text-white">
                <TrendingUp size={12} />
              </span>
              Results & Business Impact
            </div>

            <h2
              className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl lg:text-4xl leading-tight"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Measured Outcomes & Growth
            </h2>

            {/* Metrics Counters */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {study.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-[#29382F]/10 bg-gradient-to-br from-[#F5FAF2] via-white to-[#F9FAF8] p-8 text-center shadow-xs"
                >
                  <p className="font-heading text-4xl font-black text-[#29382F] sm:text-5xl">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#506B59]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Outcome Highlight Box */}
            <div className="rounded-3xl border border-emerald-300 bg-emerald-50/80 p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <CheckCircle2 size={18} />
                Verified Results
              </div>
              <p className="mt-3 font-heading text-xl font-bold leading-relaxed text-emerald-950 sm:text-2xl">
                {study.theResults}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7: PROJECT GALLERY (4K VISUAL ASSETS) */}
        {galleryImages.length > 0 && (
          <section className="relative space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#29382F]/15 bg-[#EEF5EB] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#29382F] shadow-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#29382F] text-white">
                <Layers size={12} />
              </span>
              Visual Showcase
            </div>

            <h2
              className="font-heading text-2xl font-bold text-[#29382F] sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Campaign & Asset Gallery in 4K
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {galleryImages.map((imgUrl, i) => (
                <div
                  key={i}
                  className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-[#29382F]/10 bg-[#E8EDE3] shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <Image
                    src={imgUrl}
                    alt={`${study.client} showcase 4K visual ${i + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {study.client} · 4K Showcase {i + 1}
                    </span>
                    <span className="rounded-full bg-white/30 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md">
                      4K UHD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 8: RELATED CASE STUDIES */}
        {relatedStudies.length > 0 && (
          <section className="border-t border-[#29382F]/10 pt-16 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#506B59]">
                  Explore More Work
                </p>
                <h3
                  className="font-heading mt-1 text-2xl font-bold text-[#29382F] sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  Related Success Stories
                </h3>
              </div>
              <Link
                href="/case-studies"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#29382F] hover:text-[#D78359]"
              >
                View All
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedStudies.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/case-studies/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-[#29382F]/10 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#B6CBA9]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8EDE3]">
                    <Image
                      src={rel.coverImage}
                      alt={rel.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-[#29382F] shadow-xs">
                        {rel.industry}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#506B59]">
                      {rel.client}
                    </p>
                    <h4
                      className="font-heading mt-1.5 line-clamp-2 text-base font-bold leading-snug text-[#29382F]"
                      style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                    >
                      {rel.title}
                    </h4>
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs font-bold text-[#29382F] border-t border-[#29382F]/10">
                      <span>View Story</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* BOTTOM CTA SECTION */}
      <section className="border-t border-[#29382F]/10 bg-[#29382F] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B6CBA9]">
            <Sparkles size={14} />
            Partner With Growth Enzyme
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
