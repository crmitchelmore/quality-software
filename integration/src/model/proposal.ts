import type { Catalogue } from "../catalogue.js";
import type { EvidenceMap, CandidatePattern } from "./project-map.js";

/**
 * Turn the (advisory) evidence map into a CONSERVATIVE, warn-only candidate profile
 * (design 14, critique #5/#7). We never auto-ban and never propose `enforcement: block`
 * — the agent/user must ratify before anything becomes authoritative.
 */

export interface ProfileProposal {
  yaml: string;
  philosophies: { id: string; reason: string }[];
  adopt: { id: string; enforcement: "advise" | "warn"; confidence: string; reason: string }[];
  anchors: { name: string; path: string; confidence: string }[];
  notes: string[];
}

function confidenceToEnforcement(c: CandidatePattern["confidence"]): "advise" | "warn" {
  return c === "high" ? "warn" : "advise";
}

export function proposeProfileFromEvidence(map: EvidenceMap, catalogue: Catalogue): ProfileProposal {
  const adopt: ProfileProposal["adopt"] = [];
  const philSet = new Map<string, string>();

  // Seed adopt entries from medium+ confidence candidates only, deduped by pattern
  // id (multiple structural hubs can imply the same pattern) keeping the strongest.
  const rank = { high: 3, medium: 2, low: 1 } as const;
  const byId = new Map<string, ProfileProposal["adopt"][number]>();
  for (const cand of map.candidatePatterns) {
    if (cand.confidence === "low") continue;
    if (!catalogue.nodeById.get(cand.patternId)) continue;
    const entry = {
      id: cand.patternId,
      enforcement: confidenceToEnforcement(cand.confidence),
      confidence: cand.confidence,
      reason: cand.evidence[0] ?? "structural evidence",
    };
    const existing = byId.get(cand.patternId);
    if (!existing || rank[cand.confidence] > rank[existing.confidence as keyof typeof rank]) {
      byId.set(cand.patternId, entry);
    }
    for (const phil of catalogue.philosophyForPattern.get(cand.patternId) ?? []) {
      if (!philSet.has(phil.philosophyId)) philSet.set(phil.philosophyId, `implied by adopted pattern ${cand.patternId}`);
    }
  }
  adopt.push(...byId.values());

  // Candidate canonical anchors from high/medium-confidence duplicate clusters.
  const anchors: ProfileProposal["anchors"] = [];
  for (const dup of map.duplicateSymbols) {
    if (dup.canonical && dup.canonical.confidence !== "low") {
      anchors.push({ name: dup.name, path: dup.canonical.path, confidence: dup.canonical.confidence });
    }
  }

  const philosophies = [...philSet.entries()].map(([id, reason]) => ({ id, reason }));
  const notes: string[] = [
    "All entries are warn-only or advisory; nothing is adopted until you ratify it.",
    "No patterns are banned automatically — add bans deliberately.",
  ];
  if (!adopt.length) notes.push("No medium+ confidence patterns detected; profile left intentionally minimal.");

  return { yaml: renderProfileYaml(philosophies, adopt), philosophies, adopt, anchors, notes };
}

function renderProfileYaml(
  philosophies: { id: string }[],
  adopt: { id: string; enforcement: string }[],
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
  lines.push("  adopt:");
  if (adopt.length) {
    for (const a of adopt) {
      lines.push(`    - id: ${a.id}`);
      lines.push(`      enforcement: ${a.enforcement}`);
    }
  } else {
    lines.push("    []");
  }
  lines.push("  ban: []");
  return lines.join("\n") + "\n";
}
