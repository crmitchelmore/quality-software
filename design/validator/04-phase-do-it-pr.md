# 4. Phase — do-it-pr (PR-level, top-down)

## 4.1 Trigger & intent

Runs when a **PR is opened or updated** (GitHub Action / equivalent). It is the phase that
**understands the whole change top-down** and judges it against the **high-altitude**
patterns the write-time phase cannot see: architectural, integration, and cross-file design
patterns, plus **repo-wide reuse**. It is allowed seconds-to-minutes and a real LLM budget.

## 4.2 Top-down strategy

The order matters: judge the **largest structures first**, because a high-level verdict
constrains the lower-level ones (e.g. if the change introduces a new bounded context, the
expectations for its internal repositories/DI follow). 

```mermaid
flowchart TB
  A["1. Change comprehension<br/>summarise intent of the whole diff"] --> B
  B["2. Architectural altitude<br/>does the change respect adopted<br/>architecture? new boundaries? layering?"] --> C
  C["3. Integration altitude<br/>messaging, resilience, API contracts,<br/>saga/outbox/idempotency on new I/O"] --> D
  D["4. Design altitude<br/>aggregates, repositories, DI, domain model<br/>across the changed files"] --> E
  E["5. Reuse sweep<br/>does new code duplicate an existing abstraction?"] --> F
  F["6. Aggregate, gate, rank → PR review"]
```

## 4.3 Flow

```mermaid
sequenceDiagram
  participant GH as GitHub PR event
  participant Act as PR Action
  participant Eng as Conformance engine
  participant Idx as Code index
  participant LLM
  GH->>Act: pull_request opened/synchronize
  Act->>Idx: ensure index up to date (changed files + dependents)
  Act->>Eng: ChangeSet{kind: diff, altitude: all}
  Eng->>Eng: select adopted+banned patterns applicable to the diff
  Eng->>Eng: Layer 1 deterministic (import-direction, missing-timeout, etc.)
  Eng->>Idx: retrieve neighbours + candidate existing abstractions
  Eng->>LLM: per high-altitude candidate: change + pattern spec + retrieved code → verdict
  LLM-->>Eng: structured verdicts {applicable, conformance, confidence, evidence, suggestion}
  Eng->>Eng: aggregate, dedupe vs write-time notes, confidence-gate
  Eng-->>Act: findings
  Act->>GH: PR review: summary + inline comments + check status
```

## 4.4 Output contract

- A **single PR review** with:
  - a **summary**: which adopted patterns the change touched, conformance per pattern, and a
    short top-down narrative ("introduces an outbound payment call — `circuit-breaker` and
    `timeout` are adopted and present; `idempotency` is adopted but missing").
  - **inline comments** anchored to the offending lines, each with severity, confidence,
    catalogue link, and a concrete suggested diff.
  - a **check run** status: `success` / `neutral` / `failure` per the rollout level of the
    violated patterns (blocking patterns at `block` fail the check; everything else is
    advisory/neutral).
- A machine-readable artdefact (`conformance-report.json`) for dashboards and the
  [batch phase](05-phase-do-it-later.md) to consume as a trend baseline.

## 4.5 Why PR-time owns architectural & reuse

- **Whole-change context.** Only here is the complete set of added/modified files visible, so
  layering, boundaries, and synergistic pattern sets (e.g. `outbox` + `idempotent-receiver`,
  `cqrs` + `event-sourcing`) can be evaluated as a unit.
- **Affordable LLM.** PRs are infrequent relative to writes, so per-candidate LLM judgement
  with retrieval is economical.
- **Authoritative gate.** CI is the natural enforcement point, so promotion to `block` lives
  here, not at write-time.

## 4.6 Anti-false-positive measures

- **Diff-scoped:** only patterns whose applicability is triggered *by the change* are judged;
  pre-existing debt is not flagged on unrelated PRs (the batch phase owns that).
- **Dedupe with write-time:** findings already surfaced (and acted on or waived) at write-time
  are not repeated.
- **Confidence gate + evidence required:** an LLM finding with no concrete evidence span is
  demoted to advisory regardless of confidence.
- **Waivers honoured:** `.conformance/waivers.yaml` and inline waivers suppress known,
  intentional deviations and explain them in the summary instead of re-flagging.
