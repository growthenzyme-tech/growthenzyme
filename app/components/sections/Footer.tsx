"use client";

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
  { name: "Linkedin", href: "https://www.linkedin.com" },
  { name: "Instagram", href: "https://www.instagram.com" },
  { name: "Facebook", href: "https://www.facebook.com" },
  { name: "Threads", href: "https://www.threads.net" },
  { name: "X (Twitter)", href: "https://x.com" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white text-[#29382F]">
      {/* TOP GEOMETRIC BOXES PATTERN (INCREASED WIDTH & LENGTH) */}
    

      {/* WATTS-STYLE CAPSULE CARD AREA */}
      <div className="w-full px-3 py-6 sm:px-6 sm:py-10 md:px-8 lg:px-12 lg:py-14">
        <div className="relative mx-auto max-w-[1520px] overflow-hidden bg-[#B6CBA9] px-6 pt-10 pb-8 sm:pb-10 md:pb-12 sm:px-10 sm:pt-12 md:px-12 md:pt-14 lg:rounded-l-full lg:rounded-r-[3.5rem] rounded-[2rem] sm:rounded-[2.8rem] lg:pl-28 lg:pr-14 xl:pl-36 xl:pr-16 shadow-[0_20px_50px_rgba(41,56,47,0.12)]">

          {/* TOP 3-COLUMN CONTENT GRID (MATCHING USER CONTENTS) */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr] lg:gap-14 xl:gap-20">

            {/* BRAND & CONTACT COLUMN (Left) */}
            <div className="flex flex-col justify-between">
              <div>
                <Link href="/" className="inline-flex items-center gap-3.5 group">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-[#29382F]/15 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src="/images/logo.png"
                      alt="GrowthEnzyme logo"
                      width={48}
                      height={48}
                      className="h-full w-full object-contain p-1.5"
                    />
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-[#29382F]">
                    Growth Enzyme
                  </span>
                </Link>

                <h3 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-3xl">
                  Catalyzing Digital Growth
                </h3>

                <p className="mt-3 text-sm text-[#405C48] sm:text-base">
                  A full-service digital growth agency.
                </p>
              </div>

              {/* CONTACT DETAILS */}
              <div className="mt-8 flex flex-col items-start gap-2.5">
                <h4 className="text-sm font-bold text-[#243B2D]">
                  Contact
                </h4>

                <a
                  href="mailto:contact@growthenzyme.com"
                  className="text-sm font-medium text-[#405C48] transition-colors hover:text-[#17291F] sm:text-base underline-offset-2 hover:underline"
                >
                  contact@growthenzyme.com
                </a>

                <a
                  href="tel:+918807457959"
                  className="text-sm font-medium text-[#405C48] transition-colors hover:text-[#17291F] sm:text-base underline-offset-2 hover:underline"
                >
                  +91 88074 57959
                </a>
              </div>
            </div>

            {/* SERVICES COLUMN (Middle) */}
            <div className="lg:pt-2">
              <h4 className="text-base font-bold text-[#243B2D]">
                Services
              </h4>
              <ul className="mt-5 flex flex-col gap-3.5 sm:gap-4">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="text-sm font-medium text-[#405C48] transition-all duration-200 hover:translate-x-1 hover:text-[#17291F] inline-block sm:text-base"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SOCIALS COLUMN (Right) */}
            <div className="lg:pt-2">
              <h4 className="text-base font-bold text-[#243B2D]">
                Socials
              </h4>
              <ul className="mt-5 flex flex-col gap-3.5 sm:gap-4">
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#405C48] transition-all duration-200 hover:translate-x-1 hover:text-[#17291F] inline-block sm:text-base"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* COPYRIGHT LINE */}
          <div className="mt-10 border-t border-[#29382F]/10 pt-5 text-center text-xs text-[#405C48] sm:text-sm">
            <p>© {new Date().getFullYear()} Growth Enzyme. All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
