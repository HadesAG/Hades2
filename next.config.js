/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for authenticated pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Skip type checking and linting during build if needed
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Handle environment variables
  env: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
  },
  // Vercel deployment optimizations
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Handle build issues with dynamic pages
  generateBuildId: async () => {
    return 'hades-build-' + Date.now()
  },
  // Optimize for serverless
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig