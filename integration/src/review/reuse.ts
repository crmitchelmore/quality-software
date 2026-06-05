import { fingerprint, type Finding } from "../contract.js";
import { CAPABILITIES, findCanonicalHelper, moduleReachesCapabilityInline } from "../model/capabilities.js";
import { moduleFromFile, pickCanonical, resolveLayerPrefixes, type ModuleInfo } from "../model/project-map.js";
import type { ReviewInput } from "./types.js";

/**
 * Flag a changed file that DECLARES a symbol which already has a home elsewhere in
 * the baseline — "you re-implemented X; reuse the canonical one". Symbol-DIFFING
 * (critique): for modified files only NEW declarations count, a file is never
 * compared against itself, and obviously-distinct cases are suppressed.
 */
export function reuseAgainstBaseline(
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

/**
 * Flag a changed file that NEWLY reaches for a cross-cutting capability inline
 * (e.g. java.time, Jackson, MessageDigest) when the baseline already has a
 * canonical helper for it. This connects onboarding's localised-capability
 * detection to enforcement: "you added date logic directly; route it through
 * the existing helper". Only NET-NEW usage counts — a modified file that already
 * used the capability at base is not re-flagged, and files that already import
 * the helper are skipped.
 */
export function capabilityBypass(
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
