
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
    <section className="relative isolate mx-auto mt-20 w-full max-w-full overflow-hidden bg-[#B6CBA9] text-[#29382F]">

      {/* Hero Main Content */}
      <div className="relative mx-auto grid min-h-0 max-w-[1320px] items-center gap-7 px-5 py-9 sm:gap-8 sm:px-8 sm:py-12 lg:min-h-[700px] lg:grid-cols-[1fr_0.95fr] lg:gap-8 lg:px-14 lg:py-16">

        {/* Soft Background Decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-[-180px] h-[420px] w-[420px] rounded-full bg-[#A5B59F]/20 blur-3xl"
        />

        {/* LEFT CONTENT */}
        <div className="relative z-20 mx-auto w-full max-w-[660px] py-1 sm:py-5 lg:mx-0 lg:py-12">

          {/* Label */}
          <div className="mb-5 ml-0 inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#2F4A39] sm:mb-7 sm:ml-2 sm:text-xs sm:tracking-[0.22em] lg:mb-8">
            Digital Growth Agency
          </div>

          {/* Heading */}
          <h1 className="text-[clamp(2.6rem,11vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-[#29382F] sm:text-[clamp(3.5rem,9vw,5rem)] lg:text-[clamp(3rem,5.4vw,5.6rem)] lg:leading-[0.98]">
            We Catalyze
            <br />

            <span className="mt-2 -ml-2 inline-block whitespace-nowrap rounded-full bg-[#29382F] px-4 py-2.5 text-white sm:-ml-4 sm:mt-3 sm:px-8 lg:-ml-7">
              Digital Growth.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[510px] text-[13px] font-medium leading-6 text-[#29382F]/85 sm:mt-7 sm:text-base sm:leading-8 lg:mt-9 lg:text-lg lg:leading-9">
            We&apos;re a full-service digital growth agency — combining
            performance marketing, intelligent automation, and
            standout design to grow businesses that matter.
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:mt-10 lg:gap-5">

            {/* Primary Button */}
            <Link
              href="#contact"
              className="group inline-flex w-full items-center justify-between overflow-hidden rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] p-[4px] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.18),inset_0_2px_3px_rgba(255,255,255,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.2)] active:translate-y-1 active:shadow-[0_2px_0_#6F9259] sm:w-auto"
            >
              <span className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2.5 text-sm font-bold text-[#29382F] sm:gap-5 sm:px-5 sm:py-3.5">
                Start Growing

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/50 bg-white/35 shadow-[inset_0_1px_3px_rgba(255,255,255,0.7)]">
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
              className="group inline-flex w-full items-center justify-between overflow-hidden rounded-xl border border-[#E5E4DC] bg-gradient-to-b from-white to-[#E9E9E3] p-[4px] shadow-[0_5px_0_#C5C5BC,0_9px_18px_rgba(41,56,47,0.13),inset_0_2px_3px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#C5C5BC,0_12px_22px_rgba(41,56,47,0.16)] active:translate-y-1 active:shadow-[0_2px_0_#C5C5BC] sm:w-auto"
            >
              <span className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2.5 text-sm font-bold text-[#29382F] sm:gap-5 sm:px-5 sm:py-3.5">
                View Our Work

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DADBD2] bg-[#F5F5EF] shadow-[inset_0_1px_3px_rgba(255,255,255,0.9)]">
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </span>
            </Link>

          </div>
        </div>

        {/* RIGHT SIDE - MAIN FRAME WITH OVERFLOW IMAGE */}
        <div className="relative mx-auto mt-5 h-[250px] w-full max-w-[290px] overflow-visible sm:mt-8 sm:h-[305px] sm:max-w-[360px] lg:ml-auto lg:mr-0 lg:mt-0 lg:h-[355px] lg:max-w-[390px]">

          {/* Sage backing */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[1.5rem] bg-[#A5B59F] sm:translate-x-3.5 sm:translate-y-3.5 sm:rounded-[2rem]"
          />

          {/* Main Frame Card */}
          <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] border-[5px] border-[#FFFDF8] bg-[#F5F0E5] shadow-[0_25px_55px_rgba(41,56,47,0.18)] sm:rounded-[2rem] sm:border-[8px]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8] via-[#F7F3EB] to-[#ECE7DA]" />
          </div>

          {/* 4K 3D Smartphone with Glowing Data Dashboard, Upward Terracotta Growth Arrow, SEO & Web Design Wireframes */}
          <Image
            src="/images/hero-phone-growth-final.webp"
            alt="4K 3D flagship smartphone displaying Growth Matters analytics dashboard, upward terracotta growth arrow, web design wireframes, and SEO metrics"
            width={872}
            height={1024}
            priority
            quality={100}
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 70vw, 45vw"
            className="pointer-events-none absolute left-1/2 top-[-22%] z-20 h-[130%] w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_24px_46px_rgba(41,56,47,0.22)] sm:top-[-24%] sm:h-[132%] lg:top-[-24%] lg:h-[132%]"
          />

          {/* Terracotta floating detail */}
          <div className="absolute bottom-3.5 left-[-2%] z-30 flex items-center gap-2 rounded-full border border-[#F5F0E5]/70 bg-[#D78359] px-3.5 py-1.5 text-[10px] font-semibold tracking-wide text-[#FFF9EF] shadow-[0_12px_25px_rgba(41,56,47,0.2)] sm:bottom-5 sm:left-[-5%] sm:gap-3 sm:px-5 sm:py-2.5 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-[#FFF9EF]" />
            Ideas into Impact
          </div>

          {/* Small decorative accent */}
          <div className="absolute -right-2.5 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-[#F5F0E5] bg-[#506B59] text-sm text-[#F5F0E5] shadow-lg sm:-right-3.5 sm:h-11 sm:w-11 sm:border-4 sm:text-base">
            ✳
          </div>

        </div>
      </div>

      {/* SERVICES TICKER */}
      <div className="bg-[#A5B59F] text-[#29382F]">
        <div className="mx-auto flex min-h-14 max-w-[1320px] flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-4 text-[8px] font-bold uppercase tracking-[0.06em] sm:min-h-16 sm:gap-x-6 sm:gap-y-3 sm:px-10 sm:py-5 sm:text-xs sm:tracking-[0.1em] sm:justify-between lg:px-14">

          {focusAreas.map((area, index) => (
            <div key={area} className="flex items-center gap-2 sm:gap-5">
              <span>{area}</span>

              {index !== focusAreas.length - 1 && (
                <span
                  aria-hidden="true"
                  className="text-base leading-none text-[#D78359] sm:text-lg"
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
