"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ANALYTICS_SITE_ID = "itamiforge";
const ANALYTICS_ENDPOINT = "https://sitestats.varunrajan.workers.dev/collect";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const payload = {
      site: ANALYTICS_SITE_ID,
      path: pathname,
      referrer: document.referrer,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    fetch(ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
