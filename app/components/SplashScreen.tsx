"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Show for 1.3 seconds, then open home page immediately without fade
    const timer = setTimeout(() => {
      setIsOpen(false);
      document.body.style.overflow = "";
    }, 1300);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white"
    >
      <div className="relative flex items-center justify-center">
        <Image
          src="/images/logo.png"
          alt="GrowthEnzyme"
          width={120}
          height={120}
          priority
          quality={100}
          className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain select-none"
        />
      </div>
    </div>
  );
}
