import Link from "next/link";
import GradientText from "@/components/GradientText";
import { ProjectCard } from "@/components/project-card";
import { featuredProjects, publicProjects } from "@/lib/projects";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-10">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <GradientText
            className="display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            colors={["#9a6038", "#668040", "#5a3010", "#85691b", "#502810"]}
            animationSpeed={5}
            direction="horizontal"
            yoyo
          >
            Game and App studio.
          </GradientText>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
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
