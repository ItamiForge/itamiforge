const UPSTREAM_ANALYTICS_ENDPOINT =
  process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT ??
  "https://sitestats.varunrajan.workers.dev/collect";

const COLLECT_KEY = process.env.NEXT_PUBLIC_SITESTATS_KEY ?? "";

export async function POST(request: Request) {
  let body = "";

  try {
    body = await request.text();
  } catch {
    return new Response(null, { status: 204 });
  }

  const headers = new Headers({
    "Content-Type": request.headers.get("content-type") ?? "application/json",
  });

  if (COLLECT_KEY) {
    headers.set("X-Sitestats-Key", COLLECT_KEY);
  }

  try {
    await fetch(UPSTREAM_ANALYTICS_ENDPOINT, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });
  } catch {
    // Local tracker not running is a valid state during app-only work.
  }

  return new Response(null, { status: 204 });
}
