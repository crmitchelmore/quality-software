import type { Detector, ResolvedProfile } from "../contract.js";
import { forbiddenImportDetector } from "./forbidden-import.js";
import { bannedConstructDetector } from "./banned-construct.js";
import { reuseDetector } from "./reuse.js";
import { boundaryLayerConfig } from "../model/layers.js";

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
    const { fromLayers, toLayers, layerPrefixes } = boundaryLayerConfig(boundaryPattern.options);
    detectors.push(
      forbiddenImportDetector({ patternId: boundaryPattern.id, fromLayers, toLayer: toLayers[0], layerPrefixes }),
    );
  }

  // Banned-construct signatures — driven by the profile's ban list.
  const bannedIds = new Set(profile.ban.map((b) => b.id));
  if (bannedIds.size) detectors.push(bannedConstructDetector(bannedIds));

  // Reuse detector — always on (advisory).
  detectors.push(reuseDetector(["src"]));

  return detectors;
}
