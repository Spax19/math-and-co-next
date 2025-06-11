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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Adjust this to your needs
      },
    ],
  },

  eslint: {
    dirs: ["pages", "utils"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
};

export default nextConfig;
