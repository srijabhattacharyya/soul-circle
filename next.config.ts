import type {NextConfig} from 'next';
require('dotenv').config({ path: './src/app/.env.local' });

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
      '*.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev',
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@genkit-ai/googleai', 'firebase'],
  },
};

export default nextConfig;
