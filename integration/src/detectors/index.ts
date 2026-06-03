import type { Detector, ResolvedProfile } from "../contract.js";
import { forbiddenImportDetector } from "./forbidden-import.js";
import { bannedConstructDetector } from "./banned-construct.js";
import { reuseDetector } from "./reuse.js";
import { DEFAULT_LAYER_PREFIXES, type Layer } from "../model/layers.js";

/**
 * Build the active detector set from a resolved profile. Only detectors backed
 * by an adopted/banned pattern (or always-on reuse) are instantiated, so the
 * engine never "lints against all 275 patterns" (design 01-concepts).
 */
export function buildDetectors(profile: ResolvedProfile): Detector[] {
  const detectors: Detector[] = [];

  // Boundary detector — driven by an adopted hexagonal/clean/layered pattern.
  const boundaryPattern = profile.adopt.find((p) =>
    ["hexagonal-architecture", "clean-architecture", "layered-architecture", "onion-architecture"].includes(p.id),
  );
  if (boundaryPattern) {
    const opts = boundaryPattern.options ?? {};
    const fromLayers = layersFromGlobs(opts.domainGlobs as string[] | undefined, ["domain", "application"]);
    const toLayers = layersFromGlobs(opts.forbidImportsFrom as string[] | undefined, ["infrastructure"]);
    detectors.push(
      forbiddenImportDetector({ patternId: boundaryPattern.id, fromLayers, toLayer: toLayers[0] }),
    );
  }

  // Banned-construct signatures — driven by the profile's ban list.
  const bannedIds = new Set(profile.ban.map((b) => b.id));
  if (bannedIds.size) detectors.push(bannedConstructDetector(bannedIds));

  // Reuse detector — always on (advisory).
  detectors.push(reuseDetector(["src"]));

  return detectors;
}

/**
 * Map configured path globs to architectural layers so the write-time detector
 * and the certifier's forbidden-layer-edge predicate agree on the SAME boundary
 * (critique: one boundary identity, two altitudes). Falls back to `dflt` when no
 * glob names a recognised layer.
 */
function layersFromGlobs(globs: string[] | undefined, dflt: Layer[]): Layer[] {
  if (!globs || globs.length === 0) return dflt;
  const layers = new Set<Layer>();
  for (const g of globs) {
    for (const layer of Object.keys(DEFAULT_LAYER_PREFIXES) as Layer[]) {
      if (layer === "other") continue;
      if (DEFAULT_LAYER_PREFIXES[layer].some((p) => g.includes(p.replace(/\/$/, "")))) layers.add(layer);
    }
  }
  return layers.size ? [...layers] : dflt;
}
