import type {NextConfig} from 'next';

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
};

export default nextConfig;
