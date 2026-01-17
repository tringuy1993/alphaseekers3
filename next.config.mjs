import bundleAnalyzer from '@next/bundle-analyzer';

// Bundle analyzer - run with ANALYZE=true to see bundle size breakdown
// Usage: ANALYZE=true npm run build
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  // React Strict Mode - helps identify potential problems in your app
  // Enables additional checks and warnings for:
  // - Unsafe lifecycle methods
  // - Legacy string ref API usage
  // - Unexpected side effects
  // - Deprecated findDOMNode usage
  reactStrictMode: true,

  eslint: {
    // When true, ESLint errors are ignored during builds
    // TODO: Set to false after fixing ESLint config issue
    // See TASK_LOG.md for pending ESLint fixes
    ignoreDuringBuilds: true,
  },

  typescript: {
    // When true, TypeScript errors are ignored during builds
    // TODO: Set to false after fixing existing TypeScript errors
    // See TASK_LOG.md for pending TypeScript fixes
    ignoreBuildErrors: true,
  },

  // Experimental features for performance optimization
  experimental: {
    // Automatically optimizes imports from these packages
    // Reduces bundle size by only importing what's used
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },

  // Remote image patterns - defines allowed external image sources
  // Required for next/image optimization to work with external URLs
  images: {
    remotePatterns: [
      {
        // Allow Firebase Storage images
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
      {
        // Allow icon-library.com images
        protocol: 'https',
        hostname: 'icon-library.com',
      },
    ],
  },
});
