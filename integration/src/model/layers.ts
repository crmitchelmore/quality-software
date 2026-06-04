import type { Layer } from "./lang/types.js";
import type { AdoptedPattern, ResolvedProfile } from "../contract.js";
import { matchesGlob } from "../globs.js";

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

const BOUNDARY_PATTERNS = new Set([
  "hexagonal-architecture",
  "clean-architecture",
  "onion-architecture",
  "layered-architecture",
]);

function cloneDefaultLayerPrefixes(): Record<Layer, string[]> {
  return {
    test: [...DEFAULT_LAYER_PREFIXES.test],
    domain: [...DEFAULT_LAYER_PREFIXES.domain],
    application: [...DEFAULT_LAYER_PREFIXES.application],
    infrastructure: [...DEFAULT_LAYER_PREFIXES.infrastructure],
    interface: [...DEFAULT_LAYER_PREFIXES.interface],
    other: [],
  };
}

function hasGlobSyntax(pattern: string): boolean {
  return /[*?]/.test(pattern);
}

function matchesLayerPattern(rel: string, pattern: string): boolean {
  return hasGlobSyntax(pattern) ? matchesGlob(rel, pattern) : rel.includes(pattern);
}

/** Classify a repo-relative file path into an architectural layer. */
export function classifyLayer(rel: string, prefixes: Record<Layer, string[]> = DEFAULT_LAYER_PREFIXES): Layer {
  if (isTestPath(rel)) return "test";
  for (const layer of ORDERED) {
    if (prefixes[layer].some((p) => matchesLayerPattern(rel, p))) return layer;
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

/**
 * Map configured path globs to architectural layers, so the write-time detector
 * and the certifier's forbidden-layer-edge policy derive the SAME boundary from a
 * profile (one boundary identity, two altitudes). Falls back to `dflt` when no
 * glob names a recognised layer.
 */
export function layersFromGlobs(globs: string[] | undefined, dflt: Layer[]): Layer[] {
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

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim().length > 0) : [];
}

function addConfiguredGlobs(
  prefixes: Record<Layer, string[]>,
  globs: string[],
  fallbackLayer: Layer,
): void {
  for (const glob of globs) {
    const layers = layersFromGlobs([glob], []);
    for (const layer of layers.length ? layers : [fallbackLayer]) {
      prefixes[layer].push(glob);
    }
  }
}

export function layerPrefixesFromBoundaryOptions(options: Record<string, unknown> | undefined): Record<Layer, string[]> {
  const prefixes = cloneDefaultLayerPrefixes();
  addConfiguredGlobs(prefixes, stringArray(options?.domainGlobs), "domain");
  addConfiguredGlobs(prefixes, stringArray(options?.forbidImportsFrom), "infrastructure");
  return prefixes;
}

export function boundaryLayerConfig(options: Record<string, unknown> | undefined): {
  fromLayers: Layer[];
  toLayers: Layer[];
  layerPrefixes: Record<Layer, string[]>;
} {
  return {
    fromLayers: layersFromGlobs(stringArray(options?.domainGlobs), ["domain", "application"]),
    toLayers: layersFromGlobs(stringArray(options?.forbidImportsFrom), ["infrastructure"]),
    layerPrefixes: layerPrefixesFromBoundaryOptions(options),
  };
}

export function boundaryPatternFromProfile(profile: ResolvedProfile): AdoptedPattern | undefined {
  return profile.adopt.find((p) => BOUNDARY_PATTERNS.has(p.id));
}

export function layerPrefixesFromProfile(profile: ResolvedProfile): Record<Layer, string[]> | undefined {
  const boundaryPattern = boundaryPatternFromProfile(profile);
  return boundaryPattern ? layerPrefixesFromBoundaryOptions(boundaryPattern.options) : undefined;
}
