import "./global.css";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import type { Metadata } from "next";
import { PrivacyBanner } from "@/components/privacy-banner";
import { Provider } from "@/components/provider";
import { SITE } from "@/lib/site";
import localFont from "next/font/local";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi_Complete/Fonts/TTF/Satoshi-Variable.ttf",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi_Complete/Fonts/TTF/Satoshi-VariableItalic.ttf",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const synonym = localFont({
  src: [
    {
      path: "../public/fonts/Synonym_Complete/Fonts/TTF/Synonym-Variable.ttf",
      weight: "200 700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const quicksand = localFont({
  src: [
    {
      path: "../public/fonts/Quicksand_Complete/Fonts/TTF/Quicksand-Variable.ttf",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://itamiforge.github.io/itamiforge/"),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${synonym.variable} ${quicksand.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Provider>{children}</Provider>
        <AnalyticsTracker />
        <PrivacyBanner />
      </body>
    </html>
  );
}
