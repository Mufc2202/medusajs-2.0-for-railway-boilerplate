const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",

      },
      { // Note: needed to serve images from /public folder
        protocol: process.env.NEXT_PUBLIC_BASE_URL?.startsWith('https') ? 'https' : 'http',
        hostname: process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, ''),
      },
      { // Note: only needed when using local-file for product media
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace('https://', ''),
      },
      { 
        protocol: "https",
        hostname: "meteor.stullercloud.com",
      },
      { 
        protocol: "https",
        hostname: "dolgins-nextjs.s3.us-east-2.amazonaws.com",
      },
      { // Note: can be removed after deleting demo products
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "minio.thespecialcharacter.com",
      },      
      {
        protocol: "https",
        hostname: "minio.dangbaby.co",
      },
      {
        protocol: "https",
        hostname: "bucket-production-9e1b.up.railway.app",
      },
      ...(process.env.NEXT_PUBLIC_MINIO_ENDPOINT ? [{ // Note: needed when using MinIO bucket storage for media
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MINIO_ENDPOINT,
      }] : []),
    ],
  },
  serverRuntimeConfig: {
    port: process.env.PORT || 3000
  },
  async redirects() {
    return [
      {
        source: '/products/:path',
        destination: '/jewelry/:path',
        permanent: true,
      },
      {
        source: '/categories/:path',
        destination: '/t/:path',
        permanent: true,
      },      
      {
        source: '/jewelry-repairs',
        destination: '/t/jewelry-repair',
        permanent: true,
      },      
      {
        source: '/jewelry-repairs/watch-repair',
        destination: '/t/jewelry-repair/watches',
        permanent: true,
      },      
    ]
  },  
}

module.exports = nextConfig
