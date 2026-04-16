import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // <--- ESTO ES LO MÁS IMPORTANTE
  // Si usas imágenes de Next.js (<Image />), añade esto también:
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
