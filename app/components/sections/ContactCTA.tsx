import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative isolate -mt-px flex min-h-[480px] w-full items-center justify-center overflow-hidden border-0 bg-white px-5 py-20 text-[#29382F] sm:min-h-[540px] sm:py-24 lg:min-h-[590px]"
    >
      {/* ORGANIC SCULPTURAL BACKGROUND */}
   {/* SYMMETRICAL ORGANIC WAVE BACKGROUND */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
>
  <svg
    viewBox="0 0 1440 600"
    preserveAspectRatio="none"
    className="h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Warm background atmosphere */}
      <linearGradient id="contactAtmosphere" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFDF8" />
        <stop offset="100%" stopColor="#F4F7F0" />
      </linearGradient>

      {/* Main organic green surface */}
      <linearGradient id="organicSurface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D3E2C8" />
        <stop offset="45%" stopColor="#B6CBA9" />
        <stop offset="100%" stopColor="#91AA80" />
      </linearGradient>

      {/* Sculptural depth */}
      <linearGradient id="organicDepth" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#829C75" />
        <stop offset="100%" stopColor="#29382F" />
      </linearGradient>

      {/* Soft shadow */}
      <filter id="organicShadow" x="-25%" y="-25%" width="150%" height="160%">
        <feGaussianBlur stdDeviation="18" />
      </filter>

      {/* Soft contour blur */}
      <filter id="organicSoftEdge" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" />
      </filter>

      {/* Subtle surface highlight */}
      <linearGradient id="organicHighlight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      {/* ONE ORGANIC WAVE — reused on both sides */}
      <g id="organicWave">
        {/* Shadow */}
        <path
          d="
            M1440 28
            C1375 72 1352 133 1310 192
            C1264 258 1207 294 1142 336
            C1070 382 1025 431 974 486
            C936 528 895 567 842 600
            L1440 600 Z
          "
          fill="#29382F"
          opacity="0.18"
          transform="translate(0 14)"
          filter="url(#organicShadow)"
        />

        {/* Main flowing surface */}
        <path
          d="
            M1440 28
            C1375 72 1352 133 1310 192
            C1264 258 1207 294 1142 336
            C1070 382 1025 431 974 486
            C936 528 895 567 842 600
            L1440 600 Z
          "
          fill="url(#organicSurface)"
        />

        {/* Surface highlight */}
        <path
          d="
            M1440 28
            C1375 72 1352 133 1310 192
            C1264 258 1207 294 1142 336
            C1070 382 1025 431 974 486
            C936 528 895 567 842 600
            L1440 600 Z
          "
          fill="url(#organicHighlight)"
          opacity="0.7"
        />

        {/* Secondary flowing contour */}
        <path
          d="
            M1440 145
            C1360 184 1325 250 1260 305
            C1190 365 1120 393 1064 454
            C1018 505 974 556 922 600
          "
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          opacity="0.32"
          filter="url(#organicSoftEdge)"
        />

        {/* Fine contour lines */}
        <g
          fill="none"
          stroke="#FFFDF8"
          strokeWidth="1.5"
          opacity="0.38"
        >
          <path
            d="
              M1440 115
              C1340 150 1310 220 1235 280
              C1150 348 1065 375 1010 448
            "
          />

          <path
            d="
              M1440 155
              C1350 188 1325 258 1250 315
              C1170 375 1090 403 1040 470
            "
          />

          <path
            d="
              M1440 195
              C1365 224 1340 287 1270 343
              C1200 398 1125 429 1075 490
            "
          />
        </g>

        {/* Outer curve highlight */}
        <path
          d="
            M1440 28
            C1375 72 1352 133 1310 192
            C1264 258 1207 294 1142 336
            C1070 382 1025 431 974 486
          "
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          opacity="0.42"
        />
      </g>
    </defs>

    {/* Background */}
    <rect
      width="1440"
      height="600"
      fill="url(#contactAtmosphere)"
    />

    {/* LEFT WAVE — mirrored version */}
    <use
      href="#organicWave"
      transform="translate(1440 0) scale(-1 1)"
    />

    {/* RIGHT WAVE — original version */}
    <use href="#organicWave" />
  </svg>
</div>

      {/* OVERSIZED BACKGROUND TYPOGRAPHY */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] w-full -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center text-[clamp(9rem,29vw,28rem)] font-black leading-none tracking-[-0.09em] text-[#29382F]/[0.035]"
      >
        GROWTH
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 top-6 mx-auto flex w-full max-w-[1400px] flex-col items-center text-center">
        {/* Label */}
        <Link
          href="#contact"
          className="inline-flex items-center rounded-full border border-[#29382F]/70 bg-[#FFFDF8]/80 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#29382F] transition-colors duration-300 hover:bg-[#29382F] hover:text-[#FFFDF8] sm:text-xs"
        >
          Get in touch
        </Link>

        {/* Heading */}
        <h2 className="mt-7 text-[clamp(3.2rem,9vw,7rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-[#29382F]">
          Ready to{" "}
          <span className="relative -top-[2px] mt-2 inline-block rounded-full bg-[#29382F] px-6 py-2.5 text-white sm:mt-3 sm:px-8 sm:py-3">
            grow?
          </span>
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-[650px] text-sm font-medium leading-7 text-[#506B59] sm:mt-8 sm:text-base lg:text-lg">
          Let&apos;s talk about what&apos;s possible for your brand.
          No fluff, just growth.
        </p>

        {/* CTA BUTTON */}
        <Link
          href="mailto:hello@growthenzyme.com"
          className="group mt-8 inline-flex w-full items-center justify-between overflow-hidden rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] p-[4px] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.18),inset_0_2px_3px_rgba(255,255,255,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.2)] active:translate-y-1 active:shadow-[0_2px_0_#6F9259] sm:w-auto"
        >
          <span className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2.5 text-sm font-bold text-[#29382F] sm:gap-5 sm:px-5 sm:py-3.5">
            Start the Conversation

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/50 bg-white/35 shadow-[inset_0_1px_3px_rgba(255,255,255,0.7)]">
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}