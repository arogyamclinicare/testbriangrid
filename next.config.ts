import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA configuration
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Mobile-first headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
