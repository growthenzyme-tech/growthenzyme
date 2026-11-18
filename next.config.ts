
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [75, 100],
  },
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

if (process.env.NODE_ENV === "development") {
  try {
    initOpenNextCloudflareForDev();
  } catch {
    // Ignored
  }
}

export default nextConfig;
