import type { CatalogProject, ProjectCategory, ProjectStatus } from "@/lib/catalog/schema";
import { catalogSnapshotSchema } from "@/lib/catalog/schema";
import snapshotJson from "../catalog/snapshot.json";

export type { ProjectCategory, ProjectStatus };

export type ProjectMeta = CatalogProject;

export const catalogSnapshot = catalogSnapshotSchema.parse(snapshotJson);
export const PROJECTS: ProjectMeta[] = catalogSnapshot.included;
export const publicProjects = PROJECTS.filter((project) => project.public);
export const featuredProjects = publicProjects.filter((project) => project.featured);
export const excludedRepos = catalogSnapshot.excluded;

export function projectCatalogHref(slug: string): `/docs/projects/#${string}` {
  return `/docs/projects/#${slug}`;
}

const PROJECT_GUIDES = {
  "astro-sumi": "/docs/projects/astro-sumi",
} as const;

export function projectGuideHref(slug: string): string | undefined {
  if (slug in PROJECT_GUIDES) {
    return PROJECT_GUIDES[slug as keyof typeof PROJECT_GUIDES];
  }

  return undefined;
}
