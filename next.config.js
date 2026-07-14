/** @type {import('next').NextConfig} */
const nextConfig = {
  // When STATIC_EXPORT=true, produce a fully static site (no Node server needed).
  // The output lands in "out/" and can be served by the Spring Boot backend.
  // For Docker/Node deployments, use DOCKER_BUILD=true for standalone mode.
  ...(process.env.STATIC_EXPORT ? { output: 'export' } : process.env.DOCKER_BUILD ? { output: 'standalone' } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'test-api.irpay.dev',
        pathname: '/storage/images/**',
      }
    ],
  },
}

export default nextConfig