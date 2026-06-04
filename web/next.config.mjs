/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Prisma's binary engine must not be bundled into the client; mark it
  // external for server components / route handlers so Vercel's serverless
  // runtime ships it correctly.
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
