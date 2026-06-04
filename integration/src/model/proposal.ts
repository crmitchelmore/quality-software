import type { Catalogue } from "../catalogue.js";
import type { EvidenceMap, CandidatePattern } from "./project-map.js";
import { selectCorePhilosophies, disciplineOf, DEFAULT_TESTING_CAP } from "./philosophies.js";
import { altitudeOf, type Altitude } from "./inventory.js";
import { missingRepoSpecificTerms, pathExistsInEvidenceMap } from "./validation.js";

/**
 * Turn the (advisory) evidence map into a CONSERVATIVE, warn-only candidate profile
 * (design 14, critique #5/#7). We never auto-ban and never propose `enforcement: block`
 * — the agent/user must ratify before anything becomes authoritative.
 */

export interface ProfileProposal {
  yaml: string;
  philosophies: { id: string; reason: string }[];
  testingPhilosophies: { id: string; reason: string }[];
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
  const validationNotes: string[] = [];
  for (const dup of map.duplicateSymbols) {
    if (dup.canonical && dup.canonical.confidence !== "low") {
      if (pathExistsInEvidenceMap(map, dup.canonical.path)) {
        anchors.push({ name: dup.name, path: dup.canonical.path, confidence: dup.canonical.confidence });
      } else {
        validationNotes.push(
          `Candidate anchor "${dup.name}" omitted because path "${dup.canonical.path}" was not observed in the scan.`,
        );
      }
    }
  }

  // CORE philosophies only — a small, well-supported set, not every implied one
  // (mixing many philosophies creates contradictory guidance). Testing-discipline
  // philosophies are selected SEPARATELY so they form an independent section and
  // never crowd out the application-architecture philosophies (and vice versa).
  const core = selectCorePhilosophies(adoptedCands, catalogue, {
    include: (id) => disciplineOf(catalogue, id) !== "testing",
  });
  const philosophies = core.map((c) => ({
    id: c.id,
    reason: `core: implied by ${c.impliedBy.slice(0, 3).join(", ")}`,
  }));
  const testingCore = selectCorePhilosophies(adoptedCands, catalogue, {
    cap: DEFAULT_TESTING_CAP,
    include: (id) => disciplineOf(catalogue, id) === "testing",
  });
  const testingPhilosophies = testingCore.map((c) => ({
    id: c.id,
    reason: `testing: implied by ${c.impliedBy.slice(0, 3).join(", ")}`,
  }));

  // Split adopted patterns: testing-discipline patterns live in the independent
  // testing section; everything else is grouped by altitude in `patterns:`.
  const isTesting = (id: string) => catalogue.nodeById.get(id)?.group === "testing";
  const archAdopt = adopt.filter((a) => !isTesting(a.id));
  const testingAdopt = adopt.filter((a) => isTesting(a.id));

  const notes: string[] = [
    "All entries are warn-only or advisory; nothing is adopted until you ratify it.",
    "No patterns are banned automatically — add bans deliberately.",
    "Philosophies are reduced to the core set to avoid contradictory guidance; add/remove deliberately.",
    "Testing philosophies and patterns are kept in an independent `testing:` section.",
    ...validationNotes,
  ];
  const knownTerms = new Set(catalogue.nodeById.keys());
  for (const term of missingRepoSpecificTerms(map, adopt.map((a) => a.reason), knownTerms)) {
    notes.push(
      `Review generated wording: reason mentions "${term}" but no matching repository vocabulary was observed.`,
    );
  }
  if (!adopt.length) notes.push("No medium+ confidence patterns detected; profile left intentionally minimal.");

  return {
    yaml: renderProfileYaml(philosophies, archAdopt, testingPhilosophies, testingAdopt),
    philosophies,
    testingPhilosophies,
    adopt,
    anchors,
    notes,
  };
}

function renderProfileYaml(
  philosophies: { id: string }[],
  adopt: { id: string; enforcement: string; altitude: Altitude }[],
  testingPhilosophies: { id: string }[] = [],
  testingAdopt: { id: string; enforcement: string }[] = [],
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
  if (testingPhilosophies.length || testingAdopt.length) {
    lines.push("testing:");
    lines.push("  # Independent testing discipline: its own philosophies + patterns,");
    lines.push("  # kept separate from the application architecture above.");
    lines.push("  philosophies:");
    if (testingPhilosophies.length) for (const p of testingPhilosophies) lines.push(`    - ${p.id}`);
    else lines.push("    []");
    lines.push("  patterns:");
    if (testingAdopt.length) {
      lines.push("    adopt:");
      for (const a of testingAdopt) {
        lines.push(`      - id: ${a.id}`);
        lines.push(`        enforcement: ${a.enforcement}`);
      }
    } else {
      lines.push("    adopt: []");
    }
  }
  return lines.join("\n") + "\n";
}
