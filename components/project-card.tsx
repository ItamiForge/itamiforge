import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";

type ProjectCardProps = {
  project: ProjectMeta;
};

const statusTone: Record<ProjectMeta["status"], string> = {
  active: "status-active",
  experimental: "status-experimental",
  concept: "status-concept",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={project.docsPath} className="card block h-full">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight">
          {project.title}
        </h3>
        <span className={`status-pill ${statusTone[project.status]}`}>
          {project.status}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-6">
        {project.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={`${project.slug}-${tag}`} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        Source: {project.sourcePath}
      </p>
    </Link>
  );
}
