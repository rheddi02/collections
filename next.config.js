/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import withPWA from "@ducanh2912/next-pwa";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js App Router requires unsafe-inline for hydration scripts.
  // Remove unsafe-eval if the production build works without it.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  // YouTube and Facebook iframes
  "frame-src https://www.youtube.com https://www.facebook.com",
  "connect-src 'self' https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/** @type {import("next").NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
            pathname: '/**'
        },
        {
            protocol: 'https',
            hostname: 'fastly.picsum.photos',
            port: '',
            pathname: '/**'
        },
        {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**'
        },
        {
            protocol: 'https',
            hostname: 'drive.google.com',
            port: '',
            pathname: '/**'
        },
    ],
  },
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
