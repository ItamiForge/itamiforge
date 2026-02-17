#!/usr/bin/env bun
/**
 * Generate projects index page dynamically
 * Scans /content/docs/projects/ for directories with index.mdx
 * and creates /content/docs/projects/index.mdx with project cards
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const PROJECTS_DIR = join(process.cwd(), "content", "docs", "projects");
const OUTPUT_FILE = join(PROJECTS_DIR, "index.mdx");

interface ProjectInfo {
  slug: string;
  title: string;
  description: string;
  path: string;
}

async function extractFrontmatter(
  content: string,
): Promise<{ title: string; description: string }> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return { title: "", description: "" };
  }

  const frontmatter = frontmatterMatch[1];

  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m);

  return {
    title: titleMatch?.[1]?.trim() || "",
    description: descriptionMatch?.[1]?.trim() || "",
  };
}

async function scanProjects(): Promise<ProjectInfo[]> {
  const projects: ProjectInfo[] = [];

  try {
    const entries = await readdir(PROJECTS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const indexPath = join(PROJECTS_DIR, entry.name, "index.mdx");

      try {
        await stat(indexPath);
        const content = await readFile(indexPath, "utf-8");
        const { title, description } = await extractFrontmatter(content);

        if (title) {
          projects.push({
            slug: entry.name,
            title,
            description,
            path: `./${entry.name}`,
          });
        }
      } catch {
        // No index.mdx in this directory, skip
      }
    }
  } catch (error) {
    console.error("Error scanning projects:", error);
    process.exit(1);
  }

  // Sort alphabetically by title
  return projects.sort((a, b) => a.title.localeCompare(b.title));
}

function generateIndexPage(projects: ProjectInfo[]): string {
  const cards = projects
    .map(
      (
        project,
      ) => `  <Link href="${project.path}" className="card block h-full no-underline">
    <h3 className="text-xl font-semibold tracking-tight">${project.title}</h3>
    <p className="mt-3 text-sm text-muted-foreground leading-6">${project.description}</p>
  </Link>`,
    )
    .join("\n");

  return `---
title: Projects
description: A collection of tools and experiments.
---

import Link from "next/link";

<div className="bento-grid my-8">
${cards}
</div>

`;
}

async function main() {
  console.log("🔍 Scanning projects...");
  const projects = await scanProjects();
  console.log(`✅ Found ${projects.length} projects`);

  console.log("📝 Generating index.mdx...");
  const content = generateIndexPage(projects);

  await Bun.write(OUTPUT_FILE, content);
  console.log(`✅ Written to ${OUTPUT_FILE}`);

  console.log("\n📋 Projects included:");
  for (const project of projects) {
    console.log(`  - ${project.title}`);
  }
}

main();
