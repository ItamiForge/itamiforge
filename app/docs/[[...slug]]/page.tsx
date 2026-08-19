import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { docsSource, getDocPageImage } from "@/lib/source";
import { AstroSumiBackdrop } from "@/components/astro-sumi-backdrop";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/mdx-components";
import { isAstroSumiDocsSlug } from "@/lib/astro-sumi-paper-noir";
import { notFound } from "next/navigation";

type DocsPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function Page(props: DocsPageProps) {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const showAstroSumiBackdrop = isAstroSumiDocsSlug(params.slug);

  return (
    <>
      {showAstroSumiBackdrop ? <AstroSumiBackdrop /> : null}
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(docsSource, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata(props: DocsPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);
  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: [getDocPageImage(page).url],
    },
  };
}
