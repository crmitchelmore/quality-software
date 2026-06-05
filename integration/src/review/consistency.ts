import { fingerprint, type Finding } from "../contract.js";
import type { EvidenceMap } from "../model/project-map.js";

type ConsistencyChange = {
  patternId: string;
  baseScore: number;
  headScore: number;
  violations: number;
  newLocations: string[];
};

export function candidateConsistencyChanges(headMap: EvidenceMap, baseMap: EvidenceMap): Map<string, ConsistencyChange> {
  const baseByPattern = new Map(baseMap.candidatePatterns.map((c) => [c.patternId, c]));
  const changes = new Map<string, ConsistencyChange>();
  for (const head of headMap.candidatePatterns) {
    if (!head.consistency || head.consistency.violations === 0) continue;
    const base = baseByPattern.get(head.patternId);
    const baseLocations = new Set(base?.consistency ? base.locations : []);
    const newLocations = head.locations.filter((loc) => !baseLocations.has(loc));
    if (newLocations.length === 0) continue;
    changes.set(head.patternId, {
      patternId: head.patternId,
      baseScore: base?.consistency?.score ?? 1,
      headScore: head.consistency.score,
      violations: head.consistency.violations,
      newLocations,
    });
  }
  return changes;
}

export function withConsistencyContext(findings: Finding[], changes: Map<string, ConsistencyChange>): Finding[] {
  return findings.map((finding) => {
    const change = finding.patternId ? changes.get(finding.patternId) : undefined;
    if (!change || !change.newLocations.includes(finding.path)) return finding;
    const context = consistencyText(change);
    return {
      ...finding,
      message: `${finding.message} ${context}`,
      evidence: [finding.evidence, context].filter(Boolean).join(" | "),
      rationale: [finding.rationale, context].filter(Boolean).join(" "),
    };
  });
}

export function candidateConsistencyAdvisories(
  changes: Map<string, ConsistencyChange>,
  certifiedPatternIds: Set<string>,
): Finding[] {
  const out: Finding[] = [];
  for (const change of changes.values()) {
    if (certifiedPatternIds.has(change.patternId)) continue;
    const path = change.newLocations[0];
    out.push({
      fingerprint: fingerprint({
        patternId: change.patternId,
        detectorId: "consistency.candidate-pattern",
        detectorVersion: "1.0.0",
        symbol: change.patternId,
        evidence: `${change.newLocations.join(",")} ${change.headScore}`,
        scopePath: path,
      }),
      detectorId: "consistency.candidate-pattern",
      detectorVersion: "1.0.0",
      patternId: change.patternId,
      severity: "advice",
      path,
      message: `Candidate pattern consistency changed for '${change.patternId}'. ${consistencyText(change)}`,
      suggestion: `Align the new inconsistent module(s) with the existing ${change.patternId} structure, or record an explicit exception if the divergence is intentional.`,
      evidence: `new inconsistent module(s): ${change.newLocations.join(", ")}`,
    });
  }
  return out;
}

function percent(score: number): string {
  return `${Math.round(score * 100)}%`;
}

function consistencyText(change: ConsistencyChange): string {
  return `Pattern consistency is now ${percent(change.headScore)} (${change.violations} violation(s); was ${percent(
    change.baseScore,
  )}).`;
}
