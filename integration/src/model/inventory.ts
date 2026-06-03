import type { EvidenceMap } from "./project-map.js";
import type { Catalogue, GraphNode } from "../catalogue.js";

/**
 * Altitude-grouped pattern & philosophy inventory (design 14). Turns the evidence
 * map's advisory `candidatePatterns` into a human-facing inventory bucketed by
 * altitude — HIGH (architecture), MEDIUM (design), LOW (implementation) — with the
 * representative files for each, plus the philosophies those patterns imply (via
 * the cross-source knowledge graph). This is the "what patterns does this project
 * use, and where do they live" view; nothing here is adopted or enforced.
 */

export type Altitude = "high" | "medium" | "low";

export interface InventoryEntry {
  id: string;
  title: string;
  group: string;
  confidence: "low" | "medium" | "high";
  evidence: string[];
  locations: string[];
}

export interface PhilosophyEntry {
  id: string;
  title: string;
  impliedBy: string[]; // pattern ids that imply this philosophy
}

export interface Inventory {
  high: InventoryEntry[];
  medium: InventoryEntry[];
  low: InventoryEntry[];
  philosophies: PhilosophyEntry[];
}

/** Catalogue group → altitude. Architecture-scale groups are "high". */
const HIGH_GROUPS = new Set([
  "architecture",
  "ddd-strategic",
  "cloud-distributed",
  "enterprise-integration",
]);
const LOW_GROUPS = new Set(["implementation", "testing"]);

export function altitudeOf(group: string): Altitude {
  if (HIGH_GROUPS.has(group)) return "high";
  if (LOW_GROUPS.has(group)) return "low";
  return "medium";
}

const CONF_RANK: Record<string, number> = { high: 3, medium: 2, low: 1 };

export function buildInventory(map: EvidenceMap, catalogue: Catalogue): Inventory {
  const high: InventoryEntry[] = [];
  const medium: InventoryEntry[] = [];
  const low: InventoryEntry[] = [];
  const philAgg = new Map<string, Set<string>>(); // philosophyId -> implying pattern ids

  // Deduplicate by pattern id, keeping the highest-confidence evidence.
  const seen = new Map<string, InventoryEntry>();
  for (const cand of map.candidatePatterns) {
    const node = catalogue.nodeById.get(cand.patternId);
    if (!node || node.kind === "philosophy") continue;
    const entry: InventoryEntry = {
      id: cand.patternId,
      title: node.title,
      group: node.group,
      confidence: cand.confidence,
      evidence: cand.evidence,
      locations: cand.locations,
    };
    const prev = seen.get(cand.patternId);
    if (!prev || CONF_RANK[entry.confidence] > CONF_RANK[prev.confidence]) seen.set(cand.patternId, entry);

    for (const phil of catalogue.philosophyForPattern.get(cand.patternId) ?? []) {
      const set = philAgg.get(phil.philosophyId) ?? new Set<string>();
      set.add(cand.patternId);
      philAgg.set(phil.philosophyId, set);
    }
  }

  for (const entry of seen.values()) {
    const bucket = altitudeOf(entry.group);
    (bucket === "high" ? high : bucket === "low" ? low : medium).push(entry);
  }

  const byConfThenTitle = (a: InventoryEntry, b: InventoryEntry) =>
    CONF_RANK[b.confidence] - CONF_RANK[a.confidence] || a.title.localeCompare(b.title);
  high.sort(byConfThenTitle);
  medium.sort(byConfThenTitle);
  low.sort(byConfThenTitle);

  const philosophies: PhilosophyEntry[] = [...philAgg.entries()]
    .map(([id, impliedBy]) => {
      const node: GraphNode | undefined = catalogue.nodeById.get(id);
      return { id, title: node?.title ?? id, impliedBy: [...impliedBy] };
    })
    .sort((a, b) => b.impliedBy.length - a.impliedBy.length || a.title.localeCompare(b.title));

  return { high, medium, low, philosophies };
}

const ALTITUDE_LABEL: Record<Altitude, string> = {
  high: "High-level — architecture",
  medium: "Medium-level — design patterns",
  low: "Low-level — implementation patterns",
};

export function renderInventory(inv: Inventory): string {
  const L: string[] = [];
  L.push("# Project pattern & philosophy inventory");
  L.push("");
  L.push(
    "> Detected from structural evidence (advisory). Confidence and file references " +
      "are best-effort; review before adopting or enforcing anything.",
  );
  L.push("");

  const section = (altitude: Altitude, entries: InventoryEntry[]) => {
    L.push(`## ${ALTITUDE_LABEL[altitude]}`);
    if (!entries.length) {
      L.push("- _none detected_");
      L.push("");
      return;
    }
    for (const e of entries) {
      L.push(`### ${e.title}  \`${e.id}\`  · ${e.confidence} confidence · _${e.group}_`);
      for (const ev of e.evidence) L.push(`- ${ev}`);
      if (e.locations.length) {
        L.push(`- where:`);
        for (const loc of e.locations) L.push(`  - \`${loc}\``);
      }
      L.push("");
    }
  };

  section("high", inv.high);
  section("medium", inv.medium);
  section("low", inv.low);

  L.push("## Implied philosophies");
  if (!inv.philosophies.length) {
    L.push("- _none implied by the detected patterns_");
  } else {
    L.push("> Inferred from the patterns above via the cross-source knowledge graph.");
    L.push("");
    for (const p of inv.philosophies) {
      L.push(`- **${p.title}** \`${p.id}\` — implied by: ${p.impliedBy.join(", ")}`);
    }
  }
  L.push("");
  return L.join("\n");
}
