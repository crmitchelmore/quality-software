import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Finding, ResolvedProfile, CanonicalEvent } from "../contract.js";
import {
  parseModules,
  deriveEvidenceMap,
  moduleFromFile,
  pickCanonical,
  resolveLayerPrefixes,
  type ModuleInfo,
  type BuildOptions,
  type EvidenceMap,
} from "../model/project-map.js";
import { layerPrefixesFromProfile } from "../model/layers.js";
import { certify, certifiedFindings } from "../policy/certify.js";
import { policiesFromProfile } from "../policy/from-profile.js";
import { CAPABILITIES, findCanonicalHelper, moduleReachesCapabilityInline } from "../model/capabilities.js";
import { fingerprint } from "../contract.js";
import { filterSuppressedFindings, loadFindingExceptions } from "../exceptions.js";
import { LLMJudge } from "../judge/judge.js";
import type { CodeRegion } from "../judge/schema.js";
import type { LLMClient } from "../llm/types.js";

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

export type ChangeStatus = "added" | "modified" | "deleted" | "renamed";

export interface ChangeEntry {
  path: string; // head path (the new path for renames; the removed path for deletes)
  status: ChangeStatus;
  oldPath?: string; // previous path for renames
}

export interface ReviewInput {
  repoRoot: string;
  profile: ResolvedProfile;
  changes: ChangeEntry[];
  /** Content of a path at the BASE ref (undefined if it did not exist there). */
  baseContent: (path: string) => string | undefined;
  buildOpts?: BuildOptions;
  event?: CanonicalEvent;
}

export interface ReviewLLMOptions {
  client: LLMClient;
  catalogueRoot?: string;
  callTimeoutMs?: number;
}

export interface ReviewResult {
  decision: "allow" | "block";
  blocking: Finding[]; // net-new certified violations introduced by the PR
  advisories: Finding[]; // reuse + other non-blocking signals
  findings: Finding[]; // blocking ++ advisories
  summary: string;
}

/** Apply the reverse overlay that turns the head module set into the BASE module set. */
function baselineModules(
  repoRoot: string,
  changes: ChangeEntry[],
  baseContent: ReviewInput["baseContent"],
  opts: BuildOptions,
): ModuleInfo[] {
  const byPath = new Map(parseModules(repoRoot, opts).map((m) => [m.path, m]));
  const registry = opts.registry;
  const prefixes = resolveLayerPrefixes(opts);
  const reAdd = (path: string) => {
    const content = baseContent(path);
    if (content === undefined) {
      byPath.delete(path);
      return;
    }
    const m = moduleFromFile(path, content, prefixes, registry);
    if (m) byPath.set(path, m);
    else byPath.delete(path);
  };
  for (const c of changes) {
    switch (c.status) {
      case "added":
        byPath.delete(c.path); // did not exist at base
        break;
      case "deleted":
        reAdd(c.path); // existed at base; restore it
        break;
      case "modified":
        reAdd(c.path); // restore the base version
        break;
      case "renamed":
        byPath.delete(c.path); // new path did not exist at base
        if (c.oldPath) reAdd(c.oldPath); // old path did
        break;
    }
  }
  return [...byPath.values()];
}

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

type ConsistencyChange = {
  patternId: string;
  baseScore: number;
  headScore: number;
  violations: number;
  newLocations: string[];
};

