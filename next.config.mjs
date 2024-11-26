/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'abundant-crocodile-641.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'mellow-raven-947.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'majestic-clownfish-172.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
