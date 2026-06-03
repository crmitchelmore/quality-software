import type { Detector, Finding, ChangeSet, DetectorContext } from "../contract.js";
import { fingerprint } from "../contract.js";
import { relPath } from "./util.js";
import { factsFor, resolveRelative } from "./facts.js";
import { classifyLayer, layerOfImportSpec, type Layer } from "../model/layers.js";
import { defaultRegistry, type ProviderRegistry } from "../model/lang/registry.js";

/**
 * Forbidden-import boundary detector — the flagship rulepack, now LANGUAGE-NEUTRAL.
 *
 * It is the single-file, write-time PROJECTION of the certifier's
 * `forbidden-layer-edge` predicate (design 16.6): "a module in a source layer must
 * not depend on a module in a forbidden target layer" — the import-direction
 * invariant shared by Hexagonal/Clean/Onion/Layered architecture.
 *
 * It runs over the neutral code model (FileFacts via the provider registry), so it
 * covers TypeScript, Kotlin, Java and Python (and every other provider language)
 * with one implementation. Two resolution qualities:
 *   - RELATIVE imports (`../infrastructure/db`) are path-resolved precisely →
 *     block-eligible, exactly as before.
 *   - PACKAGE/FQN imports (`com.app.infrastructure.Db`) are classified by scanning
 *     the specifier for a layer segment → marked `heuristic` (low-confidence,
 *     advisory only). The authoritative blocker for these is the certifier, which
 *     resolves the FQN against the whole-project index (design 16.6).
 */

export interface BoundaryEdge {
  patternId: string;
  fromLayers: Layer[];
  toLayer: Layer;
  registry?: ProviderRegistry;
}

const DETECTOR_ID = "forbidden-import.dependency-rule";

export function forbiddenImportDetector(edge: BoundaryEdge): Detector {
  const version = "1.1.0";
  const registry = edge.registry ?? defaultRegistry();
  const fromSet = new Set(edge.fromLayers);
  return {
    id: DETECTOR_ID,
    version,
    patternId: edge.patternId,
    requiresContext: "file",
    events: ["POST_WRITE_CONTENT", "PR_REVIEW", "BATCH"],
    canBlock: true, // deterministic; only PATH-RESOLVED findings are block-eligible (heuristic ones are not)
    maxLatencyMs: 50,
    run(change: ChangeSet, ctx: DetectorContext): Finding[] {
      const findings: Finding[] = [];
      const rationale = ctx.rationaleFor(edge.patternId);
      for (const file of change.files) {
        if (!file.content) continue;
        const rel = relPath(change.repoRoot, file.path);
        const fromLayer = classifyLayer(rel);
        if (!fromSet.has(fromLayer)) continue;
        const facts = factsFor(rel, file.content, registry);
        if (!facts) continue;
        for (const imp of facts.imports) {
          const spec = imp.raw;
          let targetLayer: Layer | undefined;
          let heuristic = false;
          const resolved = resolveRelative(rel, spec);
          if (resolved !== undefined) {
            targetLayer = classifyLayer(resolved);
          } else {
            targetLayer = layerOfImportSpec(spec);
            heuristic = true; // FQN/package segment-scan — not resolved against the index
          }
          if (targetLayer !== edge.toLayer) continue;
          findings.push(
            buildFinding(rel, spec, imp.span?.startLine, edge, fromLayer, heuristic, version, rationale),
          );
        }
      }
      return findings;
    },
  };
}

function buildFinding(
  rel: string,
  spec: string,
  line: number | undefined,
  edge: BoundaryEdge,
  fromLayer: Layer,
  heuristic: boolean,
  version: string,
  rationale: { philosophyId?: string; rationale?: string },
): Finding {
  const evidence = `import "${spec}"`;
  const how = heuristic
    ? `possible boundary crossing — '${spec}' looks like the ${edge.toLayer} layer (heuristic; not resolved)`
    : `imports the ${edge.toLayer} layer ("${spec}")`;
  return {
    fingerprint: fingerprint({
      patternId: edge.patternId,
      detectorId: DETECTOR_ID,
      detectorVersion: version,
      symbol: spec,
      evidence,
      scopePath: rel,
    }),
    detectorId: DETECTOR_ID,
    detectorVersion: version,
    patternId: edge.patternId,
    philosophyId: rationale.philosophyId,
    severity: "warning",
    path: rel,
    line,
    message: `Boundary violation: ${fromLayer} module ${rel} ${how}.`,
    suggestion:
      `Depend on an abstraction (outbound port/interface) owned by the ${fromLayer} layer instead of ` +
      `importing ${edge.toLayer} directly; wire the concrete implementation in the composition root.`,
    evidence,
    rationale: rationale.rationale,
    heuristic: heuristic || undefined,
  };
}
