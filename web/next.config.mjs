/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export — produces an `out/` folder you can upload to any
  // shared hosting's public_html (Hostinger, cPanel, GoDaddy, Namecheap…).
  // No Node.js runtime is required on the server.
  output: "export",
  // Static export can't run the Next.js Image Optimizer, so disable it.
  images: { unoptimized: true },
  // Friendlier URLs on shared hosting (each page becomes its own folder
  // with index.html — works without server-side routing).
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
};

export default nextConfig;
