import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { SITE } from "@/lib/site";

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
        text: "AI ERP",
        url: "/ai-erp",
      },
      {
        text: "About",
        url: "/about",
      },
    ],
    githubUrl: SITE.githubRepo,
    themeSwitch: {
      enabled: true,
      mode: "light-dark-system",
    },
  };
}
