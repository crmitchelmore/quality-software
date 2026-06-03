import type { EvidenceMap, ModuleInfo } from "./project-map.js";
import type { Catalogue } from "../catalogue.js";
import { buildInventory, altitudeOf, type Altitude, type InventoryEntry } from "./inventory.js";

/**
 * The DETAILED companion to the (intentionally small) patterns.config.yaml. Where
 * the config says *which* philosophies/patterns a project has adopted, this map says
 * *where* each pattern lives, *how* it is implemented, and *what flavour* it is
 * (e.g. "Event Sourcing — Axon Framework"). It is generated from the same structural
 * evidence, so it is best-effort and advisory; it exists to anchor reviews and help
 * humans navigate, not to enforce anything.
 */

export interface PatternMapEntry {
  id: string;
  title: string;
  altitude: Altitude;
  confidence: "low" | "medium" | "high";
  flavour: string;
  evidence: string[];
  anchors: string[];
  philosophies: string[];
}

export interface CapabilityMapEntry {
  id: string;
  title: string;
  status: "no-canonical-helper" | "canonical-bypassed";
  canonical: string | null;
  usedIn: number;
  sample: string[];
}

export interface PatternMap {
  meta: { commit?: string; fileCount: number; detector: string; limitations: string[] };
  patterns: PatternMapEntry[];
  capabilities: CapabilityMapEntry[];
}

/** Framework/stack markers detected from import specifiers across the codebase. */
function detectFrameworks(modules: ModuleInfo[]): Set<string> {
  const fw = new Set<string>();
  for (const m of modules) {
    for (const i of m.imports) {
      const s = i.spec;
      if (/\baxonframework\b/.test(s)) fw.add("axon");
      if (/springframework\.data\b/.test(s)) fw.add("spring-data");
      if (/springframework\.web\b/.test(s)) fw.add("spring-web");
      if (/\bspringframework\b/.test(s)) fw.add("spring");
      if (/(jakarta|javax)\.persistence\b/.test(s)) fw.add("jpa");
      if (/jackson/i.test(s)) fw.add("jackson");
      if (/kotlinx\.coroutines/.test(s)) fw.add("coroutines");
      if (/reactor\.core|springframework\.web\.reactive/.test(s)) fw.add("reactor");
    }
  }
  return fw;
}

/** Best-effort, human-readable implementation flavour for a detected pattern. */
function flavourFor(patternId: string, fw: Set<string>): string {
  const axon = fw.has("axon");
  switch (patternId) {
    case "event-sourcing":
      return axon
        ? "Axon Framework event store; aggregates rebuilt by replaying `*Event` types"
        : "Custom event log replayed to derive current state";
    case "cqrs":
      return axon
        ? "Command/query separation over Axon command & query buses, with read-model projections"
        : "Explicit command vs query/read-model separation";
    case "aggregate":
      return axon ? "Axon-managed aggregate roots (`@Aggregate`)" : "DDD aggregate roots guarding their invariants";
    case "domain-event":
      return axon ? "Domain events published on the Axon event bus, consumed by projectors" : "Domain events drive side effects/projections";
    case "modular-monolith":
      return "Feature packages with `internal/` sub-packages enforcing module boundaries";
    case "repository":
      return fw.has("spring-data")
        ? "Spring Data repositories over the persistence store"
        : fw.has("jpa")
          ? "JPA-backed repositories"
          : "Repository interfaces acting as persistence ports";
    case "strategy":
      return "Polymorphic strategy hub — one interface, many interchangeable implementations";
    case "factory-method":
      return "Factory types centralising construction of a family of objects";
    case "layered-architecture":
      return "Distinct layers (domain / application / infrastructure) with directional dependencies";
    default:
      return "Detected structurally; review the anchors to confirm the implementation style";
  }
}

/** Anchors should point at production code, not tests. */
function isTestPath(p: string): boolean {
  return /(^|\/)(test|tests|__tests__|spec)\//i.test(p) || /(Test|Spec|\.test|\.spec)\.[A-Za-z]+$/.test(p);
}

