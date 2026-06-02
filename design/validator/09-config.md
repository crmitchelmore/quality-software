# 9. Project pattern profile (`patterns.config.yaml`)

The profile is the **contract** the validator enforces. It lives at the repo root and is the
project's deliberate selection from the catalogue — what to apply, what to forbid, and how
strictly. Without it, the validator does nothing (no implicit "lint against all 275 patterns").

The profile is **philosophy-first**. A project chooses a small set of **design philosophies**
(and, for product/UX-bearing repos, practice philosophies); those philosophies *imply* an
initial bundle of adopted and banned patterns via the [knowledge graph](../../docs/graph/index.md),
and they supply the **north-star rubric** the LLM judge reasons against. Patterns are the
enforceable, checkable projection of the philosophies; philosophies are the "why" that keeps
the pattern set coherent as the codebase scales. See
[philosophy-first selection](11-philosophy-selection.md) for the bootstrap mechanism.

## 9.1 Example

```yaml
# patterns.config.yaml — selected philosophies + patterns for THIS repo
projectSize: medium          # small (<10k) | medium (<=100k) | large (>100k)
                             # selects which catalogue rating band drives prioritisation

# --- WHY: the philosophies this project commits to (the north star) ---
# These drive bootstrap (imply adopt/ban) and ground the LLM judge's rubric.
philosophies:
  adopt:
    - id: a-philosophy-of-software-design   # deep modules, define errors out of existence
      weight: primary        # primary | secondary — primary wins ties/tensions
    - id: domain-driven-design
      weight: primary
    - id: functional-core-imperative-shell
      weight: secondary
  # Philosophies explicitly rejected (their associated patterns are demoted/banned)
  reject:
    - id: move-fast-and-break-things
      reason: "Regulated domain; correctness and auditability beat raw velocity."
  # On tension between two adopted philosophies, the resolution is recorded here so the
  # judge and humans apply a consistent precedence rather than re-litigating per PR.
  tie_breakers:
    - prefer: domain-driven-design
      over: functional-core-imperative-shell
      when: "modelling rich domain behaviour vs maximising pure functions"

# --- WHAT: the enforceable pattern projection (bootstrapped, then human-ratified) ---
# Architecture & high-level commitments
adopt:
  - id: hexagonal-architecture
    enforcement: block
    options:
      domainGlobs: ["src/domain/**", "src/application/**"]
      forbidImportsFrom: ["src/infrastructure/**"]   # domain must not import infra
  - id: repository
    enforcement: block
    appliesTo: ["src/infrastructure/persistence/**"]
  - id: unit-of-work
    enforcement: advise
  - id: dependency-injection
    enforcement: block
  - id: circuit-breaker
    enforcement: block
    appliesTo: ["src/infrastructure/clients/**"]
  - id: timeout
    enforcement: block
    appliesTo: ["src/infrastructure/clients/**"]
  - id: idempotency
    enforcement: advise
  - id: outbox
    enforcement: advise
  - id: guard-clause
    enforcement: advise
  - id: newtype-wrapper
    enforcement: advise
    options: { domainIdsMustBeTyped: true }
  - id: arrange-act-assert
    enforcement: advise
    appliesTo: ["**/*.test.ts", "**/*.spec.ts"]

# Patterns this project has deliberately rejected
ban:
  - id: service-locator
    enforcement: block
    reason: "We use constructor DI everywhere; service location hides dependencies."
  - id: active-record
    enforcement: block
    reason: "Domain is persistence-ignorant; we use data-mapper + repository."
  - id: singleton
    enforcement: advise
    reason: "Prefer DI-scoped lifetimes; global singletons hurt testability."

# Phase behaviour
phases:
  write: { enabled: true, mode: advise, failMode: open, llm: false, block: false, maxFindings: 1 }  # advisory, fail-open (see doc 13)
  pr:    { enabled: true,  llm: true,  failOn: block }    # PR CI = authoritative gate; LLM advisory-only in v1
  later: { enabled: true }

budgets:
  writeMs: 150
  prTokens: 120000
  laterTokens: 1000000

# --- Practice patterns (product/UX) for repos that own user-facing or product surfaces ---
# Optional. Included where relevant; checked at PR/later altitude (never write-time), and
# mostly advisory — they gate process/UX qualities, not code structure.
practicePatterns:
  adopt:
    - id: progressive-disclosure
      enforcement: advise
      appliesTo: ["src/ui/**"]
    - id: optimistic-ui-feedback
      enforcement: advise
      appliesTo: ["src/ui/**"]
```

## 9.2 Choosing the profile (governance)

The profile is a design decision, owned like any architectural choice, and is **seeded from
the philosophies down**:

1. **Pick philosophies first.** A maintainer (or the bootstrapper, from a short interview /
   the repo's `project_types` + size) selects 1–3 primary philosophies and any secondary
   ones. This is the single highest-leverage choice: it fixes the project's values.
2. **Imply patterns from philosophies.** The bootstrapper walks the knowledge graph:
   `philosophy.associated_patterns` → proposed `adopt`; `philosophy.at_odds_patterns` and the
   `conflicts_with` of adopted patterns → proposed `ban`; rejected philosophies demote their
   associated patterns. Practice philosophies likewise imply practice patterns.
3. **Filter & rank by project type + size.** Of the implied patterns, keep those whose
   `project_types` include this repo's type and whose rating for its size band is ≥ 4;
   surface the rest as optional. (Catalogue ratings still drive prioritisation.)
4. **Synergy completion.** If you adopt `event-sourcing`, the bootstrapper suggests its
   `synergies` (`cqrs`, `outbox`, snapshotting) and warns on `conflicts_with`.
5. **Human ratifies in a PR.** The generated proposal is edited and reviewed like code, so
   adopting/banning a philosophy or pattern is an explicit, auditable decision.
6. **Evolves with evidence.** Patterns start at `advise`; the [rollout](10-maturity-rollout.md)
   process promotes them to `block` once their finding precision is proven on real PRs.

See [philosophy-first selection](11-philosophy-selection.md) for the full bootstrap algorithm
and the `conformance init` flow.

## 9.3 Consistency checks on the profile itself

The validator first validates the **profile**:

- every philosophy `id`, pattern `id`, and practice-pattern `id` exists in the catalogue;
- no pattern is both adopted and banned;
- **philosophy coherence** — two adopted philosophies that the catalogue marks as
  `tensions_with` must have a recorded `tie_breaker`, else the profile is flagged
  (unresolved value conflict);
- **philosophy ↔ pattern coherence** — an adopted pattern that is `at_odds` with an adopted
  primary philosophy is a profile error unless explicitly waived with a reason;
- adopted sets are **synergy-coherent** and **conflict-free** — adopting two
  `conflicts_with` patterns (e.g. `active-record` + `data-mapper`) is a profile error;
- `appliesTo`/`domainGlobs` reference real paths.

This makes the project's pattern strategy itself a checkable, version-controlled artefact —
the same "one canonical pattern across all surfaces" consistency the catalogue promotes —
and ties every enforced pattern back to a stated philosophy, so the *why* is never lost.

> **Coherence is warn-not-block (review-incorporated, [§13.7](13-mvp-and-trust.md)):** only a
> *direct contradiction* (same pattern adopted **and** banned) is a hard error. Philosophy
> tensions and pattern↔philosophy `at_odds` are **warnings requiring a rationale**, since the
> hand-authored graph is not context-free and hybrid architectures are legitimate; graph edges
> carry `confidence`/`scope` metadata and support scoped exceptions.
