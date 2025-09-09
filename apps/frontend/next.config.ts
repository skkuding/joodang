import type { NextConfig } from "next";
import withPWAOrig from "next-pwa";

const PUBLIC_ASSETS = [
  "android-maskable-1280x1280.png",
  "android-maskable-128x128.png",
  "android-maskable-192x192.png",
  "android-maskable-512x512.png",
  "joodang-badge.png",
  "logo.png",
  "logo_symbol.svg",
  "logo_text.svg",
  "store_image.png",
  ...[
    "blackBeer.png",
    "blackHouse.png",
    "blackReserv.svg",
    "file.svg",
    "globe.svg",
    "graphic_food.svg",
    "grayBeer.png",
    "grayHouse.png",
    "icon_aninal.svg",
    "icon_apple.svg",
    "icon_arrow.svg",
    "icon_arrow_down.svg",
    "icon_bowl.svg",
    "icon_caution.svg",
    "icon_check_round.svg",
    "icon_chip.svg",
    "icon_clock.png",
    "icon_clock.svg",
    "icon_close.svg",
    "icon_default_profile.svg",
    "icon_drink.svg",
    "icon_food.svg",
    "icon_fried.svg",
    "icon_gray_beer.svg",
    "icon_gray_calendar.svg",
    "icon_gray_caution.svg",
    "icon_gray_clock.png",
    "icon_gray_clock.svg",
    "icon_gray_coloredHouse.svg",
    "icon_gray_house.svg",
    "icon_gray_location.svg",
    "icon_gray_money.svg",
    "icon_gray_mypage.svg",
    "icon_gray_person.svg",
    "icon_gray_reservation.svg",
    "icon_heart.svg",
    "icon_kakao.svg",
    "icon_kakao_pay.png",
    "icon_location.svg",
    "icon_minus.svg",
    "icon_money.svg",
    "icon_my_location.svg",
    "icon_orange_beer.svg",
    "icon_orange_beers.svg",
    "icon_orange_caution.svg",
    "icon_orange_clock.svg",
    "icon_orange_house.svg",
    "icon_orange_mypage.svg",
    "icon_orange_noti.svg",
    "icon_orange_reservation.svg",
    "icon_orange_store.svg",
    "icon_plus.svg",
    "icon_refresh.svg",
    "icon_rice.svg",
    "icon_squid.svg",
    "icon_toss.png",
    "notification.svg",
    "orangeCalendar.svg",
    "orangeCheckbox.svg",
    "orangeClock.svg",
    "orangeMoney.svg",
    "orange_dot.svg",
    "whiteBeer.png",
    "whiteHouse.png",
  ].map(f => `icons/${f}`),
  ...[
    "bap.png",
    "beverage.png",
    "fruit.png",
    "maroon5.png",
    "tang.png",
    "tuiguim.png",
  ].map(f => `menu_image/${f}`),
  ...["cheers.png", "drinkMacju.png", "today1.png", "today2.png"].map(
    f => `picture/${f}`
  ),
  ...["cheers.png", "drinkMacju.png", "today1.png", "today2.png"].map(
    f => `pictures/${f}`
  ),
  ...[
    "4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png",
    "iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",
    "iPhone_11__iPhone_XR_portrait.png",
    "iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",
    "iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",
    "iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png",
    "iPhone_16_Pro_Max_portrait.png",
    "iPhone_16_Pro_portrait.png",
    "iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png",
    "iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",
    "iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",
    "iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",
    "icon.png",
  ].map(f => `splash_screens/${f}`),
];

const additionalManifestEntries = PUBLIC_ASSETS.map(path => ({
  url: `/${path}`,
  revision: path,
}));

const withPWA = withPWAOrig({
  dest: "public",
  register: true,
  skipWaiting: true,
  additionalManifestEntries,
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
      { protocol: "https", hostname: "k.kakaocdn.net", pathname: "/**" }, // kakao profile images
      { protocol: "https", hostname: "img1.kakaocdn.net", pathname: "/**" },
      { protocol: "http", hostname: "t1.kakaocdn.net", pathname: "/**" },
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
