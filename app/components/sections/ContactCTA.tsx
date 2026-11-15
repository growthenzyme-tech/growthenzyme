
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      id="contact"
    className="relative z-10 isolate -mt-px flex min-h-[560px] w-full items-center justify-center overflow-hidden border-0 bg-white px-5 pt-28 pb-20 text-[#29382F] sm:min-h-[640px] sm:px-5 sm:pt-32 sm:pb-24 lg:min-h-[720px] lg:pt-32"
    style={{ transform: "translateY(20px)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[34px] z-30 h-9 bg-white"
      />

      {/* LARGE ASYMMETRICAL GREEN BACKGROUND SHAPE */}
      
{/* REFINED GREEN SHAPE — LEFT SIDE */}
{/* ABSTRACT RIBBON WAVE BACKGROUND (no content) */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
>
  <svg
    viewBox="0 0 1440 600"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
  >
    <defs>
      <linearGradient id="rbG1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#EEF3EA" />
        <stop offset="1" stopColor="#B6CBA9" />
      </linearGradient>
      <linearGradient id="rbG2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#C9D9BF" />
        <stop offset="1" stopColor="#789474" />
      </linearGradient>
      <linearGradient id="rbG3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#91AA80" />
        <stop offset="1" stopColor="#405C48" />
      </linearGradient>
      <linearGradient id="rbG4" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#29382F" />
        <stop offset="0.55" stopColor="#405C48" />
        <stop offset="1" stopColor="#91AA80" stopOpacity="0.2" />
      </linearGradient>
    </defs>

    {/* white open area (delete this line to keep your own section bg) */}
    <rect width="1440" height="600" fill="#FFFFFF" />

    {/* pale arcs, bottom right */}
    <path d="M700 600C900 470 1200 430 1440 450V600Z" fill="#B6CBA9" opacity="0.14" />
    <path d="M800 600C1000 500 1250 480 1440 500V600Z" fill="#B6CBA9" opacity="0.16" />

    {/* ribbons: widest + lightest at the back */}
    <path d="M0 0H540C560 200 640 380 860 470C1040 545 1250 560 1440 535V600H0Z" fill="url(#rbG1)" opacity="0.7" />
    <path d="M0 0H440C440 210 520 360 760 470C960 555 1220 580 1440 560V600H0Z" fill="url(#rbG2)" opacity="0.5" />
    <path d="M0 0H300C280 230 380 380 620 490C860 590 1180 595 1440 585V600H0Z" fill="url(#rbG3)" opacity="0.3" />
    <path d="M0 0H150C110 250 220 420 470 520C720 610 1100 610 1440 600V600H0Z" fill="url(#rbG3)" opacity="0.25" />

    {/* crossing ribbons from the top-left */}
    <path d="M0 90C220 160 330 330 560 450C760 555 1000 540 1440 520L1440 560C1000 600 760 600 540 500C300 390 170 260 0 200Z" fill="#789474" opacity="0.22" />
    <path d="M0 220C160 250 280 380 480 470C680 560 960 560 1440 545L1440 580C960 610 640 600 440 510C260 430 140 340 0 330Z" fill="#405C48" opacity="0.18" />

    {/* fine light lines */}
    <g fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.45">
      <path d="M0 60C230 130 360 330 600 450C800 550 1050 545 1440 515" />
      <path d="M0 80C230 150 350 335 590 455C790 555 1040 552 1440 525" />
      <path d="M0 100C225 170 345 340 580 460C780 560 1030 560 1440 535" />
      <path d="M0 120C220 190 340 345 570 465C770 565 1020 568 1440 545" />
      <path d="M0 140C215 210 335 350 560 470C760 570 1010 576 1440 555" />
    </g>

    {/* fine dark lines */}
    <g fill="none" stroke="#29382F" strokeWidth="1" opacity="0.25">
      <path d="M60 0C60 250 200 430 480 520C760 600 1100 600 1440 590" />
      <path d="M90 0C85 250 220 430 500 525C780 605 1100 605 1440 592" />
      <path d="M120 0C110 250 240 430 520 530C800 610 1100 610 1440 594" />
    </g>

    {/* dark swoosh (crescent with pointed ends) */}
    <path
      d="M120 400C300 520 560 560 900 548C1120 540 1300 520 1440 505V530C1300 548 1120 575 900 585C600 596 330 560 120 400Z"
      fill="url(#rbG4)"
    />
    <path
      d="M300 505C560 575 900 560 1440 520V540C900 592 560 600 300 505Z"
      fill="#29382F"
      opacity="0.6"
    />
    <path
      d="M120 400C300 520 560 560 900 548C1120 540 1300 520 1440 505"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      opacity="0.35"
    />
  </svg>
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
