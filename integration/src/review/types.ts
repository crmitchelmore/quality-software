import type { CanonicalEvent, Finding, ResolvedProfile } from "../contract.js";
import type { LLMClient } from "../llm/types.js";
import type { BuildOptions } from "../model/project-map.js";

export type ChangeStatus = "added" | "modified" | "deleted" | "renamed";

export interface ChangeEntry {
  path: string; // head path (the new path for renames; the removed path for deletes)
  status: ChangeStatus;
  oldPath?: string; // previous path for renames
}

export interface ReviewInput {
  repoRoot: string;
  profile: ResolvedProfile;
  changes: ChangeEntry[];
  /** Content of a path at the BASE ref (undefined if it did not exist there). */
  baseContent: (path: string) => string | undefined;
  buildOpts?: BuildOptions;
  event?: CanonicalEvent;
}

export interface ReviewLLMOptions {
  client: LLMClient;
  catalogueRoot?: string;
  callTimeoutMs?: number;
}

export interface ReviewResult {
  decision: "allow" | "block";
  blocking: Finding[]; // net-new certified violations introduced by the PR
  advisories: Finding[]; // reuse + other non-blocking signals
  findings: Finding[]; // blocking ++ advisories
  summary: string;
}
