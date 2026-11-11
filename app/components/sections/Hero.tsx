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
    <section className="relative isolate mx-auto w-full max-w-[1320px] overflow-hidden bg-[#101817] text-white">
      <div className="absolute inset-0 bottom-14 -z-10">
        <Image
          src="/images/hero-person.webp"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center grayscale brightness-[0.42]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101817]/95 via-[#101817]/75 to-[#101817]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101817]/75 via-transparent to-[#101817]/20" />
      </div>

      <div className="mx-auto flex min-h-[650px] w-full max-w-[1320px] items-center justify-center px-6 py-24 text-center sm:px-10 lg:min-h-[700px] lg:px-14">
        <div className="w-full max-w-[900px]">
          <div className="mb-8 inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
            {/* <span className="h-[2px] w-10 bg-[#C7F23A]" /> */}
            Digital Growth Agency
          </div>

          <h1 className="text-[clamp(3.5rem,8vw,7.25rem)] font-semibold leading-[0.95] tracking-[-0.07em]">
            We Catalyze
            <br />
            <span className="mt-2 inline-block rounded-full bg-[#C7F23A] px-5 py-1 text-[#101817] sm:px-8">
              Digital Growth.
            </span>
          </h1>

          <div className="mx-auto mt-8 flex max-w-[900px] flex-col items-center gap-8 sm:flex-row sm:justify-center">
            <p className="max-w-[430px] text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              We&apos;re a full-service digital growth agency — combining
              performance marketing, intelligent automation, and standout
              design to grow businesses that matter.
            </p>

          
          </div>
            <div className="flex shrink-0 flex-wrap items-center justify-center gap-4 mt-10">
              <Link
                href="#contact"
                className="group inline-flex items-center gap-4 rounded-full bg-[#C7F23A] px-6 py-4 text-sm font-semibold text-[#101817] transition-colors hover:bg-white"
              >
                Start Growing
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="#work"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#C7F23A]"
              >
                View Our Work
                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
        </div>
      </div>

      <div className="bg-[#C7F23A] text-[#101817]">
        <div className="mx-auto flex min-h-14 max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.1em] sm:px-10 sm:text-xs lg:px-14">
          {focusAreas.map((area) => (
            <div key={area} className="flex items-center gap-5">
              <span>{area}</span>
              <span aria-hidden="true" className="text-base leading-none">
                *
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
