import type { LLMJudge } from "../judge/judge.js";
import type { CodeRegion } from "../judge/schema.js";
import type { EvidenceMap } from "../model/project-map.js";
import type { Policy } from "../policy/types.js";
import { certify } from "../policy/certify.js";

/**
 * Honest evaluation harness (design 16.10). Two distinct measurements:
 *
 *  1. JUDGE quality (advisory): precision / recall / false-advisory / abstention,
 *     measured over LABELLED cases drawn from the calibration, regression,
 *     adversarial and cross-language sets — NEVER the prompt-grounding examples
 *     (that circularity is the whole point of the split).
 *  2. CERTIFIER false-block rate: the gate-eligibility metric. A policy is only
 *     promotable advisory→blocking when it blocks ZERO conforming cases here.
 */

export type EvalSet = "calibration" | "regression" | "adversarial" | "cross-language";
export type Label = "conforms" | "violates";

export interface JudgeCase {
  id: string;
  set: EvalSet;
  patternId: string;
  region: CodeRegion;
  label: Label;
}

export interface JudgeMetrics {
  total: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  falseAdvisoryRate: number;
  bySet: Record<string, { total: number; correct: number }>;
}

function ratio(n: number, d: number): number {
  return d === 0 ? 0 : n / d;
}

export async function runJudgeEval(cases: JudgeCase[], judge: LLMJudge): Promise<JudgeMetrics> {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  const bySet: Record<string, { total: number; correct: number }> = {};
  for (const c of cases) {
    const res = await judge.judge([{ patternId: c.patternId, region: c.region }]);
    const flagged = res.findings.length > 0;
    const correct = flagged === (c.label === "violates");
    if (c.label === "violates") flagged ? tp++ : fn++;
    else flagged ? fp++ : tn++;
    const s = (bySet[c.set] ??= { total: 0, correct: 0 });
    s.total++;
    if (correct) s.correct++;
  }
  const total = cases.length;
  return {
    total,
    truePositives: tp,
    falsePositives: fp,
    trueNegatives: tn,
    falseNegatives: fn,
    precision: ratio(tp, tp + fp),
    recall: ratio(tp, tp + fn),
    falseAdvisoryRate: ratio(fp, total),
    bySet,
  };
}

export interface BlockingCase {
  id: string;
  label: Label;
  map: EvidenceMap;
  policies: Policy[];
}

export interface BlockingMetrics {
  total: number;
  /** Conforming cases the certifier wrongly blocked — must be 0 to promote. */
  falseBlocks: string[];
  /** Violating cases the certifier correctly blocked. */
  trueBlocks: number;
  conformingCases: number;
  falseBlockRate: number;
  /** True only when zero conforming cases were blocked (the promotion gate). */
  promotable: boolean;
}

export interface BlockingPromotionThresholds {
  /** Maximum acceptable false-block rate over labelled conforming cases. */
  maxFalseBlockRate: number;
  /** Require the policy to catch at least this many labelled violations. */
  minTrueBlocks: number;
}

export interface BlockingPromotionResult extends BlockingMetrics {
  thresholds: BlockingPromotionThresholds;
  reasons: string[];
}

/**
 * Measure the certifier's false-block rate (design 16.6/16.10). The certifier is
 * deterministic, so this is a property of the policies + evidence maps, not a model.
 */
export function runBlockingEval(cases: BlockingCase[]): BlockingMetrics {
  const falseBlocks: string[] = [];
  let trueBlocks = 0;
  let conforming = 0;
  for (const c of cases) {
    const blocked = certify(c.policies, c.map).some((v) => v.severity === "block");
    if (c.label === "conforms") {
      conforming++;
      if (blocked) falseBlocks.push(c.id);
    } else if (blocked) {
      trueBlocks++;
    }
  }
  return {
    total: cases.length,
    falseBlocks,
    trueBlocks,
    conformingCases: conforming,
    falseBlockRate: ratio(falseBlocks.length, conforming),
    promotable: falseBlocks.length === 0,
  };
}

export function evaluateBlockingPromotion(
  cases: BlockingCase[],
  thresholds: BlockingPromotionThresholds = { maxFalseBlockRate: 0, minTrueBlocks: 1 },
): BlockingPromotionResult {
  const metrics = runBlockingEval(cases);
  const reasons: string[] = [];
  if (metrics.falseBlockRate > thresholds.maxFalseBlockRate) {
    reasons.push(
      `false-block rate ${metrics.falseBlockRate} exceeds threshold ${thresholds.maxFalseBlockRate}`,
    );
  }
  if (metrics.trueBlocks < thresholds.minTrueBlocks) {
    reasons.push(`true blocks ${metrics.trueBlocks} below threshold ${thresholds.minTrueBlocks}`);
  }
  return {
    ...metrics,
    thresholds,
    reasons,
    promotable: reasons.length === 0,
  };
}
