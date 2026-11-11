
import {
  Megaphone,
  Workflow,
  Search,
  Palette,
  Code2,
  Video,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Performance Marketing",
    description:
      "Google Ads, Meta Ads, and multi-channel campaigns engineered for measurable ROAS.",
    Icon: Megaphone,
    color: "bg-[#F1F4EC]",
  },
  {
    number: "02",
    title: "Business Automation",
    description:
      "n8n-powered workflows that eliminate repetitive tasks and scale your operations.",
    Icon: Workflow,
    color: "bg-[#EAF3E6]",
  },
  {
    number: "03",
    title: "Search Engine Optimisation",
    description:
      "On-page, off-page, technical SEO and backlink strategies that drive sustainable organic growth.",
    Icon: Search,
   color: "bg-[#2C4126]",
  },
  {
    number: "04",
    title: "Design Creatives",
    description:
      "Scroll-stopping posters, social creatives and brand assets that convert attention into action.",
    Icon: Palette,
    color: "bg-[#2C4126]",
  },
  {
    number: "05",
    title: "Web Design & Development",
    description:
      "High-converting websites and landing pages built for performance, not just looks.",
    Icon: Code2,
    color: "bg-[#F1F4EC]",
  },
  {
    number: "06",
    title: "Video Production & Editing",
    description:
      "From concept to cut — reels, ads, and brand films that tell your growth story.",
    Icon: Video,
    color: "bg-[#EAF3E6]",
  },
];

export default function Services() {
  return (
    <section
      id="services"
       className="w-full bg-transparent"
    >
      <div className="mx-auto w-full max-w-[1320px] bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-14 lg:py-28">
        <div className="mx-auto max-w-[1320px]">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <span className=" rounded-full bg-[#C7F23A] px-5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#548B43]">
              What We Do
            </span>

          <h2 className="mt-4 max-w-[650px] text-4xl font-bold leading-[1.08] tracking-[-0.055em] text-[#173B32] sm:text-5xl lg:text-6xl">
  Six ways we grow
  <br className="hidden sm:block" />
  {/* <span className="mt-2 inline-block rounded-full bg-[#C7F23A] px-5 py-1 text-[#101817] sm:px-8"> */}
    your business.
  {/* </span> */}
</h2>


          </div>

          

         <p className="relative -mt-5 max-w-[390px] text-base font-bold leading-8 text-[#52675D] sm:text-lg sm:leading-9">
  From traffic to conversions, brand to automation — we cover every
  growth lever.
</p>

        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => {
            const Icon = service.Icon;
const isDarkCard = service.number === "03" || service.number === "04";
            return (
              <article
                key={service.number}
                className={`group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-1xl border border-[#E9EDE6] ${
  service.color
} ${
 service.number === "03"
  ? "lg:-mr-14 border-0"
  : service.number === "04"
    ? "lg:-ml-14 border-0"
    : ""
} p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C7DDB9] hover:shadow-[0_15px_35px_rgba(35,65,30,0.08)] sm:p-8`}
              >
                {/* Top */}
                <div className="flex items-start justify-between">

                 <span className={`text-xs font-medium tracking-widest ${
  isDarkCard ? "text-white/60" : "text-[#92998C]"
}`}>
  {service.number}
</span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#548B43] transition-all duration-300 group-hover:bg-[#B9E77B] group-hover:text-[#263A20]">
                    <Icon size={21} strokeWidth={1.7} />
                  </div>

                </div>

                {/* Bottom */}
                <div className="mt-12">

                  <div className="flex items-center justify-between gap-3">

                   <h3 className={`text-xl font-semibold tracking-tight sm:text-[22px] ${
  isDarkCard ? "text-white" : "text-[#20251E]"
}`}>
  {service.title}
</h3>

                 <ArrowUpRight
  size={19}
  className={`shrink-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 ${
    isDarkCard
      ? "text-white/70 group-hover:text-[#C7F23A]"
      : "text-[#8B9585] group-hover:text-[#548B43]"
  }`}
/>

                  </div>

                  <p className={`mt-3 max-w-[310px] text-sm leading-7 ${
  isDarkCard ? "text-white/75" : "text-[#737A70]"
}`}>
  {service.description}
</p>

                </div>

              </article>
            );
          })}

        </div>

      </div>
      </div>
    </section>
  );
}
