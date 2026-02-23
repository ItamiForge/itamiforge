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
  sourcePath?: `tools/${string}`;
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
    sourcePath: "tools/port-finder",
    featured: true,
    public: true,
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
    sourcePath: "tools/goto",
    featured: false,
    public: true,
  },
  {
    slug: "brew-run",
    title: "BrewRun",
    summary:
      "Interactive SOP runner concept for brewery operations and auditability.",
    status: "concept",
    category: "concept",
    tags: ["brewery", "operations", "tui", "consulting"],
    docsPath: "/docs/projects/brew-run",
    sourcePath: "tools/brew-run",
    featured: true,
    public: true,
  },
  {
    slug: "yield-viz",
    title: "YieldViz",
    summary:
      "Analytics concept to visualize process yield losses and financial impact.",
    status: "concept",
    category: "concept",
    tags: ["analytics", "visualization", "brewery"],
    docsPath: "/docs/projects/yield-viz",
    sourcePath: "tools/yield-viz",
    featured: false,
    public: true,
  },
  {
    slug: "shadcn-theme-builder",
    title: "Shadcn Theme Builder",
    summary:
      "Theme prototyping workspace for quickly testing UI tokens and components.",
    status: "experimental",
    category: "app",
    tags: ["nextjs", "shadcn", "design-system"],
    docsPath: "/docs/projects/shadcn-theme-builder",
    sourcePath: "tools/shadcn-theme-builder",
    featured: false,
    public: true,
  },
  {
    slug: "developer-blog-theme",
    title: "Developer Blog Theme",
    summary:
      "Internal work-in-progress template that is intentionally excluded from public docs.",
    status: "experimental",
    category: "app",
    tags: ["astro", "wip", "internal"],
    docsPath: "/docs/projects/developer-blog-theme",
    sourcePath: "tools/developer-blog-theme",
    featured: false,
    public: false,
  },
];

export const publicProjects = PROJECTS.filter((project) => project.public);
export const featuredProjects = publicProjects.filter(
  (project) => project.featured,
);
