import type { ResolvedProfile } from "../contract.js";
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
    if (!BOUNDARY_PATTERNS.has(adopted.id)) continue;
    const opts = adopted.options ?? {};
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
