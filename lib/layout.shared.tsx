import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BarChart2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE } from "@/lib/site";

const SITESTATS_URL =
  process.env.NEXT_PUBLIC_SITESTATS_URL ?? "https://itamiforge.github.io/sitestats/";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: SITE.name,
      url: "/",
    },
    links: [
      {
        text: "Docs",
        url: "/docs",
      },
      {
        text: "Blog",
        url: "/blog",
      },
      {
        text: "Learn",
        url: "/learn",
        active: "nested-url",
      },
      {
        text: "AI ERP",
        url: "/ai-erp",
      },
      {
        text: "About",
        url: "/about",
      },
      {
        text: "Stats",
        url: SITESTATS_URL,
        external: true,
        icon: <BarChart2 size={14} />,
      },
    ],
    githubUrl: SITE.githubRepo,
    themeSwitch: {
      enabled: true,
      mode: "light-dark-system",
      component: <ThemeToggle />,
    },
  };
}
