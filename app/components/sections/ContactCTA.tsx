
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative isolate -mt-px flex min-h-[480px] w-full items-center justify-center overflow-hidden border-0 bg-white px-5 py-20 text-[#29382F] sm:min-h-[540px] sm:py-24 lg:min-h-[590px]"
    >

{/* 3D DIAGONAL BACKGROUND */}
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
      {/* Main green surface */}
      <linearGradient id="diagonalSurface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C9DDBB" />
        <stop offset="50%" stopColor="#B6CBA9" />
        <stop offset="100%" stopColor="#93AD82" />
      </linearGradient>

      {/* Dark 3D extrusion */}
      <linearGradient id="diagonalDepth" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#718B66" />
        <stop offset="100%" stopColor="#29382F" />
      </linearGradient>

      {/* Diagonal shadow */}
      <filter id="diagonalShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="12" />
      </filter>

      {/* Feathered diagonal fade */}
<linearGradient id="diagonalFade" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
  <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.12" />
  <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.5" />
  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
</linearGradient>

<filter id="softDiagonalBlur" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur stdDeviation="14" />
</filter>
    </defs>

    {/* Soft shadow behind the diagonal */}
    <path
      d="M1440 0 L1440 600 L0 600 Z"
      fill="#29382F"
      opacity="0.16"
      transform="translate(0 12)"
      filter="url(#diagonalShadow)"
    />

    {/* 3D EXTRUDED SIDE */}
    <path
      d="M1440 0 L1440 600 L0 600 L18 582 L1422 -18 Z"
      fill="url(#diagonalDepth)"
      opacity="0.95"
    />

    {/* MAIN DIAGONAL FACE */}
    <path
      d="M1440 0 L1440 600 L0 600 Z"
      fill="url(#diagonalSurface)"
    />

{/* SOFT FEATHERED DIAGONAL TRANSITION */}
<path
  d="M1440 0 L0 600"
  fill="none"
  stroke="#FFFFFF"
  strokeWidth="95"
  opacity="0.65"
  filter="url(#softDiagonalBlur)"
/>

{/* SUBTLE FADE OVER THE GREEN SURFACE */}
<path
  d="M1440 0 L1440 600 L0 600 Z"
  fill="url(#diagonalFade)"
  opacity="0.45"
/>
    {/* Fine highlight along the diagonal */}
    <path
      d="M1440 0 L0 600"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      opacity="0.55"
    />

    {/* Subtle lower edge highlight */}
    <path
      d="M0 600 L1440 600"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      opacity="0.3"
    />
  </svg>
</div>

{/* OVERSIZED BACKGROUND TYPOGRAPHY */}
{/* ORIGINAL DARK BACKGROUND TYPOGRAPHY */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute left-1/2 top-1/2 z-[1] w-full -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center text-[clamp(9rem,29vw,28rem)] font-black leading-none tracking-[-0.09em] text-[#29382F]/[0.035]"
>
  GROWTH
</div>

{/* WHITE TYPOGRAPHY ON THE GREEN DIAGONAL */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-[2] overflow-hidden [clip-path:polygon(100%_0,100%_100%,0_100%)]"
>
  <div
    className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center text-[clamp(9rem,29vw,28rem)] font-black leading-none tracking-[-0.09em] text-[#29382F]/[0.10]"
  >
    GROWTH
  </div>
</div>


      {/* Main Content */}
      <div className="relative z-10 top-6 mx-auto flex w-full max-w-[1400px] flex-col items-center text-center">

        {/* Label */}
        <Link
          href="#contact"
          className="inline-flex items-center rounded-full border border-[#29382F]/70 bg-[#FFFDF8]/80 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#29382F] transition-colors duration-300 hover:bg-[#29382F] hover:text-[#FFFDF8] sm:text-xs"
        >
          Get in touch
        </Link>

        {/* Heading */}
       {/* HEADING */}
<h2 className="mt-7 text-[clamp(3.2rem,9vw,7rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-[#29382F]">
 Ready to <span className="relative -top-[2px] mt-2 inline-block rounded-full bg-[#29382F] px-6 py-2.5 text-white sm:mt-3 sm:px-8 sm:py-3">
  grow?
</span>
</h2>

        {/* Description */}
        <p className="mt-6 max-w-[650px] text-sm font-medium leading-7 text-[#506B59] sm:mt-8 sm:text-base lg:text-lg">
          Let&apos;s talk about what&apos;s possible for your brand.
          No fluff, just growth.
        </p>

        {/* CTA Button */}
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

      {/* WHITE TEXT OVERLAY ON GREEN DIAGONAL */}

    </section>
  );
}
