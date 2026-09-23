import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Inlines each route's CSS directly into the HTML <head> as a <style>
    // tag instead of a separate <link rel="stylesheet"> request. Our global
    // Tailwind stylesheet was showing up as a ~37KB render-blocking request
    // (measured ~400-1500ms depending on network conditions) in PageSpeed
    // Insights audits — this removes that extra network round-trip from the
    // critical rendering path entirely.
    inlineCss: true,
  },
};

export default nextConfig;
