import { BookOpenText, Github } from "lucide-react";
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

const statusLabel: Record<ProjectMeta["status"], string> = {
  active: "active",
  experimental: "exp",
  concept: "concept",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const githubUrl = project.links?.github
    ? project.links.github
    : project.sourcePath?.includes("github.com")
      ? project.sourcePath
      : undefined;
  const variant = project.slug.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % 3;

  return (
    <article className={`card project-mini project-mini--v${variant} h-full`}>
      <Link
        href={project.docsPath}
        className="project-mini__stretched"
        aria-label={`${project.title} docs`}
      />

      <div className="project-mini__layout">
        <div className="project-mini__zone project-mini__zone--head">
          <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
        </div>

        <div className="project-mini__zone project-mini__zone--summary">
          <p className="text-sm leading-6">{project.summary}</p>
        </div>

        <div className="project-mini__zone project-mini__zone--signals">
          <span className={`status-pill ${statusTone[project.status]}`}>
            {statusLabel[project.status]}
          </span>
          <span
            className={`visibility-pill ${project.public ? "visibility-oss" : "visibility-private"}`}
          >
            {project.public ? "OSS" : "PRIV"}
          </span>
        </div>

        <div className="project-mini__zone project-mini__zone--tags">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={`${project.slug}-${tag}`} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        <div className="project-mini__zone project-mini__zone--footer">
          <div className="project-mini__meta">
            <span className="meta-chip">{project.category}</span>
            <span className="meta-chip">{project.tags.length} tags</span>
          </div>

          <div className="project-mini__actions">
            <Link
              href={project.docsPath}
              className="project-mini__action"
              aria-label={`${project.title} docs`}
            >
              <BookOpenText className="h-4 w-4" aria-hidden="true" />
            </Link>

            {githubUrl ? (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="project-mini__action"
                aria-label={`${project.title} GitHub repository`}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
