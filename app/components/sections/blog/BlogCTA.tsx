
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function BlogCTA() {
  return (
    <section className="bg-[#29382F] px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B6CBA9]">
            Ready to grow?
          </p>

          <h2
            className="max-w-2xl text-4xl leading-tight text-[#FFFDF8] sm:text-5xl md:text-6xl"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
          >
            Let's create something
            <span className="italic text-[#B6CBA9]"> meaningful.</span>
          </h2>
        </div>

        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center gap-4 bg-[#B6CBA9] px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#29382F] transition hover:bg-[#FFFDF8]"
        >
          Let's Talk
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
