"use client";

import { ThemeToggler } from "animate-ui";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <ThemeToggler direction="ttb" className={className}>
      {({ effective, toggleTheme }) => (
        <button
          type="button"
          onClick={() => toggleTheme(effective === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
          aria-label="Toggle Theme"
        >
          {effective === "dark" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      )}
    </ThemeToggler>
  );
}
