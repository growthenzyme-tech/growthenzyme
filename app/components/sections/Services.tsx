
import {
  Megaphone,
  Workflow,
  Search,
  Palette,
  Code2,
  Video,
  ArrowUpRight,
} from "lucide-react";

// GrowthEnzyme colour palette
// Cream: #F5F0E5
// Sage: #A5B59F
// Deep Green: #29382F
// Mid Green: #506B59
// Terracotta: #D78359
// Tan: #E8D9C5

const services = [
  {
    number: "01",
    title: "Performance Marketing",
    description:
      "Google Ads, Meta Ads, and multi-channel campaigns engineered for measurable ROAS.",
    Icon: Megaphone,
    card: "bg-[#A5B59F]",
    titleColor: "text-[#17251D]",
    descColor: "text-[#29382F]",
    metaColor: "text-[#29382F]/65",
    disc: "bg-[#F5F0E5] text-[#506B59]",
    arrow: "text-[#29382F]/70 group-hover:text-[#17251D]",
  },
  {
    number: "02",
    title: "Business Automation",
    description:
      "n8n-powered workflows that eliminate repetitive tasks and scale your operations.",
    Icon: Workflow,
    card: "bg-[#D78359]",
    titleColor: "text-white",
    descColor: "text-[#FFF9EF]",
    metaColor: "text-white/80",
    disc: "bg-[#FFF9EF] text-[#C76F46]",
    arrow: "text-white/80 group-hover:text-white",
  },
  {
    number: "03",
    title: "Search Engine Optimisation",
    description:
      "On-page, off-page, technical SEO and backlink strategies that drive sustainable organic growth.",
    Icon: Search,
    card: "bg-[#E8D9C5]",
    titleColor: "text-[#17251D]",
    descColor: "text-[#405044]",
    metaColor: "text-[#29382F]/65",
    disc: "bg-[#29382F] text-[#F5F0E5]",
    arrow: "text-[#29382F]/65 group-hover:text-[#D78359]",
  },
  {
    number: "04",
    title: "Design Creatives",
    description:
      "Scroll-stopping posters, social creatives and brand assets that convert attention into action.",
    Icon: Palette,
    card: "bg-[#29382F]",
    titleColor: "text-white",
    descColor: "text-[#F5F0E5]",
    metaColor: "text-white/65",
    disc: "bg-[#D78359] text-white",
    arrow: "text-white/75 group-hover:text-[#E8D9C5]",
  },
  {
    number: "05",
    title: "Web Design & Development",
    description:
      "High-converting websites and landing pages built for performance, not just looks.",
    Icon: Code2,
    card: "bg-[#506B59]",
    titleColor: "text-white",
    descColor: "text-[#F5F0E5]",
    metaColor: "text-white/70",
    disc: "bg-[#F5F0E5] text-[#506B59]",
    arrow: "text-white/75 group-hover:text-[#E8D9C5]",
  },
  {
    number: "06",
    title: "Video Production & Editing",
    description:
      "From concept to cut — reels, ads, and brand films that tell your growth story.",
    Icon: Video,
    card: "bg-[#FFFDF8] border border-[#A5B59F]/40",
    titleColor: "text-[#17251D]",
    descColor: "text-[#405044]",
    metaColor: "text-[#29382F]/60",
    disc: "bg-[#A5B59F] text-[#17251D]",
    arrow: "text-[#29382F]/65 group-hover:text-[#D78359]",
  },
];

export default function Services() {
  return (
    <section id="services" className="w-full bg-transparent">
      <div className="mx-auto w-full max-w-[1320px] bg-transparent px-6 py-20 text-[#29382F] sm:px-10 sm:py-24 lg:px-14 lg:py-28">
        <div className="mx-auto max-w-[1320px]">

          {/* Section Heading */}
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <span className="inline-flex items-center rounded-full border border-[#405B49]/40 bg-[#F5F0E5]/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#29382F] sm:text-xs sm:tracking-[0.22em]">
                What We Do
              </span>

              <h2 className="mt-4 max-w-[650px] text-4xl font-semibold leading-[1.05] tracking-[-0.06em] text-[#17251D] sm:text-5xl lg:text-6xl">
                Six ways we grow
                <br className="hidden sm:block" />
                your business.
              </h2>
            </div>

            <p className="relative max-w-[390px] text-base font-medium leading-8 text-[#405044] sm:text-lg sm:leading-9 md:-mt-5">
              From traffic to conversions, brand to automation — we cover every
              growth lever.
            </p>

          </div>

          {/* Services Grid */}
          <div className="rounded-[2rem] bg-[#A5B59F]/25 p-4 sm:rounded-[2.5rem] sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">

              {services.map((service) => {
                const Icon = service.Icon;

                return (
                  <article
                    key={service.number}
                    className={`group relative flex min-h-[270px] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] ${service.card} px-7 py-10 text-center shadow-[0_18px_30px_rgba(41,56,47,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_40px_rgba(41,56,47,0.26)] sm:px-8`}
                  >
                    {/* Soft top-left light */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.22),transparent_45%)]"
                    />

                    {/* Number */}
                    <span
                      className={`absolute left-6 top-5 text-xs font-medium tracking-widest ${service.metaColor}`}
                    >
                      {service.number}
                    </span>

                    {/* Arrow */}
                    <ArrowUpRight
                      size={19}
                      className={`absolute right-6 top-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 ${service.arrow}`}
                    />

                    {/* Icon disc */}
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-[0_10px_20px_rgba(41,56,47,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] ring-4 ring-white/20 transition-transform duration-300 group-hover:scale-105 ${service.disc}`}
                    >
                      <Icon size={26} strokeWidth={1.7} />
                    </div>

                    {/* Service title */}
                    <h3
                      className={`relative mt-6 text-xl font-semibold tracking-tight sm:text-[22px] ${service.titleColor}`}
                    >
                      {service.title}
                    </h3>

                    {/* Service description */}
                    <p
                      className={`relative mt-3 max-w-[290px] text-sm leading-7 ${service.descColor}`}
                    >
                      {service.description}
                    </p>
                  </article>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
