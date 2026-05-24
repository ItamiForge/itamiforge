"use client";

import { useEffect } from "react";

const ANALYTICS_SITE_ID = "itamiforge";
const DEFAULT_WORKER_ORIGIN = "https://sitestats.varunrajan.workers.dev";

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export function AnalyticsTracker() {
  useEffect(() => {
    if ("undefined" === typeof window) {
      return;
    }

    const workerOrigin = normalizeOrigin(
      process.env.NEXT_PUBLIC_SITESTATS_WORKER_ORIGIN ?? DEFAULT_WORKER_ORIGIN
    );
    const trackerSrc = `${workerOrigin}/tracker.js`;
    if (document.querySelector(`script[data-sitestats-tracker="${trackerSrc}"]`)) {
      return;
    }

    (window as typeof window & { ANALYTICS_SITE_ID?: string }).ANALYTICS_SITE_ID =
      ANALYTICS_SITE_ID;
    const script = document.createElement("script");
    script.defer = true;
    script.src = trackerSrc;
    script.dataset.sitestatsTracker = trackerSrc;
    document.head.appendChild(script);
  }, []);

  return null;
}
