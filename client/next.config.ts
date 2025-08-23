import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CLOUDFRONT_DOMAIN || "",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
