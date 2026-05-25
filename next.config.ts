import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Long-lived immutable cache for all static media assets.
  // Frames and videos never change in-place (new files get new names),
  // so a 1-year max-age is safe and eliminates repeat-visit fetches.
  async headers() {
    return [
      {
        source: '/frames/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
