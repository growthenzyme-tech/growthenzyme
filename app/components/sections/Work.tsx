
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface Project {
  number: string;
  name: string;
  categories: string[];
  description: string;
  image: string;
  imageAlt: string;
  results: { value: string; label: string }[];
  theme: string;
  link?: string;
}

const projects: Project[] = [
  {
    number: "01",
    name: "JClick Solutions",
    categories: ["Performance Marketing", "Meta Ads", "EdTech"],
    description:
      "Ran a 14-day Meta Ads campaign for JClick Solutions across 3 ad sets. Reached 78,011 people, drove 1.9L+ video views, and generated 32 form submissions - all within a ₹5,575 budget. The Turing Point ad set alone delivered 29 leads.",
    image: "/services/img1.webp",
    imageAlt: "JClick Solutions campaign project",
    results: [
      { value: "32", label: "Leads" },
      { value: "₹5,575", label: "Spent" },
      { value: "1,90,375", label: "Video views" },
    ],
    theme: "bg-[#E8EEE5]",
  },
  {
    number: "02",
    name: "Dream Decor Interior",
    categories: ["Performance Marketing", "Meta Ads", "SMM"],
    description:
      "Ran multiple Meta Ads campaigns for a local interior design studio — combining a call-objective ad and a messaging ad. Delivered 36 direct calls at just ₹35 per call, 47K+ video views, and 10 messaging conversations started, across a tight local budget.",
    image: "/services/img2.webp",
    imageAlt: "Dream Decor Interior project",
    results: [
      { value: "36", label: "Calls" },
      { value: "₹35.31", label: "Per call" },
      { value: "47,907", label: "Views" },
    ],
    theme: "bg-[#F2E5D9]",
  },
  {
    number: "03",
    name: "Pattanam Vaidhyar Vaidhyasalai",
    categories: ["Web Design", "Landing Page", "Health Care"],
    description:
      "Designed a conversion-focused landing page for a traditional Ayurvedic clinic. The brief was clear: earn trust fast, make booking frictionless. Clean layout, local-language elements, and a clear call-to-action — built to convert first-time visitors into appointments.",
    image: "/services/img3.webp",
    imageAlt: "Pattanam Vaidhyar Vaidhyasalai website project",
    results: [
      { value: "5 Days", label: "Delivered in" },
      { value: "Mobile-first", label: "Experience" },
      { value: "Conversion", label: "Focused" },
    ],
    theme: "bg-[#EAE8DC]",
    link: "https://pattanamvaidhyar.in/",
  },
  {
    number: "04",
    name: "Hameed Marine",
    categories: ["Web Design", "Manufacturing", "Business", "In Progress"],
    description:
      "Built a complete business website for Hameed Marine — a manufacturer of fish meal, fish oil, and fish soluble paste. The challenge was making an industrial B2B product feel credible and approachable online. Clean product presentation, clear specs, and a direct inquiry flow — built for buyers, not browsers.",
    image: "/services/img4.webp",
    imageAlt: "Hameed Marine project",
    results: [
      { value: "End-to-end", label: "Design" },
      { value: "B2B", label: "Business" },
      { value: "Industry-first", label: "Layout" },
    ],
    theme: "bg-[#E5EBE5]",
    link: "https://eternal-mars-253427.framer.app/",
  },
];

