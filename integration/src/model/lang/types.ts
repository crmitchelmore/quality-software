/**
 * Neutral, language-independent code model (design 15).
 *
 * A LanguageProvider turns source files into these provenance-stamped facts; the
 * evidence map, detectors and the LLM judge's structural grounding consume ONLY
 * this model — never raw language ASTs. This is the seam that makes detection
 * language-neutral.
 */

export type Layer = "domain" | "application" | "infrastructure" | "interface" | "test" | "other";

/** Stable module identity: a resolved repo-relative path (JS) or an FQN (JVM/Go). */
export type ModuleId = string;

export type SymbolKind =
  | "function"
  | "class"
  | "interface"
  | "type"
  | "enum"
  | "const"
  | "default"
  | "reexport";

export interface Span {
  startLine: number;
  endLine: number;
}

export type Tier = 0 | 1 | 2 | 3;
export type Confidence = "low" | "medium" | "high";

/** Where a fact came from and how much to trust it. L0/L1/L2/L3 are NOT equal. */
export interface Provenance {
  provider: string;
  tier: Tier;
  confidence: Confidence;
  method: string; // "ts-compiler" | "regex-line" | "tree-sitter" | "scip"
  version: string;
}

export interface SymbolFact {
  name: string;
  kind: SymbolKind;
  span?: Span;
}

export interface RefFact {
  /** Raw module specifier / import target as written. */
  raw: string;
  /** Resolved ModuleId, if the provider could resolve it. */
  resolved?: ModuleId;
  typeOnly?: boolean;
  span?: Span;
}

export interface FileFacts {
  /** Repo-relative path of the file these facts came from. */
  path: string;
  moduleId: ModuleId;
  language: string;
  /** Provider's layer hint; the classifier makes the final call. */
  layerHint?: Layer;
  isBarrel: boolean;
  isTest: boolean;
  isGenerated: boolean;
  exports: SymbolFact[];
  imports: RefFact[];
  /** Extension point for tier-specific facts (DI bindings, annotations, …). */
  semanticFacts?: Record<string, unknown>;
  provenance: Provenance;
}

export interface ResolveCtx {
  fromModule: ModuleId;
  /** All known ModuleIds in the project, for resolving a raw ref to a real module. */
  known: Set<ModuleId>;
}

/**
 * A language front-end. Highest-tier provider that `claims()` a file wins.
 */
export interface LanguageProvider {
  id: string;
  tier: Tier;
  claims(file: string): boolean;
  extract(path: string, content: string): FileFacts;
  resolveRef(raw: string, ctx: ResolveCtx): ModuleId | undefined;
}
