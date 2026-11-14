
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Works", href: "#work" },
  { name: "Process", href: "#process" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#29382F]/10 bg-white text-[#29382F] shadow-[0_3px_15px_rgba(41,56,47,0.05)]">
      <nav className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-10 lg:px-14">

        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center">
          <Image
            src="/images/logo.jpg"
            alt="GrowthEnzyme Logo"
            width={52}
            height={52}
            priority
            className="h-[48px] w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[15px] font-semibold text-[#29382F] transition-colors duration-300 hover:text-[#D78359]"
            >
              {link.name}
            </Link>
          ))}

          {/* Let's Talk Button */}
        
<Link
  href="#contact"
  className="group inline-flex items-center gap-3 rounded-xl border border-[#A5B59F] bg-gradient-to-b from-[#B6CBA9] to-[#91A88F] px-4 py-3 text-[15px] font-bold text-[#29382F] shadow-[0_4px_0_#71876F,0_8px_16px_rgba(41,56,47,0.15),inset_0_2px_3px_rgba(255,255,255,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_0_#71876F,0_11px_20px_rgba(41,56,47,0.18)] active:translate-y-1 active:shadow-[0_2px_0_#71876F]"
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-semibold text-[#29382F] transition-colors duration-300 hover:text-[#D78359]"
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Let's Talk Button */}
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-center gap-3 rounded-xl border border-[#F5F0E5] bg-gradient-to-b from-[#FDFBF4] to-[#E9E5D9] px-5 py-3 font-bold text-[#29382F] shadow-[0_4px_0_#6F856D,0_8px_16px_rgba(41,56,47,0.12)] transition-all duration-300 active:translate-y-1 active:shadow-[0_2px_0_#6F856D]"
            >
              Let's Talk
           
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
