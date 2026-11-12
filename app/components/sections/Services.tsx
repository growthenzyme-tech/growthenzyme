
import {
  Megaphone,
  Workflow,
  Search,
  Palette,
  Code2,
  Video,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Performance Marketing",
    shortTitle: "Performance Marketing",
    description:
      "Google Ads, Meta Ads, and multi-channel campaigns engineered for measurable ROAS.",
    Icon: Megaphone,
    card: "bg-[#B6CBA9]",
    titleColor: "text-[#29382F]",
    descColor: "text-[#29382F]/80",
    metaColor: "text-[#29382F]/65",
    iconBg: "bg-[#F5F0E5]",
    iconColor: "text-[#506B59]",
  },
  {
    number: "02",
    title: "Business Automation",
    shortTitle: "Business Automation",
    description:
      "n8n-powered workflows that eliminate repetitive tasks and scale your operations.",
    Icon: Workflow,
    card: "bg-[#D78359]",
    titleColor: "text-white",
    descColor: "text-white/90",
    metaColor: "text-white/75",
    iconBg: "bg-[#FFFDF8]",
    iconColor: "text-[#D78359]",
  },
  {
    number: "03",
    title: "Search Engine Optimisation",
    shortTitle: "SEO",
    description:
      "On-page, off-page, technical SEO and backlink strategies that drive sustainable organic growth.",
    Icon: Search,
    card: "bg-[#F5F0E5]",
    titleColor: "text-[#29382F]",
    descColor: "text-[#506B59]",
    metaColor: "text-[#506B59]/65",
    iconBg: "bg-[#29382F]",
    iconColor: "text-white",
  },
  {
    number: "04",
    title: "Design Creatives",
    shortTitle: "Creative Design",
    description:
      "Scroll-stopping posters, social creatives and brand assets that convert attention into action.",
    Icon: Palette,
    card: "bg-[#29382F]",
    titleColor: "text-white",
    descColor: "text-white/80",
    metaColor: "text-white/65",
    iconBg: "bg-[#D78359]",
    iconColor: "text-white",
  },
  {
    number: "05",
    title: "Web Design & Development",
    shortTitle: "Web Development",
    description:
      "High-converting websites and landing pages built for performance, not just looks.",
    Icon: Code2,
    card: "bg-[#506B59]",
    titleColor: "text-white",
    descColor: "text-white/85",
    metaColor: "text-white/65",
    iconBg: "bg-[#F5F0E5]",
    iconColor: "text-[#506B59]",
  },
  {
    number: "06",
    title: "Video Production & Editing",
    shortTitle: "Video Production",
    description:
      "From concept to cut — reels, ads, and brand films that tell your growth story.",
    Icon: Video,
    card: "bg-[#E8D9C5]",
    titleColor: "text-[#29382F]",
    descColor: "text-[#506B59]",
    metaColor: "text-[#506B59]/65",
    iconBg: "bg-white",
    iconColor: "text-[#D78359]",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative w-full overflow-hidden bg-white px-5 py-20 text-[#29382F] sm:px-10 sm:py-24 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px]">

        {/* LEFT HEADING + RIGHT SERVICE CARDS */}
        <div className="relative isolate grid grid-cols-1 gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
          {/* FULL-WIDTH TOP GREEN BACKGROUND SHADE */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute left-1/2 top-[98px] z-0 hidden h-[380px] w-screen -translate-x-1/2 bg-gradient-to-b from-[#DCE8D7] via-[#EAF0E6] to-white lg:block"
/>

          {/* LEFT SIDE - HEADING */}
          <div className="relative z-10 flex flex-col items-start lg:sticky lg:top-28">

            <span className="inline-flex items-center rounded-full bg-[#B6CBA9]/30 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#506B59] sm:text-xs">
              What We Do
            </span>

           <h2 className="mt-6 max-w-[520px] text-5xl font-bold uppercase leading-[0.95] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
  Six Ways We Grow Your{" "}
  <span className="mt-3 inline-block rounded-full bg-[#29382F] px-5 py-3 text-white sm:px-7">
    Business
  </span>
</h2>

            <p className="mt-7 max-w-[390px] text-sm leading-7 text-[#506B59] sm:text-base sm:leading-8">
              From traffic to conversions, brand to automation — we cover every growth lever.
            </p>


            {/* CTA */}
            <a
              href="#contact"
              className="group mt-7 inline-flex items-center overflow-hidden rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] p-[4px] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.18),inset_0_2px_3px_rgba(255,255,255,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.2)] active:translate-y-1 active:shadow-[0_2px_0_#6F9259]"
            >
              <span className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-[#29382F] sm:gap-5 sm:px-6 sm:py-3.5">
                Let's Work Together

                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/50 bg-white/35 shadow-[inset_0_1px_3px_rgba(255,255,255,0.7)]">
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </span>
            </a>
          </div>

          {/* RIGHT SIDE - SERVICE CARD COLLAGE */}
       
{/* SERVICES GRID */}
{/* SERVICES GRID WRAPPER */}
<div className="relative z-10 mt-16 lg:mt-20">

  {/* TOP GREEN BACKGROUND SHADE */}


  {/* SERVICE CARDS */}
  <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">

  {services.map((service, index) => {
    const Icon = service.Icon;

const cardColors = [
  "bg-[#B6C5AA]", // Sage green
  "bg-[#D6BBA5]", // Muted warm beige
  "bg-[#B8B69A]", // Soft olive
  "bg-[#A9BDB0]", // Eucalyptus green
  "bg-[#C5AD9C]", // Muted terracotta
  "bg-[#A5B59F]", // Hero sage green
];

    return (
      <article
        key={service.number}
       className={`group relative flex min-h-[230px] flex-col overflow-hidden  border border-[#506B59]/30 ${cardColors[index]} p-6 shadow-[0_3px_10px_rgba(41,56,47,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#29382F]/60 hover:shadow-[0_12px_28px_rgba(41,56,47,0.10)] sm:p-7`}
      >

   
        {/* DECORATIVE CIRCLE */}
        {/* <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-10 h-36 w-36 rounded-full border-[22px] border-[#29382F]/[0.04] transition-transform duration-500 group-hover:scale-125"
        /> */}

        {/* ICON */}
        <div className="relative z-10 mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#29382F] text-[#F5F0E5] shadow-[0_5px_12px_rgba(41,56,47,0.12)] transition-transform duration-300 group-hover:scale-110">
          <Icon size={25} strokeWidth={1.7} />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 mt-7">
          <h3 className="max-w-[260px] text-xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-[22px]">
            {service.title}
          </h3>

          <p className="mt-3 max-w-[290px] text-xs leading-6 text-[#506B59] sm:text-sm sm:leading-7">
            {service.description}
          </p>
        </div>

  

      </article>
    );
  })}

</div>

       </div> {/* SERVICE CARDS */}
</div>   {/* SERVICES GRID WRAPPER */}
      </div>
    </section>
  );
}
