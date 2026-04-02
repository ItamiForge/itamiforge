"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const BANNER_KEY = "__sitestats_banner_dismissed";
const DISMISS_DAYS = 90;

export function PrivacyBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BANNER_KEY);
      if (!raw) {
        setVisible(true);
        return;
      }
      const expiresAt = parseInt(raw, 10);
      if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
        localStorage.removeItem(BANNER_KEY);
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      const expiresAt = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(BANNER_KEY, String(expiresAt));
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 py-3 border-t"
      style={{
        background: "hsl(var(--background) / 0.95)",
        borderColor: "hsl(var(--border))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "slideInUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <p className="text-sm text-fd-muted-foreground max-w-2xl" style={{ lineHeight: "1.5" }}>
        This site uses anonymous traffic analytics to understand visitor patterns. IP addresses are
        masked and no personal data is stored or shared.{" "}
        <span className="opacity-60">Data is used solely for site improvement.</span>
      </p>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss privacy notice"
        className="flex-shrink-0 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border transition-colors"
        style={{
          fontFamily: "var(--font-sans)",
          borderColor: "hsl(var(--border))",
          color: "hsl(var(--foreground))",
          background: "transparent",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--secondary))";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <X size={12} />
        Got it
      </button>
    </div>
  );
}
