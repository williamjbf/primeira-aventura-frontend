import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('http://localhost:8080/uploads/**')],
  }
};

export default nextConfig;
