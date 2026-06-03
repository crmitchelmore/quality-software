import type { EvidenceMap, ModuleInfo } from "../model/project-map.js";
import type { Finding } from "../contract.js";
import { fingerprint } from "../contract.js";
import type { Policy, CertifiedViolation } from "./types.js";

/**
 * Deterministic policy certifier (design 16.6). Re-checks each Policy's predicate
 * against the neutral evidence map and yields CertifiedViolations with exact
 * evidence. This is the ONLY path that can produce a block — no LLM involved.
 *
 * The certifier is intentionally boring and explainable: every blockable finding
 * can be traced to a concrete edge, import or duplicate in the model.
 */

const CERTIFIER_ID = "policy-certifier";
const CERTIFIER_VERSION = "1.0.0";

function globToRe(glob: string): RegExp {
  const re = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "\u0000")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, ".*");
  return new RegExp(`^${re}$`);
}

function layerOf(map: EvidenceMap): Map<string, ModuleInfo> {
  return new Map(map.modules.map((m) => [m.path, m]));
}

export function certifyPolicy(policy: Policy, map: EvidenceMap): CertifiedViolation | null {
  const p = policy.predicate;
  const byPath = layerOf(map);
  const evidence: CertifiedViolation["evidence"] = [];

  if (p.kind === "forbidden-layer-edge") {
    for (const e of map.dependencyEdges) {
      const from = byPath.get(e.from);
      const to = byPath.get(e.to);
      if (from?.layer === p.from && to?.layer === p.to) {
        evidence.push({ path: e.from, detail: `${p.from} → ${p.to} dependency on ${e.to}` });
      }
    }
  } else if (p.kind === "forbidden-import") {
    const fromRe = p.fromGlob ? globToRe(p.fromGlob) : null;
    const importRe = new RegExp(p.importPattern);
    for (const m of map.modules) {
      if (fromRe && !fromRe.test(m.path)) continue;
      for (const imp of m.imports) {
        if (importRe.test(imp.spec)) {
          evidence.push({ path: m.path, detail: `imports '${imp.spec}'` });
        }
      }
    }
  } else if (p.kind === "no-duplicate-symbol") {
    const max = p.max ?? 1;
    const cluster = map.duplicateSymbols.find((d) => d.name === p.symbol);
    if (cluster) {
      const nonTest = cluster.files.filter((f) => !byPath.get(f)?.isTest);
      if (nonTest.length > max) {
        for (const f of nonTest) evidence.push({ path: f, detail: `declares '${p.symbol}'` });
      }
    }
  }

  if (evidence.length === 0) return null;
  return {
    policyId: policy.id,
    patternId: policy.patternId,
    philosophyId: policy.philosophyId,
    severity: policy.severity,
    evidence,
    message: policy.message,
  };
}

/** Certify a set of policies, returning all satisfied violations. */
export function certify(policies: Policy[], map: EvidenceMap): CertifiedViolation[] {
  const out: CertifiedViolation[] = [];
  for (const policy of policies) {
    const v = certifyPolicy(policy, map);
    if (v) out.push(v);
  }
  return out;
}

/**
 * Turn certified violations into canonical Findings. These are NOT advisory — they
 * are the deterministic, block-eligible findings (design 16.6). Severity is taken
 * from the policy; only here can `block` legitimately originate.
 */
export function certifiedFindings(violations: CertifiedViolation[]): Finding[] {
  const out: Finding[] = [];
  for (const v of violations) {
    for (const ev of v.evidence) {
      out.push({
        fingerprint: fingerprint({
          patternId: v.patternId,
          detectorId: `${CERTIFIER_ID}:${v.policyId}`,
          detectorVersion: CERTIFIER_VERSION,
          evidence: ev.detail,
          scopePath: ev.path,
        }),
        detectorId: `${CERTIFIER_ID}:${v.policyId}`,
        detectorVersion: CERTIFIER_VERSION,
        patternId: v.patternId,
        philosophyId: v.philosophyId,
        severity: v.severity,
        path: ev.path,
        line: ev.line,
        message: v.message,
        evidence: ev.detail,
        rationale: `Certified by policy '${v.policyId}' (deterministic predicate over the code model).`,
        advisory: false,
      });
    }
  }
  return out;
}

/**
 * Corroborate an advisory LLM finding with a certified violation (design 16.6).
 * An LLM finding becomes block-eligible only when an independent deterministic
 * predicate fires for the SAME file. Returns the certified (blocking) finding the
 * LLM finding maps to, or null — the LLM never upgrades itself.
 */
export function corroborate(
  llmFinding: Finding,
  violations: CertifiedViolation[],
): CertifiedViolation | null {
  for (const v of violations) {
    if (v.patternId && llmFinding.patternId && v.patternId !== llmFinding.patternId) continue;
    if (v.evidence.some((e) => e.path === llmFinding.path)) return v;
  }
  return null;
}
