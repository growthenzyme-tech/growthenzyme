"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGeneralSettings } from "@/app/lib/settings";

const services = [
  { id: "01", name: "Performance Marketing", href: "/#services" },
  { id: "02", name: "SEO", href: "/#services" },
  { id: "03", name: "Web Design", href: "/#services" },
  { id: "04", name: "Automation", href: "/#services" },
  { id: "05", name: "Creatives", href: "/#services" },
  { id: "06", name: "Video", href: "/#services" },
];

const companyLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "Works", href: "/#work" },
  { name: "Process", href: "/#process" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/#contact" },
];

export default function Footer() {
  const [websiteName, setWebsiteName] = useState("Growth Enzyme");
  const [footerCopyright, setFooterCopyright] = useState("");
  const [contactEmail, setContactEmail] = useState("contact@growthenzyme.com");
  const [phone, setPhone] = useState("+91 88074 57959");
  const [address, setAddress] = useState("");

  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    instagram: "",
    facebook: "",
    threads: "",
    x: "",
  });

  useEffect(() => {
    let isMounted = true;

    getGeneralSettings()
      .then((settings) => {
        if (!isMounted) return;

        if (settings.websiteName?.trim()) {
          setWebsiteName(settings.websiteName.trim());
        }

        setFooterCopyright(settings.footerCopyright?.trim() || "");
        setContactEmail(
          settings.contactEmail?.trim() || "contact@growthenzyme.com"
        );
        setPhone(settings.phone?.trim() || "+91 88074 57959");
        setAddress(settings.address?.trim() || "");

        setSocialLinks({
          linkedin: settings.socialLinks?.linkedin?.trim() || "",
          instagram: settings.socialLinks?.instagram?.trim() || "",
          facebook: settings.socialLinks?.facebook?.trim() || "",
          threads: settings.socialLinks?.threads?.trim() || "",
          x: settings.socialLinks?.x?.trim() || "",
        });
      })
      .catch((error) => {
        console.error("Failed to load footer settings:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const socials = [
    {
      name: "LinkedIn",
      href:
        socialLinks.linkedin ||
        "https://www.linkedin.com/company/growth-enzyme/posts/",
    },
    {
      name: "Instagram",
      href:
        socialLinks.instagram || "https://www.instagram.com/growthenzyme/",
    },
    {
      name: "Facebook",
      href: socialLinks.facebook || "https://www.facebook.com/growthenzyme/",
    },
    {
      name: "Threads",
      href: socialLinks.threads,
    },
    {
      name: "X (Twitter)",
      href: socialLinks.x,
    },
  ].filter((social) => social.href);

  const phoneHref = phone.replace(/[^\d+]/g, "");

  return (
    <footer className="relative w-full overflow-hidden bg-transparent text-white">
      {/* ─────────────────────────────────────────────────────────────
          COMPACT UNDULATING HORIZON WAVE WITH TECHNICAL SILHOUETTES
      ───────────────────────────────────────────────────────────── */}
    

      {/* ─────────────────────────────────────────────────────────────
          COMPACT MAIN FOOTER BODY
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-0 w-full bg-[#0E2921] px-6 pb-6 pt-10 sm:px-10 sm:pb-8 md:px-14 lg:px-20 xl:px-24 ">
        <div className="mx-auto max-w-[1400px]">
          {/* TOP CONTENT GRID (4 COLUMNS - COMPACT GAPS & PADDING) */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr] lg:gap-8 xl:gap-10">
            {/* ── COL 1: BRAND LOGO & HEADLINE ── */}
            <div className="flex flex-col justify-start">
              <Link href="/" className="group inline-flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-white/10 shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
                  <Image
                    src="/images/logo.png"
                    alt={`${websiteName} logo`}
                    width={44}
                    height={44}
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <span className="font-heading text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  {websiteName}
                </span>
              </Link>

              {/* HEADLINE & SUBTITLE */}
              <div className="mt-3.5">
                <h2 className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Catalyzing Digital Growth
                </h2>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#B6CBA9] sm:text-base">
                  A full-service digital growth agency.
                </p>
              </div>
            </div>

            {/* ── COL 2: SERVICES ── */}
            <div>
              <h3 className="font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-[#B6CBA9] sm:text-sm">
                Services
              </h3>

              <ul className="mt-3.5 space-y-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={service.href}
                      className="group flex items-center text-sm font-medium text-white/85 transition-colors hover:text-[#D78359] sm:text-[15px]"
                    >
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        {service.name}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/blog"
                    className="group flex items-center text-sm font-medium text-white/85 transition-colors hover:text-[#D78359] pt-0.5 sm:text-[15px]"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      Blog & Insights
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── COL 3: INFORMATION / NAVIGATION ── */}
            <div>
              <h3 className="font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-[#B6CBA9] sm:text-sm">
                Information
              </h3>

              <ul className="mt-3.5 space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm font-medium text-white/85 transition-colors hover:text-[#D78359] sm:text-[15px]"
                    >
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── COL 4: CONTACT & SOCIALS ── */}
            <div>
              <h3 className="font-heading text-[13px] font-bold uppercase tracking-[0.18em] text-[#B6CBA9] sm:text-sm">
                Contact
              </h3>

              <div className="mt-3.5 space-y-3 text-sm sm:text-[15px]">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#B6CBA9]/80 font-semibold">
                    Headquarters
                  </p>
                  <p className="mt-0.5 font-medium text-white">
                    {websiteName}
                  </p>
                </div>

                {contactEmail && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#B6CBA9]/80 font-semibold">
                      Email
                    </p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="mt-0.5 block break-all font-medium text-white transition-colors hover:text-[#D78359]"
                    >
                      {contactEmail}
                    </a>
                  </div>
                )}

                {phone && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#B6CBA9]/80 font-semibold">
                      Direct Line
                    </p>
                    <a
                      href={`tel:${phoneHref}`}
                      className="mt-0.5 block font-medium text-white transition-colors hover:text-[#D78359]"
                    >
                      {phone}
                    </a>
                  </div>
                )}

                {address && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#B6CBA9]/80 font-semibold">
                      Office Address
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/80 sm:text-sm">
                      {address}
                    </p>
                  </div>
                )}

                {/* Social Media Links */}
                {socials.length > 0 && (
                  <div className="pt-1">
                    <p className="text-xs uppercase tracking-wider text-[#B6CBA9]/80 font-semibold mb-2">
                      Follow {websiteName}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {socials.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                          className="flex h-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] px-3 text-xs font-semibold text-white transition-all hover:border-[#D78359] hover:bg-[#D78359] hover:scale-105"
                        >
                          <span>{social.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              COPYRIGHT LINE
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs sm:text-[13px] text-white/60">
            <p>
              © {new Date().getFullYear()}{" "}
              {footerCopyright || `${websiteName}. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
