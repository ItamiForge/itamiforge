import { blog, docs } from "fumadocs-mdx:collections/server";
import type { InferPageType } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [],
});

export const blogSource = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blog, []),
  plugins: [],
});

export function getDocPageImage(page: InferPageType<typeof docsSource>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export function getBlogPageImage(page: InferPageType<typeof blogSource>) {
  return {
    url: `/og/blog/${page.slugs.join("/") || "index"}.png`,
  };
}

export async function getLLMText(page: InferPageType<typeof docsSource>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}\n\n${processed}`;
}
