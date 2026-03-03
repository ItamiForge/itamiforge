import Link from "next/link";
import { InkSplashReveal } from "@/components/ink-splash-reveal";
import { ProjectCard } from "@/components/project-card";
import { featuredProjects, publicProjects } from "@/lib/projects";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-10">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <InkSplashReveal
            as="h1"
            className="display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Game and App studio.
          </InkSplashReveal>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {SITE.description}
          </p>
        </div>
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
    </div>
  );
}
