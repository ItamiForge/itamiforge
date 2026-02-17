"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeToggler } from "./animate-ui-theme-toggler";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch - render placeholder during SSR
  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
        aria-label="Toggle Theme"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <ThemeToggler
      theme={theme as "light" | "dark" | "system"}
      resolvedTheme={resolvedTheme as "light" | "dark"}
      setTheme={setTheme}
      direction="ttb"
    >
      {({ effective, toggleTheme }) => {
        const nextTheme = effective === "dark" ? "light" : "dark";
        return (
          <button
            type="button"
            onClick={() => toggleTheme(nextTheme)}
            className="p-2 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
            aria-label="Toggle Theme"
          >
            {effective === "dark" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        );
      }}
    </ThemeToggler>
  );
}
