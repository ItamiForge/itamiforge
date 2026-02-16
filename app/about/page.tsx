import Link from "next/link";
import { SITE } from "@/lib/site";

export default function AboutPage() {
  const experiences = [
    {
      role: "Senior Manager",
      company: "AbInBev",
      period: "03/2024 - 01/2025",
      location: "KA",
      description: [
        "Led the effort to build in-house supply chain solution for end-to-end automated process control in breweries",
        "Core product collected data from brewery floor real time, made predictions from pre-built ml models, and controlled equipments to achieve various desired outputs throughout the brewery and packaging lines",
      ],
    },
    {
      role: "Global Analytics Manager",
      company: "AbInBev",
      period: "05/2022 - 03/2024",
      location: "KA",
      description: [
        "Lead data scientist for analytics projects undertaken globally in Supply",
        "Liaison between the 6 zones and the global function for projects around brewing quality and efficiency, AIML platform and analytical solution building; aggregate to the tune of 1M USD capex/opex with benefits around 2-3M USD",
      ],
    },
    {
      role: "Lead Data Scientist",
      company: "Tesco Bengaluru",
      period: "05/2020 - 05/2022",
      location: "KA",
      description: [
        "Designed and built an in-house product for test-control experimentation and review, to test experiments ranging from Store layout changes to product core set launch/tweaks and digital platform A/B testing",
        "The tech stack was Hadoop Eco-system, dash web framework, deployment on the inhouse cloud platform with custom VMs and load balancer setup",
      ],
    },
    {
      role: "Data Science Specialist",
      company: "Bain & Company",
      period: "06/2019 - 05/2020",
      location: "KA",
      description: [
        "A varied experience working across business problems in the strategy consulting side, to creating products as part of the internal IP development",
        "Bain provided a generous platform that enabled me to find my strengths and interests, and the stint, albeit short, added significant maturity and understanding of fundamental problem solving",
        "Built a Supplier Negotiation Tool for the Retail practice with MetroChina being one of the customers",
      ],
    },
    {
      role: "Associate",
      company: "TheMathCompany",
      period: "07/2018 - 06/2019",
      location: "KA",
      description: [
        "Onsite consultant at one of the largest beverage companies in the world",
        "Global framework to identify and retain employees at risk of attrition (~6k employees worldwide)",
        "Tool for quantifying yearly performance of employees",
        "Part of the core Hiring and Training people in Data Science",
        "Deployed solutions on Azure (Databricks, Datalakes, MySQL) with mostly frameworks",
      ],
    },
    {
      role: "Data Scientist",
      company: "Mu Sigma",
      period: "05/2015 - 07/2018",
      location: "KA",
      description: [
        "Part of a customer churn/retention problem, creating a prediction model for a major insurance client to help make low level decisions easier, and scaled for their entire Asia - Pacific region (4 months)",
        "Created the foundation for enabling machine learning based decision making for their global analytics department (platform - R)",
        "Created Excel VBA automation tools, Qlikview decision boards for one of the biggest life insurance companies as part of a process of optimising their business. Prototype towards creating value for their Russian entity (10 months)",
        "Presales experience in both pitching and handling discovery phase of projects across insurance, retail and government transportation domains",
        "Forecasting project for a food services company to improve logistics efforts with more accurate sales predictions (4 months)",
        "Retail project doing batch forecasting of new products and their cannibalisation of existing products. Part of the process involved in deploying them into the digital platform back-end (7 months)",
        "Primary contributor in a novel project for a huge Swiss bank, involving generating synthetic test data for offshore app-development, with minimal touch points with production (4 months)",
        "Consolidation project for a major footwear company to integrate their manufacturing supply/demand dashboards/workflows (4 months)",
      ],
    },
  ];

  const skills = [
    "HTML & CSS",
    "Docker/CICD",
    "SQL",
    "Git",
    "Machine Learning",
    "Python",
    "Dash/Flask",
    "R",
    "Azure Eco-System",
    "GenAI",
  ];

  return (
    <div className="container mx-auto max-w-5xl py-12 space-y-12">
      <section className="space-y-6">
        <div className="border-b border-border pb-6">
          <p className="eyebrow text-muted-foreground mb-2">Resume</p>
          <h1 className="font-display text-6xl font-medium tracking-tight text-primary">
            Varun V
          </h1>
        </div>
        <div className="flex flex-wrap gap-6 text-sm font-mono text-muted-foreground uppercase tracking-wider">
          <p>Bengaluru, India</p>
          <span>/</span>
          <p>9916014327</p>
          <span>/</span>
          <Link
            href="mailto:varunrajan@protonmail.com"
            className="hover:text-foreground transition-colors"
          >
            varunrajan@protonmail.com
          </Link>
        </div>
      </section>

      <div className="bento-grid">
        {/* Summary */}
        <div className="bento-card-wide card p-8 space-y-6">
          <p className="eyebrow text-muted-foreground">01 / Summary</p>
          <div className="space-y-4 text-lg font-display text-foreground/90 leading-relaxed max-w-2xl">
            <p>
              Engineer and Consultant with a decade of experience in Data,
              Analytics and Software. Worked in Retail, Banking, Insurance,
              FMCG, and Manufacturing industries.
            </p>
            <p>
              Expertise lies in building analytics strategy, product
              development, and AIML solutioning. Recent experience has been in
              game dev and mobile apps, working as an indie solo developer.
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="bento-card-wide card p-8 space-y-6">
          <p className="eyebrow text-muted-foreground">02 / Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="tag-pill bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground transition-colors font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bento-card-wide card p-8 space-y-6">
          <p className="eyebrow text-muted-foreground">03 / Education</p>
          <div>
            <h3 className="font-display text-2xl font-medium tracking-tight">
              Amrita School of Engineering
            </h3>
            <div className="flex justify-between items-baseline mt-2 border-t border-border pt-3">
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                B.Tech
              </p>
              <p className="text-sm text-muted-foreground font-mono">01/2015</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bento-card-wide card p-8 space-y-6 flex flex-col justify-between">
          <div>
            <p className="eyebrow text-muted-foreground">04 / Connect</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="btn btn-secondary w-full justify-center uppercase tracking-wide text-xs font-semibold"
            >
              LinkedIn
            </Link>
            <Link
              href={SITE.githubRepo}
              target="_blank"
              className="btn btn-secondary w-full justify-center uppercase tracking-wide text-xs font-semibold"
            >
              Github
            </Link>
          </div>
        </div>

        {/* Experience Header */}
        <div className="col-span-full pt-12 pb-4 border-b border-border">
          <h2 className="font-display text-3xl font-medium tracking-tight">
            Experience
          </h2>
        </div>

        {/* Experience Cards */}
        {experiences.map((exp) => (
          <div
            key={`${exp.company}-${exp.role}`}
            className="bento-card-wide card p-8 space-y-6"
          >
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-display font-medium text-xl tracking-tight text-primary">
                  {exp.role}
                </h3>
                <p className="text-xs font-mono text-muted-foreground">
                  {exp.period}
                </p>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-4 mb-2">
                <p className="text-sm font-mono text-foreground/80">
                  {exp.company}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  {exp.location}
                </p>
              </div>
            </div>

            <ul className="list-none space-y-3 text-sm text-muted-foreground/80 font-light">
              {exp.description.map((item) => (
                <li
                  key={item}
                  className="pl-4 border-l border-border hover:border-primary transition-colors hover:text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