function candidateConsistencyChanges(headMap: EvidenceMap, baseMap: EvidenceMap): Map<string, ConsistencyChange> {
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

function percent(score: number): string {
  return `${Math.round(score * 100)}%`;
}

function consistencyText(change: ConsistencyChange): string {
  return `Pattern consistency is now ${percent(change.headScore)} (${change.violations} violation(s); was ${percent(
    change.baseScore,
  )}).`;
}

function withConsistencyContext(findings: Finding[], changes: Map<string, ConsistencyChange>): Finding[] {
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

function candidateConsistencyAdvisories(
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

/**
 * Flag a changed file that DECLARES a symbol which already has a home elsewhere in
 * the baseline — "you re-implemented X; reuse the canonical one". Symbol-DIFFING
 * (critique): for modified files only NEW declarations count, a file is never
 * compared against itself, and obviously-distinct cases are suppressed.
 */
function reuseAgainstBaseline(
  input: ReviewInput,
  headByPath: Map<string, ModuleInfo>,
  baseModules: ModuleInfo[],
): Finding[] {
  const baseByPath = new Map(baseModules.map((m) => [m.path, m]));
  const prefixes = resolveLayerPrefixes(input.buildOpts ?? {});
  const declIndex = new Map<string, ModuleInfo[]>(); // symbol -> baseline modules declaring it
  const signatureIndex = new Map<string, BaselineDeclaration[]>();
  for (const m of baseModules) {
    if (m.isTest || m.isBarrel || m.isGenerated) continue;
    for (const e of m.exports) {
      if (e.kind === "reexport" || e.name === "default") continue;
      const arr = declIndex.get(e.name) ?? [];
      arr.push(m);
      declIndex.set(e.name, arr);
      if (e.signatureShape && e.lexicalTokens?.length) {
        const sigs = signatureIndex.get(e.signatureShape) ?? [];
        sigs.push({ module: m, name: e.name, lexicalTokens: e.lexicalTokens });
        signatureIndex.set(e.signatureShape, sigs);
      }
    }
  }

  const out: Finding[] = [];
  for (const c of input.changes) {
    if (c.status !== "added" && c.status !== "modified") continue;
    const head = headByPath.get(c.path);
    if (!head || head.isTest || head.isGenerated || head.isBarrel) continue;

    // New declarations only: subtract the file's own base-version exports.
    const priorOwn = new Set<string>();
    if (c.status === "modified") {
      const baseSrc = input.baseContent(c.path);
      const baseMod =
        baseSrc !== undefined ? moduleFromFile(c.path, baseSrc, prefixes, input.buildOpts?.registry) : undefined;
      for (const e of baseMod?.exports ?? []) priorOwn.add(e.name);
    }

    for (const e of head.exports) {
      if (e.kind === "reexport" || e.name === "default") continue;
      if (priorOwn.has(e.name)) continue; // pre-existing symbol of this same file
      const elsewhere = (declIndex.get(e.name) ?? []).filter(
        (m) => m.path !== c.path && m.exports.some((x) => x.name === e.name && x.kind === e.kind),
      );
      if (elsewhere.length) {
        const canonical = pickCanonical(
          elsewhere.map((m) => m.path),
          baseByPath,
        );
        const sameLayer = elsewhere.some((m) => m.layer === head.layer);
        // Soften a cross-layer collision: same-named things in different layers are
        // frequently legitimately distinct (e.g. a domain Order vs a DTO Order).
        const severity = sameLayer ? "advice" : "info";
        out.push({
          fingerprint: fingerprint({
            detectorId: "reuse.canonical-baseline",
            detectorVersion: "1.0.0",
            symbol: e.name,
            evidence: `declares ${e.name}`,
            scopePath: c.path,
          }),
          detectorId: "reuse.canonical-baseline",
          detectorVersion: "1.0.0",
          severity,
          path: c.path,
          message:
            `Possible re-implementation: '${e.name}' already exists at ${canonical.path}` +
            (elsewhere.length > 1 ? ` (+${elsewhere.length - 1} more)` : "") +
            (sameLayer ? "." : ` (different layer — confirm it is genuinely distinct).`),
          suggestion: `Reuse the canonical '${e.name}' from ${canonical.path} instead of defining a parallel implementation.`,
          evidence: `declares ${e.name}`,
        });
        continue;
      }

      const signatureFinding = signatureReuseFinding(c.path, head, e, signatureIndex);
      if (signatureFinding) out.push(signatureFinding);
    }
  }
  return out;
}

type BaselineDeclaration = {
  module: ModuleInfo;
  name: string;
  lexicalTokens: string[];
};

function primitiveOnlySignature(shape: string): boolean {
  const parts = shape.match(/[a-z][a-z0-9]*/g) ?? [];
  return parts.every((part) => ["fn", "string", "number", "boolean", "void", "unknown", "any"].includes(part));
}

function tokenSimilarity(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): { score: number; overlap: string[] } {
  const a = new Set(left ?? []);
  const b = new Set(right ?? []);
  if (a.size === 0 || b.size === 0) return { score: 0, overlap: [] };
  const overlap = [...a].filter((token) => b.has(token)).sort();
  const unionSize = new Set([...a, ...b]).size;
  return { score: unionSize ? overlap.length / unionSize : 0, overlap };
}

function signatureReuseFinding(
  path: string,
  head: ModuleInfo,
  exported: ModuleInfo["exports"][number],
  signatureIndex: Map<string, BaselineDeclaration[]>,
): Finding | undefined {
  if (!exported.signatureShape || !exported.lexicalTokens?.length) return undefined;
  const candidates = (signatureIndex.get(exported.signatureShape) ?? []).filter(
    (candidate) => candidate.module.path !== path && candidate.name !== exported.name,
  );
  let best: { candidate: BaselineDeclaration; score: number; overlap: string[] } | undefined;
  for (const candidate of candidates) {
    const { score, overlap } = tokenSimilarity(exported.lexicalTokens, candidate.lexicalTokens);
    if (!best || score > best.score) best = { candidate, score, overlap };
  }
  if (!best) return undefined;

  const primitiveOnly = primitiveOnlySignature(exported.signatureShape);
  const minOverlap = primitiveOnly ? 3 : 2;
  const minScore = primitiveOnly ? 0.45 : 0.3;
  if (best.overlap.length < minOverlap || best.score < minScore) return undefined;

  const severity = best.candidate.module.layer === head.layer ? "advice" : "info";
  const evidence = `signature ${exported.signatureShape}; overlapping tokens: ${best.overlap.slice(0, 6).join(", ")}`;
  return {
    fingerprint: fingerprint({
      detectorId: "reuse.signature-baseline",
      detectorVersion: "1.0.0",
      symbol: `${exported.signatureShape}:${exported.name}`,
      evidence,
      scopePath: path,
    }),
    detectorId: "reuse.signature-baseline",
    detectorVersion: "1.0.0",
    severity,
    path,
    message:
      `Possible semantic re-implementation: '${exported.name}' has the same signature shape as ` +
      `'${best.candidate.name}' at ${best.candidate.module.path} and overlapping lexical evidence.`,
    suggestion: `Reuse '${best.candidate.name}' from ${best.candidate.module.path}, or rename/document why this similarly-shaped implementation is distinct.`,
    evidence,
  };
}

/**
 * Flag a changed file that NEWLY reaches for a cross-cutting capability inline
 * (e.g. java.time, Jackson, MessageDigest) when the baseline already has a
 * canonical helper for it. This connects onboarding's localised-capability
 * detection to enforcement: "you added date logic directly; route it through
 * the existing helper". Only NET-NEW usage counts — a modified file that already
 * used the capability at base is not re-flagged, and files that already import
 * the helper are skipped.
 */
function capabilityBypass(
  input: ReviewInput,
  headByPath: Map<string, ModuleInfo>,
  baseModules: ModuleInfo[],
): Finding[] {
  // Canonical helper per capability, derived once from the baseline.
  const helpers = new Map<string, ModuleInfo>();
  for (const cap of CAPABILITIES) {
    const h = findCanonicalHelper(baseModules, cap);
    if (h) helpers.set(cap.id, h);
  }
  if (helpers.size === 0) return [];

  const out: Finding[] = [];
  const prefixes = resolveLayerPrefixes(input.buildOpts ?? {});
  for (const c of input.changes) {
    if (c.status !== "added" && c.status !== "modified") continue;
    const head = headByPath.get(c.path);
    if (!head || head.isTest || head.isGenerated || head.isBarrel) continue;

    // Base version of this file, to enforce NET-NEW only.
    const baseSrc = c.status === "modified" ? input.baseContent(c.path) : undefined;
    const baseMod =
      baseSrc !== undefined ? moduleFromFile(c.path, baseSrc, prefixes, input.buildOpts?.registry) : undefined;

    for (const cap of CAPABILITIES) {
      const canonical = helpers.get(cap.id);
      if (!canonical || canonical.path === c.path) continue;
      if (!moduleReachesCapabilityInline(head, cap)) continue; // file doesn't reach the capability inline
      if (baseMod && moduleReachesCapabilityInline(baseMod, cap)) continue; // not net-new
      if (head.imports.some((i) => i.resolved === canonical.path)) continue; // already routes through helper

      out.push({
        fingerprint: fingerprint({
          detectorId: "reuse.capability-bypass",
          detectorVersion: "1.0.0",
          symbol: cap.id,
          evidence: `inline ${cap.id}`,
          scopePath: c.path,
        }),
        detectorId: "reuse.capability-bypass",
        detectorVersion: "1.0.0",
        severity: "advice",
        path: c.path,
        message: `New inline ${cap.title.toLowerCase()} — a canonical helper already exists at ${canonical.path}.`,
        suggestion: `Route ${cap.title.toLowerCase()} through ${canonical.path} instead of using the underlying library directly, so behaviour stays consistent.`,
        evidence: `inline ${cap.id}`,
      });
    }
  }
  return out;
}

function summarise(
  decision: ReviewResult["decision"],
  blocking: Finding[],
  advisories: Finding[],
  llmIncomplete = false,
): string {
  const lines: string[] = [];
  lines.push(
    decision === "block"
      ? `BLOCK: ${blocking.length} net-new boundary violation(s) introduced by this PR.`
      : "PASS: no net-new boundary violations introduced.",
  );
  for (const f of blocking.slice(0, 20)) lines.push(`  [block] ${f.path} — ${f.message}`);
  const policy = advisories.filter((a) => a.detectorId.startsWith("policy-certifier:"));
  if (policy.length) {
    lines.push(`Policy advisories (${policy.length}):`);
    for (const f of policy.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const consistency = advisories.filter((a) => a.detectorId === "consistency.candidate-pattern");
  if (consistency.length) {
    lines.push(`Consistency advisories (${consistency.length}):`);
    for (const f of consistency.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const reuse = advisories.filter((a) => a.detectorId === "reuse.canonical-baseline");
  if (reuse.length) {
    lines.push(`Reuse advisories (${reuse.length}):`);
    for (const f of reuse.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const semanticReuse = advisories.filter((a) => a.detectorId === "reuse.signature-baseline");
  if (semanticReuse.length) {
    lines.push(`Signature-reuse advisories (${semanticReuse.length}):`);
    for (const f of semanticReuse.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const capBypass = advisories.filter((a) => a.detectorId === "reuse.capability-bypass");
  if (capBypass.length) {
    lines.push(`Capability-bypass advisories (${capBypass.length}):`);
    for (const f of capBypass.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const llm = advisories.filter((a) => a.detectorId === "llm-judge");
  if (llm.length) {
    lines.push(`LLM advisories (${llm.length}, advisory-only):`);
    for (const f of llm.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  if (llmIncomplete) lines.push("LLM advisory pass incomplete: provider/budget failed open.");
  return lines.join("\n");
}

// --- git adapter -----------------------------------------------------------

function git(repoRoot: string, args: string[]): string {
  return execFileSync("git", ["-C", repoRoot, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
}

/** Parse `git diff --name-status <base>...HEAD` into ChangeEntry[]. */
export function changesFromGit(repoRoot: string, base: string): ChangeEntry[] {
  let raw: string;
  try {
    raw = git(repoRoot, ["diff", "--name-status", "-M", `${base}...HEAD`]);
  } catch {
    return [];
  }
  const out: ChangeEntry[] = [];
  for (const line of raw.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const parts = line.split(/\t/);
    const code = parts[0];
    if (code.startsWith("R")) {
      out.push({ status: "renamed", oldPath: parts[1], path: parts[2] });
    } else if (code === "A") {
      out.push({ status: "added", path: parts[1] });
    } else if (code === "D") {
      out.push({ status: "deleted", path: parts[1] });
    } else if (code === "M" || code === "C" || code.startsWith("T")) {
      out.push({ status: "modified", path: parts[parts.length - 1] });
    }
  }
  return out;
}

/** Read a path's content at the base ref (undefined if absent). */
export function gitBaseContent(repoRoot: string, base: string): (path: string) => string | undefined {
  return (path: string) => {
    try {
      return git(repoRoot, ["show", `${base}:${path}`]);
    } catch {
      return undefined;
    }
  };
}
