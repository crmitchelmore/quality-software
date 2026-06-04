import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Detector, Finding, ChangeSet, DetectorContext } from "../contract.js";
import { fingerprint } from "../contract.js";
import { relPath } from "./util.js";
import { factsFor } from "./facts.js";
import { walkAllFiles } from "../fs-util.js";
import { isTestPath } from "../model/layers.js";

/**
 * Names so common across unrelated modules that a bare name collision carries
 * essentially no reuse signal (every codebase has many independent `Result`s,
 * `Options`, `Config`s …). Flagging them trains the agent to ignore ALL reuse
 * advice, so they are suppressed at write-time. Domain-specific duplication
 * (`calculateVat`, `OrderTotal`) still surfaces.
 */
const NOISY_NAMES = new Set(
  [
    "result", "options", "option", "config", "configuration", "context", "handler",
    "service", "controller", "repository", "manager", "factory", "builder", "provider",
    "client", "request", "response", "error", "exception", "logger", "module", "props",
    "state", "store", "model", "entity", "dto", "mapper", "type", "types", "data",
    "item", "items", "value", "values", "key", "node", "event", "command", "query",
    "id", "name", "status", "default", "index", "main", "app", "base", "util", "utils",
    "helper", "helpers", "constants", "schema", "validator", "filter", "create", "update",
    "delete", "get", "list", "find", "run", "execute", "init", "setup", "test",
  ],
);

/** A declared name worth indexing/flagging for reuse: long enough and not noisy. */
function isMeaningfulName(name: string): boolean {
  if (name.length < 4) return false;
  return !NOISY_NAMES.has(name.toLowerCase());
}

/** Barrel/re-export aggregators (`index.ts`, `mod.rs`, `__init__.py`) carry no original code. */
function isBarrelPath(rel: string): boolean {
  return /(^|\/)(index|mod|__init__|package)\.[a-z]+$/i.test(rel);
}

/** Generated code should never be offered as the canonical home to reuse. */
function isGeneratedPath(rel: string): boolean {
  return /(^|\/)(generated|gen|build|dist|out|node_modules|\.next|target|__generated__)(\/|$)/i.test(rel) ||
    /\.(g|generated)\.[a-z]+$/i.test(rel);
}

/** Files that should be neither indexed as a reuse home nor flagged as duplicators. */
function isSkippablePath(rel: string): boolean {
  return isTestPath(rel) || isBarrelPath(rel) || isGeneratedPath(rel);
}

/**
 * Reuse detector (design 07-reuse-enforcement + 13.9). Flags when a change adds a
 * declared symbol whose name already exists elsewhere in the codebase — "this
 * abstraction may already exist; reuse rather than reinvent".
 *
 * Now LANGUAGE-NEUTRAL: declarations come from the neutral code model (FileFacts
 * via the provider registry), so duplicate-symbol reuse is detected across
 * TypeScript, Kotlin, Java and Python alike, not just JS `export`s.
 *
 * MVP scope: NEAR-EXACT name match only, ADVISORY only (no blocking). Embedding/
 * semantic similarity is deferred — it produces false positives unless corroborated
 * by lexical/signature evidence (design 13.9). The repo index is cached by file
 * mtime/size so write-time checks do not repeatedly re-parse unchanged projects.
 */

function declaredNames(rel: string, content: string): string[] {
  const facts = factsFor(rel, content);
  if (!facts) return [];
  const names = new Set<string>();
  for (const e of facts.exports) {
    if (e.kind === "reexport" || e.name === "default") continue;
    if (!isMeaningfulName(e.name)) continue;
    names.add(e.name);
  }
  return [...names];
}

interface IndexedFile {
  rel: string;
  abs: string;
  signature: string;
}

interface CachedReuseIndex {
  signature: string;
  index: Map<string, string[]>;
}

const reuseIndexCache = new Map<string, CachedReuseIndex>();

function reusableFiles(repoRoot: string, srcGlobs: string[]): IndexedFile[] {
  const files: IndexedFile[] = [];
  for (const dir of srcGlobs) {
    for (const abs of walkAllFiles(join(repoRoot, dir))) {
      const rel = relPath(repoRoot, abs);
      if (isSkippablePath(rel)) continue;
      try {
        const st = statSync(abs);
        files.push({ rel, abs, signature: `${rel}:${st.size}:${st.mtimeMs}` });
      } catch {
        continue;
      }
    }
  }
  return files.sort((a, b) => a.rel.localeCompare(b.rel));
}

function cachedReuseIndex(repoRoot: string, srcGlobs: string[]): Map<string, string[]> {
  const files = reusableFiles(repoRoot, srcGlobs);
  const signature = files.map((f) => f.signature).join("\n");
  const cacheKey = `${repoRoot}\0${srcGlobs.join("\0")}`;
  const cached = reuseIndexCache.get(cacheKey);
  if (cached?.signature === signature) return cached.index;

  const index = new Map<string, string[]>();
  for (const file of files) {
    let content: string;
    try {
      content = readFileSync(file.abs, "utf8");
    } catch {
      continue;
    }
    for (const name of declaredNames(file.rel, content)) {
      const arr = index.get(name) ?? [];
      arr.push(file.rel);
      index.set(name, arr);
    }
  }
  reuseIndexCache.set(cacheKey, { signature, index });
  return index;
}

export function reuseDetector(srcGlobs: string[] = ["src"]): Detector {
  const version = "1.1.0";
  return {
    id: "reuse.duplicate-export",
    version,
    requiresContext: "repo",
    events: ["POST_WRITE_CONTENT", "PR_REVIEW", "BATCH"],
    canBlock: false,
    maxLatencyMs: 400,
    run(change: ChangeSet, _ctx: DetectorContext): Finding[] {
      const changedRel = new Set(change.files.map((f) => relPath(change.repoRoot, f.path)));
      const index = cachedReuseIndex(change.repoRoot, srcGlobs);

      const findings: Finding[] = [];
      for (const file of change.files) {
        if (!file.content) continue;
        const rel = relPath(change.repoRoot, file.path);
        if (isSkippablePath(rel)) continue;
        for (const name of declaredNames(rel, file.content)) {
          const existing = (index.get(name) ?? []).filter((path) => !changedRel.has(path));
          if (existing && existing.length) {
            const evidence = `declares ${name}`;
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
              message: `Possible duplicate: '${name}' is already declared by ${existing[0]}${
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
