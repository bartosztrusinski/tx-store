import { type NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['app', 'components', 'lib', 'features', 'prisma', 'middleware.ts'],
  },
};

export default nextConfig;
