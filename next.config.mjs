import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();
const isProductionBuild = process.env.NODE_ENV === "production";
const pagesBasePath = "/itamiforge";

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProductionBuild ? pagesBasePath : "",
};

export default withMDX(config);
