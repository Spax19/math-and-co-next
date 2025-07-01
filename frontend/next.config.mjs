/** @type {import('next').NextConfig} */
const nextConfig = {
  // For server-only packages
  serverExternalPackages: ["bcryptjs"],

  // Webpack configuration to handle Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side specific config
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
      };
    }
    return config;
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // Images configuration (if needed)
  images: {
    domains: [
      "https://math-and-co-next-efj8-git-main-spax19s-projects.vercel.app/",
    ],
    minimumCacheTTL: 60,
  },

  experimental: {
    serverComponentsExternalPackages: ["mysql2", "bcryptjs"],
  },
  //

  eslint: {
    dirs: ["pages", "utils"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
};

export default nextConfig;
