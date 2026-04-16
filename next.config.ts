import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remover output: 'export' permite usar rutas dinámicas con servidor Next.js
  // Si usas imágenes de Next.js (<Image />), añade esto también:
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
