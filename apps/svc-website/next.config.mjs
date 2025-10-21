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
};

export default nextConfig;
