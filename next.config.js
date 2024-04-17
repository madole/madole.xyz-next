/** @type {import('next').NextConfig} */
const webpack = require("webpack");

module.exports = {
  output: "export",
  reactStrictMode: true,
  webpack: (cfg, { buildId }) => {
    cfg.module.rules.push({
      test: /\.md$/,
      loader: "frontmatter-markdown-loader",
      options: { mode: ["react-component"] },
    });
    cfg.plugins.push(
      new webpack.DefinePlugin({
        "process.env.CONFIG_BUILD_ID": JSON.stringify(buildId),
      })
    );
    cfg.resolve.fallback = {
      fs: false,
      path: false,
      querystring: false,
    };
    return cfg;
  },
  images: {
    domains: ["media.giphy.com"],
    unoptimized: true,
  },
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return Date.now().toString();
  },
};
