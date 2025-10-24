/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Next.js invokes its own ESLint runner during builds; we rely on workspace linting instead.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals = config.externals ?? [];
    config.externals.push({
      "node:assert/strict": "commonjs node:assert/strict",
      "node:test": "commonjs node:test",
    });

    return config;
  },
  // API rewrites для интеграции микросервисов
  async rewrites() {
    const API_BASE = process.env.INTERNAL_API_URL || 'http://localhost';
    
    return [
      // Auth service
      {
        source: '/api/auth/:path*',
        destination: `${API_BASE}:3001/auth/:path*`,
      },
      // Catalog service
      {
        source: '/api/catalog/:path*',
        destination: `${API_BASE}:3002/catalog/:path*`,
      },
      // Enquiries service
      {
        source: '/api/enquiries/:path*',
        destination: `${API_BASE}:3003/enquiries/:path*`,
      },
      // Billing service
      {
        source: '/api/billing/:path*',
        destination: `${API_BASE}:3004/billing/:path*`,
      },
      // Vendors service
      {
        source: '/api/vendors/:path*',
        destination: `${API_BASE}:3005/vendors/:path*`,
      },
      // Guests service
      {
        source: '/api/guests/:path*',
        destination: `${API_BASE}:3006/guests/:path*`,
      },
      // Payments service
      {
        source: '/api/payments/:path*',
        destination: `${API_BASE}:3007/payments/:path*`,
      },
    ];
  },
};

export default nextConfig;
