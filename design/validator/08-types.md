# 8. Core types (TypeScript)

Design-level interfaces for the engine. These define the contracts; no runtime is included in
this repo. They are deliberately small, deep, and behaviour-revealing.

```ts
// ---------- Catalogue (mirrors patterns/*.yaml) ----------
export type Scale =
  | "architectural" | "integration" | "data"
  | "concurrency" | "design" | "implementation"
  | "frontend" | "organisational";

export interface PatternRef { id: string; }

export interface CataloguePattern {
  id: string;
  title: string;
  scale: Scale;
  category: string;
  maturity: "time-tested" | "established" | "emerging" | "cutting-edge";
  shortDescription: string;
  description: string;
  synergies: Array<{ pattern: string; reason: string }>;
  conflictsWith: string[];
  alternatives: string[];
  languages: string[];
  frameworks: string[];
  projectTypes: string[];
  ratings: Record<"small" | "medium" | "large", { score: 1|2|3|4|5; notes: string }>;
  examples: Array<{ language: string; positive: string; negative: string; explanation: string }>;
}

// ---------- Project profile (patterns.config.yaml) ----------
export type Enforcement = "off" | "advise" | "block";

export interface AdoptedPattern {
  id: string;                    // must exist in the catalogue
  enforcement: Enforcement;      // how findings are surfaced
  appliesTo?: string[];          // optional path globs to scope the pattern
  options?: Record<string, unknown>; // rule-pack tuning (e.g. timeout thresholds)
}

export interface PatternProfile {
  projectSize: "small" | "medium" | "large"; // selects the rating band used for prioritisation
  adopt: AdoptedPattern[];
  ban: Array<{ id: string; enforcement: Enforcement; reason?: string }>;
  phases: {
    write: { enabled: boolean; llm: boolean; maxFindings: number };
    pr:    { enabled: boolean; llm: boolean; failOn: Enforcement }; // e.g. "block"
    later: { enabled: boolean };
  };
  budgets: { writeMs: number; prTokens: number; laterTokens: number };
}

// ---------- Change sets ----------
export type ChangeKind = "file" | "diff" | "tree";

export interface FileChange {
  path: string;
  before?: string;     // undefined for new files
  after?: string;      // undefined for deletions
}

export interface ChangeSet {
  kind: ChangeKind;
  files: FileChange[];
  repoRoot: string;
  baseRef?: string;    // for diff/tree
}

// ---------- Findings ----------
export type Conformance = "applied" | "violated" | "partial" | "na";
export type FindingKind = "violation" | "missed-opportunity" | "reuse" | "ban" | "confirm";
export type Severity = "info" | "low" | "medium" | "high";

export interface Evidence {
  file: string;
  range?: { startLine: number; endLine: number };
  note: string;                 // what was observed (the "why")
  source: "ast" | "heuristic" | "llm";
}

export interface Suggestion {
  text: string;
  patch?: string;               // unified diff when deterministic/autofixable
  autofixSafe: boolean;
}

export interface Finding {
  id: string;                   // stable per (pattern, location, ruleVersion)
  pattern: string;              // catalogue id
  kind: FindingKind;
  altitude: Scale;
  conformance: Conformance;
  severity: Severity;
  confidence: number;           // 0..1, calibrated
  evidence: Evidence[];
  suggestion?: Suggestion;
  catalogueUrl: string;         // docs/patterns/<category>/<id>.md
  phase: "write" | "pr" | "later";
}

// ---------- Detector contract ----------
export interface DetectorContext {
  changeSet: ChangeSet;
  pattern: CataloguePattern;
  profile: AdoptedPattern;      // adopted entry (or ban)
  index: CodeIndex;             // symbols, deps, embeddings (reuse + retrieval)
  budget: Budget;               // remaining time/tokens
}

export interface Detector {
  pattern: string;              // catalogue id this detector serves
  layer: 1 | 2 | 3;             // deterministic | heuristic | llm
  requiresContext: "file" | "module" | "repo";
  /** Pure for layers 1-2; layer 3 may call the model. Must be side-effect free. */
  run(ctx: DetectorContext): Promise<Finding[]>;
}

// ---------- Engine ----------
export interface Engine {
  /** Selects applicable adopted/banned patterns, runs the layered pipeline, gates, ranks. */
  evaluate(changeSet: ChangeSet, profile: PatternProfile, phase: Finding["phase"]): Promise<Finding[]>;
}

// ---------- Code index (reuse + retrieval) ----------
export interface CodeIndex {
  findSymbol(name: string): SymbolInfo[];
  nearestByEmbedding(snippet: string, k: number): SymbolInfo[];
  dependents(path: string): string[];
  componentsImplementing(patternId: string): SymbolInfo[]; // adopted-pattern realisations
}

export interface SymbolInfo {
  name: string; path: string; signature: string; kind: "function" | "class" | "interface" | "type";
}

export interface Budget { msRemaining: number; tokensRemaining: number; spend(ms: number, tokens: number): void; }
```

## Notes

- **Detectors are keyed to catalogue ids** and tagged with their layer and context need; the
  router ([06](06-pattern-routing.md)) uses `requiresContext` to assign a phase.
- **Findings are stable-ided** by `(pattern, location, ruleVersion)` so the decision log can
  match waivers and suppress flapping.
- **Layer-3 detectors are the only ones permitted to call the model**, and only within the
  `Budget`; layers 1–2 are pure and cache-friendly.
- The **profile's `projectSize`** picks which catalogue **rating band** drives prioritisation,
  tying the catalogue's per-size scores directly into enforcement weight.
