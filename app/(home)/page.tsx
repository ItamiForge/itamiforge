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
            Building systems.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {SITE.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs" className="btn btn-primary">
              Docs
            </Link>
            <Link href="/blog" className="btn btn-secondary">
              Blog
            </Link>
          </div>
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            <div className="card-subtle px-4 py-3">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="mt-2 text-2xl font-semibold">{activeCount}</p>
            </div>
            <div className="card-subtle px-4 py-3">
              <p className="text-xs text-muted-foreground">Concept</p>
              <p className="mt-2 text-2xl font-semibold">{conceptCount}</p>
            </div>
          </div>
        </div>

        <aside className="card-subtle h-fit space-y-6 p-6">
          <div>
            <p className="eyebrow text-muted-foreground">Focus</p>
            <h2 className="mt-3 text-2xl font-semibold">Durable tooling.</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>CLI, TUI, and documentation for daily workflows.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card px-4 py-3">
                <p className="text-xs text-muted-foreground">Stack</p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  Rust · Next.js
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Projects</h2>
          </div>
          <Link href="/docs/projects" className="btn">
            All projects
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
          <h3 className="mt-3 text-2xl font-semibold">Manuals.</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Install steps and operational notes.
          </p>
          <Link href="/docs" className="btn mt-5 w-fit">
            Read
          </Link>
        </article>
        <article className="card">
          <p className="eyebrow text-muted-foreground">Notes</p>
          <h3 className="mt-3 text-2xl font-semibold">Logs.</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Field notes and decisions.
          </p>
          <Link href="/docs/notes" className="btn mt-5 w-fit">
            Read
          </Link>
        </article>
        <article className="card">
          <p className="eyebrow text-muted-foreground">Blog</p>
          <h3 className="mt-3 text-2xl font-semibold">Update.</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Longer form thoughts.
          </p>
          <Link href="/blog" className="btn mt-5 w-fit">
            Read
          </Link>
        </article>
      </section>
    </div>
  );
}
