import type { ResolvedProfile } from "../contract.js";
import type { ExportedSymbol } from "../model/extract.js";
import { layersFromGlobs, type Layer } from "../model/layers.js";
import type { Policy } from "./types.js";

/**
 * Derive deterministic certifier policies from a resolved profile (design 16.6).
 *
 * This is the bridge that lets the PR reviewer BLOCK on the same architectural
 * decisions the profile adopts. Only predicates that can be checked
 * deterministically over the neutral evidence map become policies; syntactic bans
 * (Singleton, Service Locator, …) stay with the advisory write-time signatures.
 *
 * A boundary pattern (Hexagonal/Clean/Onion/Layered) yields one
 * `forbidden-layer-edge` policy per (sourceLayer → forbiddenTargetLayer). Severity
 * is `block` ONLY when the pattern's enforcement is `block`; otherwise `warning`
 * (so the same boundary surfaces as advice until a team opts into gating).
 */

const BOUNDARY_PATTERNS = new Set([
  "hexagonal-architecture",
  "clean-architecture",
  "onion-architecture",
  "layered-architecture",
]);

export function policiesFromProfile(profile: ResolvedProfile): Policy[] {
  const policies: Policy[] = [];
  for (const adopted of profile.adopt) {
    const opts = adopted.options ?? {};

    if (BOUNDARY_PATTERNS.has(adopted.id)) {
      const fromLayers = layersFromGlobs(opts.domainGlobs as string[] | undefined, ["domain", "application"]);
      const toLayers = layersFromGlobs(opts.forbidImportsFrom as string[] | undefined, ["infrastructure"]);
      const severity = adopted.enforcement === "block" ? "block" : "warning";
      for (const from of fromLayers) {
        for (const to of toLayers) {
          if (from === to) continue;
          policies.push(boundaryPolicy(adopted.id, from, to, severity, adopted.sourcePhilosophy));
        }
      }
    }

    policies.push(...namingPolicies(adopted.id, opts, adopted.enforcement, adopted.sourcePhilosophy));
  }
  return policies;
}

function boundaryPolicy(
  patternId: string,
  from: Layer,
  to: Layer,
  severity: Policy["severity"],
  philosophyId?: string,
): Policy {
  return {
    id: `boundary:${from}->${to}`,
    patternId,
    philosophyId,
    predicate: { kind: "forbidden-layer-edge", from, to },
    severity,
    message: `Boundary violation: a ${from} module must not depend on the ${to} layer (${patternId}).`,
  };
}

type NamingConventionOption = {
  scopeGlob?: string;
  exportKind?: ExportedSymbol["kind"];
  namePattern: string;
  message?: string;
};

const EXPORT_KINDS = new Set<ExportedSymbol["kind"]>([
  "function",
  "class",
  "interface",
  "type",
  "enum",
  "const",
  "default",
  "reexport",
]);

function namingPolicies(
  patternId: string,
  opts: Record<string, unknown>,
  enforcement: ResolvedProfile["adopt"][number]["enforcement"],
  philosophyId?: string,
): Policy[] {
  const conventions = namingConventionOptions(opts);
  const severity: Policy["severity"] = enforcement === "advise" ? "advice" : "warning";
  return conventions.map((convention, index) => ({
    id: `naming:${patternId}:${index}`,
    patternId,
    philosophyId,
    predicate: {
      kind: "naming-convention",
      scopeGlob: convention.scopeGlob,
      exportKind: convention.exportKind,
      namePattern: convention.namePattern,
    },
    severity,
    message:
      convention.message ??
      `Naming convention violation: ${convention.exportKind ?? "exported symbol"} should match /${
        convention.namePattern
      }/${convention.scopeGlob ? ` in ${convention.scopeGlob}` : ""} (${patternId}).`,
  }));
}

function namingConventionOptions(opts: Record<string, unknown>): NamingConventionOption[] {
  const raw = opts.namingConventions ?? opts.namingConvention;
  const entries = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return entries.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const rec = entry as Record<string, unknown>;
    if (typeof rec.namePattern !== "string" || rec.namePattern.trim() === "") return [];
    try {
      new RegExp(rec.namePattern);
    } catch {
      return [];
    }
    if (rec.exportKind !== undefined && typeof rec.exportKind !== "string") return [];
    if (typeof rec.exportKind === "string" && !EXPORT_KINDS.has(rec.exportKind as ExportedSymbol["kind"])) return [];
    const exportKind = rec.exportKind as ExportedSymbol["kind"] | undefined;
    const scopeGlob = typeof rec.scopeGlob === "string" && rec.scopeGlob.trim() !== "" ? rec.scopeGlob : undefined;
    const message = typeof rec.message === "string" && rec.message.trim() !== "" ? rec.message : undefined;
    return [{ namePattern: rec.namePattern, exportKind, scopeGlob, message }];
  });
}
