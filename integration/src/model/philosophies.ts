import type { Catalogue } from "../catalogue.js";
import type { CandidatePattern } from "./project-map.js";

/**
 * Select the CORE philosophies for a project rather than every philosophy any
 * detected pattern could imply. Mixing many philosophies produces contradictory
 * guidance (e.g. "hide everything" vs "make everything explicit"), so we keep a
 * small, well-supported set.
 *
 * Weighting: each implying pattern contributes by its confidence (high=3, medium=2,
 * low=1). We drop philosophies supported only by a single low/medium pattern unless
 * a HIGH-confidence pattern implies them, then keep the top `cap` by weight.
 */

const CONF_WEIGHT = { high: 3, medium: 2, low: 1 } as const;

export interface CorePhilosophy {
  id: string;
  impliedBy: string[]; // pattern ids, strongest first
  weight: number;
}

export const DEFAULT_CORE_CAP = 4;

export function selectCorePhilosophies(
  candidates: CandidatePattern[],
  catalogue: Catalogue,
  cap: number = DEFAULT_CORE_CAP,
): CorePhilosophy[] {
  // Aggregate: philosophyId -> { weight, hasHigh, implying patterns (deduped, best conf) }
  const agg = new Map<string, { weight: number; hasHigh: boolean; byPattern: Map<string, number> }>();
  for (const cand of candidates) {
    const w = CONF_WEIGHT[cand.confidence];
    for (const phil of catalogue.philosophyForPattern.get(cand.patternId) ?? []) {
      const a = agg.get(phil.philosophyId) ?? { weight: 0, hasHigh: false, byPattern: new Map() };
      // Count each pattern once, at its strongest confidence contribution.
      const prev = a.byPattern.get(cand.patternId) ?? 0;
      if (w > prev) {
        a.weight += w - prev;
        a.byPattern.set(cand.patternId, w);
      }
      if (cand.confidence === "high") a.hasHigh = true;
      agg.set(phil.philosophyId, a);
    }
  }

  const ranked: CorePhilosophy[] = [...agg.entries()]
    .filter(([, a]) => a.hasHigh || a.weight >= 2) // drop single weak support
    .map(([id, a]) => ({
      id,
      weight: a.weight,
      impliedBy: [...a.byPattern.entries()].sort((x, y) => y[1] - x[1]).map(([p]) => p),
    }))
    .sort((a, b) => b.weight - a.weight || b.impliedBy.length - a.impliedBy.length || a.id.localeCompare(b.id));

  return ranked.slice(0, cap);
}
