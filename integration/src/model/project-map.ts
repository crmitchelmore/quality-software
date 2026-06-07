import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { walkAllFiles } from "../fs-util.js";
import { relPath } from "../detectors/util.js";
import type { ExportedSymbol } from "./extract.js";
import { defaultRegistry, type ProviderRegistry } from "./lang/registry.js";
import type { Provenance } from "./lang/types.js";
import { DEFAULT_LAYER_PREFIXES, classifyLayer } from "./layers.js";
import { detectCapabilities, classifyCapabilityUse, type CapabilityCluster, type CapabilityUse } from "./capabilities.js";
import { inferCandidates } from "./candidates.js";
import { deriveDependencyGraph } from "./graph.js";
import { deriveDuplicateSymbols, pickCanonical } from "./duplicates.js";

export { pickCanonical } from "./duplicates.js";

/**
 * The codebase EVIDENCE MAP (design 14). Deliberately NOT an authoritative
 * "pattern model" — it records, in three tiers of decreasing certainty:
 *   1. structural facts  (modules, layers, exports, dependency graph, duplicates)
 *   2. detector-backed signals (filled in by the engine elsewhere; see onboard)
 *   3. advisory candidate patterns + candidate canonical anchors (confidence-tagged)
 *
 * Only tier 1/2 are reliable; tier 3 is explicitly low/medium confidence and must
 * be user-ratified before it influences any blocking configuration.
 */

export const SCANNER_VERSION = "1.0.0";

export type Layer = "domain" | "application" | "infrastructure" | "interface" | "test" | "other";

export interface ModuleInfo {
  path: string; // repo-relative
  language: string;
  layer: Layer;
  isBarrel: boolean;
  isTest: boolean;
  isGenerated: boolean;
  exports: ExportedSymbol[];
  imports: { spec: string; typeOnly: boolean; resolved?: string }[];
  inbound: number; // how many modules import this one
  packageName?: string; // FQN package/namespace (JVM, C#, Go, PHP) — for cross-file resolution
  /** How this module touches each cross-cutting capability it imports, from its
   *  source (inline call vs DI-injected bean vs declarative annotation). Drives
   *  reuse detection so injected/annotation-based shared use is not a false smell. */
  capabilityUse?: Record<string, CapabilityUse>;
  provenance: Provenance;
}

export interface CanonicalChoice {
  path: string;
  confidence: "high" | "medium" | "low";
  reasons: string[];
}

export interface DuplicateCluster {
  name: string;
  files: string[];
  /** Best-guess reference implementation — NOT authoritative (design 14). */
  canonical: CanonicalChoice | null;
  sameLayer: boolean;
  /** Distinct layers the symbol appears in — different layers ⇒ likely legitimately distinct. */
  layers: Layer[];
}

export interface CandidatePattern {
  patternId: string;
  confidence: "high" | "medium" | "low";
  evidence: string[];
  locations: string[];
  consistency?: { applied: number; violations: number; score: number };
}

export interface EvidenceMap {
  meta: {
    generatedAt: string;
    gitCommit?: string;
    scannerVersion: string;
    fileCount: number;
    extraction: { method: string; confidence: "low" | "medium" | "high"; providers: string[]; knownLimitations: string[] };
  };
  layerGlobs: Record<Layer, string[]>;
  modules: ModuleInfo[];
  dependencyEdges: { from: string; to: string }[];
  duplicateSymbols: DuplicateCluster[];
  candidatePatterns: CandidatePattern[];
  capabilityClusters: CapabilityCluster[];
}

export interface BuildOptions {
  /** Override layer classification globs (path prefixes, repo-relative). */
  layerPrefixes?: Partial<Record<Layer, string[]>>;
  srcDirs?: string[];
  /** Language provider registry (design 15). Defaults to the built-in set. */
  registry?: ProviderRegistry;
}

export function resolveLayerPrefixes(opts: BuildOptions = {}): Record<Layer, string[]> {
  const prefixes: Record<Layer, string[]> = {
    test: [...DEFAULT_LAYER_PREFIXES.test],
    domain: [...DEFAULT_LAYER_PREFIXES.domain],
    application: [...DEFAULT_LAYER_PREFIXES.application],
    infrastructure: [...DEFAULT_LAYER_PREFIXES.infrastructure],
    interface: [...DEFAULT_LAYER_PREFIXES.interface],
    other: [],
  };
  for (const [k, v] of Object.entries(opts.layerPrefixes ?? {})) prefixes[k as Layer] = v as string[];
  return prefixes;
}

