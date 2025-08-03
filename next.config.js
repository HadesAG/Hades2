/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@splinetool/react-spline', 'lucide-react'],
  },
  
  // Optimize images and static assets
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle analyzer for development
  webpack: (config, { dev, isServer }) => {
    // Optimize Spline loading
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          spline: {
            name: 'spline',
            test: /[\\/]node_modules[\\/]@splinetool[\\/]/,
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }
    
    return config;
  },
  
  // Enable compression and optimize for Vercel
  compress: true,
  poweredByHeader: false,
  
  // Optimize for production
  swcMinify: true,
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;