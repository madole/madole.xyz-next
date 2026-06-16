/** @type {import('next').NextConfig} */

const isStaticExport = process.env.STATIC_EXPORT === "true";

module.exports = {
  ...(isStaticExport ? { output: "export" } : {}),
  reactStrictMode: true,
  turbopack: {},
  env: {
    CONFIG_BUILD_ID: Date.now().toString(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.giphy.com",
      },
    ],
    unoptimized: true,
  },
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return Date.now().toString();
  },
};
