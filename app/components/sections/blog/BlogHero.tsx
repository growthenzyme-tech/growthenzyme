
import { ArrowDown, Sparkles } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-[#29382F] px-6 pb-16 pt-32 md:px-12 md:pb-20 lg:px-20">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-20 -top-28 h-[380px] w-[380px] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-10 -top-16 h-[280px] w-[280px] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-32 left-[15%] h-[300px] w-[300px] rounded-full bg-[#B6CBA9]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#B6CBA9]">
          <Sparkles size={14} />
          GrowthEnzyme Journal
        </div>

        <div className="mt-8 text-center">
          <h1
            className="text-6xl tracking-tight text-[#FFFDF8] sm:text-7xl md:text-8xl"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
          >
            The <span className="italic text-[#B6CBA9]">Blog.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-xs leading-6 tracking-[0.12em] text-white/65 md:text-sm">
            IDEAS, INSIGHTS AND STRATEGIES TO HELP YOUR BUSINESS
            GROW IN THE DIGITAL WORLD.
          </p>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-white/20 pt-5">
          <p className="text-xs text-white/65">
            Explore ideas. Discover possibilities. Grow better.
          </p>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-[#B6CBA9]">
            <ArrowDown size={16} />
          </div>
        </div>
      </div>
    </section>
  );
}
