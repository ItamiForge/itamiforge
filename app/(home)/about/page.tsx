import { Clock, Download, Mail, MapPin, MoveRight, Phone } from "lucide-react";
import {
  buildYearlyMonthlyData,
  fetchAllContributions,
  fetchAllUserRepos,
  fetchOrgRepos,
  padCurrentYearToDecember,
  splitByYear,
} from "@/lib/github";
import { GitHubActivity } from "@/components/github-activity";
import Link from "next/link";
import { SITE } from "@/lib/site";

const EXCLUDED_REPOS = new Set(["itamiforge.github.io", "jordanrex.github.io"]);

async function fetchGitHubData() {
  const token = process.env.GH_PAT;

  const [contribData, userRepoStats, orgRepos] = await Promise.all([
    fetchAllContributions("JordanRex"),
    fetchAllUserRepos(token),
    fetchOrgRepos("ItamiForge", token),
  ]);

  // Merge all repos, de-dupe by full_name, exclude profile/site repos
  const seenFullNames = new Set<string>();
  const allRepos = [...userRepoStats.repos, ...orgRepos].filter((r) => {
    if (EXCLUDED_REPOS.has(r.name.toLowerCase())) {
      return false;
    }
    if (seenFullNames.has(r.full_name)) {
      return false;
    }
    seenFullNames.add(r.full_name);
    return true;
  });

  // Sort by updated_at (matches GitHub UI "updated" time — covers pushes, issues, PRs, etc.)
  const recentRepos = allRepos
    .filter((r) => !r.private)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);

  const contributionsByYear = padCurrentYearToDecember(splitByYear(contribData.contributions));
  const yearlyMonthlyData = buildYearlyMonthlyData(
    contribData.contributions,
    contribData.total,
    contribData.years
  );

  return {
    years: contribData.years,
    yearTotals: contribData.total,
    contributionsByYear,
    yearlyMonthlyData,
    publicCount: userRepoStats.publicCount,
    privateCount: userRepoStats.privateCount,
    languageMap: userRepoStats.languageMap,
    recentRepos,
  };
}

type Project = {
  text: string;
  duration?: string;
  client?: string;
  tech?: string[];
  subProjects?: {
    text: string;
    tech?: string[];
  }[];
};

type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  projects: Project[];
};

