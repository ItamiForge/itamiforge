import { z } from "zod";

export const projectStatusSchema = z.enum(["active", "experimental", "concept", "archived"]);
export const projectCategorySchema = z.enum([
  "cli",
  "desktop",
  "shell",
  "app",
  "concept",
  "library",
  "game",
]);
export const projectVisibilitySchema = z.enum(["public", "stub"]);

export const optedOutContractSchema = z.object({
  catalog: z.literal(false),
});

export const optedInContractSchema = z.object({
  catalog: z.literal(true),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: projectStatusSchema,
  category: projectCategorySchema,
  featured: z.boolean().default(false),
  visibility: projectVisibilitySchema.default("public"),
  tags: z.array(z.string()).default([]),
  live: z.string().min(1).optional(),
  install: z.string().min(1).optional(),
});

export const repoContractSchema = z.union([optedOutContractSchema, optedInContractSchema]);

export const allowlistEntrySchema = z.object({
  repo: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
  slug: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  status: projectStatusSchema.optional(),
  category: projectCategorySchema.optional(),
  featured: z.boolean().optional(),
  visibility: projectVisibilitySchema.optional(),
  tags: z.array(z.string()).optional(),
  live: z.string().optional(),
  install: z.string().optional(),
});

export const policySchema = z.object({
  orgs: z.array(z.string()).min(1),
  contractFile: z.string().default(".itamiforge.yml"),
  denylist: z.array(z.string()).default([]),
  allowlist: z.array(allowlistEntrySchema).default([]),
});

export const membershipReasonSchema = z.enum([
  "denylist",
  "fork",
  "invalid_contract",
  "opted_out",
  "yaml",
  "allowlist",
  "no_contract",
  "private_omitted",
]);

export const catalogProjectSchema = z.object({
  repo: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  status: projectStatusSchema,
  category: projectCategorySchema,
  featured: z.boolean(),
  visibility: projectVisibilitySchema,
  public: z.boolean(),
  tags: z.array(z.string()),
  language: z.string().nullable(),
  github: z.string().optional(),
  live: z.string().optional(),
  install: z.string().optional(),
  pushedAt: z.string().nullable(),
  archived: z.boolean(),
  reason: z.enum(["yaml", "allowlist"]),
});

export const catalogExcludedSchema = z.object({
  repo: z.string(),
  reason: z.enum(["denylist", "fork", "invalid_contract", "opted_out", "no_contract"]),
  detail: z.string().optional(),
});

export const catalogSnapshotSchema = z.object({
  generatedAt: z.string(),
  source: z.string(),
  included: z.array(catalogProjectSchema),
  excluded: z.array(catalogExcludedSchema),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type ProjectCategory = z.infer<typeof projectCategorySchema>;
export type ProjectVisibility = z.infer<typeof projectVisibilitySchema>;
export type RepoContract = z.infer<typeof repoContractSchema>;
export type OptedInContract = z.infer<typeof optedInContractSchema>;
export type AllowlistEntry = z.infer<typeof allowlistEntrySchema>;
export type CatalogPolicy = z.infer<typeof policySchema>;
export type MembershipReason = z.infer<typeof membershipReasonSchema>;
export type CatalogProject = z.infer<typeof catalogProjectSchema>;
export type CatalogExcluded = z.infer<typeof catalogExcludedSchema>;
export type CatalogSnapshot = z.infer<typeof catalogSnapshotSchema>;
