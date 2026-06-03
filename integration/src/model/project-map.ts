import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { walkSourceFiles } from "../fs-util.js";
import { relPath } from "../detectors/util.js";
import { extractFile, type ExportedSymbol } from "./extract.js";

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
  layer: Layer;
  isBarrel: boolean;
  isTest: boolean;
  exports: ExportedSymbol[];
  imports: { spec: string; typeOnly: boolean; resolved?: string }[];
  inbound: number; // how many modules import this one
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
    extraction: { method: "typescript-syntactic"; confidence: "medium"; knownLimitations: string[] };
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
}

const DEFAULT_LAYER_PREFIXES: Record<Layer, string[]> = {
  test: ["test/", "tests/", "__tests__/", "__mocks__/", "fixtures/", "spec/"],
  domain: ["src/domain/", "domain/", "src/core/"],
  application: ["src/application/", "application/", "src/usecases/", "src/use-cases/", "src/app/"],
  infrastructure: ["src/infrastructure/", "infrastructure/", "src/infra/", "src/adapters/", "src/persistence/"],
  interface: ["src/interface/", "src/interfaces/", "src/api/", "src/http/", "src/web/", "src/ui/", "src/controllers/", "src/routes/"],
  other: [],
};

function isTestPath(rel: string): boolean {
  return /(^|\/)(test|tests|__tests__|__mocks__|fixtures|spec)(\/|$)/.test(rel) || /\.(test|spec)\.[tj]sx?$/.test(rel);
}

function classifyLayer(rel: string, prefixes: Record<Layer, string[]>): Layer {
  if (isTestPath(rel)) return "test";
  const ordered: Layer[] = ["domain", "application", "infrastructure", "interface"];
  for (const layer of ordered) {
    if (prefixes[layer].some((p) => rel.includes(p))) return layer;
  }
  return "other";
}

/** Resolve a relative import spec against the importing file to a repo-relative module path. */
function resolveSpec(fromRel: string, spec: string, known: Set<string>): string | undefined {
  if (!spec.startsWith(".")) return undefined;
  const dir = fromRel.split("/").slice(0, -1);
  for (const part of spec.split("/")) {
    if (part === "." || part === "") continue;
    else if (part === "..") dir.pop();
    else dir.push(part);
  }
  const base = dir.join("/");
  // ESM/TS projects import with a `.js` specifier that maps to a `.ts` source file.
  const jsToTs = base.replace(/\.js$/, ".ts").replace(/\.jsx$/, ".tsx").replace(/\.mjs$/, ".mts");
  const stripped = base.replace(/\.(js|jsx|mjs|cjs)$/, "");
  const candidates = [
    base,
    jsToTs,
    `${stripped}.ts`,
    `${stripped}.tsx`,
    `${stripped}.mts`,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mts`,
    `${stripped}/index.ts`,
    `${stripped}/index.tsx`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
    `${base}/index.js`,
  ];
  return candidates.find((c) => known.has(c));
}

function gitCommit(repoRoot: string): string | undefined {
  try {
    return execSync(`git -C "${repoRoot}" rev-parse --short HEAD`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return undefined;
  }
}

export function buildEvidenceMap(repoRoot: string, opts: BuildOptions = {}): EvidenceMap {
  const prefixes: Record<Layer, string[]> = { ...DEFAULT_LAYER_PREFIXES };
  for (const [k, v] of Object.entries(opts.layerPrefixes ?? {})) prefixes[k as Layer] = v as string[];
  const srcDirs = opts.srcDirs ?? ["src", "lib", "app", "packages", "test", "tests"];

  // --- Tier 1: parse every file into a module record ---
  const modules: ModuleInfo[] = [];
  const seen = new Set<string>();
  for (const dir of srcDirs) {
    for (const abs of walkSourceFiles(join(repoRoot, dir))) {
      const rel = relPath(repoRoot, abs);
      if (seen.has(rel)) continue;
      seen.add(rel);
      let syntax;
      try {
        syntax = extractFile(rel, readFileSync(abs, "utf8"));
      } catch {
        continue;
      }
      modules.push({
        path: rel,
        layer: classifyLayer(rel, prefixes),
        isBarrel: syntax.isBarrel,
        isTest: isTestPath(rel),
        exports: syntax.exports,
        imports: syntax.imports.map((i) => ({ ...i })),
        inbound: 0,
      });
    }
  }

  // --- dependency graph + inbound counts ---
  const known = new Set(modules.map((m) => m.path));
  const inbound = new Map<string, number>();
  const edges: { from: string; to: string }[] = [];
  for (const m of modules) {
    const resolvedTargets = new Set<string>();
    for (const imp of m.imports) {
      const resolved = resolveSpec(m.path, imp.spec, known);
      imp.resolved = resolved;
      if (resolved && resolved !== m.path) resolvedTargets.add(resolved);
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
        method: "typescript-syntactic",
        confidence: "medium",
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
