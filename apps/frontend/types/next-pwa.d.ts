declare module "next-pwa" {
  import type { NextConfig } from "next";
  type WithPWA = (nextConfig?: NextConfig) => NextConfig;
  export default function nextPwa(options?: Record<string, any>): WithPWA;
}
