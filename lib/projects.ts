export type ProjectStatus = "active" | "experimental" | "concept";
export type ProjectCategory = "cli" | "desktop" | "shell" | "app" | "concept";

export interface ProjectMeta {
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  category: ProjectCategory;
  tags: string[];
  docsPath: `/docs/projects/${string}`;
  sourcePath?: string;
  featured: boolean;
  public: boolean;
  links?: {
    github?: string;
    live?: string;
    docs?: string;
  };
}

export const PROJECTS: ProjectMeta[] = [
  {
    slug: "astro-sumi",
    title: "Astro Sumi",
    summary:
      "Astro-based writing and blog template built for GitHub Pages deployment.",
    status: "active",
    category: "app",
    tags: ["astro", "template", "blog", "github-pages"],
    docsPath: "/docs/projects/astro-sumi",
    sourcePath: "https://github.com/ItamiForge/astro-sumi",
    featured: true,
    public: true,
    links: {
      github: "https://github.com/ItamiForge/astro-sumi",
      live: "https://itamiforge.github.io/astro-sumi/",
      docs: "https://itamiforge.github.io/itamiforge/docs/projects/astro-sumi",
    },
  },
  {
    slug: "kirei",
    title: "Kirei",
    summary: "A fast and safe macOS cleaner with both CLI and TUI workflows.",
    status: "active",
    category: "desktop",
    tags: ["rust", "tauri", "macos", "cleaning"],
    docsPath: "/docs/projects/kirei",
    featured: true,
    public: true,
    links: {
      github: "https://github.com/ItamiForge/kirei",
      docs: "https://itamiforge.github.io/itamiforge/docs/projects/kirei",
    },
  },
  {
    slug: "port-finder",
    title: "Port Finder",
    summary:
      "Cross-platform CLI + TUI for finding and reclaiming busy ports quickly.",
    status: "active",
    category: "cli",
    tags: ["rust", "networking", "terminal"],
    docsPath: "/docs/projects/port-finder",
    sourcePath: "https://github.com/ItamiForge/port-finder",
    featured: true,
    public: true,
    links: {
      github: "https://github.com/ItamiForge/port-finder",
      docs: "https://itamiforge.github.io/itamiforge/docs/projects/port-finder",
    },
  },
  {
    slug: "goto",
    title: "goto",
    summary:
      "Navigate to projects using namespace-based paths with tab completion.",
    status: "active",
    category: "shell",
    tags: ["rust", "productivity", "shell"],
    docsPath: "/docs/projects/goto",
    sourcePath: "https://github.com/ItamiForge/goto",
    featured: false,
    public: true,
    links: {
      github: "https://github.com/ItamiForge/goto",
      docs: "https://itamiforge.github.io/itamiforge/docs/projects/goto",
    },
  },
  {
    slug: "mcp-react-native-toolkit",
    title: "MCP React Native Toolkit",
    summary:
      "Local MCP server for React Native + Expo docs, tooling, and device automation.",
    status: "active",
    category: "app",
    tags: ["typescript", "mcp", "react-native", "expo"],
    docsPath: "/docs/projects/mcp-react-native-toolkit",
    sourcePath: "https://github.com/ItamiForge/mcp-react-native-toolkit",
    featured: true,
    public: true,
    links: {
      github: "https://github.com/ItamiForge/mcp-react-native-toolkit",
      docs: "https://itamiforge.github.io/itamiforge/docs/projects/mcp-react-native-toolkit",
    },
  },
  {
    slug: "kageasset",
    title: "KageAsset",
    summary:
      "Cross-platform CLI that scans image assets and generates structured metadata summaries.",
    status: "experimental",
    category: "cli",
    tags: ["rust", "assets", "cli", "tooling"],
    docsPath: "/docs/projects/kageasset",
    sourcePath: "https://github.com/ItamiForge/kageasset",
    featured: false,
    public: true,
    links: {
      github: "https://github.com/ItamiForge/kageasset",
      docs: "https://itamiforge.github.io/itamiforge/docs/projects/kageasset",
    },
  },
  {
    slug: "itamiforge-site",
    title: "ItamiForge Site",
    summary:
      "Portfolio and documentation hub built with Next.js App Router and Fumadocs.",
    status: "experimental",
    category: "app",
    tags: ["nextjs", "fumadocs", "typescript", "portfolio"],
    docsPath: "/docs/projects/itamiforge-site",
    sourcePath: "https://github.com/ItamiForge/itamiforge",
    featured: false,
    public: true,
    links: {
      github: "https://github.com/ItamiForge/itamiforge",
      live: "https://itamiforge.github.io/itamiforge/",
      docs: "https://itamiforge.github.io/itamiforge/docs/projects/itamiforge-site",
    },
  },
  {
    slug: "ai-erp-core",
    title: "AI ERP Core",
    summary:
      "Private operations platform for SOP execution, production visibility, and analytics.",
    status: "active",
    category: "app",
    tags: ["private", "erp", "ai", "operations"],
    docsPath: "/docs/projects/ai-erp-core",
    sourcePath: "private/ai-erp-core",
    featured: false,
    public: false,
  },
  {
    slug: "developer-blog-theme",
    title: "Developer Blog Theme",
    summary:
      "Private in-progress template and content workflow for internal publishing.",
    status: "experimental",
    category: "app",
    tags: ["private", "astro", "theme", "internal"],
    docsPath: "/docs/projects/developer-blog-theme",
    sourcePath: "private/developer-blog-theme",
    featured: false,
    public: false,
  },
];

export const publicProjects = PROJECTS.filter((project) => project.public);
export const featuredProjects = publicProjects.filter(
  (project) => project.featured,
);
