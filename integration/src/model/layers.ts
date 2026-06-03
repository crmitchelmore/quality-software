import type { Layer } from "./lang/types.js";

export type { Layer };

/**
 * Shared, language-neutral layer classification (design 15/16). The SAME prefixes
 * and classifier drive both the evidence map (project-map.ts) and the write-time
 * deterministic detectors, so write-time and PR-time agree on what a "layer" is.
 *
 * Classification is by path SEGMENT substring (`rel.includes("domain/")`), not
 * strict globs, so nested build layouts (gradle/maven
 * `src/main/kotlin/com/app/domain/…`, python packages, etc.) already classify via
 * the bare-segment entries ("domain/", "infrastructure/", …).
 *
 * NOTE: these semantics are byte-for-byte the ones project-map.ts shipped with;
 * do not "improve" them here without re-validating the evidence map, or layer
 * classification (and every downstream edge/duplicate) shifts silently.
 */

export const DEFAULT_LAYER_PREFIXES: Record<Layer, string[]> = {
  test: ["test/", "tests/", "__tests__/", "__mocks__/", "fixtures/", "spec/"],
  domain: ["src/domain/", "domain/", "src/core/"],
  application: ["src/application/", "application/", "src/usecases/", "src/use-cases/", "src/app/"],
  infrastructure: ["src/infrastructure/", "infrastructure/", "src/infra/", "src/adapters/", "src/persistence/"],
  interface: ["src/interface/", "src/interfaces/", "src/api/", "src/http/", "src/web/", "src/ui/", "src/controllers/", "src/routes/"],
  other: [],
};

export function isTestPath(rel: string): boolean {
  return /(^|\/)(test|tests|__tests__|__mocks__|fixtures|spec)(\/|$)/.test(rel) || /\.(test|spec)\.[tj]sx?$/.test(rel);
}

const ORDERED: Layer[] = ["domain", "application", "infrastructure", "interface"];

/** Classify a repo-relative file path into an architectural layer. */
export function classifyLayer(rel: string, prefixes: Record<Layer, string[]> = DEFAULT_LAYER_PREFIXES): Layer {
  if (isTestPath(rel)) return "test";
  for (const layer of ORDERED) {
    if (prefixes[layer].some((p) => rel.includes(p))) return layer;
  }
  return "other";
}

/**
 * Best-effort layer of an IMPORT SPECIFIER as written (design 16, supporting
 * heuristic). Works for path-style imports (`../infrastructure/db`) AND
 * package-qualified FQNs (`com.app.infrastructure.Db`) by scanning for a layer
 * segment token. Returns undefined when no layer token is present.
 *
 * This is an ADVISORY write-time heuristic only: at PR time the certifier resolves
 * imports to real modules over the whole-project index and is authoritative.
 */
export function layerOfImportSpec(spec: string): Layer | undefined {
  const norm = spec.replace(/[.\\]/g, "/").toLowerCase();
  const has = (...frags: string[]) => frags.some((f) => norm.includes(f));
  if (has("/infrastructure/", "/infra/", "/persistence/", "/adapter/", "/adapters/")) return "infrastructure";
  if (has("/interface/", "/controller/", "/controllers/", "/rest/", "/http/", "/web/")) return "interface";
  if (has("/application/", "/usecase/", "/usecases/", "/use-cases/")) return "application";
  if (has("/domain/", "/core/")) return "domain";
  return undefined;
}
