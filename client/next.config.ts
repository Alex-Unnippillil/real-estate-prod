import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@client"] = path.resolve(__dirname, "src");
    config.resolve.alias["@server"] = path.resolve(
      __dirname,
      "../server/src"
    );
    return config;
  },
};

export default nextConfig;
