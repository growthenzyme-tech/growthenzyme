
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

export default function Footer() {
  return (
    <footer className="relative mt-20 w-full overflow-hidden  bg-[#B6CBA9] text-[#29382F]">

      <div className="mx-auto max-w-[1500px] px-6 pb-8 pt-12 sm:px-10 sm:pt-16 lg:px-14 lg:pb-10 lg:pt-20">

        {/* FOOTER MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.7fr_0.45fr_0.35fr] lg:gap-16">

          {/* BRAND & CONTACT */}
          <div className="flex flex-col items-start">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white sm:h-[90px] sm:w-[90px]">
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
            <div className="mt-7 flex flex-col gap-3">
              <h3 className="text-base font-bold text-[#243B2D]">
                Contact
              </h3>

              <a
                href="mailto:contact@growthenzyme.com"
                className="text-sm text-[#405C48] transition-colors duration-300 hover:text-[#17291F] sm:text-base"
              >
                contact@growthenzyme.com
              </a>

              <a
                href="tel:+918807457959"
                className="text-sm text-[#405C48] transition-colors duration-300 hover:text-[#17291F] sm:text-base"
              >
                +91 88074 57959
              </a>
            </div>
          </div>

          {/* SERVICES */}
          <div className="lg:pt-8">
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
          <div className="lg:pt-8">
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

        {/* DIVIDER */}
        <div className="mt-10 border-t border-[#29382F]/20 sm:mt-12 lg:mt-14" />

        {/* COPYRIGHT */}
        <div className="pt-7 text-center">
          <p className="text-xs text-[#405C48] sm:text-sm">
            © {new Date().getFullYear()} Growth Enzyme. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
