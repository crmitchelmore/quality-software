import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadPatterns, type Pattern } from "./lib/patterns.js";
import { loadPhilosophies, type Philosophy } from "./lib/philosophies.js";
import { loadPractice, type PracticePattern } from "./lib/practice.js";

const DOCS = join(ROOT, "docs");
const GRAPH_DIR = join(DOCS, "graph");

type NodeKind = "software-pattern" | "practice-pattern" | "philosophy";
type EdgeKind =
  | "philosophy-associates-pattern"
  | "philosophy-associates-practice"
  | "philosophy-at-odds-pattern"
  | "philosophy-at-odds-practice"
  | "philosophy-complements-philosophy"
  | "philosophy-tension-philosophy"
  | "practice-relates-software"
  | "practice-relates-practice"
  | "practice-relates-philosophy"
  | "pattern-synergy-pattern"
  | "pattern-conflict-pattern";

interface GraphNode {
  id: string;
  kind: NodeKind;
  title: string;
  group: string; // category or discipline
  altitude?: "low" | "medium" | "high"; // scope (software-patterns only)
}

interface GraphEdge {
  source: string;
  target: string;
  kind: EdgeKind;
  reason?: string;
}

function main(): void {
  const patterns = loadPatterns();
  const practice = loadPractice();
  const philosophies = loadPhilosophies();

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  const addNode = (n: GraphNode) => {
    if (!nodeIds.has(n.id)) {
      nodeIds.add(n.id);
      nodes.push(n);
    }
  };

  for (const p of patterns) addNode({ id: p.id, kind: "software-pattern", title: p.title, group: p.category, altitude: p.altitude });
  for (const p of practice) addNode({ id: p.id, kind: "practice-pattern", title: p.title, group: `${p.discipline}:${p.category}` });
  for (const ph of philosophies) addNode({ id: ph.id, kind: "philosophy", title: ph.title, group: ph.discipline ?? "software" });

  // Only emit edges whose endpoints are real nodes (keeps the graph clean).
  const known = (id: string) => nodeIds.has(id);
  const edge = (source: string, target: string, kind: EdgeKind, reason?: string) => {
    if (known(source) && known(target)) edges.push({ source, target, kind, reason });
  };

  for (const ph of philosophies) {
    for (const a of ph.associated_patterns ?? []) edge(ph.id, a.pattern, "philosophy-associates-pattern", a.reason);
    for (const a of ph.associated_practice_patterns ?? []) edge(ph.id, a.pattern, "philosophy-associates-practice", a.reason);
    for (const a of ph.at_odds_patterns ?? []) edge(ph.id, a.pattern, "philosophy-at-odds-pattern", a.reason);
    for (const a of ph.at_odds_practice_patterns ?? []) edge(ph.id, a.pattern, "philosophy-at-odds-practice", a.reason);
    for (const c of ph.complements ?? []) edge(ph.id, c, "philosophy-complements-philosophy");
    for (const t of ph.tensions_with ?? []) edge(ph.id, t.philosophy, "philosophy-tension-philosophy", t.reason);
  }

  for (const p of practice) {
    for (const a of p.related_software_patterns ?? []) edge(p.id, a.pattern, "practice-relates-software", a.reason);
    for (const a of p.related_practice_patterns ?? []) edge(p.id, a.pattern, "practice-relates-practice", a.reason);
    for (const a of p.related_philosophies ?? []) edge(p.id, a.philosophy, "practice-relates-philosophy", a.reason);
  }

  for (const p of patterns) {
    for (const s of p.synergies ?? []) edge(p.id, s.pattern, "pattern-synergy-pattern", s.reason);
    for (const w of p.works_well_with ?? []) edge(p.id, w, "pattern-synergy-pattern");
    for (const c of p.conflicts_with ?? []) edge(p.id, c, "pattern-conflict-pattern");
  }

  mkdirSync(GRAPH_DIR, { recursive: true });
  writeFileSync(
    join(GRAPH_DIR, "knowledge-graph.json"),
    JSON.stringify({ nodes, edges }, null, 2) + "\n",
  );

  writeFileSync(join(GRAPH_DIR, "index.md"), renderMarkdown(nodes, edges) + "\n");
  console.log(`✔ Knowledge graph: ${nodes.length} nodes, ${edges.length} edges.`);
}

function renderMarkdown(nodes: GraphNode[], edges: GraphEdge[]): string {
  const out: string[] = [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const counts = (k: NodeKind) => nodes.filter((n) => n.kind === k).length;

  out.push("# Cross-Source Knowledge Graph\n");
  out.push(
    "A generated, machine-readable graph (`knowledge-graph.json`) linking software patterns, " +
      "product & UX practice patterns, and design philosophies. This is the substrate the " +
      "selection/bootstrap mechanism uses to expand a chosen philosophy into a coherent bundle " +
      "of patterns. See [design/validator](../../design/validator/README.md).\n",
  );
  out.push("## Totals\n");
  out.push(`- Software patterns: **${counts("software-pattern")}**`);
  out.push(`- Practice patterns (product + UX): **${counts("practice-pattern")}**`);
  out.push(`- Philosophies: **${counts("philosophy")}**`);
  out.push(`- Edges: **${edges.length}**\n`);

  // Cross-domain edges only (drop intra-software-pattern synergy noise) for a legible diagram.
  const crossKinds = new Set<EdgeKind>([
    "philosophy-associates-pattern",
    "philosophy-associates-practice",
    "practice-relates-software",
    "practice-relates-philosophy",
  ]);
  const cross = edges.filter((e) => crossKinds.has(e.kind));

  out.push("## Cross-domain bridges\n");
  out.push(
    "How the three sources connect (philosophy → pattern, philosophy → practice, practice → software, practice → philosophy). " +
      "Intra-collection links (pattern↔pattern synergies, philosophy↔philosophy) are in the JSON but omitted here for legibility.\n",
  );
  out.push("```mermaid");
  out.push("flowchart LR");
  out.push("  classDef phil fill:#e8d5ff,stroke:#7c3aed;");
  out.push("  classDef prac fill:#d1fae5,stroke:#059669;");
  out.push("  classDef sw fill:#dbeafe,stroke:#2563eb;");
  const used = new Set<string>();
  const sanitize = (id: string) => id.replace(/[^a-zA-Z0-9_]/g, "_");
  // Cap the diagram to keep it renderable; full data is in JSON.
  for (const e of cross.slice(0, 120)) {
    const s = byId.get(e.source)!;
    const t = byId.get(e.target)!;
    used.add(e.source);
    used.add(e.target);
    out.push(`  ${sanitize(e.source)}["${s.title}"] --> ${sanitize(e.target)}["${t.title}"]`);
  }
  for (const id of used) {
    const n = byId.get(id)!;
    const cls = n.kind === "philosophy" ? "phil" : n.kind === "practice-pattern" ? "prac" : "sw";
    out.push(`  class ${sanitize(id)} ${cls};`);
  }
  out.push("```");
  out.push("");

  // Most-connected philosophies (hubs) — useful for selection.
  const degree = new Map<string, number>();
  for (const e of edges) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }
  const philHubs = nodes
    .filter((n) => n.kind === "philosophy")
    .map((n) => ({ n, d: degree.get(n.id) ?? 0 }))
    .sort((a, b) => b.d - a.d)
    .slice(0, 15);
  out.push("## Most-connected philosophies\n");
  out.push("| Philosophy | Discipline | Connections |");
  out.push("| --- | --- | :-: |");
  for (const { n, d } of philHubs) out.push(`| ${n.title} | ${n.group} | ${d} |`);
  out.push("");
  return out.join("\n");
}

main();
