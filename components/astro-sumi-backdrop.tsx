"use client";

import { useEffect, useState } from "react";
import { Grainient } from "@/components/grainient";
import { PAPER_NOIR } from "@/lib/astro-sumi-paper-noir";
import { createPortal } from "react-dom";

export function AstroSumiBackdrop() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("astro-sumi-docs");
    return () => {
      document.documentElement.classList.remove("astro-sumi-docs");
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="astro-sumi-grainient" aria-hidden="true">
      <Grainient {...PAPER_NOIR} />
    </div>,
    document.body
  );
}
