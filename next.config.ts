import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://expense-app-backend-production.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
