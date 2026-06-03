import { readFileSync, existsSync } from "node:fs";
import { load as parseYaml } from "js-yaml";
import type { ResolvedProfile, AdoptedPattern } from "./contract.js";
import type { Catalogue } from "./catalogue.js";

/**
 * Loads and resolves `patterns.config.yaml` (design 09-config.md), which is
 * philosophy-first: philosophies imply patterns and ground the rubric.
 *
 * Coherence is WARN-not-block (design 13.7): the only hard error is a direct
 * contradiction (same pattern adopted and banned). Philosophy tensions and
 * pattern<->philosophy at-odds are warnings requiring a rationale, since the
 * hand-authored graph is not context-free and hybrid architectures are valid.
 */

interface RawProfile {
  projectSize?: string;
  philosophies?: {
    adopt?: ({ id: string; weight?: string } | string)[];
    reject?: ({ id: string; reason?: string } | string)[];
    tie_breakers?: unknown[];
  };
  adopt?: RawAdopt;
  ban?: RawBan;
  /** Generated configs nest patterns under a `patterns:` key. */
  patterns?: { adopt?: RawAdopt; ban?: RawBan };
  practicePatterns?: { adopt?: ({ id: string } & Partial<AdoptedPattern>)[] };
  phases?: Partial<ResolvedProfile["phases"]>;
}

type RawAdopt =
  | ({ id: string } & Partial<AdoptedPattern>)[]
  | Record<string, ({ id: string } & Partial<AdoptedPattern>)[]>;
type RawBan = { id: string; enforcement?: string; reason?: string }[];

const DEFAULT_PHASES: ResolvedProfile["phases"] = {
  // Design 13.3: write-time advisory + fail-open by default.
  write: { enabled: true, mode: "advise", failMode: "open", llm: false, block: false },
  pr: { enabled: true, llm: true, failOn: "block" },
  later: { enabled: true },
};

const idOf = (v: { id: string } | string): string => (typeof v === "string" ? v : v.id);

type RawAdoptEntry = { id: string } & Partial<AdoptedPattern>;

/** Accept either a flat adopt list or one grouped by altitude band, in high→medium→low order. */
function flattenAdopt(adopt: RawProfile["adopt"]): RawAdoptEntry[] {
  if (!adopt) return [];
  if (Array.isArray(adopt)) return adopt;
  const order = ["high", "medium", "low"];
  const keys = [...Object.keys(adopt)].sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi) || a.localeCompare(b);
  });
  return keys.flatMap((k) => adopt[k] ?? []);
}

export class ProfileError extends Error {}

export function loadProfile(path: string, catalogue: Catalogue): ResolvedProfile {
  if (!existsSync(path)) {
    throw new ProfileError(
      `No profile at ${path}. Run \`conformance init\` to generate a candidate profile.`,
    );
  }
  const raw = (parseYaml(readFileSync(path, "utf8")) ?? {}) as RawProfile;
  const warnings: string[] = [];

  const knows = (id: string) => catalogue.nodeById.has(id);

  const philosophiesAdopt = (raw.philosophies?.adopt ?? []).map((v) => ({
    id: idOf(v),
    weight: (typeof v === "object" && v.weight === "secondary" ? "secondary" : "primary") as
      | "primary"
      | "secondary",
  }));
  const philosophiesReject = (raw.philosophies?.reject ?? []).map(idOf);

  // `adopt`/`ban` may live at the top level (hand-written profiles) or nested
  // under `patterns:` (generated configs); `adopt` may be a flat list or grouped
  // by altitude band (`{ high: [...], medium: [...], low: [...] }`).
  const rawAdopt = flattenAdopt(raw.adopt ?? raw.patterns?.adopt);
  const rawBan = raw.ban ?? raw.patterns?.ban ?? [];
  const adopt: AdoptedPattern[] = rawAdopt.map((p) => ({
    id: p.id,
    enforcement: (p.enforcement as AdoptedPattern["enforcement"]) ?? "advise",
    appliesTo: p.appliesTo,
    options: p.options,
    sourcePhilosophy: p.sourcePhilosophy,
  }));
  const ban = rawBan.map((b) => ({
    id: b.id,
    enforcement: b.enforcement ?? "block",
    reason: b.reason,
  }));
  const practicePatterns: AdoptedPattern[] = (raw.practicePatterns?.adopt ?? []).map((p) => ({
    id: p.id,
    enforcement: (p.enforcement as AdoptedPattern["enforcement"]) ?? "advise",
    appliesTo: p.appliesTo,
  }));

  // --- Unknown-id checks (warn; the catalogue may legitimately predate an id) ---
  for (const id of [
    ...philosophiesAdopt.map((p) => p.id),
    ...philosophiesReject,
    ...adopt.map((p) => p.id),
    ...ban.map((b) => b.id),
    ...practicePatterns.map((p) => p.id),
  ]) {
    if (!knows(id)) warnings.push(`Unknown catalogue id in profile: '${id}'.`);
  }

  // --- HARD ERROR: same pattern adopted and banned (the one direct contradiction) ---
  const adoptIds = new Set(adopt.map((p) => p.id));
  const directContradiction = ban.map((b) => b.id).filter((id) => adoptIds.has(id));
  if (directContradiction.length) {
    throw new ProfileError(
      `Profile contradiction — pattern(s) both adopted and banned: ${directContradiction.join(", ")}.`,
    );
  }

  // --- WARN: adopted pattern at odds with an adopted primary philosophy ---
  const primaryPhils = new Set(philosophiesAdopt.filter((p) => p.weight === "primary").map((p) => p.id));
  for (const phil of primaryPhils) {
    for (const odd of catalogue.atOddsForPhilosophy.get(phil) ?? []) {
      if (adoptIds.has(odd)) {
        warnings.push(
          `Pattern '${odd}' is at odds with adopted primary philosophy '${phil}'. ` +
            `Allowed (hybrid architectures are legitimate) but record a rationale.`,
        );
      }
    }
  }

  // --- WARN: two adopted patterns that conflict_with each other ---
  for (const p of adoptIds) {
    for (const c of catalogue.conflictsForPattern.get(p) ?? []) {
      if (adoptIds.has(c) && p < c) {
        warnings.push(`Adopted patterns '${p}' and '${c}' conflict_with each other — confirm intent.`);
      }
    }
  }

  const size = ((raw.projectSize as ResolvedProfile["projectSize"]) ?? "medium");

  return {
    projectSize: size,
    philosophies: { adopt: philosophiesAdopt, reject: philosophiesReject },
    adopt,
    ban,
    practicePatterns,
    phases: {
      write: { ...DEFAULT_PHASES.write, ...(raw.phases?.write ?? {}) },
      pr: { ...DEFAULT_PHASES.pr, ...(raw.phases?.pr ?? {}) },
      later: { ...DEFAULT_PHASES.later, ...(raw.phases?.later ?? {}) },
    },
    warnings,
  };
}
