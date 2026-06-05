import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseModules, deriveEvidenceMap, type BuildOptions } from "../model/project-map.js";
import { layerPrefixesFromProfile } from "../model/layers.js";
import { certify, certifiedFindings } from "../policy/certify.js";
import { policiesFromProfile } from "../policy/from-profile.js";
import { filterSuppressedFindings, loadFindingExceptions } from "../exceptions.js";
import { LLMJudge } from "../judge/judge.js";
import type { CodeRegion } from "../judge/schema.js";
import { baselineModules } from "./baseline.js";
import {
  candidateConsistencyAdvisories,
  candidateConsistencyChanges,
  withConsistencyContext,
} from "./consistency.js";
import { capabilityBypass, reuseAgainstBaseline } from "./reuse.js";
import { summarise } from "./summary.js";
import type { ReviewInput, ReviewLLMOptions, ReviewResult } from "./types.js";

export type { ChangeEntry, ChangeStatus, ReviewInput, ReviewLLMOptions, ReviewResult } from "./types.js";
export { changesFromGit, gitBaseContent } from "./git.js";

/**
 * Baseline-aware PR review (design 16.6/16.10). Given an ONBOARDED codebase whose
 * patterns are configured in a profile, this checks that a PR:
 *   1. does not INTRODUCE a boundary violation (net-new certified blocks), and
 *   2. does not RE-IMPLEMENT functionality that already has a canonical home
 *      (reuse advisories against the baseline).
 *
 * The two correctness pillars (per design + rubber-duck critique):
 *   - NET-NEW gating: we certify the baseline AND the head and block only on
 *     violations the PR introduces — never pre-existing ones, and including cases
 *     where the changed side is the import TARGET (e.g. a new infra module that an
 *     unchanged domain file now resolves to).
 *   - CLEAN re-derivation: baseline and head evidence maps are each derived from a
 *     fresh, independent module set, so no stale edge/duplicate from a previous
 *     file version leaks across the diff.
 */

export function reviewPR(input: ReviewInput): ReviewResult {
  const opts: BuildOptions = {
    ...(input.buildOpts ?? {}),
    layerPrefixes: input.buildOpts?.layerPrefixes ?? layerPrefixesFromProfile(input.profile),
  };
  const headModules = parseModules(input.repoRoot, opts);
  const headByPath = new Map(headModules.map((m) => [m.path, m]));
  const headMap = deriveEvidenceMap(headModules, input.repoRoot, opts);
  const inputWithBuildOpts: ReviewInput = { ...input, buildOpts: opts };
  const baseMap = deriveEvidenceMap(
    baselineModules(input.repoRoot, input.changes, input.baseContent, opts),
    input.repoRoot,
    opts,
  );

  // --- 1. Net-new certified violations (the only thing that can block) ---
  const policies = policiesFromProfile(input.profile);
  const headFindings = certifiedFindings(certify(policies, headMap));
  const baseFindings = certifiedFindings(certify(policies, baseMap));
  const baseFps = new Set(baseFindings.map((f) => f.fingerprint));
  const netNew = headFindings.filter((f) => !baseFps.has(f.fingerprint));
  const consistencyChanges = candidateConsistencyChanges(headMap, baseMap);
  const certifiedPatternIds = new Set(netNew.flatMap((f) => (f.patternId ? [f.patternId] : [])));
  const exceptions = loadFindingExceptions(input.repoRoot);
  const unsuppressed = withConsistencyContext(filterSuppressedFindings(netNew, exceptions), consistencyChanges);
  const blocking = unsuppressed.filter((f) => f.severity === "block");
  const certAdvisory = unsuppressed.filter((f) => f.severity !== "block");
  const consistency = filterSuppressedFindings(
    candidateConsistencyAdvisories(consistencyChanges, certifiedPatternIds),
    exceptions,
  );

  // --- 2. Reuse-against-baseline (advisory) ---
  const reuse = filterSuppressedFindings(reuseAgainstBaseline(inputWithBuildOpts, headByPath, baseMap.modules), exceptions);

  // --- 3. Capability bypass: PR adds inline use of a cross-cutting capability
  //        (date/time, JSON, crypto, …) when a canonical helper already exists. ---
  const capBypass = filterSuppressedFindings(capabilityBypass(inputWithBuildOpts, headByPath, baseMap.modules), exceptions);

  const advisories = [...certAdvisory, ...consistency, ...reuse, ...capBypass];
  const findings = [...blocking, ...advisories];
  const decision: ReviewResult["decision"] = blocking.length > 0 ? "block" : "allow";
  return { decision, blocking, advisories, findings, summary: summarise(decision, blocking, advisories) };
}

export async function reviewPRWithLLM(input: ReviewInput & { llm?: ReviewLLMOptions }): Promise<ReviewResult> {
  const deterministic = reviewPR(input);
  if (!input.llm || input.profile.phases.pr.llm !== true) return deterministic;

  const pairs = llmJudgePairs(input);
  if (pairs.length === 0) return deterministic;

  const judged = await new LLMJudge({
    repoRoot: input.llm.catalogueRoot ?? input.repoRoot,
    client: input.llm.client,
    event: input.event ?? "PR_REVIEW",
    callTimeoutMs: input.llm.callTimeoutMs,
  }).judge(pairs);
  const exceptions = loadFindingExceptions(input.repoRoot);
  const llmFindings = filterSuppressedFindings(judged.findings, exceptions);
  if (llmFindings.length === 0 && !judged.incomplete) return deterministic;

  const advisories = [...deterministic.advisories, ...llmFindings];
  const findings = [...deterministic.blocking, ...advisories];
  const summary = summarise(deterministic.decision, deterministic.blocking, advisories, judged.incomplete);
  return { ...deterministic, advisories, findings, summary };
}

function llmJudgePairs(input: ReviewInput): { patternId: string; region: CodeRegion }[] {
  const patternIds = [...new Set(input.profile.adopt.map((pattern) => pattern.id))];
  if (patternIds.length === 0) return [];
  const pairs: { patternId: string; region: CodeRegion }[] = [];
  for (const change of input.changes) {
    if (change.status !== "added" && change.status !== "modified") continue;
    const region = regionForPath(input.repoRoot, change.path);
    if (!region) continue;
    for (const patternId of patternIds) pairs.push({ patternId, region });
  }
  return pairs;
}

function regionForPath(repoRoot: string, path: string): CodeRegion | undefined {
  let content: string;
  try {
    content = readFileSync(join(repoRoot, path), "utf8");
  } catch {
    return undefined;
  }
  const lines = content.split("\n").slice(0, 200);
  return { file: path, startLine: 1, endLine: Math.max(1, lines.length), content: lines.join("\n") };
}
