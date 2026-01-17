import type { NextConfig } from "next";

const config: NextConfig = {
  allowedDevOrigins: ["http://localhost:8000", "https://annuairedid-fe.qcdigitalhub.com"],
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  headers: async () => [
    {
      source: "/:_next/static/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default config;
