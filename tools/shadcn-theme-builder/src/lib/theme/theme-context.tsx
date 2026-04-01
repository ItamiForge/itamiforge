"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
};

export type ThemeState = {
  mode: "light" | "dark";
  colors: ThemeColors;
  radius: number;
  font: string;
  setMode: (mode: "light" | "dark") => void;
  setColors: (colors: Partial<ThemeColors>) => void;
  setRadius: (radius: number) => void;
  setFont: (font: string) => void;
};

const defaultColors: ThemeColors = {
  background: "0 0% 100%",
  foreground: "222.2 84% 4.9%",
  card: "0 0% 100%",
  cardForeground: "222.2 84% 4.9%",
  popover: "0 0% 100%",
  popoverForeground: "222.2 84% 4.9%",
  primary: "222.2 47.4% 11.2%",
  primaryForeground: "210 40% 98%",
  secondary: "210 40% 96.1%",
  secondaryForeground: "222.2 47.4% 11.2%",
  muted: "210 40% 96.1%",
  mutedForeground: "215.4 16.3% 46.9%",
  accent: "210 40% 96.1%",
  accentForeground: "222.2 47.4% 11.2%",
  destructive: "0 84.2% 60.2%",
  destructiveForeground: "210 40% 98%",
  border: "214.3 31.8% 91.4%",
  input: "214.3 31.8% 91.4%",
  ring: "222.2 84% 4.9%",
  chart1: "12 76% 61%",
  chart2: "173 58% 39%",
  chart3: "197 37% 24%",
  chart4: "43 74% 66%",
  chart5: "27 87% 67%",
};

const ThemeContext = createContext<ThemeState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [colors, setColorsState] = useState<ThemeColors>(defaultColors);
  const [radius, setRadius] = useState(0.5);
  const [font, setFont] = useState("Inter");

  const setColors = (newColors: Partial<ThemeColors>) => {
    setColorsState((prev) => ({ ...prev, ...newColors }));
  };

  // Effect to update CSS variables when state changes
  useEffect(() => {
    const root = document.documentElement;

    // Update colors
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Update radius
    root.style.setProperty("--radius", `${radius}rem`);

    // Update Class for Dark Mode
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [colors, radius, mode]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colors,
        radius,
        font,
        setMode,
        setColors,
        setRadius,
        setFont,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
