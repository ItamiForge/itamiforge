"use client";

import { AnimatePresence, motion } from "framer-motion";
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
        <span className="w-5 h-5 flex items-center justify-center" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className={`relative p-2 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors overflow-hidden ${className || ""}`}
      onClick={() => {
        const toggle = () => setTheme(isDark ? "light" : "dark");

        // Use View Transitions API if available
        if (
          typeof document !== "undefined" &&
          "startViewTransition" in document
        ) {
          (
            document as unknown as {
              startViewTransition: (cb: () => void) => void;
            }
          ).startViewTransition(toggle);
        } else {
          toggle();
        }
      }}
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
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
