import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'xngqlfrpvguitptnhb.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'www.bmw.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mercedes-benz.com',
      },
      {
        protocol: 'https',
        hostname: 'www.audi.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tesla.com',
      },
    ],
  },
};

export default nextConfig;
