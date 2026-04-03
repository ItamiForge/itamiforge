#!/usr/bin/env bun
/**
 * Generate notes index page dynamically.
 * Scans /content/docs/notes/ for .mdx note files
 * and creates /content/docs/notes.mdx with recent-note cards.
 */

import { execFile } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const NOTES_DIR = join(process.cwd(), "content", "docs", "notes");
const OUTPUT_FILE = join(process.cwd(), "content", "docs", "notes.mdx");
const META_FILE = join(process.cwd(), "content", "docs", "notes", "meta.json");

interface NoteInfo {
  slug: string;
  title: string;
  description: string;
  updatedAt: Date;
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function extractFrontmatter(
  content: string
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

async function getLastUpdated(relativePath: string, absolutePath: string): Promise<Date> {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      {
        cwd: process.cwd(),
      }
    );
    const gitDate = stdout.trim();

    if (gitDate) {
      const parsed = new Date(gitDate);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  } catch {
    // Fall back to filesystem mtime if git metadata is unavailable.
  }

  const fileStats = await stat(absolutePath);
  return fileStats.mtime;
}

async function scanNotes(): Promise<NoteInfo[]> {
  const notes: NoteInfo[] = [];

  try {
    const entries = await readdir(NOTES_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
        continue;
      }

      const absolutePath = join(NOTES_DIR, entry.name);
      const relativePath = join("content", "docs", "notes", entry.name);
      const slug = entry.name.replace(/\.mdx$/, "");
      const content = await readFile(absolutePath, "utf-8");
      const { title, description } = await extractFrontmatter(content);
      const updatedAt = await getLastUpdated(relativePath, absolutePath);

      notes.push({
        slug,
        title: title || slugToTitle(slug),
        description,
        updatedAt,
      });
    }
  } catch (error) {
    console.error("Error scanning notes:", error);
    process.exit(1);
  }

  return notes.sort((a, b) => {
    const timeDiff = b.updatedAt.getTime() - a.updatedAt.getTime();
    if (timeDiff !== 0) {
      return timeDiff;
    }

    return a.title.localeCompare(b.title);
  });
}

function generateIndexPage(notes: NoteInfo[]): string {
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  const cards = notes
    .map((note) => {
      const title = escapeAttribute(note.title);
      const updatedDate = dateFormatter.format(note.updatedAt);
      const combinedDescription = note.description
        ? `${note.description} Updated ${updatedDate}.`
        : `Updated ${updatedDate}.`;
      const description = escapeAttribute(combinedDescription);

      return `  <Card title="${title}" description="${description}" href="/docs/notes/${note.slug}" />`;
    })
    .join("\n");

  const cardsSection = cards
    ? `<Cards>\n${cards}\n</Cards>`
    : "No notes yet. Add a file in `content/docs/notes/` to populate this section.";

  return `---
title: Notes
description: Working notes for architecture decisions, implementation details, and shipping logs.
---

import { Card, Cards } from "fumadocs-ui/components/card";

Notes are lightweight documents that bridge day-to-day execution and long-form blog posts.

## Recent notes

${cardsSection}

`;
}

function generateMetaFile(notes: NoteInfo[]): string {
  return `${JSON.stringify(
    {
      title: "Notes",
      pages: notes.map((note) => note.slug),
    },
    null,
    2
  )}\n`;
}

async function main() {
  console.log("Scanning notes...");
  const notes = await scanNotes();
  console.log(`Found ${notes.length} notes`);

  console.log("Generating notes.mdx...");
  const notesIndexContent = generateIndexPage(notes);
  const notesMetaContent = generateMetaFile(notes);

  await Bun.write(OUTPUT_FILE, notesIndexContent);
  await Bun.write(META_FILE, notesMetaContent);
  console.log(`Written ${OUTPUT_FILE}`);
  console.log(`Written ${META_FILE}`);
}

main();
