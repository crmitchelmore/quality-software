# 13. Enforcement tiers, MVP & trust (review-incorporated)

> This document records the design changes adopted after two independent rubber-duck reviews
> (concept + architecture). Both converged on the same core correction: **the value is a small
> number of high-precision, project-specific constraints delivered at the moment an agent is
> about to violate them — not a 460-item catalogue enforced by LLM taste.** Philosophies are
> the *why*; patterns are the *what*; **detectors are the product.** Where earlier docs
> conflict with this one, this document wins.

> **Update (2026-06-03, see [15](15-language-neutral-model.md) + [16](16-llm-first-detection.md)):**
> detection is being made language-neutral and **LLM-first for the advisory tier**. This does
> **not** overturn the tiers below — it refines them. The *enforceable* tier stays deterministic
> and is still the **only** thing that may block a merge (now stated as a machine-verifiable
> *evidence contract*). The *advisory* tier's detection mechanism becomes a catalogue-grounded
> LLM judge (covering all 275 patterns across any language), with regex/AST/tree-sitter demoted
> to an accelerator, evidence provider, cache, and blocking *verifier*. "LLM-first" means
> **first for coverage and reasoning, never sole authority for blocking.**

## 13.1 Two tiers — enforceable vs advisory

The catalogue is explicitly split so nothing implies that all 460 items are equally
actionable:

| Tier | Contents | Max action | Gate |
| --- | --- | --- | --- |
| **Certified enforceable rulepacks** | small set of patterns with a validated detector (import boundaries, dependency direction, banned constructs, timeout/retry/circuit-breaker/idempotency, outbox, duplicate/reuse) | may **block** (PR-time; write-time only after measured precision) | each ships fixtures + measured precision before it can block |
| **Advisory knowledge catalogue** | the rest of the 275 patterns, all 145 PM/UX practice patterns, all 40 philosophies, the graph | **advise only** (explanation, ranking, onboarding, PR checklist) | none — never blocks |

