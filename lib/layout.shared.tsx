import { BarChart2 } from "lucide-react";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { SITE } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

const SITESTATS_URL = "https://sitestats.pages.dev/";

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
