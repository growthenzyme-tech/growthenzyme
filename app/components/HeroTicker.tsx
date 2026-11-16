"use client";

import { useEffect, useRef } from "react";

const tickerItems = [
  "PERFORMANCE MARKETING",
  "SEO",
  "WEB DESIGN & DEV",
  "BUSINESS AUTOMATION",
  "DESIGN CREATIVES",
  "VIDEO PRODUCTION",
];

export default function HeroTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

  // Speed & position tracking
  const isHoveredRef = useRef(false);
  const currentSpeedRef = useRef(1.1); // px per frame
  const xPosRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      // Normalize delta so 60fps/120fps/144fps screens all run at the exact same physical speed
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      // Mouse points: run slowly (0.22); otherwise: run continuously (1.1)
      const targetSpeed = isHoveredRef.current ? 0.22 : 1.1;

      // Smooth deceleration / acceleration
      currentSpeedRef.current +=
        (targetSpeed - currentSpeedRef.current) * 0.08 * delta;

      xPosRef.current -= currentSpeedRef.current * delta;

      if (singleSetRef.current && trackRef.current) {
        const setWidth = singleSetRef.current.offsetWidth;
        if (setWidth > 0 && Math.abs(xPosRef.current) >= setWidth) {
          xPosRef.current += setWidth;
        }
        trackRef.current.style.transform = `translate3d(${xPosRef.current}px, 0, 0)`;
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onTouchStart={() => {
        isHoveredRef.current = true;
      }}
      onTouchEnd={() => {
        isHoveredRef.current = false;
      }}
      className="relative w-full overflow-hidden border-t border-white/10 bg-[#1B3A2D] py-2.5 sm:py-3 select-none"
      aria-label="Services ticker"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
      >
        {/* Render 4 duplicate sets to guarantee seamless infinite wrapping on any screen size */}
        {[0, 1, 2, 3].map((setIndex) => (
          <div
            key={setIndex}
            ref={setIndex === 0 ? singleSetRef : undefined}
            className="flex shrink-0 items-center gap-5 sm:gap-8 pr-5 sm:pr-8"
          >
            {tickerItems.map((item) => (
              <div
                key={item}
                className="flex shrink-0 items-center gap-5 sm:gap-8"
              >
                <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#E8EFE9] transition-colors duration-200 hover:text-white">
                  {item}
                </span>

                {/* Lime sparkle from reference image */}
                <svg
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#A8D96C] shrink-0 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                </svg>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
