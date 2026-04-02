"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const ANALYTICS_SITE_ID = "itamiforge";
const PUBLIC_ANALYTICS_ENDPOINT =
  process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT?.trim() ?? "";
const ANALYTICS_ENDPOINT =
  PUBLIC_ANALYTICS_ENDPOINT ||
  (process.env.NODE_ENV === "development" ? "/api/analytics" : "");
const ANALYTICS_ENABLED = ANALYTICS_ENDPOINT.length > 0;

// ── Visitor name wordlist (adjective + noun, deterministic for the session) ──
const ADJECTIVES = [
  "Swift",
  "Calm",
  "Bold",
  "Wise",
  "Bright",
  "Cool",
  "Keen",
  "Lone",
  "Vast",
  "Deep",
  "Dark",
  "Soft",
  "Wild",
  "Free",
  "True",
  "Pure",
  "Fair",
  "Rare",
  "Deft",
  "Sly",
  "Jade",
  "Onyx",
  "Iris",
  "Cyan",
  "Teal",
  "Sage",
  "Fern",
  "Mist",
  "Dawn",
  "Dusk",
  "Ash",
  "Coal",
  "Void",
  "Rust",
  "Gold",
  "Iron",
  "Silk",
  "Frost",
  "Ember",
  "Glow",
];
const NOUNS = [
  "Nova",
  "River",
  "Echo",
  "Storm",
  "Comet",
  "Raven",
  "Phoenix",
  "Cipher",
  "Nebula",
  "Pulse",
  "Prism",
  "Vertex",
  "Quasar",
  "Stratos",
  "Vortex",
  "Lumis",
  "Nexus",
  "Solace",
  "Titan",
  "Orbit",
  "Beacon",
  "Haven",
  "Axiom",
  "Zenith",
  "Nadir",
  "Crest",
  "Forge",
  "Sigil",
  "Talon",
  "Ridge",
  "Glyph",
  "Helix",
  "Flare",
  "Rift",
  "Tide",
  "Shard",
  "Ember",
  "Wisp",
  "Spire",
  "Cove",
];

function generateVisitorName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const suffix = Math.floor(Math.random() * 900 + 100); // 100-999
  return `${adj}${noun}${suffix}`;
}

const VISITOR_KEY = "__sitestats_visitor";
const SESSION_KEY = "__sitestats_session_id";

function getOrCreateVisitorName(): string {
  try {
    const stored = localStorage.getItem(VISITOR_KEY);
    if (stored) return stored;
    const name = generateVisitorName();
    localStorage.setItem(VISITOR_KEY, name);
    return name;
  } catch {
    return generateVisitorName();
  }
}

function getOrCreateSessionId(): string {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

function sendBeacon(payload: Record<string, unknown>) {
  if (!ANALYTICS_ENABLED) return;
  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export function AnalyticsTracker() {
  if (!ANALYTICS_ENABLED) return null;
  const pathname = usePathname();
  const sessionStartRef = useRef<number>(Date.now());

  // Send session_end beacon on page unload
  useEffect(() => {
    const handleUnload = () => {
      const duration = Date.now() - sessionStartRef.current;
      const visitorName = getOrCreateVisitorName();
      const sessionId = getOrCreateSessionId();
      const endPayload = {
        site: ANALYTICS_SITE_ID,
        path: window.location.pathname,
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sessionId,
        visitorName,
        eventType: "session_end",
        sessionDuration: duration,
      };

      // Prefer sendBeacon for reliability on unload
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(endPayload)], {
          type: "application/json",
        });
        navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
      } else {
        sendBeacon(endPayload);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (!pathname) return;

    const visitorName = getOrCreateVisitorName();
    const sessionId = getOrCreateSessionId();

    const payload = {
      site: ANALYTICS_SITE_ID,
      path: pathname,
      referrer: document.referrer,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      sessionId,
      visitorName,
      eventType: "pageview",
    };

    sendBeacon(payload);
  }, [pathname]);

  return null;
}
