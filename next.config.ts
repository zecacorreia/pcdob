import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imagens destacadas vêm do WordPress atual (pcdob.org.br) via REST API.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pcdob.org.br",
        pathname: "/wp-content/uploads/**",
      },
      // Fotos oficiais dos parlamentares (seção Leaderships).
      {
        protocol: "https",
        hostname: "www.camara.leg.br",
        pathname: "/internet/deputado/bandep/**",
      },
    ],
  },
};

export default nextConfig;
