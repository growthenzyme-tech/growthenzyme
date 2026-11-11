import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const focusAreas = [
  "Performance Marketing",
  "Business Automation",
  "Search Optimisation",
  "Brand Design",
  "Web Development",
];

export default function Hero() {
  return (
    <section className="relative isolate mx-auto w-full max-w-[1320px] overflow-hidden bg-[#F5F0E5] text-[#29382F]">

      {/* Hero Main Content */}
      <div className="relative mx-auto grid min-h-[660px] max-w-[1320px] items-center gap-10 px-6 py-16 sm:px-10 lg:min-h-[700px] lg:grid-cols-[1fr_0.95fr] lg:gap-8 lg:px-14">

        {/* Soft Background Decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-[-180px] h-[420px] w-[420px] rounded-full bg-[#A5B59F]/20 blur-3xl"
        />

        {/* LEFT CONTENT */}
        <div className="relative z-20 max-w-[660px] py-8 lg:py-12">

          {/* Label */}
          <div className="mb-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#506B59] ml-2">
          
            Digital Growth Agency
          </div>

          {/* Heading */}
          <h1 className="text-[clamp(3rem,5.4vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-[#29382F]">
            We Catalyze
            <br />

            <span className="mt-3 inline-block whitespace-nowrap rounded-full bg-[#A5B59F] px-5 py-2 text-[#29382F] sm:px-8">
              Digital Growth.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-9 max-w-[510px] text-base font-medium leading-8 text-[#667568] sm:text-lg sm:leading-9">
            We&apos;re a full-service digital growth agency — combining
            performance marketing, intelligent automation, and
            standout design to grow businesses that matter.
          </p>

          {/* CTA Buttons */}
        
{/* CTA Buttons */}
<div className="mt-10 flex flex-wrap items-center gap-5">

  {/* Primary Button */}
  <Link
    href="#contact"
    className="group inline-flex items-center overflow-hidden rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] p-[4px] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.18),inset_0_2px_3px_rgba(255,255,255,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.2)] active:translate-y-1 active:shadow-[0_2px_0_#6F9259]"
  >
    <span className="flex items-center gap-5 rounded-lg px-6 py-3.5 text-sm font-bold text-[#29382F]">
      Start Growing

      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/50 bg-white/35 shadow-[inset_0_1px_3px_rgba(255,255,255,0.7)]">
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </span>
  </Link>

  {/* Secondary Button */}
  <Link
    href="#work"
    className="group inline-flex items-center overflow-hidden rounded-xl border border-[#E5E4DC] bg-gradient-to-b from-white to-[#E9E9E3] p-[4px] shadow-[0_5px_0_#C5C5BC,0_9px_18px_rgba(41,56,47,0.13),inset_0_2px_3px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#C5C5BC,0_12px_22px_rgba(41,56,47,0.16)] active:translate-y-1 active:shadow-[0_2px_0_#C5C5BC]"
  >
    <span className="flex items-center gap-5 rounded-lg px-6 py-3.5 text-sm font-bold text-[#29382F]">
      View Our Work

      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DADBD2] bg-[#F5F5EF] shadow-[inset_0_1px_3px_rgba(255,255,255,0.9)]">
        <ArrowUpRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </span>
  </Link>

</div>

        </div>

        {/* RIGHT IMAGE FRAME */}
     
{/* RIGHT SIDE - MAIN FRAME WITH OVERFLOW IMAGE */}
<div className="relative mx-auto mt-10 h-[350px] w-full max-w-[420px] overflow-visible lg:ml-auto lg:mr-0 lg:mt-0 lg:h-[440px]">

  {/* Sage backing */}
  <div
    aria-hidden="true"
    className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-[#A5B59F]"
  />

  {/* Existing Main Frame */}
  <div className="absolute inset-0 overflow-hidden rounded-[2rem] border-[8px] border-[#FFFDF8] bg-[#A5B59F] shadow-[0_25px_55px_rgba(41,56,47,0.18)]">

    <Image
      src="/images/growthenzyme-hero.png"
      alt="Botanical foliage and organic natural textures"
      fill
      priority
      sizes="(max-width: 1024px) 100vw, 40vw"
      className="object-cover object-center"
    />

    <div className="absolute inset-0 bg-[#A5B59F]/15 mix-blend-color" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#29382F]/20 via-transparent to-white/10" />

  </div>

  {/* Transparent sculpture overlaps the frame and rises above its top edge */}
  <Image
    src="/images/growthenzyme-hero.png"
    alt="Sculptural botanical illustration representing growth"
    width={373}
    height={669}
    priority
    sizes="(max-width: 1024px) 65vw, 30vw"
    className="pointer-events-none absolute left-1/2 top-[-38%] z-20 h-[145%] w-auto max-w-none -translate-x-1/2 object-contain"
  />

  {/* Terracotta floating detail */}
  <div className="absolute bottom-8 left-[-6%] z-30 flex items-center gap-3 rounded-full border border-[#F5F0E5]/70 bg-[#D78359] px-5 py-3 text-xs font-semibold tracking-wide text-[#FFF9EF] shadow-[0_12px_25px_rgba(41,56,47,0.2)]">
    <span className="h-2 w-2 rounded-full bg-[#FFF9EF]" />
    Ideas into Impact
  </div>

  {/* Small decorative accent */}
  <div className="absolute -right-3 top-[45%] z-30 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#F5F0E5] bg-[#506B59] text-xl text-[#F5F0E5] shadow-lg">
    ✳
  </div>

</div>

      </div>

      {/* SERVICES TICKER */}
      <div className="bg-[#A5B59F] text-[#29382F]">
        <div className="mx-auto flex min-h-16 max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.1em] sm:px-10 sm:text-xs lg:px-14">

          {focusAreas.map((area, index) => (
            <div key={area} className="flex items-center gap-5">
              <span>{area}</span>

              {index !== focusAreas.length - 1 && (
                <span
                  aria-hidden="true"
                  className="text-lg leading-none text-[#D78359]"
                >
                  ✳
                </span>
              )}
            </div>
          ))}

        </div>
      </div>

    </section>
  );
}