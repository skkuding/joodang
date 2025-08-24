// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      oneOf: [
        // 1) ?component를 붙여 import하면 React 컴포넌트로
        {
          resourceQuery: /component/,
          use: [{ loader: '@svgr/webpack', options: { icon: true } }],
        },
        // 2) ?url을 붙여 import하면 파일 URL(StaticImageData)로
        {
          resourceQuery: /url/,
          type: 'asset',
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