export default async function AboutPage() {
  const {
    years,
    yearTotals,
    contributionsByYear,
    yearlyMonthlyData,
    publicCount,
    privateCount,
    languageMap,
    recentRepos,
  } = await fetchGitHubData();
  const experiences: Experience[] = [
    {
      role: "Senior Manager",
      company: "AbInBev",
      period: "03/2024 - 01/2025",
      location: "Bengaluru, KA",
      projects: [
        {
          text: "Spearheaded the 'SODA AI' initiative—building an in-house Advanced Process Control (APC) framework for end-to-end automation in breweries. Designed the architecture to stream real-time data from edge devices on the brewery floor to the cloud, execute pre-built predictive ML models, and actuate physical equipment controls to optimize brewing and packaging output.",
          duration: "10 months",
          tech: [
            "FastAPI",
            "Azure",
            "Databricks / Unity Catalog",
            "Medallion Arch",
            "Linux / VMs",
            "Docker / Portainer",
            "CI/CD",
          ],
        },
      ],
    },
    {
      role: "Global Analytics Manager",
      company: "AbInBev",
      period: "05/2022 - 03/2024",
      location: "Bengaluru, KA",
      projects: [
        {
          text: "Spearheaded global analytics projects within the Supply function as the Lead Data Scientist.",
          tech: ["Analytics Strategy"],
        },
        {
          text: "Acted as the primary liaison between six global zones and the central function to drive initiatives around brewing quality, efficiency, AI/ML platform development, and analytical solutions.",
          tech: ["AI/ML Platforms", "Stakeholder Management"],
        },
        {
          text: "Managed a portfolio with approximately $1M USD in CAPEX/OPEX, delivering $2-3M USD in operational benefits.",
          tech: ["Portfolio Management"],
        },
      ],
    },
    {
      role: "Lead Data Scientist",
      company: "Tesco",
      period: "05/2020 - 05/2022",
      location: "Bengaluru, KA",
      projects: [
        {
          text: "Designed and engineered an end-to-end, in-house experimentation platform for measuring A/B tests and test-control initiatives—covering everything from physical store layout adjustments to digital product launches. Built the system entirely from the ground up using the Hadoop ecosystem and Dash web framework, orchestrating the deployment across custom VMs and load balancers on their internal cloud infrastructure.",
          duration: "24 months",
          tech: ["A/B Testing", "Experimentation", "Hadoop", "Dash", "Cloud Infrastructure"],
        },
      ],
    },
    {
      role: "Data Science Specialist",
      company: "Bain & Company",
      period: "06/2019 - 05/2020",
      location: "Bengaluru, KA",
      projects: [
        {
          text: "Collaborated across a variety of business challenges, bridging the gap between strategy consulting and internal IP product development.",
          duration: "7 months",
          tech: ["Strategy Consulting"],
        },
        {
          text: "Developed a Supplier Negotiation Tool for the Retail practice, successfully servicing major clients including Metro China.",
          duration: "4 months",
          tech: ["Retail Analytics", "Tool Development"],
        },
      ],
    },
    {
      role: "Associate",
      company: "TheMathCompany",
      period: "07/2018 - 06/2019",
      location: "Bengaluru, KA",
      projects: [
        {
          text: "Acted as an onsite consultant at AB InBev, embedded directly within their People Analytics team to drive global HR transformation initiatives.",
          duration: "11 months",
          tech: ["Onsite Consulting", "People Analytics"],
          subProjects: [
            {
              text: "Built a global framework to identify and retain employees at risk of attrition, processing data and generating insights for approximately 6,000 employees worldwide.",
              tech: ["Predictive Modeling", "Azure", "Databricks"],
            },
            {
              text: "Developed an analytical tool for accurately quantifying and assessing the functional yearly performance of employees.",
              tech: ["Data Lakes", "MySQL"],
            },
          ],
        },
        {
          text: "Played a core internal role at TheMathCompany, leading technical hiring panels and training new talent entering the Data Science practice.",
          tech: ["Team Leadership", "Hiring & Training"],
        },
      ],
    },
    {
      role: "Data Scientist",
      company: "Mu Sigma",
      period: "05/2015 - 07/2018",
      location: "Bengaluru, KA",
      projects: [
        {
          text: "Created a predictive churn and retention model for a major insurance client, scaling the solution across the Asia-Pacific region.",
          duration: "4 months",
          tech: ["Predictive Modeling", "Insurance"],
        },
        {
          text: "Built the foundational R-based platform to enable machine learning-driven decision-making within a global analytics department.",
          duration: "4 months",
          tech: ["R", "Platform Engineering"],
        },
        {
          text: "Developed Excel VBA automation tools and QlikView decision boards to optimize business processes for a leading life insurance company, including prototyping tools for their Russian entity.",
          duration: "10 months",
          tech: ["Excel VBA", "QlikView", "Business Optimization"],
        },
        {
          text: "Participated in presales execution, pitching and handling the discovery phase of projects across the insurance, retail, and government transportation domains.",
          duration: "3 months",
          tech: ["Presales", "Discovery"],
        },
        {
          text: "Executed a forecasting project for a food services company, improving logistics efficiency through highly accurate sales predictions.",
          duration: "4 months",
          tech: ["Forecasting", "Logistics"],
        },
        {
          text: "Delivered a batch forecasting solution for retail products, analyzing the cannibalization of existing products and deploying the model to a digital back-end platform.",
          duration: "7 months",
          tech: ["Batch Forecasting", "Retail"],
        },
        {
          text: "Contributed to a novel project for a major Swiss bank that involved generating synthetic test data for offshore app development.",
          duration: "4 months",
          tech: ["Synthetic Data Generation"],
        },
      ],
    },
  ];

  const skillCategories = [
    {
      name: "Languages",
      skills: ["Python", "R", "SQL", "TypeScript / JS", "Bash / Shell", "HTML & CSS"],
    },
    {
      name: "Data Science & AI",
      skills: [
        "XGBoost",
        "Machine Learning",
        "Generative AI",
        "Predictive Modeling",
        "Forecasting",
        "A/B Testing",
      ],
    },
    {
      name: "Databases & Big Data",
      skills: ["PostgreSQL", "SQLite", "Snowflake", "Redis", "Neo4j", "Hadoop / Hive", "MySQL"],
    },
    {
      name: "Cloud & Infrastructure",
      skills: ["Azure (Primary)", "AWS", "GCP", "On-Premises Systems"],
    },
    {
      name: "Web Frameworks",
      skills: ["React / Next.js", "Astro", "Dash / Flask"],
    },
    {
      name: "DevOps & Utilities",
      skills: ["Docker", "CI/CD", "Git", "Automation", "Linux / VMs"],
    },
    {
      name: "Games & Apps",
      skills: ["Bevy", "Ebitengine", "Pygame", "Expo", "Ignite Boilerplate"],
    },
  ];

  return (
    <div className="main-page-content container mx-auto max-w-6xl pb-12 space-y-16 px-6 md:px-0">
      {/* Header Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 border-b border-border pb-10">
        <div className="space-y-8">
          {/* Title & Bio */}
          <div className="space-y-6 max-w-3xl">
            <h1 className="font-display text-7xl md:text-8xl font-medium tracking-tight text-primary">
              Varun V
            </h1>
          </div>

          {/* Minimal Details Row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2 text-sm font-mono tracking-wider text-muted-foreground/80">
            {/* Location */}
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-foreground/50" />
              <span className="uppercase text-foreground/80 font-medium">Bengaluru, India</span>
            </div>

            {/* Email */}
            <Link
              href="mailto:varunrajan@protonmail.com"
              className="flex items-center gap-2.5 hover:text-foreground transition-colors group"
            >
              <Mail className="w-4 h-4 text-foreground/50 group-hover:text-foreground transition-colors" />
              <span className="uppercase text-foreground/80 font-medium group-hover:text-foreground transition-colors">
                varunrajan@protonmail.com
              </span>
            </Link>

            {/* Phone */}
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-foreground/50" />
              <span className="font-medium text-foreground/80">+91 9916014327</span>
            </div>

            {/* Resume Download */}
            <a
              href="/resume.txt"
              download
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <Download className="w-4 h-4 text-foreground/50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
              <span className="font-medium uppercase bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:via-amber-600 group-hover:to-emerald-600 dark:group-hover:from-orange-400 dark:group-hover:via-amber-400 dark:group-hover:to-emerald-400 transition-all duration-300">
                Download Resume
              </span>
            </a>
          </div>
        </div>
      </section>

      <div className="bento-grid">
        {/* Summary Card */}
        <div className="bento-card-wide card p-8 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"></div>
          </div>
          <p className="eyebrow text-muted-foreground">Professional Summary</p>
          <div className="space-y-4 text-lg md:text-xl font-display text-foreground/90 leading-relaxed max-w-3xl">
            <p>
              I am an engineer and consultant with a decade of rich experience in Data, Analytics,
              and Software. I've delivered solutions across Retail, Banking, Insurance, FMCG, and
              Manufacturing industries, with deep expertise in building analytics strategy, product
              development, and scalable AI/ML solutions.
            </p>
            <p>
              Recently, I've pivoted my creative focus towards game development and mobile apps,
              operating as an independent solo developer building immersive interactive experiences.
            </p>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bento-card-wide card p-8 space-y-8 relative overflow-hidden">
          <p className="eyebrow text-muted-foreground">Technical Arsenal</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {skillCategories.map((category) => (
              <div key={category.name} className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground/80 font-mono uppercase tracking-wider">
                  {category.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="tag-pill bg-secondary/50 text-secondary-foreground hover:bg-muted hover:text-foreground transition-all duration-200 font-medium px-3 py-1.5 text-xs md:text-sm border-transparent hover:border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Card */}
        <div className="bento-card card p-8 space-y-6 flex flex-col justify-between">
          <p className="eyebrow text-muted-foreground">Education</p>
          <div>
            <h3 className="font-display text-2xl font-medium tracking-tight">
              Amrita School of Engineering
            </h3>
            <div className="flex justify-between items-baseline mt-4 border-t border-border/50 pt-4">
              <p className="text-sm text-foreground/70 font-mono uppercase tracking-wider">
                B.Tech
              </p>
              <p className="text-sm text-muted-foreground font-mono">01/2015</p>
            </div>
          </div>
        </div>

        {/* Connect Card */}
        <div className="bento-card card p-8 space-y-6 flex flex-col justify-between bg-secondary/10">
          <div>
            <p className="eyebrow text-muted-foreground">Connect</p>
            <h3 className="font-display text-2xl font-medium tracking-tight mt-2">
              Let's work together
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="btn bg-background hover:bg-secondary w-full justify-between group"
            >
              <span className="uppercase tracking-wide text-xs font-semibold">LinkedIn</span>
              <MoveRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={SITE.githubRepo}
              target="_blank"
              className="btn bg-background hover:bg-secondary w-full justify-between group"
            >
              <span className="uppercase tracking-wide text-xs font-semibold">Github</span>
              <MoveRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="space-y-8 pt-12">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-4xl font-medium tracking-tight text-primary">
            Experience
          </h2>
          <div className="h-px bg-border flex-1 opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {experiences.map((exp, _index) => (
            <div
              key={`${exp.company}-${exp.role}`}
              className="card p-8 group hover:border-primary/50 transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <h3 className="font-display font-medium text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
                      at
                    </span>
                    <span className="font-medium text-lg">{exp.company}</span>
                  </div>
                </div>
                <div className="flex flex-col md:items-end text-sm font-mono text-muted-foreground bg-secondary/30 px-3 py-1 rounded md:bg-transparent md:p-0">
                  <span>{exp.period}</span>
                  <span className="text-xs opacity-70">{exp.location}</span>
                </div>
              </div>

              <div className="flex flex-col mt-6">
                {exp.projects.map((project, pIdx) => (
                  <div key={`${exp.company}-${exp.role}-${project.text}`} className="group/project">
                    {0 !== pIdx && <hr className="w-full border-t border-border/50 my-6" />}

                    <div className="space-y-4">
                      <p className="text-foreground/80 font-normal leading-relaxed text-sm md:text-base">
                        {project.text}
                      </p>

                      {/* Sub-projects list if any exist */}
                      {project.subProjects && 0 < project.subProjects.length && (
                        <div className="pl-5 space-y-4 border-l border-border/50 ml-2 mt-4 pt-1 pb-1">
                          {project.subProjects.map((sub) => (
                            <div key={sub.text} className="space-y-2 relative">
                              <span className="absolute -left-[25px] top-2 w-1.5 h-1.5 rounded-full bg-border" />
                              <p className="text-muted-foreground/90 text-sm leading-relaxed">
                                {sub.text}
                              </p>
                              {sub.tech && 0 < sub.tech.length && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  {sub.tech.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[10px] text-muted-foreground font-medium px-2 py-0.5 rounded border border-border/30 bg-secondary/10 uppercase tracking-wider"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Project Metadata (Duration & Tech Stack) */}
                      {(project.client ||
                        project.duration ||
                        (project.tech && 0 < project.tech.length)) && (
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          {/* Client specific badge */}
                          {project.client && (
                            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-secondary-foreground uppercase bg-secondary/50 px-2 py-1 rounded-sm tracking-wider">
                              {project.client}
                            </div>
                          )}

                          {project.duration && (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/80 lowercase bg-secondary/20 px-2 py-1 rounded-md border border-border/30">
                              <Clock className="w-3.5 h-3.5 opacity-70" />
                              <span>{project.duration}</span>
                            </div>
                          )}

                          {/* Vertical Separator */}
                          {(project.duration || project.client) &&
                            project.tech &&
                            0 < project.tech.length && (
                              <div className="w-px h-4 bg-border/40 hidden sm:block"></div>
                            )}

                          {project.tech && 0 < project.tech.length && (
                            <div className="flex flex-wrap items-center gap-2">
                              {project.tech.map((t) => (
                                <span
                                  key={t}
                                  className="text-[11px] text-muted-foreground/90 font-medium px-2.5 py-1 rounded-full border border-border/40 bg-background shadow-sm tracking-wide"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Activity Section */}
      {0 < years.length && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-4xl font-medium tracking-tight text-primary">
              Contributions
            </h2>
            <div className="h-px bg-border flex-1 opacity-50" />
          </div>

          <div className="card p-6 md:p-8 overflow-hidden">
            <GitHubActivity
              years={years}
              yearTotals={yearTotals}
              contributionsByYear={contributionsByYear}
              yearlyMonthlyData={yearlyMonthlyData}
              publicCount={publicCount}
              privateCount={privateCount}
              languageMap={languageMap}
              recentRepos={recentRepos}
            />
          </div>
        </div>
      )}
    </div>
  );
}
