/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HELIUS_WEBSOCKET: process.env.HELIUS_WEBSOCKET,
  },
  images: {
    domains: [
      'assets.coingecko.com',
      'coin-images.coingecko.com',
      'raw.githubusercontent.com',
      'logos.covalenthq.com',
      'assets.spline.design'
    ],
  },
  experimental: {
    // Enable experimental features for better performance
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: [
    '@splinetool/react-spline',
    '@splinetool/runtime'
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Optimize for Spline and WebGL
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
      },
    });
    
    return config;
  },
  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  // Additional performance settings
  reactStrictMode: true,
  generateEtags: false,
  // Optimize image loading
  images: {
    ...nextConfig.images,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

module.exports = nextConfig;