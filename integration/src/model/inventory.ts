import type { EvidenceMap } from "./project-map.js";
import type { CapabilityCluster } from "./capabilities.js";
import type { Catalogue, GraphNode } from "../catalogue.js";
import { selectCorePhilosophies } from "./philosophies.js";

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
  altitude: Altitude;
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
  capabilities: CapabilityCluster[];
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

  // Deduplicate by pattern id, keeping the highest-confidence evidence.
  const seen = new Map<string, InventoryEntry>();
  for (const cand of map.candidatePatterns) {
    const node = catalogue.nodeById.get(cand.patternId);
    if (!node || node.kind === "philosophy") continue;
    const entry: InventoryEntry = {
      id: cand.patternId,
      title: node.title,
      group: node.group,
      // Prefer the curated per-pattern altitude; fall back to the group heuristic.
      altitude: node.altitude ?? altitudeOf(node.group),
      confidence: cand.confidence,
      evidence: cand.evidence,
      locations: cand.locations,
    };
    const prev = seen.get(cand.patternId);
    if (!prev || CONF_RANK[entry.confidence] > CONF_RANK[prev.confidence]) seen.set(cand.patternId, entry);
  }

  for (const entry of seen.values()) {
    (entry.altitude === "high" ? high : entry.altitude === "low" ? low : medium).push(entry);
  }

  const byConfThenTitle = (a: InventoryEntry, b: InventoryEntry) =>
    CONF_RANK[b.confidence] - CONF_RANK[a.confidence] || a.title.localeCompare(b.title);
  high.sort(byConfThenTitle);
  medium.sort(byConfThenTitle);
  low.sort(byConfThenTitle);

  // CORE philosophies only (reduced from all-implied to avoid contradictions).
  const philosophies: PhilosophyEntry[] = selectCorePhilosophies(map.candidatePatterns, catalogue).map((c) => {
    const node: GraphNode | undefined = catalogue.nodeById.get(c.id);
    return { id: c.id, title: node?.title ?? c.id, impliedBy: c.impliedBy };
  });

  return { high, medium, low, philosophies, capabilities: map.capabilityClusters };
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

  L.push("## Localised utilities & shared-helper opportunities");
  if (!inv.capabilities.length) {
    L.push("- _no scattered cross-cutting capabilities detected_");
  } else {
    L.push(
      "> Cross-cutting functions that should have ONE canonical home. " +
        "Consolidating these keeps behaviour consistent and avoids divergent copies.",
    );
    L.push("");
    for (const c of inv.capabilities) {
      if (c.recommendation === "route-through-canonical" && c.canonical) {
        L.push(
          `### ${c.title}  \`${c.id}\` — shared helper exists, ${c.bypassing.length} caller(s) bypass it`,
        );
        L.push(`- canonical helper: \`${c.canonical.path}\` (${c.canonical.inbound} dependents)`);
        L.push(`- used directly in ${c.usingFiles.length} file(s); route these through the helper:`);
        for (const f of c.bypassing.slice(0, 10)) L.push(`  - \`${f}\``);
        if (c.bypassing.length > 10) L.push(`  - …and ${c.bypassing.length - 10} more`);
      } else {
        L.push(`### ${c.title}  \`${c.id}\` — no shared helper, used in ${c.usingFiles.length} file(s)`);
        L.push(`- consider extracting one canonical helper; currently reached for inline in:`);
        for (const f of c.usingFiles.slice(0, 10)) L.push(`  - \`${f}\``);
        if (c.usingFiles.length > 10) L.push(`  - …and ${c.usingFiles.length - 10} more`);
      }
      L.push("");
    }
  }
  L.push("");
  return L.join("\n");
}
