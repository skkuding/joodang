// next.config.ts
import type { NextConfig } from "next";
import withPWAOrig from "next-pwa";

const withPWA = withPWAOrig({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: ({ url }: { url: URL }) =>
        url.origin === self.location.origin &&
        url.pathname.startsWith("/_next/image"),
      handler: "CacheFirst",
      options: {
        cacheName: "next-image",
        expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: ({ url }: { url: URL }) =>
        url.origin === self.location.origin &&
        url.pathname.startsWith("/_next/static/media"),
      handler: "CacheFirst",
      options: {
        cacheName: "next-static-media",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /https:\/\/map\.pstatic\.net\/resource\/.*\.(pbf)(?:\?|$)/,
      handler: "CacheFirst",
      options: {
        cacheName: "naver-map-pbf",
        expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern:
        /https:\/\/mape\.pstatic\.net\/styler\/api\/v1\/style\/.*\/style\.json(?:\?|$)/,
      handler: "CacheFirst",
      options: {
        cacheName: "naver-map-style-json",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /https:\/\/map\.pstatic\.net\/.*\.(png|jpg|jpeg)(?:\?|$)/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "naver-map-tiles",
        expiration: { maxEntries: 800, maxAgeSeconds: 60 * 60 * 24 * 14 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});

const nextConfig: NextConfig = withPWA({
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "joodang.com", pathname: "/**" },
      { protocol: "https", hostname: "storage.joodang.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" }, // dev
    ],
    formats: ["image/avif", "image/webp"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      oneOf: [
        {
          resourceQuery: /component/,
          use: [{ loader: "@svgr/webpack", options: { icon: true } }],
        },
        { resourceQuery: /url/, type: "asset" },
      ],
    });
    return config;
  },
});

export default nextConfig;