export function buildPatternMap(map: EvidenceMap, catalogue: Catalogue): PatternMap {
  const inv = buildInventory(map, catalogue);
  const fw = detectFrameworks(map.modules);

  const toEntry = (e: InventoryEntry): PatternMapEntry => ({
    id: e.id,
    title: e.title,
    altitude: altitudeOf(e.group),
    confidence: e.confidence,
    flavour: flavourFor(e.id, fw),
    evidence: e.evidence,
    anchors: e.locations.filter((p) => !isTestPath(p)),
    philosophies: (catalogue.philosophyForPattern.get(e.id) ?? []).map((p) => p.philosophyId),
  });

  const patterns = [...inv.high, ...inv.medium, ...inv.low].map(toEntry);

  const capabilities: CapabilityMapEntry[] = inv.capabilities.map((c) => ({
    id: c.id,
    title: c.title,
    status: c.recommendation === "route-through-canonical" ? "canonical-bypassed" : "no-canonical-helper",
    canonical: c.canonical?.path ?? null,
    usedIn: c.usingFiles.length,
    sample: (c.recommendation === "route-through-canonical" ? c.bypassing : c.usingFiles).slice(0, 8),
  }));

  return {
    meta: {
      commit: map.meta.gitCommit,
      fileCount: map.meta.fileCount,
      detector: map.meta.extraction.method,
      limitations: map.meta.extraction.knownLimitations,
    },
    patterns,
    capabilities,
  };
}

// --- YAML rendering (hand-rolled; values are simple scalars/lists) ------------

function q(s: string): string {
  // Quote when the scalar could be misread by a YAML parser.
  return /^[\w./@-]+$/.test(s) ? s : JSON.stringify(s);
}

export function renderPatternMapYaml(pm: PatternMap): string {
  const L: string[] = [];
  L.push("# patterns.map.yaml — detailed companion to patterns.config.yaml (auto-generated).");
  L.push("# Where each adopted pattern lives, how it is implemented, and its flavour.");
  L.push("# Best-effort, structural evidence only — review before relying on it.");
  L.push("version: 1");
  L.push("meta:");
  if (pm.meta.commit) L.push(`  commit: ${pm.meta.commit}`);
  L.push(`  fileCount: ${pm.meta.fileCount}`);
  L.push(`  detector: ${q(pm.meta.detector)}`);
  if (pm.meta.limitations.length) {
    L.push("  limitations:");
    for (const lim of pm.meta.limitations) L.push(`    - ${q(lim)}`);
  }

  L.push("patterns:");
  if (!pm.patterns.length) L.push("  [] # none detected structurally");
  for (const p of pm.patterns) {
    L.push(`  - id: ${p.id}`);
    L.push(`    title: ${q(p.title)}`);
    L.push(`    altitude: ${p.altitude}`);
    L.push(`    confidence: ${p.confidence}`);
    L.push(`    flavour: ${q(p.flavour)}`);
    if (p.evidence.length) {
      L.push("    evidence:");
      for (const e of p.evidence) L.push(`      - ${q(e)}`);
    }
    if (p.anchors.length) {
      L.push("    anchors:");
      for (const a of p.anchors) L.push(`      - ${q(a)}`);
    }
    if (p.philosophies.length) {
      L.push(`    philosophies: [${p.philosophies.join(", ")}]`);
    }
  }

  L.push("capabilities:");
  if (!pm.capabilities.length) L.push("  [] # no scattered cross-cutting capabilities detected");
  for (const c of pm.capabilities) {
    L.push(`  - id: ${c.id}`);
    L.push(`    title: ${q(c.title)}`);
    L.push(`    status: ${c.status}`);
    L.push(`    canonical: ${c.canonical ? q(c.canonical) : "null"}`);
    L.push(`    usedIn: ${c.usedIn}`);
    if (c.sample.length) {
      L.push("    sample:");
      for (const s of c.sample) L.push(`      - ${q(s)}`);
    }
  }

  L.push("");
  return L.join("\n");
}
