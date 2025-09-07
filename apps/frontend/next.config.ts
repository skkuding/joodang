// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "joodang.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "storage.joodang.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      oneOf: [
        // 1) ?component를 붙여 import하면 React 컴포넌트로
        {
          resourceQuery: /component/,
          use: [{ loader: "@svgr/webpack", options: { icon: true } }],
        },
        // 2) ?url을 붙여 import하면 파일 URL(StaticImageData)로
        {
          resourceQuery: /url/,
          type: "asset",
        },
      ],
    });
    return config;
  },
};

const withPWA = require("next-pwa")({
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
        expiration: {
          maxEntries: 300,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
        },
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
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1년
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});
module.exports = withPWA({});

export default nextConfig;
