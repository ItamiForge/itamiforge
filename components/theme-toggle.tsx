"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`p-2 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors ${className || ""}`}
        aria-label="Toggle Theme"
      >
        <span className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`p-2 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors ${className || ""}`}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
