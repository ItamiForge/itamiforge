"use client";

import { AnimatePresence, motion } from "framer-motion";
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
        className="p-2 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground active:scale-95 transition-all"
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
      {({ resolved, toggleTheme }) => {
        const isDark = resolved === "dark";
        const nextTheme = isDark ? "light" : "dark";

        return (
          <button
            type="button"
            onClick={() => toggleTheme(nextTheme)}
            className="p-2 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground active:scale-95 transition-all relative overflow-hidden"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center justify-center"
              >
                {isDark ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        );
      }}
    </ThemeToggler>
  );
}