export default function Work() {
  return (
    <section
      id="work"
      className="relative -mt-20 w-full overflow-hidden bg-[#B6CBA9] px-5 pb-0 pt-14 text-[#29382F] sm:px-10 sm:pb-2 sm:pt-16 lg:px-14 lg:pb-10 lg:pt-20"
    >
      {/* Big soft cream circle behind heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-260px] h-[560px] w-[560px] -translate-x-1/2 rounded-[50%] bg-white sm:h-[700px] sm:w-[700px] sm:top-[-340px] lg:top-[-89vw] lg:h-[122vw] lg:w-[140vw]"
      />

      {/* Bottom mirrored soft cream circle */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-99vw] left-1/2 h-[122vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-white"
      /> */}

      <div className="relative mx-auto -mt-35 max-w-[1320px]">

        {/* SECTION HEADING */}
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
          <span className="font-heading inline-flex items-center rounded-full border border-[#506B59]/30 bg-[#FFFDF8]/60 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#506B59] backdrop-blur sm:text-xs">
            Our Portfolio
          </span>
<h2 className="font-heading mt-5 max-w-[520px] text-[clamp(2.5rem,10vw,3.5rem)] font-bold uppercase leading-[0.98] tracking-[-0.065em] text-[#29382F] sm:mt-6 sm:text-6xl lg:text-7xl">
  Work we're
  <br />

  <span className="mt-2 inline-block rounded-full bg-[#29382F] px-4 py-2.5 text-white sm:mt-3 sm:px-7 sm:py-3">
    proud of.
  </span>
</h2>

          <p className="mt-4 max-w-[420px] text-sm leading-6 text-[#506B59] sm:text-base sm:leading-7">
            A curated selection of projects across performance, design and web.
          </p>
        </div>

        {/* PROJECT CARDS - TWO COLUMNS, TWO ROWS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
          {projects.map((project, index) => {
            const isLeftCard = index % 2 === 0;
            const cardClasses = `group relative flex min-w-0 flex-col overflow-visible border border-white/60 bg-white p-4 shadow-[0_18px_40px_rgba(41,56,47,0.14)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_50px_rgba(41,56,47,0.2)] sm:p-5 ${
              project.link ? "cursor-pointer" : ""
            }`;

            const cardContent = (
              <>
                {/* IMAGE FRAME */}
                <div className="relative h-[400px] w-full shrink-0 overflow-visible bg-[#DCE4D7] sm:h-[480px]">

                  {/* IMAGE CLIPPING WRAPPER */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 600px"
                      className="object-cover transition-transform duration-700 "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#29382F]/55 via-transparent to-transparent" />

                    {/* Number label + arrow */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                      <span className="text-sm font-semibold tracking-[0.18em] text-[#F5F0E5]">
                        {project.number}
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0E5] text-[#29382F] shadow-lg transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#D78359] group-hover:text-white">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </div>

                  {/* THREE OVERLAPPING RESULT BOXES */}
                  <div
                    className={`absolute top-1/2 z-20 flex w-[100px] -translate-y-1/2 flex-col gap-3 sm:w-[108px] md:w-[116px] ${
                      isLeftCard
                        ? "left-2 md:left-[-76px]"
                        : "right-2 md:right-[-76px]"
                    }`}
                  >
                    {project.results.map((result) => (
                      <div
                        key={result.label}
                        className="flex h-[85px] w-full flex-col items-center justify-center border border-[#B6CBA9]/40 bg-[#29382F] px-2 text-center shadow-[0_8px_22px_rgba(41,56,47,0.22)] transition-transform duration-300 group-hover:scale-[1.03] sm:h-[95px]"
                      >
                        <p className="break-words text-sm font-bold leading-tight text-white sm:text-base">
                          {result.value}
                        </p>

                        <p className="mt-1 text-[8px] font-semibold uppercase leading-3 tracking-[0.08em] text-white sm:text-[9px]">
                          {result.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex min-w-0 flex-1 flex-col px-1 pt-5 sm:pt-6">

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-2">
                    {project.categories.map((category) => {
                      const isInProgress = category.toLowerCase() === "in progress";

                      return (
                        <span
                          key={category}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px] ${
                            isInProgress
                              ? "border border-[#D78359]/40 bg-[#FAECE5] text-[#C26233]"
                              : "border border-[#D5E0D2] bg-[#E8EEE5] text-[#29382F]"
                          }`}
                        >
                          {isInProgress && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
                          )}
                          {category}
                        </span>
                      );
                    })}
                  </div>

                  <h3 className="font-heading mt-4 text-2xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-[#29382F] transition-colors duration-300 group-hover:text-[#D78359] sm:text-[1.7rem]">
                    {project.name}
                  </h3>

                  <p className="mt-3 text-[13px] leading-6 text-[#506B59] sm:text-sm sm:leading-6">
                    {project.description}
                  </p>
                </div>
              </>
            );

            if (project.link) {
              return (
                <a
                  key={project.number}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} live project`}
                  className={cardClasses}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <article key={project.number} className={cardClasses}>
                {cardContent}
              </article>
            );
          })}
        </div>

        {/* BOTTOM CTA PANEL */}
        {/* <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[2rem] bg-[#29382F] px-6 py-7 text-center sm:flex-row sm:px-10 sm:text-left">
          <p className="max-w-lg text-lg font-medium leading-7 text-[#F5F0E5] sm:text-xl sm:leading-8">
            Have a project in mind? Let's create something meaningful together.
          </p>

          <Link
            href="#contact"
            className="group inline-flex shrink-0 items-center gap-4 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-6 py-3 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(0,0,0,0.3)]"
          >
            Start a Project
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div> */}

      </div>
    </section>
  );
}
