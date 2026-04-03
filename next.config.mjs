import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();
const isProductionBuild = "production" === process.env.NODE_ENV;
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
  env: {
    NEXT_PUBLIC_BASE_PATH: isProductionBuild ? pagesBasePath : "",
  },
};

export default withMDX(config);
