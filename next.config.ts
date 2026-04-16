import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remover output: 'export' permite usar rutas dinámicas con servidor Next.js
  images: {
    unoptimized: true,
  },
  // Proxy API requests to backend
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3000/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
