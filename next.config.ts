import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // A stray package-lock.json in the user folder otherwise confuses Next's workspace detection.
  outputFileTracingRoot: path.resolve("."),
  // Title and description go in the initial <head> for every visitor (Ads quality checks, Lighthouse), not streamed later.
  htmlLimitedBots: /.*/,
  experimental: {
    optimizePackageImports: ["gsap"],
    // 8 KB of CSS: inline it rather than spend a render-blocking round trip.
    inlineCss: true,
  },
  async headers() {
    return [
      {
        // Frames, loops and stills are content-addressed by chapter and never change in place.
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
