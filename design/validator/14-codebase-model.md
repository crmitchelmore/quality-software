# 14. Codebase evidence map & onboarding

> Implemented in `integration/src/model/*` and surfaced via `conformance onboard`
> + the `codebase-onboarding` skill. This document is the design rationale.

## Problem

Before an agent can *align* a project to a set of philosophies/patterns, it needs a
grounded picture of what the codebase already does: where logic lives, which modules
are canonical, and where duplication or boundary erosion has crept in. Without this,
agents re-implement abstractions that already exist and "enforce" patterns the project
never adopted.

## Stance: an evidence map, not a pattern model

We deliberately do **not** claim to "model the patterns" in a codebase authoritatively.
We produce an **evidence map** with three tiers of decreasing certainty, and we never
let the lower-certainty tiers silently drive blocking configuration.

| Tier | Content | Certainty | May drive blocking? |
|------|---------|-----------|---------------------|
| 1. Structural facts | modules, layers, exports, dependency graph, duplicate symbols | high (syntactic) | only via ratified config |
| 2. Detector-backed signals | boundary / reuse / banned-construct findings from the engine | high (certified detectors) | yes, once profile ratified |
| 3. Candidate patterns | "looks hexagonal", `*Repository` ⇒ repository, layered | low/medium, advisory | **no** — user must ratify |

## Extraction: TypeScript compiler API, syntactic only

`src/model/extract.ts` parses each file with `ts.createSourceFile` (no `Program`, no
type-checker, no `tsconfig`). This is cheap and dependency-light, yet correctly handles
the cases regex misses: `import type`, default exports, re-exports (`export … from`),
namespace exports, aliases, multiline declarations, decorators.

Reported limitations (in `meta.extraction.knownLimitations`): `tsconfig` path aliases,
monorepo package boundaries, and dynamic `import()` are not resolved. `typescript` is a
runtime dependency for this reason.

## Canonical selection is a *scored heuristic*, never authoritative

For each symbol exported from more than one file, `pickCanonical` scores candidates:

- **+** preferred layer (`domain`/`application`), non-test, non-barrel
- **−** penalties for test/fixture, barrel/index, `deprecated|legacy|example` paths
- inbound-import count and shortest path are **tie-breakers only**, never the deciding rule

The result carries `{path, confidence, reasons[]}`. Inbound popularity alone never wins —
that would canonise whatever a barrel happens to re-export.

## Duplicate symbol ≠ same abstraction

`UserRepository` in two bounded contexts is usually legitimate. Clusters record the
distinct **layers** the symbol spans and a `sameLayer` flag. Consolidation is only
suggested for same-layer / nearby-context duplication; cross-layer duplicates are
surfaced as "may be legitimately distinct".

## Derived vs curated artifacts

- `.conformance/project-map.json` — **derived**, gitignored, carries `meta` (`generatedAt`,
  `gitCommit`, `scannerVersion`, `fileCount`, `extraction`). Treat as stale if `gitCommit`
  differs from `HEAD`.
- `patterns.anchors.yaml` — **curated, committable**: the canonical anchors a human ratified.
- `patterns.config.yaml` — the ratified profile (separate concern).

## Onboarding UX: preview-first, warn-only

`conformance onboard` prints a preview report and writes only the derived map by default.
Sections, most-certain first: Observed structure → Detector-backed signals → Possible
duplication & canonical anchors → Candidate patterns (advisory) → Recommended conservative
profile (warn-only) → next-step prompt. There is **no "adopt as-is"** primary path.

`proposeProfileFromEvidence` seeds `adopt` entries only from medium+ confidence candidates,
at `advise`/`warn` enforcement, tying philosophies via `catalogue.philosophyForPattern`.
It **never** proposes `enforcement: block` and **never** auto-bans.

## Skill stays advisory

`.github/skills/codebase-onboarding` instructs the agent to run `onboard`, summarise the
evidence tiers, state plainly that nothing has been adopted, and ask the user to **ratify**
a warn-only profile before generating any alignment tasks. The agent does not decide the
project's patterns.

## Upgrade seams

The model is intentionally self-contained (TS compiler API only). Future upgrades — e.g.
`dependency-cruiser` for richer module-boundary graphs or `jscpd` for token-level clone
detection — slot in behind the same `EvidenceMap` shape without changing the onboarding UX.
