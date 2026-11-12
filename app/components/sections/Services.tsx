
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

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-[#B6CBA9]/30 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#506B59] sm:text-xs">
            What We Do
          </span>

          <h2 className="mt-5 text-4xl font-bold uppercase leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Our{" "}
               <span className="mt-2 inline-block whitespace-nowrap rounded-full bg-[#29382F] px-5 py-2 text-white sm:px-8">
      Services
    </span>

          </h2>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#506B59] sm:text-sm">
            Take your business to the next level
          </p>
        </div>

        {/* Dashed Divider */}
        <div className="relative my-10 flex items-center">
          <div className="w-full border-t border-dashed border-[#506B59]/45" />
          <span className="absolute left-0 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#D78359]">
            ✳
          </span>
          <span className="absolute right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#D78359]">
            ✳
          </span>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">

          {services.map((service, index) => {
            const Icon = service.Icon;

            return (
              <article
                key={service.number}
                className={`group relative flex min-h-[260px] flex-col items-center border border-[#29382F]/10 ${service.card} px-3 pb-6 pt-7 shadow-[0_12px_25px_rgba(41,56,47,0.08)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_30px_rgba(41,56,47,0.14)] sm:min-h-[290px] lg:min-h-[350px]`}
                style={{
                  marginTop: index % 2 === 1 ? "22px" : "0px",
                }}
              >
                {/* Hanging Top Detail */}
                <div className="absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2 bg-[#E8D9C5] shadow-sm" />

                {/* Service Number */}
                <span className={`absolute left-3 top-4 text-[9px] font-bold tracking-widest ${service.metaColor}`}>
                  {service.number}
                </span>

                {/* Icon */}
                <div className={`mt-5 flex h-12 w-12 items-center justify-center rounded-full ${service.iconBg} ${service.iconColor} shadow-sm transition-all duration-300 group-hover:scale-110`}>
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                {/* Mobile / Tablet Content */}
                <div className="mt-5 text-center lg:hidden">
                  <h3 className={`text-sm font-bold leading-5 sm:text-base ${service.titleColor}`}>
                    {service.title}
                  </h3>
                  <p className={`mt-3 text-xs leading-6 ${service.descColor}`}>
                    {service.description}
                  </p>
                </div>

                {/* Desktop Vertical Title */}
                <div className="mt-7 hidden flex-1 items-center justify-center lg:flex">
                  <h3
                    className={`whitespace-nowrap text-sm font-bold tracking-wide ${service.titleColor}`}
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {service.shortTitle}
                  </h3>
                </div>

                {/* Bottom Accent */}
                <div className={`mt-auto flex w-full items-center justify-center border-t border-dashed border-current/30 pt-4`}>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${service.titleColor}`}>
                    Explore
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="ml-2 text-[#D78359] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </article>
            );
          })}

        </div>

        {/* Bottom Message */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-[#29382F]/15 pt-7 sm:flex-row">
          <p className="max-w-lg text-center text-sm leading-7 text-[#506B59] sm:text-left">
            Every service works together to create meaningful digital growth
            for your business.
          </p>

        <a
  href="#contact"
  className="group inline-flex items-center overflow-hidden rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] p-[4px] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.18),inset_0_2px_3px_rgba(255,255,255,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.2)] active:translate-y-1 active:shadow-[0_2px_0_#6F9259]"
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

      </div>
    </section>
  );
}
