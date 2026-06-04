import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load as parseYaml } from "js-yaml";
import type { Finding } from "./contract.js";

export interface FindingException {
  fingerprint: string;
  reason: string;
  expires?: string;
}

export interface FindingExceptions {
  entries: FindingException[];
  fingerprints: Set<string>;
  warnings: string[];
}

function empty(): FindingExceptions {
  return { entries: [], fingerprints: new Set(), warnings: [] };
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function loadFindingExceptions(repoRoot: string): FindingExceptions {
  const path = join(repoRoot, "patterns.exceptions.yaml");
  if (!existsSync(path)) return empty();

  let raw: unknown;
  try {
    raw = parseYaml(readFileSync(path, "utf8"));
  } catch (e) {
    return {
      ...empty(),
      warnings: [`Could not parse patterns.exceptions.yaml: ${(e as Error).message}`],
    };
  }

  const top = asRecord(raw);
  const rawEntries = Array.isArray(top?.exceptions) ? top.exceptions : undefined;
  if (!rawEntries) {
    return { ...empty(), warnings: ["patterns.exceptions.yaml must contain an exceptions list."] };
  }

  const entries: FindingException[] = [];
  const warnings: string[] = [];
  for (const [index, value] of rawEntries.entries()) {
    const entry = asRecord(value);
    const fingerprint = typeof entry?.fingerprint === "string" ? entry.fingerprint.trim() : "";
    const reason = typeof entry?.reason === "string" ? entry.reason.trim() : "";
    const expires = typeof entry?.expires === "string" ? entry.expires.trim() : undefined;
    if (!fingerprint) {
      warnings.push(`exceptions[${index}] missing required fingerprint.`);
      continue;
    }
    if (!reason) {
      warnings.push(`exceptions[${index}] for ${fingerprint} missing required reason.`);
      continue;
    }
    entries.push({ fingerprint, reason, expires });
  }

  return { entries, fingerprints: new Set(entries.map((e) => e.fingerprint)), warnings };
}

export function filterSuppressedFindings(findings: Finding[], exceptions: FindingExceptions): Finding[] {
  if (exceptions.fingerprints.size === 0) return findings;
  return findings.filter((f) => !exceptions.fingerprints.has(f.fingerprint));
}
