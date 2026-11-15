
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
        className="pointer-events-none absolute left-0 top-0 z-10 w-full select-none overflow-hidden leading-none -translate-y-[1px]"
      >
        <svg
          viewBox="0 0 1024 320"
          preserveAspectRatio="none"
          className="h-24 w-full sm:h-32 md:h-40 lg:h-48 xl:h-56"
        >
          <path
            d={MOUNTAIN_TOP_PATH}
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">

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
