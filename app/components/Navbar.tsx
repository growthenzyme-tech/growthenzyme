"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { getGeneralSettings } from "@/app/lib/settings";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "Works", href: "/#work" },
  { name: "Process", href: "/#process" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState("GrowthEnzyme");
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("");

  useEffect(() => {
    let isMounted = true;

    getGeneralSettings()
      .then((settings) => {
        if (!isMounted) return;

        if (settings.websiteName?.trim()) {
          setWebsiteName(settings.websiteName.trim());
        }

        setAnnouncementEnabled(settings.announcementEnabled);
        setAnnouncementText(settings.announcementText?.trim() || "");
        setAnnouncementLink(settings.announcementLink?.trim() || "");
      })
      .catch((error) => {
        console.error("Failed to load website name:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function isActiveLink(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <div className="fixed top-0 z-50 w-full bg-white">
      {announcementEnabled && announcementText && (
        <div className="flex min-h-9 items-center justify-center border-b border-[#29382F]/10 bg-white px-4 py-2 text-center text-xs sm:text-sm font-medium text-[#29382F]">
            {announcementLink ? (
              <Link
                href={announcementLink}
                className="transition-opacity hover:opacity-80"
              >
                {announcementText}
                <span className="ml-2">↗</span>
              </Link>
            ) : (
              <p>{announcementText}</p>
            )}
          </div>
        )}

        <header className="w-full border-b border-[#29382F]/10 bg-white text-[#29382F] shadow-[0_3px_15px_rgba(41,56,47,0.05)]">
          <nav className="mx-auto flex h-[82px] sm:h-[88px] max-w-[1320px] items-center justify-between px-5 sm:px-10 lg:px-14">
            {/* Logo */}
            <Link
              href="/"
              aria-label={`${websiteName} home`}
              className="relative z-50 flex items-center gap-2.5 py-1"
            >
              <Image
                src="/images/logo.png"
                alt={`${websiteName} Logo`}
                width={80}
                height={80}
                priority
                className="h-[58px] sm:h-[66px] w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-9 md:flex">
              {navLinks.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative py-1 text-[15px] font-semibold transition-colors duration-300 ${
                      active
                        ? "text-[#D78359]"
                        : "text-[#29382F] hover:text-[#D78359]"
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[#D78359]" />
                    )}
                  </Link>
                );
              })}

              {/* Let's Talk Button */}
              <Link
                href="/#contact"
                className="font-instrument group inline-flex items-center gap-3 rounded-xl border border-[#A5B59F] bg-gradient-to-b from-[#B6CBA9] to-[#91A88F] px-4 py-3 text-[15px] font-bold text-[#29382F] shadow-[0_4px_0_#71876F,0_8px_16px_rgba(41,56,47,0.15),inset_0_2px_3px_rgba(255,255,255,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_0_#71876F,0_11px_20px_rgba(41,56,47,0.18)] active:translate-y-1 active:shadow-[0_2px_0_#71876F]"
              >
                Let's Talk
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-[#29382F]/20 bg-[#F5F0E5] text-[#29382F] shadow-[0_3px_0_#6F856D] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0.5 md:hidden"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </nav>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="absolute left-0 top-full w-full border-t border-[#29382F]/10 bg-[#F5F0E5] px-6 py-6 shadow-[0_12px_20px_rgba(41,56,47,0.12)] md:hidden">
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => {
                  const active = isActiveLink(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`text-base font-semibold transition-colors duration-300 ${
                        active
                          ? "text-[#D78359]"
                          : "text-[#29382F] hover:text-[#D78359]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Mobile Let's Talk Button */}
                <Link
                  href="/#contact"
                  onClick={() => setMenuOpen(false)}
                  className="font-instrument group flex items-center justify-center gap-3 rounded-xl border border-[#F5F0E5] bg-gradient-to-b from-[#FDFBF4] to-[#E9E5D9] px-5 py-3 font-bold text-[#29382F] shadow-[0_4px_0_#6F856D,0_8px_16px_rgba(41,56,47,0.12)] transition-all duration-300 active:translate-y-1 active:shadow-[0_2px_0_#6F856D]"
                >
                  Let's Talk
                </Link>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Spacer for fixed announcement and navbar */}
  {/* Spacer for fixed announcement and navbar */}
    <div
      aria-hidden="true"
      className={announcementEnabled && announcementText
        ? "h-[118px] w-full bg-white sm:h-[124px]"
        : "h-[82px] w-full bg-white sm:h-[88px]"
      }
    />
    </>
  );
}