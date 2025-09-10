/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "10.1.1.40",
      },
      {
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;
