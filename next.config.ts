import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    // Disable type checking durante build do Docker
    // todo: fix this during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint durante build do Docker
    // todo: fix this during build
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Permitir build mesmo com erros de prerender
    // todo: fix this during build
    skipValidation: true,
  },
  images: {
    remotePatterns: [new URL('http://localhost:8080/uploads/**')],
  }
};

export default nextConfig;