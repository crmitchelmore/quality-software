import type { EvidenceMap, Layer } from "./project-map.js";
import type { ProfileProposal } from "./proposal.js";

/**
 * Preview-first onboarding report (design 14, critique #5). Sections move from the
 * most certain (observed structure) to the least (candidate patterns), then the
 * conservative recommended profile and an explicit next-step prompt. Nothing here
 * tells the user a decision has been made on their behalf.
 */
export function renderOnboardingReport(map: EvidenceMap, proposal: ProfileProposal): string {
  const L: string[] = [];
  L.push("# Codebase onboarding — evidence preview");
  L.push("");
  L.push(`Scanned ${map.meta.fileCount} source files` + (map.meta.gitCommit ? ` @ ${map.meta.gitCommit}` : ""));
  L.push(`Extraction: ${map.meta.extraction.method} (confidence: ${map.meta.extraction.confidence}).`);
  L.push(`Known limitations: ${map.meta.extraction.knownLimitations.join(", ")}.`);
  L.push("");

  // 1. Observed structure (tier 1 — facts)
  L.push("## Observed structure");
  const byLayer = new Map<Layer, number>();
  for (const m of map.modules) byLayer.set(m.layer, (byLayer.get(m.layer) ?? 0) + 1);
  for (const [layer, n] of [...byLayer.entries()].sort((a, b) => b[1] - a[1])) {
    L.push(`- ${layer}: ${n} module(s)`);
  }
  L.push(`- dependency edges: ${map.dependencyEdges.length}`);
  L.push("");

  // 2. Detector-backed signals (tier 2)
  L.push("## Detector-backed signals");
  L.push("- (run with a ratified profile to populate boundary / reuse / banned-construct findings)");
  L.push("");

  // 3. Duplicate symbols + candidate canonical anchors
  L.push("## Possible duplication & canonical anchors");
  if (!map.duplicateSymbols.length) {
    L.push("- none detected");
  } else {
    for (const d of map.duplicateSymbols.slice(0, 15)) {
      const sameNote = d.sameLayer ? "same layer — likely true duplication" : `spans layers (${d.layers.join("/")}) — may be legitimately distinct`;
      L.push(`- \`${d.name}\` in ${d.files.length} files (${sameNote})`);
      if (d.canonical) {
        L.push(`  - candidate canonical: \`${d.canonical.path}\` [${d.canonical.confidence}] — ${d.canonical.reasons.join("; ")}`);
      }
    }
  }
  L.push("");

  // 4. Candidate patterns (tier 3 — advisory)
  L.push("## Candidate patterns (advisory, NOT adopted)");
  if (!map.candidatePatterns.length) {
    L.push("- none inferred");
  } else {
    for (const c of map.candidatePatterns) {
      const cons = c.consistency ? ` — consistency ${Math.round(c.consistency.score * 100)}% (${c.consistency.violations} violation(s))` : "";
      L.push(`- ${c.patternId} [${c.confidence}]${cons}`);
      for (const e of c.evidence) L.push(`  - ${e}`);
    }
  }
  L.push("");

  // 5. Recommended conservative profile
  L.push("## Recommended conservative profile (warn-only)");
  for (const n of proposal.notes) L.push(`> ${n}`);
  L.push("");
  L.push("```yaml");
  L.push(proposal.yaml.trimEnd());
  L.push("```");
  L.push("");

  // 6. Next-step prompt
  L.push("## Next steps — your call");
  L.push("1. Save this as an advisory, warn-only profile (`--write-profile`).");
  L.push("2. Edit the proposed philosophies/patterns, then save.");
  L.push("3. Mark canonical anchors you trust (`--write-anchors` → `patterns.anchors.yaml`).");
  L.push("4. Start an alignment pass once you've ratified the profile.");
  L.push("");
  L.push("_Nothing has been adopted or enforced. These are observations awaiting your ratification._");
  return L.join("\n") + "\n";
}

export function renderAnchorsYaml(proposal: ProfileProposal): string {
  const lines = ["# Curated canonical anchors — review before trusting.", "version: 1", "anchors:"];
  if (proposal.anchors.length) {
    for (const a of proposal.anchors) {
      lines.push(`  - symbol: ${a.name}`);
      lines.push(`    path: ${a.path}`);
      lines.push(`    confidence: ${a.confidence}`);
    }
  } else {
    lines.push("  []");
  }
  return lines.join("\n") + "\n";
}
