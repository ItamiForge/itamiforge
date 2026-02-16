import { Download, MoveRight } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function AboutPage() {
  const experiences = [
    {
      role: "Senior Manager",
      company: "AbInBev",
      period: "03/2024 - 01/2025",
      location: "Bengaluru, KA",
      description: [
        "Led the effort to build in-house supply chain solution for end-to-end automated process control in breweries.",
        "Core product collected data from brewery floor real time, made predictions from pre-built ML models, and controlled equipments to achieve various desired outputs throughout the brewery and packaging lines.",
      ],
    },
    {
      role: "Global Analytics Manager",
      company: "AbInBev",
      period: "05/2022 - 03/2024",
      location: "Bengaluru, KA",
      description: [
        "Lead data scientist for analytics projects undertaken globally in Supply.",
        "Liaison between the 6 zones and the global function for projects around brewing quality and efficiency, AIML platform and analytical solution building; aggregate to the tune of 1M USD capex/opex with benefits around 2-3M USD.",
      ],
    },
    {
      role: "Lead Data Scientist",
      company: "Tesco Bengaluru",
      period: "05/2020 - 05/2022",
      location: "Bengaluru, KA",
      description: [
        "Designed and built an in-house product for test-control experimentation and review, to test experiments ranging from Store layout changes to product core set launch/tweaks and digital platform A/B testing.",
        "The tech stack was Hadoop Eco-system, dash web framework, deployment on the inhouse cloud platform with custom VMs and load balancer setup.",
      ],
    },
    {
      role: "Data Science Specialist",
      company: "Bain & Company",
      period: "06/2019 - 05/2020",
      location: "Bengaluru, KA",
      description: [
        "A varied experience working across business problems in the strategy consulting side, to creating products as part of the internal IP development.",
        "Bain provided a generous platform that enabled me to find my strengths and interests, and the stint, albeit short, added significant maturity and understanding of fundamental problem solving.",
        "Built a Supplier Negotiation Tool for the Retail practice with MetroChina being one of the customers.",
      ],
    },
    {
      role: "Associate",
      company: "TheMathCompany",
      period: "07/2018 - 06/2019",
      location: "Bengaluru, KA",
      description: [
        "Onsite consultant at one of the largest beverage companies in the world.",
        "Global framework to identify and retain employees at risk of attrition (~6k employees worldwide).",
        "Tool for quantifying yearly performance of employees.",
        "Part of the core Hiring and Training people in Data Science.",
        "Deployed solutions on Azure (Databricks, Datalakes, MySQL) with mostly frameworks.",
      ],
    },
    {
      role: "Data Scientist",
      company: "Mu Sigma",
      period: "05/2015 - 07/2018",
      location: "Bengaluru, KA",
      description: [
        "Part of a customer churn/retention problem, creating a prediction model for a major insurance client to help make low level decisions easier, and scaled for their entire Asia - Pacific region (4 months).",
        "Created the foundation for enabling machine learning based decision making for their global analytics department (platform - R).",
        "Created Excel VBA automation tools, Qlikview decision boards for one of the biggest life insurance companies as part of a process of optimising their business. Prototype towards creating value for their Russian entity (10 months).",
        "Presales experience in both pitching and handling discovery phase of projects across insurance, retail and government transportation domains. One specific one being for a US state department of transportation, in partnership with a leading design consultancy firm (3 months).",
        "Forecasting project for a food services company to improve logistics efforts with more accurate sales predictions (4 months).",
        "Retail project doing batch forecasting of new products and their cannibalisation of existing products. Part of the process involved in deploying them into the digital platform back-end (7 months).",
        "Primary contributor in a novel project for a huge Swiss bank, involving generating synthetic test data for offshore app-development, with minimal touch points with production (4 months).",
        "Consolidation project for a major footwear company to integrate their manufacturing supply/demand dashboards/workflows (4 months).",
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
    <div className="container mx-auto max-w-5xl py-12 space-y-16 px-6 md:px-0">
      {/* Header Section */}
      <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
          <div className="space-y-4">
            <h1 className="font-display text-7xl md:text-8xl font-medium tracking-tight text-primary">
              Varun V
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed">
              Engineer and Consultant with a decade of experience in Data,
              Analytics, and Software.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 text-sm font-mono text-muted-foreground uppercase tracking-wider">
            <a
              href="/resume.txt"
              download
              className="group flex items-center gap-2 px-4 py-2 border border-border rounded-full hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 mb-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
            <div className="flex gap-4">
              <p>Bengaluru, India</p>
              <span>/</span>
              <Link
                href="mailto:varunrajan@protonmail.com"
                className="hover:text-foreground transition-colors border-b border-transparent hover:border-foreground"
              >
                varunrajan@protonmail.com
              </Link>
            </div>
            <p>+91 9916014327</p>
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
              Worked in Retail, Banking, Insurance, FMCG, and Manufacturing
              industries. Expertise lies in building analytics strategy, product
              development, and AIML solutioning.
            </p>
            <p>
              Recent experience has been in game dev and mobile apps, working as
              an indie solo developer.
            </p>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bento-card-wide card p-8 space-y-6">
          <p className="eyebrow text-muted-foreground">Technical Arsenal</p>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="tag-pill bg-secondary/50 text-secondary-foreground hover:bg-muted hover:text-foreground transition-all duration-200 font-medium px-3 py-1 text-sm border-transparent hover:border-border"
              >
                {skill}
              </span>
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
              <span className="uppercase tracking-wide text-xs font-semibold">
                LinkedIn
              </span>
              <MoveRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={SITE.githubRepo}
              target="_blank"
              className="btn bg-background hover:bg-secondary w-full justify-between group"
            >
              <span className="uppercase tracking-wide text-xs font-semibold">
                Github
              </span>
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

              <ul className="list-none space-y-3 text-muted-foreground/90 font-light leading-relaxed">
                {exp.description.map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 group-hover:bg-primary transition-colors duration-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
