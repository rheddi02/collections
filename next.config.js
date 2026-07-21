/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import withPWA from "@ducanh2912/next-pwa";

// react-player embed SDKs (YouTube, Vimeo, Facebook, Twitch, SoundCloud) each
// load their own player script and/or iframe from their own domain.
const VIDEO_PLAYER_SCRIPT_ORIGINS = [
  "https://www.youtube.com",
  "https://connect.facebook.net",
  "https://player.vimeo.com",
  "https://player.twitch.tv",
  "https://w.soundcloud.com",
];
const VIDEO_PLAYER_FRAME_ORIGINS = [
  "https://www.youtube.com",
  "https://www.facebook.com",
  "https://player.vimeo.com",
  "https://player.twitch.tv",
  "https://w.soundcloud.com",
];

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js App Router requires unsafe-inline for hydration scripts.
  // Remove unsafe-eval if the production build works without it.
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com ${VIDEO_PLAYER_SCRIPT_ORIGINS.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  // Direct video/audio file links played via react-player's FilePlayer
  "media-src 'self' https: blob:",
  `frame-src ${VIDEO_PLAYER_FRAME_ORIGINS.join(" ")}`,
  `connect-src 'self' https://accounts.google.com ${VIDEO_PLAYER_SCRIPT_ORIGINS.join(" ")}`,
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