function gitCommit(repoRoot: string): string | undefined {
  try {
    return execFileSync("git", ["-C", repoRoot, "rev-parse", "--short", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return undefined;
  }
}

export function buildEvidenceMap(repoRoot: string, opts: BuildOptions = {}): EvidenceMap {
  return deriveEvidenceMap(parseModules(repoRoot, opts), repoRoot, opts);
}

/**
 * Tier-1 parse step ONLY: walk the tree and turn every claimed file into a
 * ModuleInfo. No cross-file derivation happens here. Separated from
 * deriveEvidenceMap so callers (e.g. the PR reviewer) can take this module set,
 * apply an overlay (replace/add/remove files), and re-derive a consistent map
 * WITHOUT inheriting stale edges/duplicates from a previous version (design 16.6).
 */
export function parseModules(repoRoot: string, opts: BuildOptions = {}): ModuleInfo[] {
  const prefixes = resolveLayerPrefixes(opts);
  const srcDirs = opts.srcDirs ?? ["src", "lib", "app", "packages", "test", "tests"];
  const registry = opts.registry ?? defaultRegistry();

  const modules: ModuleInfo[] = [];
  const seen = new Set<string>();
  for (const dir of srcDirs) {
    for (const abs of walkAllFiles(join(repoRoot, dir))) {
      const rel = relPath(repoRoot, abs);
      if (seen.has(rel)) continue;
      seen.add(rel);
      let content: string;
      try {
        content = readFileSync(abs, "utf8");
      } catch {
        continue;
      }
      const m = moduleFromFile(rel, content, prefixes, registry);
      if (m) modules.push(m);
    }
  }
  return modules;
}

/**
 * Parse a single file into a ModuleInfo via its language provider, or undefined
 * if no provider claims it. Shared by the bulk walker and overlay callers so the
 * module shape is identical however a module enters the map.
 */
export function moduleFromFile(
  rel: string,
  content: string,
  prefixes: Record<Layer, string[]> = DEFAULT_LAYER_PREFIXES,
  registry: ProviderRegistry = defaultRegistry(),
): ModuleInfo | undefined {
  const provider = registry.providerFor(rel);
  if (!provider) return undefined;
  let facts;
  try {
    facts = provider.extract(rel, content);
  } catch {
    return undefined;
  }
  return {
    path: rel,
    language: facts.language,
    layer: facts.layerHint ?? classifyLayer(rel, prefixes),
    isBarrel: facts.isBarrel,
    isTest: facts.isTest,
    isGenerated: facts.isGenerated,
    exports: facts.exports.map((e) => ({
      name: e.name,
      kind: e.kind,
      signatureShape: e.signatureShape,
      lexicalTokens: e.lexicalTokens,
    })),
    imports: facts.imports.map((i) => ({ spec: i.raw, typeOnly: i.typeOnly ?? false, resolved: i.resolved })),
    inbound: 0,
    packageName: facts.semanticFacts?.packageName as string | undefined,
    capabilityUse: classifyCapabilityUse(
      content,
      facts.imports.map((i) => i.raw),
    ),
    provenance: facts.provenance,
  };
}

/**
 * Tier-2/3 derivation step: from a flat module set, recompute the dependency
 * graph, duplicate clusters, candidate patterns and meta. PURE over `modules`
 * (mutates only the passed modules' `inbound`/`imports.resolved`), so two module
 * sets always yield independently-consistent maps — the property the PR reviewer
 * relies on to diff baseline vs head (critique: never merge stale edges).
 */
export function deriveEvidenceMap(modules: ModuleInfo[], repoRoot: string, opts: BuildOptions = {}): EvidenceMap {
  const prefixes = resolveLayerPrefixes(opts);
  const registry = opts.registry ?? defaultRegistry();
  const providerIds = new Set(modules.map((m) => m.provenance.provider));

  const { edges, byPath } = deriveDependencyGraph(modules, registry);
  const duplicateSymbols = deriveDuplicateSymbols(modules, byPath);

  // --- Tier 3: advisory candidate patterns (confidence-tagged) ---
  const candidatePatterns = inferCandidates(modules, edges, byPath);

  // --- Localised capabilities / shared-helper opportunities (reuse, design 14) ---
  const capabilityClusters = detectCapabilities(modules);

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      gitCommit: gitCommit(repoRoot),
      scannerVersion: SCANNER_VERSION,
      fileCount: modules.length,
      extraction: {
        method: "provider-based",
        confidence: "medium",
        providers: [...providerIds].sort(),
        knownLimitations: ["tsconfig path aliases", "monorepo package boundaries", "dynamic import()"],
      },
    },
    layerGlobs: prefixes,
    modules,
    dependencyEdges: edges,
    duplicateSymbols,
    candidatePatterns,
    capabilityClusters,
  };
}
