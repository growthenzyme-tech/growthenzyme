
import {
  Search,
  Lightbulb,
  TrendingUp,
  ChartNoAxesCombined,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Diagnose",
    description:
      "We audit your digital presence, channels, and competitors to find real growth gaps.",
    detail: "Audit & Growth Gaps",
    icon: Search,
  },
  {
    number: "02",
    title: "Strategise",
    description:
      "We build a custom, data-informed growth plan aligned to your business goals and timelines.",
    detail: "Planning & Strategy",
    icon: Lightbulb,
  },
  {
    number: "03",
    title: "Execute",
    description:
      "We build, launch, and manage every channel — no handoffs, no confusion.",
    detail: "Execution & Management",
    icon: TrendingUp,
  },
  {
    number: "04",
    title: "Optimise",
    description:
      "We track, test, and continuously improve based on real performance data.",
    detail: "Tracking & Improvement",
    icon: ChartNoAxesCombined,
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="mt-10 w-full overflow-hidden bg-transparent"
    >
      <div className="grid min-h-0 grid-cols-1 lg:min-h-[650px] lg:grid-cols-[0.85fr_1.15fr]">

        {/* LEFT — HEADING AREA */}
        <div className="flex flex-col justify-center bg-white px-6 py-12 sm:px-10 sm:py-14 lg:px-14 xl:px-20">

          <div className="ml-2 flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#506B59]">
              How We Work
            </span>
          </div>

          <h2 className="mt-6 max-w-[520px] text-[clamp(2.5rem,10vw,3.5rem)] font-bold uppercase leading-[0.98] tracking-[-0.065em] text-[#29382F] sm:text-6xl lg:text-7xl">
            Our process,
            <br />
            <span className="mt-2 -ml-2 inline-block rounded-full bg-[#29382F] px-4 py-2.5 text-white sm:mt-3 sm:px-7 sm:py-3">
              simplified.
            </span>
          </h2>

          <p className="mt-6 max-w-[390px] text-sm leading-7 text-[#657365] sm:text-base">
            We don&apos;t do guesswork. Every project follows a structured
            growth methodology designed to turn ideas into meaningful
            results.
          </p>

          <div className="mt-9 flex items-center gap-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#506B59]">
              Simple steps. Meaningful growth.
            </span>
          </div>
        </div>

        {/* RIGHT — GREEN BACKGROUND + RESPONSIVE CARD GRID */}
        <div className="relative isolate my-6 flex items-center overflow-hidden bg-[#B6CBA9] px-4 py-10 sm:my-8 sm:px-10 sm:py-12 lg:my-14 lg:px-12 lg:py-16 [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)]">

          {/* CURVED WHITE EDGE */}
          <div className="absolute -left-[110px] top-1/2 hidden h-[125%] w-[220px] -translate-y-1/2 rounded-[50%] bg-white lg:block" />

          {/* DECORATIVE CIRCLE */}
          <div className="pointer-events-none absolute -right-24 -top-32 h-[330px] w-[330px] rounded-full border border-[#506B59]/15 sm:-right-28 sm:-top-40 sm:h-[420px] sm:w-[420px]" />

          {/* PROCESS CARDS */}
          <div className="relative z-10 mx-auto grid w-full max-w-[570px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative flex h-full min-w-0 px-2 py-2"
                >
                  {/* DARK GREEN ROTATED BACKGROUND */}
<div
  aria-hidden="true"
  className="absolute inset-[5px] rotate-[-4deg] rounded-[1.5rem] bg-[#29382F]"
/>

                  {/* SAGE ACCENT LAYER */}
<div
  aria-hidden="true"
  className="absolute inset-2 rotate-[4deg] rounded-[1.5rem] bg-[#B6CBA9]"
/>

                  {/* MAIN WHITE CARD */}
                  <div className="relative z-10 flex min-h-[245px] flex-col items-center overflow-hidden rounded-[1.5rem] border border-[#29382F]/10 bg-[#FAFBF8] px-5 py-6 text-center shadow-[0_10px_25px_rgba(41,56,47,0.12)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_18px_35px_rgba(41,56,47,0.18)] sm:min-h-[285px] sm:px-6 sm:py-7">

                    {/* TOP LABEL */}
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#657365] sm:text-[10px]">
                      Our Process
                    </span>

                    {/* STEP NUMBER */}
                    <span className="mt-1 text-[32px] font-bold leading-none tracking-[-0.06em] text-[#29382F] sm:text-[40px]">
                      {step.number}
                    </span>

                    {/* ICON */}
                    <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EEE5] text-[#29382F] transition-all duration-300 group-hover:bg-[#29382F] group-hover:text-[#F5F0E5] sm:h-11 sm:w-11">
                      <Icon size={21} strokeWidth={1.6} />
                    </div>

                    {/* TITLE */}
                    <h3 className="mt-3 text-base font-bold uppercase leading-tight tracking-[-0.035em] text-[#29382F] sm:text-lg">
                      {step.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-2 max-w-[260px] text-[11px] leading-[1.6] text-[#657365] sm:text-xs sm:leading-5">
                      {step.description}
                    </p>

                    {/* BOTTOM DETAIL */}
                    <div className="mt-auto pt-4">
                      <span className="inline-block border-t border-[#29382F]/15 pt-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#506B59] sm:text-[9px]">
                        {step.detail}
                      </span>
                    </div>

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
