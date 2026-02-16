import { docsSource, getLLMText } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const docScan = docsSource.getPages().map(getLLMText);
  const scanned = await Promise.all(docScan);

  return new Response(scanned.join("\n\n"));
}
