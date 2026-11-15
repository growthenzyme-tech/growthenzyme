
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      id="contact"
    className="relative z-10 isolate -mt-px flex min-h-[560px] w-full items-center justify-center overflow-hidden border-0 bg-white px-5 pt-28 pb-20 text-[#29382F] sm:min-h-[640px] sm:px-5 sm:pt-32 sm:pb-24 lg:min-h-[720px] lg:pt-36"
    style={{ transform: "translateY(32px)", marginBottom: "-32px" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[34px] z-30 h-9 bg-white"
      />

      {/* LARGE ASYMMETRICAL GREEN BACKGROUND SHAPE */}
      
{/* REFINED GREEN SHAPE — LEFT SIDE */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute -left-[24%] top-1/2 z-0 h-[90%] w-[88%] -translate-y-1/2 overflow-visible sm:-left-[19%] sm:h-[100%] sm:w-[85%] lg:-left-[17%] lg:h-[112%] lg:w-[82%] mt-10"
  style={{
    WebkitMaskImage:
      "linear-gradient(to bottom, transparent 0%, black 28%, black 100%)",
    maskImage:
      "linear-gradient(to bottom, transparent 0%, black 28%, black 100%)",
  }}
>
  {/* Rotate independently of the fade */}
  <div className="absolute inset-0 rotate-[-90deg]">
    <svg
      viewBox="0 0 700 700"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full overflow-visible"
    >
      <defs>
        {/* Sage green gradient */}
        <linearGradient
          id="contactShapeGradient"
          x1="0"
          y1="0"
          x2="700"
          y2="700"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#D3E2C8" />
          <stop offset="45%" stopColor="#B6CBA9" />
          <stop offset="100%" stopColor="#91AA80" />
        </linearGradient>

        {/* Soft shadow */}
        <filter
          id="contactShapeShadow"
          x="-20%"
          y="-20%"
          width="145%"
          height="145%"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Refined shape shadow */}
     <path
  d="
    M230 0
    H680
    Q700 0 700 20
    V390
    C700 565 565 700 390 700
    H0
    V300
C700 520 520 700 300 700
    Z
  "
  fill="#29382F"
  opacity="0.15"
  transform="translate(0 12)"
  filter="url(#contactShapeShadow)"
/>

      {/* Main smooth shape */}
  <path
  d="
    M230 0
    H680
    Q700 0 700 20
    V300
    C700 520 520 700 300 700
    H0
    V230
    C0 103 103 0 230 0
    Z
  "
  fill="url(#contactShapeGradient)"
/>

      {/* Subtle upper edge highlight */}
      <path
        d="M230 2 H680 Q698 2 698 20"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        opacity="0.3"
      />
    </svg>
  </div>
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
      <h2 className="mt-7 text-[clamp(2.8rem,7vw,5.5rem)] font-semibold uppercase leading-[0.98] tracking-[-0.065em] text-[#29382F]">
  Ready to{" "}
  <span className="relative -top-[2px] mt-2 inline-block rounded-full bg-[#29382F] px-5 py-2 text-[0.85em] text-white sm:mt-3 sm:px-7 sm:py-2.5">
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
