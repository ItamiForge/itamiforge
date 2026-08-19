import { join } from "node:path";

export const POLICY_PATH = join(process.cwd(), "catalog", "policy.yml");
export const SNAPSHOT_PATH = join(process.cwd(), "catalog", "snapshot.json");
