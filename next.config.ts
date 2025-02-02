import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '137.184.235.176',
        port: '1337',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
