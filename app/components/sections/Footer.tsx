"use client";

import Image from "next/image";
import Link from "next/link";

const services = [
  { id: "01", name: "Performance Marketing", href: "#services" },
  { id: "02", name: "SEO", href: "#services" },
  { id: "03", name: "Web Design", href: "#services" },
  { id: "04", name: "Automation", href: "#services" },
  { id: "05", name: "Creatives", href: "#services" },
  { id: "06", name: "Video", href: "#services" },
];

const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/growth-enzyme/posts/" },
  { name: "Instagram", href: "https://www.instagram.com/growthenzyme/" },
  { name: "Facebook", href: "https://www.facebook.com/growthenzyme/" },
  { name: "Threads", href: "https://www.threads.net" },
  { name: "X (Twitter)", href: "https://x.com" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white text-[#173D32] px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-7 md:px-14 lg:px-20 lg:pt-11 lg:pb-8 xl:px-24">
      <div className="mx-auto max-w-[1480px]">
        {/* MAIN 2-COLUMN GRID (EDITORIAL LEFT + TALL ORGANIC ARCH CARD RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-12 xl:gap-16 items-stretch">

          {/* LEFT COLUMN: BRAND, HEADLINE, CONTACT, SOCIALS, CTA */}
          <div className="flex flex-col justify-between">
            <div>
              {/* BRAND LOGO & NAME */}
              <Link href="/" className="inline-flex items-center gap-3.5 group flex-wrap sm:flex-nowrap">
                <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#173D32]/10 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/logo.png"
                    alt="GrowthEnzyme logo"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <span
                  className="font-heading text-[#173D32]"
                  style={{
                    fontFamily: '"Bricolage Grotesque", "Bricolage Grotesque Placeholder", sans-serif',
                    fontSize: "clamp(30px, 4.5vw, 50px)",
                    fontWeight: 800,
                    fontStyle: "normal",
                    lineHeight: "90.174px",
                    letterSpacing: "-2.8476px",
                    color: "#173D32",
                  }}
                >
                  Growth Enzyme
                </span>
              </Link>

              {/* DISPLAY HEADLINE */}
              <div>
                <h2
                  className="font-heading mt-2 text-[#173D32]"
                  style={{
                    fontFamily: '"Bricolage Grotesque", "Bricolage Grotesque Placeholder", sans-serif',
                    fontSize: "24px",
                    fontWeight: 500,
                    fontStyle: "normal",
                    lineHeight: "28.8px",
                    letterSpacing: "normal",
                    color: "#173D32",
                  }}
                >
                  Catalyzing Digital Growth
                </h2>
              </div>

              {/* SUBTITLE */}
              <p className="mt-2.5 text-sm sm:text-base text-[#4E6255] max-w-lg font-normal leading-normal">
                A full-service digital growth agency.
              </p>

              {/* THIN DIVIDER LINE */}
              <div className="mt-3.5 sm:mt-4 border-t border-[#173D32]/15 max-w-xl" />

              {/* CONTACT DETAILS */}
              <div className="mt-3.5 sm:mt-4">
                <h3 className="font-heading inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#55695C]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
                  CONTACT
                </h3>
                <a
                  href="mailto:contact@growthenzyme.com"
                  className="mt-1.5 text-sm sm:text-base font-semibold tracking-tight text-[#173D32] hover:text-[#D78359] transition-colors block"
                >
                  contact@growthenzyme.com
                </a>
                <a
                  href="tel:+918807457959"
                  className="mt-0.5 text-sm sm:text-base font-medium text-[#4E6255] hover:text-[#D78359] transition-colors block"
                >
                  +91 88074 57959
                </a>
              </div>

              {/* SOCIALS */}
              <div className="mt-4 sm:mt-4.5">
                <h3 className="font-heading inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#55695C]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
                  SOCIALS
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1.5">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-sm font-medium text-[#173D32] hover:text-[#D78359] transition-colors"
                    >
                      <span>{social.name}</span>
                      <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#D78359]">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTION ROW: PILL BUTTON */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="mailto:contact@growthenzyme.com"
                className="font-instrument group inline-flex items-center gap-2 rounded-full bg-[#173D32] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#D78359] hover:shadow-[0_8px_20px_rgba(215,131,89,0.3)] hover:-translate-y-0.5"
              >
                <span>Let&apos;s grow together</span>
                <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: SAGE ARCH CARD WITH COMPACT VERTICAL LENGTH */}
          <div className="w-full max-w-[370px] sm:max-w-[385px] lg:w-[380px] xl:w-[390px] relative flex flex-col justify-between overflow-hidden bg-[#CBD7BD] pl-10 pr-7 pt-16 sm:pl-14 sm:pr-8 sm:pt-20 lg:pl-16 lg:pr-9 lg:pt-24 pb-10 sm:pb-12 rounded-tl-[160px] sm:rounded-tl-[180px] lg:rounded-tl-[200px] rounded-tr-3xl sm:rounded-tr-[2rem] rounded-bl-3xl sm:rounded-bl-[2rem] rounded-br-[160px] sm:rounded-br-[180px] lg:rounded-br-[200px] shadow-[0_16px_40px_rgba(23,61,50,0.08)] shrink-0 self-stretch min-h-[460px] sm:min-h-[490px]">
            <div>
              {/* CARD HEADER */}
              <h3 className="font-heading inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#173D32]/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
                SERVICES
              </h3>

              {/* NUMBERED SERVICES LIST WITH COMPACT ROWS */}
              <ul className="mt-4 sm:mt-5 flex flex-col">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={service.href}
                      className="group flex items-center justify-between border-b border-[#173D32]/15 py-2.5 sm:py-3 transition-colors hover:border-[#D78359]/40"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        <span className="font-mono text-xs text-[#173D32]/50 tracking-wider shrink-0 transition-colors group-hover:text-[#D78359]">
                          {service.id}
                        </span>
                        <span className="font-heading text-sm sm:text-[15px] font-bold text-[#173D32] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#D78359] whitespace-nowrap">
                          {service.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CARD BOTTOM: CIRCULAR ARROW BUTTON + TAGLINE */}
            <div className="mt-7 sm:mt-8 flex items-center gap-4 pt-1">
              <Link
                href="#contact"
                aria-label="Contact us"
                className="group flex h-12 w-12 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-full bg-[#173D32] text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#D78359] hover:shadow-[0_8px_20px_rgba(215,131,89,0.35)]"
              >
                <svg
                  className="h-5 w-5 sm:h-5.5 sm:w-5.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </Link>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D78359] shrink-0" />
                <div className="font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] leading-tight text-[#173D32]">
                  GROWTH,<br />WITHOUT LIMITS.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT LINE */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-5 border-t border-[#173D32]/10 text-xs text-[#55695C]">
          <p>© {new Date().getFullYear()} Growth Enzyme. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
