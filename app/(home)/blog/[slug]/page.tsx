import { DocsBody } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <article className="mx-auto max-w-3xl py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {page.data.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        {" · "}
        {page.data.author}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        {page.data.title}
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        {page.data.description}
      </p>

      <DocsBody className="mt-10">
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(blogSource, page),
          })}
        />
      </DocsBody>
    </article>
  );
}

export async function generateStaticParams() {
  return blogSource.getPages().flatMap((page) => {
    const slug = page.slugs[0];
    return slug ? [{ slug }] : [];
  });
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
