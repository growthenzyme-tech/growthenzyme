
"use client";

import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import Image from "next/image";

export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Register the service worker to cache the offline image
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Offline service worker registered:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }

    // Detect internet connection
    const updateConnection = () => {
      setIsOffline(!navigator.onLine);
    };

    updateConnection();

    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);

    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  const handleRetry = () => {
    setChecking(true);

    if (navigator.onLine) {
      window.location.reload();
    } else {
      setChecking(false);
    }
  };

  if (!isOffline) return null;

  return (
    <main className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center overflow-y-auto bg-[#F8F8EF] px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2">
        {/* Dog image */}
        <div className="relative flex justify-center">
          <div className="absolute inset-10 rounded-full bg-[#DCE8C9] blur-3xl" />

          <Image
            src="/offline/offline-gym.png"
            alt="A cheerful dog"
            width={600}
            height={600}
            priority
            unoptimized
            className="relative h-auto max-h-[480px] w-full object-contain"
          />
        </div>

        {/* Offline message */}
        <div className="text-center md:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#E7EEDB] px-4 py-2 text-sm font-semibold text-[#45613B]">
            <WifiOff size={17} />
            Connection unavailable
          </div>

          <h1 className="text-4xl font-bold leading-tight text-[#214C38] sm:text-5xl lg:text-6xl">
            Oops! No Internet Connection
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-[#596257] sm:text-lg">
            Looks like you are offline. Please check your internet
            connection. Our little friend is waiting for you to come back!
          </p>

          <button
            type="button"
            onClick={handleRetry}
            disabled={checking}
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-[#668B4D] px-8 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#52743D] disabled:opacity-70"
          >
            <RefreshCw
              size={19}
              className={checking ? "animate-spin" : ""}
            />
            {checking ? "Checking..." : "Try Again"}
          </button>

          <p className="mt-8 text-sm font-medium text-[#819078]">
            Don't worry, we'll be back soon!
          </p>
        </div>
      </div>
    </main>
  );
}
