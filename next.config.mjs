import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();
// NODE_ENV is always "production" during `next build`, so we use a custom
// variable to distinguish a GitHub Pages deployment from a local dev build.
const isDeployBuild = process.env.DEPLOY_ENV === "production";
const projectBasePath = "/itamiforge";

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isDeployBuild ? projectBasePath : undefined,
  assetPrefix: isDeployBuild ? projectBasePath : undefined,
};

export default withMDX(config);
