import Image from "next/image";
import Link from "next/link";

const services = [
  { name: "Performance Marketing", href: "#services" },
  { name: "SEO", href: "#services" },
  { name: "Web Design", href: "#services" },
  { name: "Automation", href: "#services" },
  { name: "Creatives", href: "#services" },
  { name: "Video", href: "#services" },
];

const socials = [
  { name: "LinkedIn", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "Facebook", href: "#" },
  { name: "Threads", href: "#" },
  { name: "X (Twitter)", href: "#" },
];

// Smooth even waves. The first and last points sit OUTSIDE 0–1440,
// so the ends are cut cleanly by the screen edge (no kink / no slope).
const WAVE_POINTS: [number, number][] = [
  [-160, 80], [20, 42], [220, 84], [430, 46], [640, 90],
  [850, 50], [1060, 92], [1260, 54], [1460, 94], [1620, 56],
];

// Catmull-Rom → Bezier (smooth curve through every point)
const TOP_WAVE_PATH = (() => {
  const p = WAVE_POINTS;
  const f = (n: number) => n.toFixed(1);
  let d = `M-160 0L${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(
      p2[0] - (p3[0] - p1[0]) / 6
    )} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return `${d}L1620 0Z`;
})();




const STEPPED_POINTS = "58,0 201,0 201,134 142,134 142,187 0,187 0,54 58,54";

function SteppedOutline({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 201 187"
      className={`pointer-events-none absolute ${className}`}
      fill="none"
    >
      <polygon
        points={STEPPED_POINTS}
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polygon
        points="70,14 187,14 187,120 130,120 130,173 14,173 14,66 70,66"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-20 w-full overflow-hidden bg-[#B6CBA9] text-[#29382F]">

      {/* TOP WAVE SHAPE */}
      {/* TOP WAVE SHAPE */}


{/* LAYERED ORGANIC TOP WAVE */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[110px] overflow-hidden sm:h-[160px] lg:h-[220px]"
>
  <svg
    viewBox="0 0 1440 240"
    preserveAspectRatio="none"
    className="block h-full w-full"
  >
    {/* BACK WAVE */}
    <path
      d={TOP_WAVE_PATH}
      transform="translate(0 24)"
      fill="#FFFFFF"
      opacity="0.35"
    />

    {/* FRONT WAVE */}
    <path
      d={TOP_WAVE_PATH}
      fill="#FFFFFF"
    />
  </svg>
</div>



      {/* DECORATIVE WHITE FRAMES + CIRCLES */}


      <div className="relative z-10 mx-auto max-w-[1500px] px-6 pb-8 pt-24 sm:px-10 sm:pt-32 lg:px-14 lg:pb-10 lg:pt-40">

        {/* WHITE FRAME CARD */}
        <div className="relative rounded-[2rem] bg-white p-3 shadow-[0_8px_0_#8FA68B,0_24px_48px_rgba(41,56,47,0.18)] sm:rounded-[2.5rem] sm:p-4">

          {/* inner dashed frame */}
          <div className="rounded-[1.5rem] border border-dashed border-[#29382F]/20 p-6 sm:rounded-[2rem] sm:p-10 lg:p-12">

            {/* FOOTER MAIN CONTENT */}
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.7fr_0.45fr_0.35fr] lg:gap-16">

              {/* BRAND & CONTACT */}
              <div className="flex flex-col items-start">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-4">
                  <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-[#B6CBA9] sm:h-[90px] sm:w-[90px]">
                    <Image
                      src="/images/logo.png"
                      alt="GrowthEnzyme logo"
                      width={90}
                      height={90}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.07em] text-[#243B2D]">
                    Growth Enzyme
                  </span>
                </Link>

                <h2 className="mt-8 text-xl font-semibold tracking-tight text-[#29382F] sm:text-2xl">
                  Catalyzing Digital Growth
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#405C48] sm:text-base">
                  A full-service digital growth agency.
                </p>

                {/* Contact Details */}
                <div className="mt-7 flex flex-col items-start gap-3">
                  <h3 className="text-base font-bold text-[#243B2D]">
                    Contact
                  </h3>

                  <a
                    href="mailto:contact@growthenzyme.com"
                    className="rounded-full bg-[#EEF3EA] px-4 py-2 text-sm text-[#405C48] transition-colors duration-300 hover:bg-[#29382F] hover:text-white sm:text-base"
                  >
                    contact@growthenzyme.com
                  </a>

                  <a
                    href="tel:+918807457959"
                    className="rounded-full bg-[#EEF3EA] px-4 py-2 text-sm text-[#405C48] transition-colors duration-300 hover:bg-[#29382F] hover:text-white sm:text-base"
                  >
                    +91 88074 57959
                  </a>
                </div>
              </div>

              {/* SERVICES */}
              <div className="relative lg:border-l lg:border-[#29382F]/10 lg:pl-10 lg:pt-2">
                <span
                  aria-hidden="true"
                  className="mb-3 block h-1 w-10 rounded-full bg-[#D78359]"
                />
                <h3 className="mb-7 text-base font-bold text-[#243B2D]">
                  Services
                </h3>

                <ul className="flex flex-col gap-5">
                  {services.map((service) => (
                    <li key={service.name}>
                      <Link
                        href={service.href}
                        className="text-sm text-[#405C48] transition-all duration-300 hover:translate-x-1 hover:text-[#17291F] sm:text-base"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SOCIALS */}
              <div className="relative lg:border-l lg:border-[#29382F]/10 lg:pl-10 lg:pt-2">
                <span
                  aria-hidden="true"
                  className="mb-3 block h-1 w-10 rounded-full bg-[#D78359]"
                />
                <h3 className="mb-7 text-base font-bold text-[#243B2D]">
                  Socials
                </h3>

                <ul className="flex flex-col gap-5">
                  {socials.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#405C48] transition-all duration-300 hover:translate-x-1 hover:text-[#17291F] sm:text-base"
                      >
                        {social.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* COPYRIGHT PILL */}
        <div className="mt-10 flex items-center justify-center gap-4 sm:mt-12">
          <span aria-hidden="true" className="hidden h-px flex-1 bg-white/60 sm:block" />
          <p className="rounded-full bg-white px-6 py-3 text-center text-xs text-[#405C48] shadow-[0_4px_0_#8FA68B] sm:text-sm">
            © {new Date().getFullYear()} Growth Enzyme. All rights reserved.
          </p>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-white/60 sm:block" />
        </div>

      </div>
    </footer>
  );
}