# 15. Language-neutral code model

> Status: design adopted 2026-06-03 (rubber-duck incorporated). Implemented incrementally
> under `integration/src/model/lang/` (Phase 1+). Supersedes the TS-only assumption baked into
> the original `model/extract.ts` and the detectors.

## 15.1 Principle: concept is neutral, evidence is language-specific

Patterns and architectures are language-independent — Hexagonal Architecture, Repository,
Circuit Breaker, the dependency rule, "domain must not import infrastructure" mean the same
thing in TypeScript, Kotlin, Go, Python or Java. What differs is **how we read the code to
gather evidence**. The original system fused the two: extraction (TS compiler API) and
detection (JS-shaped regexes) were welded together and gated on `.ts`/`.js` extensions, so the
whole pipeline was accidentally JS-only.

The fix is one seam: a **`LanguageProvider`** turns source into a **neutral code model**, and
everything else (evidence map, detectors, the LLM judge's structural grounding) consumes only
that neutral model.

## 15.2 The provider seam

```ts
interface LanguageProvider {
  id: string;                          // "typescript" | "kotlin" | "python" | "go" | "universal"
  tier: 0 | 1 | 2 | 3;                 // see 15.4
  claims(file: string): boolean;       // which files this provider owns
  extract(file: string, content: string): FileFacts;
  resolveRef(ref: RawRef, ctx: ResolveCtx): ModuleId | undefined;
}
```

A `ProviderRegistry` selects the highest-tier provider that `claims()` a file. Files no longer
need a known extension to be walked — the walker yields everything and lets providers claim.

## 15.3 The neutral model (with provenance)

Every fact is provenance-stamped. **L0/L1/L2/L3 facts are not equally trustworthy**, and
nothing downstream may pretend otherwise (rubber-duck #7).

```ts
type ModuleId = string;               // stable id: resolved path (JS) or FQN (JVM/Go)

interface Provenance {
  provider: string;                   // provider id
  tier: 0 | 1 | 2 | 3;
  confidence: "low" | "medium" | "high";
  method: string;                     // "regex-line" | "tree-sitter" | "ts-compiler" | "scip"
  version: string;
}

interface SymbolFact { name: string; kind: SymbolKind; span?: Span; provenance: Provenance; }
interface RefFact    { raw: string; resolved?: ModuleId; typeOnly?: boolean; span?: Span; provenance: Provenance; }

interface FileFacts {
  moduleId: ModuleId;
  language: string;
  layerHint?: Layer;                  // provider may hint; classifier decides
  isBarrel: boolean;
  isTest: boolean;
  isGenerated: boolean;
  exports: SymbolFact[];
  imports: RefFact[];
  semanticFacts?: Record<string, unknown>;   // extensible: DI bindings, annotations, etc.
  provenance: Provenance;
}
```

`semanticFacts` is the documented extension point for things only some tiers can see (DI
bindings, annotations, reflection, framework conventions, visibility/package boundaries).

## 15.4 Tiered providers — breadth now, depth where it pays

| Tier | Mechanism | Coverage | Fidelity | Use |
| --- | --- | --- | --- | --- |
| **L0 Universal** | file walk + path/layer conventions + line-level import/signature regex | every language instantly | low | immediate multi-language; never blocks on its own |
| **L1 Structural** | tree-sitter (one dep, ~40 grammars, uniform query API) | most languages | good | default; symbols + dependency graph |
| **L2 Semantic** | native toolchain (TS compiler API, kotlinc/PSI, go/packages, JDT) | per-language | highest | resolution, type shape, where accuracy matters |
| **L3 Index** | consume SCIP/LSIF code-intel index | neutral by construction | high | big repos / CI where an index already exists |

## 15.5 Module resolution is normalized, not assumed relative

JS/Python use relative file paths; JVM/Go use package-qualified names against source roots.
Each provider maps **both declarations and references into the shared `ModuleId` space** (FQN
for JVM/Go, resolved path for JS, package path for Go). Dependency edges become
`ModuleId → ModuleId`, neutral regardless of language.

## 15.6 "Language-flexible", not "language-independent"

A model can *read* any language, but architecture conformance also depends on build systems,
frameworks, module boundaries and generated code (rubber-duck #8). For each supported language
we define a **minimum viable evidence** bar: module identity, import/dependency extraction,
source/test/generated classification, build/package structure, and a public-API model. Below
that bar, findings for that language stay **advisory** — never blocking.

## 15.7 Layer classification

Stays path-glob based (already neutral) but ships **per-build-system presets** and
auto-detects the build system from `build.gradle(.kts)` / `pom.xml` / `go.mod` /
`pyproject.toml` / `package.json`. The profile may override globs. Layers carry provenance like
any other fact.

## 15.8 What does not change

The contract (`ChangeSet`/`Finding`/verdict), the engine, the phases, the profile + catalogue,
and the onboarding UX are already language-neutral and are untouched. Only extraction and
detector internals move behind the provider seam — a contained refactor, not a rewrite.

## 15.9 Build order

1. Provider seam + neutral model + `TypeScriptProvider` (existing tests stay green).
2. L0 universal provider + de-locked walker (multi-language onboarding).
3. tree-sitter L1 + Kotlin grammar (demonstrable win on a Kotlin repo).
4. Native L2 providers as needed; L3 index consumption as an upgrade seam.