A pattern moves from advisory → enforceable only by acquiring a **rule pack** with fixtures and
a measured false-positive rate (see [§13.5](#135-promotion-advise--block)). Philosophies and
PM/UX practices are **advisory forever** unless decomposed into a certified pattern rulepack.

## 13.2 Enforcement is orchestration over existing tools

The system does **not** reimplement static analysis. For each certified rulepack it **generates
and runs configuration for proven tools**, and normalises their output into the canonical
`Finding`:

| Concern | Delegated to |
| --- | --- |
| Import direction / module boundaries | dependency-cruiser, eslint-plugin-boundaries, Nx, ArchUnit/NetArchTest |
| Structural anti-patterns / banned constructs | Semgrep, ESLint custom rules |
| Complexity / duplication | SonarQube, ESLint metrics |
| Security / dataflow | CodeQL (where enabled) |
| Refactor toward a pattern | OpenRewrite / jscodeshift / ts-morph codemods |

The **novel layer** is: philosophy/profile-driven **rulepack selection**, agent-runtime
enforcement at write/turn/PR phases, rationale-backed findings, reuse detection, and the
advise→block promotion workflow. The conformance engine is an **orchestrator + curator**, not a
replacement for ESLint/Semgrep/ArchUnit.

## 13.3 Write-time is advisory and fail-open by default

Reversing the earlier default. Write-time friction is far more damaging than PR-time friction,
and the Copilot CLI `preToolUse` hook is **fail-closed** (a crash/timeout denies the write),
which would put validator availability on the critical editing path.

**Default `do-it-write` behaviour:**

```yaml
write:
  enabled: true
  mode: advise           # post-write feedback, never deny by default
  failMode: open         # hook errors/timeouts ALLOW the write
  autofix: safe-only     # only apply deterministic, provably-safe arg rewrites
  llm: false             # no LLM at write-time
  block: false           # no blocking by default
```

- Advisory feedback is delivered via Copilot CLI `postToolUse.additionalContext` (the model
  sees the note on the same turn) — **not** by denying in `preToolUse`.
- `preToolUse` deny is reserved for two narrow cases, each allowlisted and ultra-cheap:
  1. **security/destructive-command guardrails** (e.g. `rm -rf`, secret exfiltration in `bash`);
  2. a small set of **proven deterministic bans** explicitly promoted after measuring write-time
     precision and p95 latency.
- Every write-time hook wraps its logic in a catch-all that emits explicit `allow` on any
  internal error, so a validator bug can never block editing.

**PR-time CI is the authoritative gate.** It is the only universal enforcement boundary (it
works regardless of which agent/runtime authored the change, and for human PRs).

### PRE_WRITE vs POST_WRITE content availability

`preToolUse` for `edit` exposes the *tool arguments* (which may be a partial replacement/patch),
not guaranteed final file content; reliable AST analysis needs the written file. The canonical
events therefore separate:

- `PRE_WRITE_INTENT` — args only; cheap textual/arg checks + guardrails; may deny (allowlist).
- `POST_WRITE_CONTENT` — final file on disk; AST-capable; advisory feedback only.

Earlier claims of "deterministic AST blocking in `preToolUse`" are withdrawn until final-content
reconstruction is proven per tool.

## 13.4 LLM-as-judge: advisory only in v1, evidence-gated

- **LLM-only findings never block** at write-time or PR-time in v1.
- The LLM judge runs **only on a candidate already raised by a deterministic/heuristic signal**,
  anchored to specific changed lines, and must return **verifiable evidence spans + a concrete
  suggested diff**. Findings whose evidence cannot be re-checked are auto-demoted/dropped.
- Add an explicit **`abstain` / "insufficient context"** outcome instead of forcing a verdict.
- **Calibrate** per rule/model/version against labelled PRs before trusting any threshold;
  self-reported confidence alone is insufficient.
- **Cache & suppress** by `hash(content, detectorVersion, rubricVersion, modelVersion,
  retrievalSet)`; dismissed findings are suppressed by **semantic fingerprint**, not location.

## 13.5 Finding identity, lifecycle & waivers

Stable identity is a **semantic fingerprint**, not `(pattern, location)`:

```
fingerprint = hash(patternId, detectorId+version, symbol/AST-node identity,
                   normalised evidence, introducing-diff-hunk hash, scope/path)
```

Lifecycle states: `new → surfaced → accepted | waived | overridden | resolved | superseded`.
Write-time findings are **reconciled** into PR-level findings by fingerprint (dedupe across
write→pr→later, no flapping). Waivers (inline or `.conformance/waivers.yaml`) **expire or
invalidate when the waived code changes materially** — they are not permanent blanket
suppressions.

## 13.6 Detector variants, not whole patterns

Routing ([§6](06-pattern-routing.md)) operates on **detector variants**, each declaring its own
requirements, because one pattern needs different evidence at different altitudes:

```yaml
# rule pack: timeout
detectors:
  - id: timeout.local-http-call
    requiresContext: file
    phases: [write, pr]
    maxLatencyMs: 50
    canBlock: false           # advisory until precision measured
    fixtures: { positive: 6, negative: 4, nonApplicable: 3 }
  - id: timeout.client-wrapper-conformance
    requiresContext: module
    phases: [pr]
    canBlock: true
```

A pattern with no certified detector variant stays advisory (its catalogue text is the LLM
rubric). `canBlock: true` is only permitted once `fixtures` exist and measured precision clears
the promotion bar.

## 13.7 Profile coherence — warn, don't over-block

Revising [§9.3](09-config.md): the hand-authored graph is not complete/context-free, so:

- **Hard error** only on a *direct contradiction*: the same pattern both adopted and banned.
- Philosophy↔philosophy tensions and pattern↔philosophy `at_odds` become **warnings requiring
  an explicit rationale**, not validation failures (hybrid architectures are legitimate).
- Graph edges carry metadata — `confidence`, `scope`, `context`, `severity` — and support
  **scoped exceptions** ("Active Record banned in `domain/**`, allowed in `admin-crud/**`").

## 13.8 `conformance init` — candidate report, repo-signals first

- `init` produces a **candidate report with confidence + evidence per item**, not a ready
  enforcement profile.
- Prefer **repo-scan signals** (existing architecture, dependency graph, test style, frameworks)
  over graph centrality when proposing philosophies/patterns.
- Everything generated defaults to `advise`; **no hard bans are auto-generated** — bans require
  explicit human selection.

## 13.9 Ratings — contextual fit over LOC thresholds

Numeric small/medium/large LOC ratings are a **weak signal**, not a hard filter. Selection
should weigh contextual fit (domain criticality, team size, change rate, compliance, expected
lifespan, data criticality) — a 5k-LOC payment system may need DDD + idempotency + outbox; a
200k-LOC CRUD admin may not. (Catalogue ratings are retained as one input; future work adds
`best_when`/`avoid_when`/`cost`/`failure_modes` fields.)

## 13.10 The MVP vertical slice (build this first)

Prove the enforcement model is trustworthy on **one** narrow slice before building the full
hook/plugin/runtime matrix:

- **Ecosystem:** TypeScript service/backend repos.
- **Runtime:** GitHub Copilot CLI (`postToolUse` advisory + `sessionStart` priming) **+** a PR
  GitHub Action. No write-time blocking. No multi-runtime yet.
- **Rulepacks (10–20 enforceable):** hexagonal boundary / forbidden infrastructure import,
  service-locator ban, active-record ban, timeout required, retry + circuit-breaker for remote
  calls, idempotency for handlers, outbox for transactional events, duplicate/reuse detection,
  arrange-act-assert (advisory) — each delegating to dependency-cruiser/Semgrep/ESLint with
  fixtures.
- **LLM:** PR-level **advisory** review only.
- **Bootstrap/explain:** philosophy-first `init` generates the profile and grounds the rationale
  (the *selection + explanation* value), but does not itself block.

### Trust metrics (gate further investment)

Measure on real PRs before expanding: **precision / false-positive rate**, accepted-suggestion
rate, **waiver/override rate**, **disable rate**, p50/p95 latency, duplicate/flapping rate,
index-freshness failures, time-to-fix, repeat-violation rate. Expand the catalogue-backed
advisory layer and write-time blocking **only** after this slice proves trustworthy.

## 13.11 MVP scope cuts (deferred, not deleted)

Deferred out of the MVP (kept in the catalogue/design as advisory or future work): PM/UX
*enforcement* (advisory PR checklist only), philosophy-conformance numeric scores, write-time
blocking by default, auto-banning from rejected philosophies, full 275-pattern enforcement,
multi-runtime beyond Copilot CLI + GitHub PR, LLM blocking, and LOC-based ratings as hard
filters.
