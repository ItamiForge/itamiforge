import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { featuredProjects, publicProjects } from "@/lib/projects";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const activeCount = publicProjects.filter(
    (project) => project.status === "active",
  ).length;
  const conceptCount = publicProjects.filter(
    (project) => project.status === "concept",
  ).length;

  return (
    <div className="space-y-16 pb-10">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <h1 className="display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Minimal systems, practical tools, shipped in the open.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {SITE.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs" className="btn btn-primary">
              Open docs
            </Link>
            <Link href="/blog" className="btn btn-secondary">
              Read blog
            </Link>
            <Link href="/ai-erp" className="btn">
              AI ERP preview
            </Link>
          </div>
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            <div className="card-subtle px-4 py-3">
              <p className="text-xs text-muted-foreground">Active tools</p>
              <p className="mt-2 text-2xl font-semibold">{activeCount}</p>
            </div>
            <div className="card-subtle px-4 py-3">
              <p className="text-xs text-muted-foreground">Concepts</p>
              <p className="mt-2 text-2xl font-semibold">{conceptCount}</p>
            </div>
          </div>
        </div>

        <aside className="card-subtle h-fit space-y-6 p-6">
          <div>
            <p className="eyebrow text-muted-foreground">Studio snapshot</p>
            <h2 className="mt-3 text-2xl font-semibold">
              Focused on durable tooling for daily workflows.
            </h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Building CLI and TUI experiences that ship quickly, stay safe by
              default, and document every decision.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card px-4 py-3">
                <p className="text-xs text-muted-foreground">Primary stack</p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  Rust · Next.js · Fumadocs
                </p>
              </div>
              <div className="card px-4 py-3">
                <p className="text-xs text-muted-foreground">Release mode</p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  Ship early · Iterate weekly
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">Active projects</p>
            <h2 className="text-3xl font-semibold">
              Build log and docs entry points
            </h2>
          </div>
          <Link href="/docs/projects" className="btn">
            View all projects
          </Link>
        </div>

        <div className="bento-grid">
          {featuredProjects.map((project) => (
            <div key={project.slug} className="bento-card-wide">
              <ProjectCard project={project} />
            </div>
          ))}
          {publicProjects
            .filter((project) => !project.featured)
            .map((project) => (
              <div key={project.slug} className="bento-card">
                <ProjectCard project={project} />
              </div>
            ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="card">
          <p className="eyebrow text-muted-foreground">Docs</p>
          <h3 className="mt-3 text-2xl font-semibold">
            Documentation that stays actionable.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Each tool ships with install steps, commands, and operational notes
            that match the real workflows.
          </p>
          <Link href="/docs" className="btn mt-5 w-fit">
            Explore docs
          </Link>
        </article>
        <article className="card">
          <p className="eyebrow text-muted-foreground">Notes</p>
          <h3 className="mt-3 text-2xl font-semibold">
            Working logs, decisions, and planning.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Capture field notes, constraints, and next moves alongside the
            shipping work.
          </p>
          <Link href="/docs/notes" className="btn mt-5 w-fit">
            Read notes
          </Link>
        </article>
        <article className="card">
          <p className="eyebrow text-muted-foreground">Blog</p>
          <h3 className="mt-3 text-2xl font-semibold">
            Longer form build updates and reflections.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            From tooling experiments to product concept threads, captured in one
            place.
          </p>
          <Link href="/blog" className="btn mt-5 w-fit">
            Visit blog
          </Link>
        </article>
      </section>
    </div>
  );
}
