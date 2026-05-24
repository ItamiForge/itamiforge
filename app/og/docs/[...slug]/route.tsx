import { docsSource, getDocPageImage } from "@/lib/source";
import { generate as DefaultImage } from "fumadocs-ui/og";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export const revalidate = false;

type DocsOgRouteContext = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function GET(_req: Request, { params }: DocsOgRouteContext) {
  const { slug } = await params;
  const page = docsSource.getPage(slug.slice(0, -1));
  if (!page) {
    notFound();
  }

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site="ItamiForge" />,
    {
      width: 1200,
      height: 630,
    }
  );
}

export function generateStaticParams() {
  return docsSource.getPages().map((page) => ({
    slug: getDocPageImage(page).segments,
  }));
}
