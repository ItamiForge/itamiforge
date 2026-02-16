import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();
const isProduction = process.env.NODE_ENV === "production";
const projectBasePath = "/itamiforge";

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProduction ? projectBasePath : undefined,
  assetPrefix: isProduction ? projectBasePath : undefined,
};

export default withMDX(config);
