import type { Catalogue } from "../catalogue.js";
import type { EvidenceMap, CandidatePattern } from "./project-map.js";
import { selectCorePhilosophies } from "./philosophies.js";
import { altitudeOf, type Altitude } from "./inventory.js";

/**
 * Turn the (advisory) evidence map into a CONSERVATIVE, warn-only candidate profile
 * (design 14, critique #5/#7). We never auto-ban and never propose `enforcement: block`
 * — the agent/user must ratify before anything becomes authoritative.
 */

export interface ProfileProposal {
  yaml: string;
  philosophies: { id: string; reason: string }[];
  adopt: { id: string; enforcement: "advise" | "warn"; confidence: string; reason: string; altitude: Altitude }[];
  anchors: { name: string; path: string; confidence: string }[];
  notes: string[];
}

function confidenceToEnforcement(c: CandidatePattern["confidence"]): "advise" | "warn" {
  return c === "high" ? "warn" : "advise";
}

export function proposeProfileFromEvidence(map: EvidenceMap, catalogue: Catalogue): ProfileProposal {
  // Dedupe medium+ confidence, catalogue-known candidates by pattern id (keep strongest).
  const rank = { high: 3, medium: 2, low: 1 } as const;
  const byId = new Map<string, CandidatePattern>();
  for (const cand of map.candidatePatterns) {
    if (cand.confidence === "low") continue;
    if (!catalogue.nodeById.get(cand.patternId)) continue;
    const existing = byId.get(cand.patternId);
    if (!existing || rank[cand.confidence] > rank[existing.confidence]) byId.set(cand.patternId, cand);
  }
  const adoptedCands = [...byId.values()];

  const adopt: ProfileProposal["adopt"] = adoptedCands.map((cand) => {
    const node = catalogue.nodeById.get(cand.patternId);
    return {
      id: cand.patternId,
      enforcement: confidenceToEnforcement(cand.confidence),
      confidence: cand.confidence,
      reason: cand.evidence[0] ?? "structural evidence",
      altitude: node?.altitude ?? altitudeOf(node?.group ?? ""),
    };
  });

  // Candidate canonical anchors from high/medium-confidence duplicate clusters.
  const anchors: ProfileProposal["anchors"] = [];
  for (const dup of map.duplicateSymbols) {
    if (dup.canonical && dup.canonical.confidence !== "low") {
      anchors.push({ name: dup.name, path: dup.canonical.path, confidence: dup.canonical.confidence });
    }
  }

  // CORE philosophies only — a small, well-supported set, not every implied one
  // (mixing many philosophies creates contradictory guidance).
  const core = selectCorePhilosophies(adoptedCands, catalogue);
  const philosophies = core.map((c) => ({
    id: c.id,
    reason: `core: implied by ${c.impliedBy.slice(0, 3).join(", ")}`,
  }));

  const notes: string[] = [
    "All entries are warn-only or advisory; nothing is adopted until you ratify it.",
    "No patterns are banned automatically — add bans deliberately.",
    "Philosophies are reduced to the core set to avoid contradictory guidance; add/remove deliberately.",
  ];
  if (!adopt.length) notes.push("No medium+ confidence patterns detected; profile left intentionally minimal.");

  return { yaml: renderProfileYaml(philosophies, adopt), philosophies, adopt, anchors, notes };
}

function renderProfileYaml(
  philosophies: { id: string }[],
  adopt: { id: string; enforcement: string; altitude: Altitude }[],
): string {
  const lines: string[] = [];
  lines.push("# Candidate conformance profile (auto-proposed, warn-only).");
  lines.push("# Review and ratify before use; nothing here blocks by default.");
  lines.push("version: 1");
  lines.push("enforcement: warn");
  lines.push("philosophies:");
  if (philosophies.length) for (const p of philosophies) lines.push(`  - ${p.id}`);
  else lines.push("  []");
  lines.push("patterns:");
  lines.push("  # Patterns grouped by altitude (scope of application).");
  const bands: { key: Altitude; label: string }[] = [
    { key: "high", label: "application / platform" },
    { key: "medium", label: "component / service" },
    { key: "low", label: "method / class / file" },
  ];
  for (const band of bands) {
    const inBand = adopt.filter((a) => a.altitude === band.key);
    if (!inBand.length) continue;
    lines.push(`  ${band.key}: # ${band.label}`);
    lines.push("    adopt:");
    for (const a of inBand) {
      lines.push(`      - id: ${a.id}`);
      lines.push(`        enforcement: ${a.enforcement}`);
    }
  }
  lines.push("  ban: []");
  return lines.join("\n") + "\n";
}
