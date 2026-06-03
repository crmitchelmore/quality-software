import { execFileSync } from "node:child_process";
import type { Finding, ResolvedProfile, CanonicalEvent } from "../contract.js";
import {
  parseModules,
  deriveEvidenceMap,
  moduleFromFile,
  pickCanonical,
  type ModuleInfo,
  type BuildOptions,
} from "../model/project-map.js";
import { certify, certifiedFindings } from "../policy/certify.js";
import { policiesFromProfile } from "../policy/from-profile.js";
import { CAPABILITIES, findCanonicalHelper, moduleReachesCapabilityInline } from "../model/capabilities.js";
import { fingerprint } from "../contract.js";

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
  const reAdd = (path: string) => {
    const content = baseContent(path);
    if (content === undefined) {
      byPath.delete(path);
      return;
    }
    const m = moduleFromFile(path, content, undefined, registry);
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
  const opts: BuildOptions = input.buildOpts ?? {};
  const headModules = parseModules(input.repoRoot, opts);
  const headByPath = new Map(headModules.map((m) => [m.path, m]));
  const headMap = deriveEvidenceMap(headModules, input.repoRoot, opts);
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
  const blocking = netNew.filter((f) => f.severity === "block");
  const certAdvisory = netNew.filter((f) => f.severity !== "block");

  // --- 2. Reuse-against-baseline (advisory) ---
  const reuse = reuseAgainstBaseline(input, headByPath, baseMap.modules);

  // --- 3. Capability bypass: PR adds inline use of a cross-cutting capability
  //        (date/time, JSON, crypto, …) when a canonical helper already exists. ---
  const capBypass = capabilityBypass(input, headByPath, baseMap.modules);

  const advisories = [...certAdvisory, ...reuse, ...capBypass];
  const findings = [...blocking, ...advisories];
  const decision: ReviewResult["decision"] = blocking.length > 0 ? "block" : "allow";
  return { decision, blocking, advisories, findings, summary: summarise(decision, blocking, advisories) };
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
  const declIndex = new Map<string, ModuleInfo[]>(); // symbol -> baseline modules declaring it
  for (const m of baseModules) {
    if (m.isTest || m.isBarrel || m.isGenerated) continue;
    for (const e of m.exports) {
      if (e.kind === "reexport" || e.name === "default") continue;
      const arr = declIndex.get(e.name) ?? [];
      arr.push(m);
      declIndex.set(e.name, arr);
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
        baseSrc !== undefined ? moduleFromFile(c.path, baseSrc, undefined, input.buildOpts?.registry) : undefined;
      for (const e of baseMod?.exports ?? []) priorOwn.add(e.name);
    }

    for (const e of head.exports) {
      if (e.kind === "reexport" || e.name === "default") continue;
      if (priorOwn.has(e.name)) continue; // pre-existing symbol of this same file
      const elsewhere = (declIndex.get(e.name) ?? []).filter(
        (m) => m.path !== c.path && m.exports.some((x) => x.name === e.name && x.kind === e.kind),
      );
      if (elsewhere.length === 0) continue;
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
    }
  }
  return out;
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
  for (const c of input.changes) {
    if (c.status !== "added" && c.status !== "modified") continue;
    const head = headByPath.get(c.path);
    if (!head || head.isTest || head.isGenerated || head.isBarrel) continue;

    // Base version of this file, to enforce NET-NEW only.
    const baseSrc = c.status === "modified" ? input.baseContent(c.path) : undefined;
    const baseMod =
      baseSrc !== undefined ? moduleFromFile(c.path, baseSrc, undefined, input.buildOpts?.registry) : undefined;

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

function summarise(decision: ReviewResult["decision"], blocking: Finding[], advisories: Finding[]): string {
  const lines: string[] = [];
  lines.push(
    decision === "block"
      ? `BLOCK: ${blocking.length} net-new boundary violation(s) introduced by this PR.`
      : "PASS: no net-new boundary violations introduced.",
  );
  for (const f of blocking.slice(0, 20)) lines.push(`  [block] ${f.path} — ${f.message}`);
  const reuse = advisories.filter((a) => a.detectorId === "reuse.canonical-baseline");
  if (reuse.length) {
    lines.push(`Reuse advisories (${reuse.length}):`);
    for (const f of reuse.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const capBypass = advisories.filter((a) => a.detectorId === "reuse.capability-bypass");
  if (capBypass.length) {
    lines.push(`Capability-bypass advisories (${capBypass.length}):`);
    for (const f of capBypass.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
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
