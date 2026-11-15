
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const MOUNTAIN_TOP_PATH =
  "M 0 0 L 1024 0 L 1023.0 204.0 C 1014.7 201.8, 986.3 193.8, 973.0 190.8 C 959.7 187.8, 949.7 187.5, 943.0 185.8 C 936.3 184.1, 940.7 186.2, 933.0 180.4 C 925.3 174.6, 906.7 158.1, 897.0 150.8 C 887.3 143.5, 891.7 141.0, 875.0 136.4 C 858.3 131.8, 817.7 127.1, 797.0 123.2 C 776.3 119.3, 762.5 116.0, 751.0 113.2 C 739.5 110.4, 732.3 107.7, 728.0 106.6 C 723.7 105.5, 727.2 105.8, 725.0 106.6 C 722.8 107.4, 726.7 102.8, 715.0 111.6 C 703.3 120.4, 666.8 150.1, 655.0 159.2 C 643.2 168.3, 646.8 164.7, 644.0 166.2 C 641.2 167.7, 645.8 166.8, 638.0 168.4 C 630.2 170.0, 607.3 175.1, 597.0 176.0 C 586.7 176.9, 594.7 172.2, 576.0 174.0 C 557.3 175.8, 503.7 184.8, 485.0 187.0 C 466.3 189.2, 470.3 187.9, 464.0 187.0 C 457.7 186.1, 453.8 186.0, 447.0 181.8 C 440.2 177.6, 428.3 165.8, 423.0 161.6 C 417.7 157.4, 417.8 158.1, 415.0 156.8 C 412.2 155.5, 411.3 154.8, 406.0 153.6 C 400.7 152.4, 389.7 151.2, 383.0 149.4 C 376.3 147.6, 380.3 150.5, 366.0 142.8 C 351.7 135.1, 311.2 110.9, 297.0 103.2 C 282.8 95.5, 284.8 97.8, 281.0 96.4 C 277.2 95.0, 277.2 95.1, 274.0 95.0 C 270.8 94.9, 267.5 95.1, 262.0 96.0 C 256.5 96.9, 259.0 95.3, 241.0 100.6 C 223.0 105.9, 178.7 123.3, 154.0 128.0 C 129.3 132.7, 104.2 128.0, 93.0 128.6 C 81.8 129.2, 89.7 129.7, 87.0 131.4 C 84.3 133.1, 82.3 134.1, 77.0 139.0 C 71.7 143.9, 60.2 156.1, 55.0 161.0 C 49.8 165.9, 55.2 166.9, 46.0 168.2 C 36.8 169.5, 7.7 168.9, 0.0 169.0 L 0 0 Z";

export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative z-10 isolate flex min-h-[580px] w-full flex-col items-center justify-center overflow-hidden bg-[#B6CBA9] px-5 pb-24 pt-36 text-[#29382F] sm:min-h-[660px] sm:px-8 sm:pb-32 sm:pt-44 lg:min-h-[720px] lg:pt-52"
    >
      {/* TOP MOUNTAIN / LANDSCAPE SILHOUETTE (WHITE SKY - NO DARK GREEN) */}
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

{/* WHITE FADE — TOP LEFT ONLY */}
{/* SMALL TOP FADE: only the top edge of the wave melts into white */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[70px] sm:h-[100px] lg:h-[130px]"
  style={{
    background:
      "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0.75) 30%, rgba(255,255,255,0.3) 65%, rgba(255,255,255,0) 100%)",
  }}
/>

</div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center text-center -mt-40">

        {/* Label */}
        <Link
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/20 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#29382F] shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-[#29382F] hover:text-[#FFFDF8] sm:px-5 sm:py-2.5 sm:text-xs"
        >
          <span className="h-2 w-2 rounded-full bg-[#D78359]" />
          Get in touch
        </Link>

        {/* Heading */}
        <h2 className="mt-7 text-[clamp(2.6rem,7.5vw,5.2rem)] font-bold uppercase leading-[0.98] tracking-[-0.065em] text-[#29382F]">
          Ready to{" "}
          <span className="relative -top-[2px] mt-2 inline-block rounded-full bg-[#29382F] px-6 py-2.5 text-[0.88em] text-white shadow-[0_8px_20px_rgba(41,56,47,0.18)] sm:mt-3 sm:px-8 sm:py-3">
            grow?
          </span>
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-[620px] text-[13px] font-medium leading-relaxed text-[#29382F]/80 sm:mt-8 sm:text-base sm:leading-8 lg:text-lg">
          Let&apos;s talk about what&apos;s possible for your brand.
          No fluff, just growth.
        </p>

        {/* CTA BUTTON */}
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
          <Link
            href="mailto:hello@growthenzyme.com"
            className="group inline-flex w-full items-center justify-between overflow-hidden rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] p-[4px] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.18),inset_0_2px_3px_rgba(255,255,255,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.2)] active:translate-y-1 active:shadow-[0_2px_0_#6F9259] sm:w-auto"
          >
            <span className="flex w-full items-center justify-between gap-4 rounded-lg px-5 py-3 text-sm font-bold text-[#29382F] sm:gap-5 sm:px-6 sm:py-3.5">
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

      </div>
    </section>
  );
}
