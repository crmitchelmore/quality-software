# Pattern Conformance Validator — Design

A design for a **mature mechanism that checks whether code changes (made by AI agents
or humans) conform to the patterns a project has deliberately selected** from the
[catalogue](../../docs/index.md), and that code is **reused** rather than reinvented.

> Status: **design-only** (TypeScript-targeted). No runtime code in this repo yet; this
> set of documents specifies the architecture precisely enough to implement.

## The problem

Agents generate a lot of code quickly. Left unchecked they:

- re-implement abstractions that already exist (no reuse),
- apply the wrong pattern, or none, where the project has a chosen one,
- introduce locally-plausible code that violates the project's architecture,
- drift the codebase away from its intended patterns one small change at a time.

A pattern catalogue is necessary but not sufficient — we need a **conformance system**
that knows *which* patterns this project uses and *checks new code against them* at the
right moment and the right altitude.

## The three phases (as requested)

| Phase | Trigger | Altitude | Goal |
| --- | --- | --- | --- |
| **do-it-later** | on demand / scheduled, over a PR or the whole repo | architectural → implementation | Establish a baseline, then *incrementally* refactor the codebase toward selected patterns. |
| **do-it-write** | every tool file-write | implementation → design (local) | Catch low-level/local pattern opportunities and violations *as code is written*, with fast, cheap checks. |
| **do-it-pr** | when a PR is opened/updated | architectural → design (whole change) | Understand the *entire* change top-down and judge it against high-level patterns and reuse. |

The phases are **complementary altitudes of the same engine**, not three separate tools.
See [pattern routing](06-pattern-routing.md) for how high- vs low-level patterns are
assigned to phases.

## Documents

1. [Concepts & principles](01-concepts.md)
2. [Architecture](02-architecture.md)
3. [Phase: do-it-write (write-time hook)](03-phase-do-it-write.md)
4. [Phase: do-it-pr (PR-level)](04-phase-do-it-pr.md)
5. [Phase: do-it-later (batch / incremental refactor)](05-phase-do-it-later.md)
6. [Pattern routing: high vs low level](06-pattern-routing.md)
7. [Reuse enforcement](07-reuse-enforcement.md)
8. [Core types (TypeScript)](08-types.md)
9. [Project pattern profile (config)](09-config.md)
10. [Maturity model & rollout](10-maturity-rollout.md)
11. [Philosophy-first selection & bootstrap](11-philosophy-selection.md)
12. [Runtime-agnostic integration contract](12-integration-contract.md)

## One-paragraph summary

A repo declares a **pattern profile** (`patterns.config.yaml`) — **philosophy-first**: it
selects the design philosophies it commits to, which *imply* (via the
[knowledge graph](../../docs/graph/index.md)) the catalogue patterns it adopts, bans, and the
enforcement level of each, and supply the LLM judge's north-star rubric (see
[selection](11-philosophy-selection.md)). A shared **conformance engine**
turns a *change set* into **findings** through a three-stage pipeline — **applicability**
(which selected patterns are relevant here), **conformance** (is the relevant pattern
applied correctly), and **reuse** (does an existing abstraction already do this) — using a
**layered detector stack**: deterministic AST/lint rules first, then heuristic signals,
then LLM judgement gated by confidence. The same engine is invoked through one
**runtime-agnostic event + verdict contract** ([integration](12-integration-contract.md)) by
thin adapters — a **write-time hook**, a **PR GitHub Action**, and a **batch CLI** — across
GitHub Copilot CLI (hooks/skill/MCP/plugin), Copilot cloud agent, and expandably Claude Code,
Codex CLI and OpenCode. Findings carry severity, confidence, a **philosophy → pattern →
suggestion** rationale chain, and can be advisory or blocking per the rollout maturity level.
