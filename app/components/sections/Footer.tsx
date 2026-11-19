"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGeneralSettings } from "@/app/lib/settings";
import { ArrowRight } from "lucide-react";

const services = [
  { id: "01", name: "Performance Marketing", href: "#services" },
  { id: "02", name: "SEO", href: "#services" },
  { id: "03", name: "Web Design", href: "#services" },
  { id: "04", name: "Automation", href: "#services" },
  { id: "05", name: "Creatives", href: "#services" },
  { id: "06", name: "Video", href: "#services" },
];

// const socials = [
//   { name: "LinkedIn", href: "https://www.linkedin.com/company/growth-enzyme/posts/" },
//   { name: "Instagram", href: "https://www.instagram.com/growthenzyme/" },
//   { name: "Facebook", href: "https://www.facebook.com/growthenzyme/" },
//   { name: "Threads", href: "https://www.threads.net" },
//   { name: "X (Twitter)", href: "https://x.com" },
// ];

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
  { name: "LinkedIn", href: socialLinks.linkedin },
  { name: "Instagram", href: socialLinks.instagram },
  { name: "Facebook", href: socialLinks.facebook },
  { name: "Threads", href: socialLinks.threads },
  { name: "X (Twitter)", href: socialLinks.x },
].filter((social) => social.href);

const phoneHref = phone.replace(/[^\d+]/g, "");

  return (
    <footer className="w-full bg-white text-[#173D32] px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-7 md:px-14 lg:px-20 lg:pt-11 lg:pb-8 xl:px-24">
      <div className="mx-auto max-w-[1480px]">
        {/* MAIN 2-COLUMN GRID (EDITORIAL LEFT + TALL ORGANIC ARCH CARD RIGHT) */}
       <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_540px]">

          {/* LEFT COLUMN: BRAND, HEADLINE, CONTACT, SOCIALS, CTA */}
       <div className="flex w-full flex-col justify-start">

  {/* BRAND LOGO & NAME */}
  <Link
    href="/"
    className="group inline-flex items-center gap-4"
  >
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#173D32]/10 shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
      <Image
        src="/images/logo.png"
        alt="GrowthEnzyme logo"
        width={64}
        height={64}
        className="h-full w-full object-contain p-1"
      />
    </div>

    <span className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-none tracking-[-0.06em] text-[#173D32]">
      {websiteName}
    </span>
  </Link>

  {/* HEADLINE */}
  <div className="mt-7">
    <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#173D32] sm:text-3xl mt-8">
      Catalyzing Digital Growth
    </h2>

    <p className="mt-3 max-w-xl text-sm leading-7 text-[#4E6255] sm:text-base">
      A full-service digital growth agency.
    </p>
  </div>

  {/* DIVIDER */}
<div className="mt-9 w-full border-t border-[#173D32]/15" />

  {/* CONTACT + SOCIALS HORIZONTAL LAYOUT */}
<div className="mt-9 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:gap-16">

    {/* CONTACT */}
    <div>
      <h3 className="font-heading inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#55695C] sm:text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
        CONTACT
      </h3>

      <div className="mt-4 space-y-2">
        {contactEmail && (
          <a
            href={`mailto:${contactEmail}`}
            className="block break-all text-sm font-semibold tracking-tight text-[#173D32] transition-colors hover:text-[#D78359] sm:text-base"
          >
            {contactEmail}
          </a>
        )}

        {phone && (
          <a
            href={`tel:${phoneHref}`}
            className="block text-sm font-medium text-[#4E6255] transition-colors hover:text-[#D78359] sm:text-base"
          >
            {phone}
          </a>
        )}

        {address && (
          <p className="text-sm leading-6 text-[#4E6255] sm:text-base">
            {address}
          </p>
        )}
      </div>
    </div>

    {/* SOCIALS */}
    {socials.length > 0 && (
      <div>
        <h3 className="font-heading inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#55695C] sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
          SOCIALS
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-sm font-medium text-[#173D32] transition-colors hover:text-[#D78359] sm:text-base"
            >
              {social.name}
              <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    )}

  </div>

  {/* CTA */}
{/* <div className="mt-12">
    <a
      href={`mailto:${contactEmail}`}
      className="font-instrument group inline-flex items-center gap-3 rounded-full bg-[#173D32] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D78359] hover:shadow-[0_8px_20px_rgba(215,131,89,0.3)]"
    >
      Let's grow together
      <ArrowRight
        size={16}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  </div> */}

</div>

          {/* RIGHT COLUMN: SAGE ARCH CARD WITH COMPACT VERTICAL LENGTH */}
     {/* RIGHT COLUMN: WIDE ORGANIC SERVICES PANEL */}
<div className="relative flex min-h-[440px] w-full flex-col justify-between overflow-hidden rounded-tl-[150px] rounded-tr-3xl rounded-bl-3xl rounded-br-[150px] bg-[#CBD7BD] px-10 pb-10 pl-12 pt-16 shadow-[0_16px_40px_rgba(23,61,50,0.08)] sm:rounded-tl-[180px] sm:rounded-br-[180px] sm:px-14 sm:pb-12 sm:pt-20 lg:min-h-[400px] lg:px-16">

  {/* Services Header */}
  <div>
    <h3 className="font-heading inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#173D32]/70">
      <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
      SERVICES
    </h3>

    {/* Two-column Services Grid */}
    <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-0">
      {services.map((service) => (
        <Link
          key={service.id}
          href={service.href}
          className="group flex min-w-0 items-center gap-3 border-b border-[#173D32]/15 py-5 transition-colors hover:border-[#D78359]/50"
        >
          <span className="shrink-0 font-mono text-xs tracking-wider text-[#173D32]/50 transition-colors group-hover:text-[#D78359]">
            {service.id}
          </span>

          <span className="font-heading text-sm font-bold leading-tight text-[#173D32] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#D78359] sm:text-base">
            {service.name}
          </span>
        </Link>
      ))}
    </div>

    {/* Blog Link */}
<Link
  href="/blog"
  className="group mt-3 flex items-center justify-between border-b border-[#173D32]/15 py-3 transition-colors hover:border-[#D78359]/50"
>
  <div className="flex items-center gap-4">
    <span className="font-mono text-xs text-[#173D32]/50">
      07
    </span>

    <span className="font-heading text-sm font-bold text-[#173D32] transition-colors group-hover:text-[#D78359]">
      Blog
    </span>
  </div>

  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173D32] text-white shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D78359]">
    <ArrowRight
      size={16}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  </span>
</Link>
  </div>

  {/* Bottom CTA */}
  {/* <div className="mt-10 flex items-center gap-4 pt-2">
    <Link
      href="#contact"
      aria-label="Contact us"
      className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#173D32] text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#D78359]"
    >
      <ArrowRight
        size={22}
        className="-rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>

    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D78359]" />
      <p className="font-heading text-[10px] font-bold uppercase leading-tight tracking-[0.16em] text-[#173D32] sm:text-xs">
        GROWTH,
        <br />
        WITHOUT LIMITS.
      </p>
    </div>
  </div> */}
</div>

        </div>

        {/* BOTTOM COPYRIGHT LINE */}
        <div className="mt-8 text-center sm:mt-10 pt-4 sm:pt-5 border-t border-[#173D32]/10 text-xs text-[#55695C]">
         <p>
  © {new Date().getFullYear()}{" "}
  {footerCopyright || `${websiteName}. All rights reserved.`}
</p>
        </div>
      </div>
    </footer>
  );
}
