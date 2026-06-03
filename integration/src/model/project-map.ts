import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { walkAllFiles } from "../fs-util.js";
import { relPath } from "../detectors/util.js";
import type { ExportedSymbol } from "./extract.js";
import { defaultRegistry, type ProviderRegistry } from "./lang/registry.js";
import type { Provenance } from "./lang/types.js";
import { DEFAULT_LAYER_PREFIXES, classifyLayer } from "./layers.js";

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
}

export interface BuildOptions {
  /** Override layer classification globs (path prefixes, repo-relative). */
  layerPrefixes?: Partial<Record<Layer, string[]>>;
  srcDirs?: string[];
  /** Language provider registry (design 15). Defaults to the built-in set. */
  registry?: ProviderRegistry;
}

function gitCommit(repoRoot: string): string | undefined {
  try {
    return execSync(`git -C "${repoRoot}" rev-parse --short HEAD`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
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
  const prefixes: Record<Layer, string[]> = { ...DEFAULT_LAYER_PREFIXES };
  for (const [k, v] of Object.entries(opts.layerPrefixes ?? {})) prefixes[k as Layer] = v as string[];
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
    exports: facts.exports.map((e) => ({ name: e.name, kind: e.kind })),
    imports: facts.imports.map((i) => ({ spec: i.raw, typeOnly: i.typeOnly ?? false, resolved: i.resolved })),
    inbound: 0,
    packageName: facts.semanticFacts?.packageName as string | undefined,
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
  const prefixes: Record<Layer, string[]> = { ...DEFAULT_LAYER_PREFIXES };
  for (const [k, v] of Object.entries(opts.layerPrefixes ?? {})) prefixes[k as Layer] = v as string[];
  const registry = opts.registry ?? defaultRegistry();
  const providerIds = new Set(modules.map((m) => m.provenance.provider));

  // --- dependency graph + inbound counts (resolution delegated to the provider) ---
  const known = new Set(modules.map((m) => m.path));

  // Orchestrator-level FQN/symbol index for package-qualified languages (design 15.5).
  const byFqn = new Map<string, string>(); // "pkg.Symbol" -> file
  const byPackage = new Map<string, string[]>(); // "pkg" -> files
  for (const m of modules) {
    if (!m.packageName) continue;
    const arr = byPackage.get(m.packageName) ?? [];
    arr.push(m.path);
    byPackage.set(m.packageName, arr);
    for (const e of m.exports) {
      byFqn.set(`${m.packageName}.${e.name}`, m.path);
    }
  }
  const fqnResolve = (raw: string): string[] => {
    if (raw.startsWith(".")) return [];
    const exact = byFqn.get(raw);
    if (exact) return [exact];
    // wildcard / package import (`com.foo.*` arrives as `com.foo`) -> all package files
    const pkg = byPackage.get(raw);
    if (pkg) return pkg;
    // `com.foo.Bar` where Bar isn't indexed: try the parent package
    const parent = raw.includes(".") ? raw.slice(0, raw.lastIndexOf(".")) : undefined;
    if (parent && byPackage.has(parent)) return byPackage.get(parent)!;
    return [];
  };

  const inbound = new Map<string, number>();
  const edges: { from: string; to: string }[] = [];
  for (const m of modules) {
    const provider = registry.providerFor(m.path);
    const resolvedTargets = new Set<string>();
    for (const imp of m.imports) {
      const direct = provider?.resolveRef(imp.spec, { fromModule: m.path, known });
      const targets = direct ? [direct] : fqnResolve(imp.spec);
      imp.resolved = targets[0];
      for (const t of targets) if (t !== m.path) resolvedTargets.add(t);
    }
    for (const t of resolvedTargets) {
      edges.push({ from: m.path, to: t });
      inbound.set(t, (inbound.get(t) ?? 0) + 1);
    }
  }
  const byPath = new Map(modules.map((m) => [m.path, m]));
  for (const m of modules) m.inbound = inbound.get(m.path) ?? 0;

  // --- duplicate symbols + scored canonical (only own declarations, not re-exports) ---
  const symbolToFiles = new Map<string, string[]>();
  for (const m of modules) {
    for (const e of m.exports) {
      if (e.kind === "reexport" || e.name === "default") continue;
      const arr = symbolToFiles.get(e.name) ?? [];
      arr.push(m.path);
      symbolToFiles.set(e.name, arr);
    }
  }
  const duplicateSymbols: DuplicateCluster[] = [];
  for (const [name, files] of symbolToFiles) {
    const unique = [...new Set(files)];
    if (unique.length < 2) continue;
    const layers = [...new Set(unique.map((f) => byPath.get(f)!.layer))];
    duplicateSymbols.push({
      name,
      files: unique,
      sameLayer: layers.length === 1,
      layers,
      canonical: pickCanonical(unique, byPath),
    });
  }
  duplicateSymbols.sort((a, b) => b.files.length - a.files.length || a.name.localeCompare(b.name));

  // --- Tier 3: advisory candidate patterns (confidence-tagged) ---
  const candidatePatterns = inferCandidates(modules, edges, byPath);

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
  };
}

/**
 * Scored canonical pick (design 14, critique #1). Inbound imports is ONE signal,
 * not the deciding rule: prefer explicit-quality signals (preferred layer, non-test,
 * non-barrel) and use inbound + short path only to break ties. Always confidence-tagged.
 */
function pickCanonical(files: string[], byPath: Map<string, ModuleInfo>): CanonicalChoice {
  const PREFERRED: Layer[] = ["domain", "application"];
  const scored = files.map((path) => {
    const m = byPath.get(path)!;
    const reasons: string[] = [];
    let score = 0;
    if (PREFERRED.includes(m.layer)) {
      score += 4;
      reasons.push(`in preferred layer (${m.layer})`);
    } else if (m.layer === "interface") {
      score += 1;
    }
    if (!m.isTest) {
      score += 2;
    } else {
      score -= 3;
      reasons.push("penalised: test/fixture file");
    }
    if (!m.isBarrel) {
      score += 2;
    } else {
      score -= 3;
      reasons.push("penalised: barrel/index re-export");
    }
    if (/(deprecated|legacy|old|example|sample)/i.test(path)) {
      score -= 3;
      reasons.push("penalised: deprecated/legacy/example path");
    }
    score += Math.min(m.inbound, 5) * 0.5;
    if (m.inbound > 0) reasons.push(`${m.inbound} inbound import${m.inbound === 1 ? "" : "s"}`);
    // shorter path is a weak tie-breaker
    score += Math.max(0, 3 - path.split("/").length) * 0.1;
    return { path, score, reasons, layer: m.layer };
  });
  scored.sort((a, b) => b.score - a.score || a.path.length - b.path.length);
  const top = scored[0];
  const runnerUp = scored[1];
  const margin = top.score - (runnerUp?.score ?? -Infinity);

  let confidence: CanonicalChoice["confidence"] = "low";
  if (PREFERRED.includes(top.layer as Layer) && margin >= 3) confidence = "high";
  else if (margin >= 2) confidence = "medium";

  return { path: top.path, confidence, reasons: top.reasons.length ? top.reasons : ["highest combined score"] };
}

/** Tier-3 advisory inference — structural only, never authoritative. */
function inferCandidates(
  modules: ModuleInfo[],
  edges: { from: string; to: string }[],
  byPath: Map<string, ModuleInfo>,
): CandidatePattern[] {
  const out: CandidatePattern[] = [];
  const layersPresent = new Set(modules.map((m) => m.layer));

  // Hexagonal / layered: needs a domain and an infrastructure layer.
  const domainModules = modules.filter((m) => m.layer === "domain" || m.layer === "application");
  if (layersPresent.has("domain") && layersPresent.has("infrastructure") && domainModules.length) {
    const violations = edges.filter((e) => {
      const from = byPath.get(e.from);
      const to = byPath.get(e.to);
      return from && to && (from.layer === "domain" || from.layer === "application") && to.layer === "infrastructure";
    });
    const violatingFiles = [...new Set(violations.map((v) => v.from))];
    const applied = domainModules.length - violatingFiles.length;
    out.push({
      patternId: "hexagonal-architecture",
      confidence: violatingFiles.length === 0 ? "medium" : "low",
      evidence: [
        `${domainModules.length} domain/application modules; ${layersPresent.has("infrastructure") ? "infrastructure layer present" : ""}`,
        `${violatingFiles.length} module(s) import infrastructure directly`,
      ].filter(Boolean),
      locations: violatingFiles,
      consistency: {
        applied,
        violations: violatingFiles.length,
        score: domainModules.length ? +(applied / domainModules.length).toFixed(2) : 1,
      },
    });
  }
  if ([...layersPresent].filter((l) => l !== "test" && l !== "other").length >= 3) {
    out.push({
      patternId: "layered-architecture",
      confidence: "low",
      evidence: [`distinct layers present: ${[...layersPresent].filter((l) => l !== "test").join(", ")}`],
      locations: [],
    });
  }

  // Repository: interfaces named *Repository (canonical) + implementers.
  const repoInterfaces = modules.flatMap((m) =>
    m.exports.filter((e) => e.kind === "interface" && /Repository$/.test(e.name)).map((e) => ({ path: m.path, name: e.name })),
  );
  if (repoInterfaces.length) {
    out.push({
      patternId: "repository",
      confidence: "low",
      evidence: [`${repoInterfaces.length} *Repository interface(s): ${repoInterfaces.map((r) => r.name).join(", ")}`],
      locations: [...new Set(repoInterfaces.map((r) => r.path))],
    });
  }

  return out;
}
