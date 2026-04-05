import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Domain canonicalization: www → non-www (301 permanent)
      // Consolidates SEO authority on https://rankmybiz.ai
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rankmybiz.ai" }],
        destination: "https://rankmybiz.ai/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
