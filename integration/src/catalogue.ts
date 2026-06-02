import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Loads the knowledge catalogue (patterns, philosophies, and the generated
 * cross-source graph) so the engine can resolve a profile, source patterns to
 * philosophies for the rationale chain, and expand a philosophy into its
 * associated patterns during bootstrap.
 *
 * The repo root is discovered by walking up for a `docs/graph/knowledge-graph.json`.
 */

export interface GraphNode {
  id: string;
  kind: "software-pattern" | "practice-pattern" | "philosophy";
  title: string;
  group: string;
}
export interface GraphEdge {
  source: string;
  target: string;
  kind: string;
  reason?: string;
}
export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Catalogue {
  repoRoot: string;
  graph: KnowledgeGraph;
  nodeById: Map<string, GraphNode>;
  /** patternId -> philosophyId(s) that associate it (for the rationale chain). */
  philosophyForPattern: Map<string, { philosophyId: string; reason?: string }[]>;
  /** philosophyId -> associated pattern ids (for bootstrap expansion). */
  patternsForPhilosophy: Map<string, { pattern: string; reason?: string }[]>;
  /** philosophyId -> at-odds pattern ids. */
  atOddsForPhilosophy: Map<string, string[]>;
  /** patternId -> conflicting pattern ids. */
  conflictsForPattern: Map<string, string[]>;
}

function findRepoRoot(start: string): string {
  let dir = start;
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, "docs", "graph", "knowledge-graph.json"))) return dir;
    if (existsSync(join(dir, ".git")) && existsSync(join(dir, "patterns"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    `Could not locate the quality-software repo root (looking for docs/graph/knowledge-graph.json) from ${start}. ` +
      `Run \`npm run docs:graph\` in tools/ first, or set CONFORMANCE_CATALOGUE_ROOT.`,
  );
}

export function loadCatalogue(fromDir?: string): Catalogue {
  const envRoot = process.env.CONFORMANCE_CATALOGUE_ROOT;
  const here = dirname(fileURLToPath(import.meta.url));
  const repoRoot = envRoot
    ? resolve(envRoot)
    : findRepoRoot(fromDir ? resolve(fromDir) : here);

  const graph: KnowledgeGraph = JSON.parse(
    readFileSync(join(repoRoot, "docs", "graph", "knowledge-graph.json"), "utf8"),
  );

  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
  const philosophyForPattern = new Map<string, { philosophyId: string; reason?: string }[]>();
  const patternsForPhilosophy = new Map<string, { pattern: string; reason?: string }[]>();
  const atOddsForPhilosophy = new Map<string, string[]>();
  const conflictsForPattern = new Map<string, string[]>();

  const push = <V>(m: Map<string, V[]>, k: string, v: V) => {
    const arr = m.get(k) ?? [];
    arr.push(v);
    m.set(k, arr);
  };

  for (const e of graph.edges) {
    switch (e.kind) {
      case "philosophy-associates-pattern":
      case "philosophy-associates-practice":
        push(patternsForPhilosophy, e.source, { pattern: e.target, reason: e.reason });
        push(philosophyForPattern, e.target, { philosophyId: e.source, reason: e.reason });
        break;
      case "philosophy-at-odds-pattern":
      case "philosophy-at-odds-practice":
        push(atOddsForPhilosophy, e.source, e.target);
        break;
      case "pattern-conflict-pattern":
        push(conflictsForPattern, e.source, e.target);
        push(conflictsForPattern, e.target, e.source);
        break;
    }
  }

  return {
    repoRoot,
    graph,
    nodeById,
    philosophyForPattern,
    patternsForPhilosophy,
    atOddsForPhilosophy,
    conflictsForPattern,
  };
}
