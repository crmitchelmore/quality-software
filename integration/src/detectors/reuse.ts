import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detector, Finding, ChangeSet, DetectorContext } from "../contract.js";
import { fingerprint } from "../contract.js";
import { relPath } from "./util.js";
import { walkSourceFiles } from "../fs-util.js";

/**
 * Reuse detector (design 07-reuse-enforcement + 13.9). Flags when a change adds
 * an exported symbol whose name already exists elsewhere in the codebase —
 * "this abstraction may already exist; reuse rather than reinvent".
 *
 * MVP scope: NEAR-EXACT name match only, ADVISORY only (no blocking). Embedding/
 * semantic similarity is deferred — it produces false positives unless
 * corroborated by lexical/signature evidence (design 13.9). The index is rebuilt
 * per run for simplicity; a real deployment caches it (design 2.5).
 */

const EXPORT_RE = /export\s+(?:async\s+)?(?:function|class|const|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g;

function exportsIn(content: string): string[] {
  const names = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(EXPORT_RE.source, "g");
  while ((m = re.exec(content))) names.add(m[1]);
  return [...names];
}

export function reuseDetector(srcGlobs: string[] = ["src"]): Detector {
  const version = "1.0.0";
  return {
    id: "reuse.duplicate-export",
    version,
    requiresContext: "repo",
    events: ["POST_WRITE_CONTENT", "PR_REVIEW", "BATCH"],
    canBlock: false,
    maxLatencyMs: 400,
    run(change: ChangeSet, _ctx: DetectorContext): Finding[] {
      const changedRel = new Set(change.files.map((f) => relPath(change.repoRoot, f.path)));

      // Build an index of existing exported names -> files (excluding changed files).
      const index = new Map<string, string[]>();
      for (const dir of srcGlobs) {
        for (const abs of walkSourceFiles(join(change.repoRoot, dir))) {
          const rel = relPath(change.repoRoot, abs);
          if (changedRel.has(rel)) continue;
          let content: string;
          try {
            content = readFileSync(abs, "utf8");
          } catch {
            continue;
          }
          for (const name of exportsIn(content)) {
            const arr = index.get(name) ?? [];
            arr.push(rel);
            index.set(name, arr);
          }
        }
      }

      const findings: Finding[] = [];
      for (const file of change.files) {
        if (!file.content) continue;
        const rel = relPath(change.repoRoot, file.path);
        for (const name of exportsIn(file.content)) {
          const existing = index.get(name);
          if (existing && existing.length) {
            const evidence = `export ${name}`;
            findings.push({
              fingerprint: fingerprint({
                detectorId: "reuse.duplicate-export",
                detectorVersion: version,
                symbol: name,
                evidence,
                scopePath: rel,
              }),
              detectorId: "reuse.duplicate-export",
              detectorVersion: version,
              severity: "advice",
              path: rel,
              message: `Possible duplicate: '${name}' is already exported by ${existing[0]}${
                existing.length > 1 ? ` (+${existing.length - 1} more)` : ""
              }.`,
              suggestion: `Reuse the existing '${name}' from ${existing[0]} instead of defining a parallel one, or rename if genuinely distinct.`,
              evidence,
            });
          }
        }
      }
      return findings;
    },
  };
}
