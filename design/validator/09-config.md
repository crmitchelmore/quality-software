# 9. Project pattern profile (`patterns.config.yaml`)

The profile is the **contract** the validator enforces. It lives at the repo root and is the
project's deliberate selection from the catalogue — what to apply, what to forbid, and how
strictly. Without it, the validator does nothing (no implicit "lint against all 263 patterns").

## 9.1 Example

```yaml
# patterns.config.yaml — selected patterns for THIS repo
projectSize: medium          # small (<10k) | medium (<=100k) | large (>100k)
                             # selects which catalogue rating band drives prioritisation

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
  write: { enabled: true,  llm: false, maxFindings: 1 }   # one interruption max
  pr:    { enabled: true,  llm: true,  failOn: block }    # block-level violations fail CI
  later: { enabled: true }

budgets:
  writeMs: 150
  prTokens: 120000
  laterTokens: 1000000
```

## 9.2 Choosing the profile (governance)

The profile is a design decision, owned like any architectural choice, and ideally **seeded
from the catalogue**:

1. **Profile from project type + size.** The catalogue tags each pattern with `project_types`
   and per-size `ratings`. A bootstrapper proposes an initial `adopt` list = patterns whose
   `project_types` include this repo's type and whose rating for its size band is ≥ 4, and an
   initial `ban` list from well-known conflicts (e.g. adopting `data-mapper` ⇒ suggest banning
   `active-record` via `conflicts_with`).
2. **Synergy completion.** If you adopt `event-sourcing`, the bootstrapper suggests its
   `synergies` (`cqrs`, `outbox`, snapshotting) and warns on `conflicts_with`.
3. **Human ratifies.** A maintainer edits the proposal — the profile is reviewed in a PR like
   code, so adopting/banning a pattern is an explicit, auditable decision.
4. **Evolves with evidence.** Patterns start at `advise`; the [rollout](10-maturity-rollout.md)
   process promotes them to `block` once their finding precision is proven on real PRs.

## 9.3 Consistency checks on the profile itself

The validator first validates the **profile**:

- every `id` exists in the catalogue;
- no pattern is both adopted and banned;
- adopted sets are **synergy-coherent** and **conflict-free** — adopting two
  `conflicts_with` patterns (e.g. `active-record` + `data-mapper`) is a profile error;
- `appliesTo`/`domainGlobs` reference real paths.

This makes the project's pattern strategy itself a checkable, version-controlled artefact —
the same "one canonical pattern across all surfaces" consistency the catalogue promotes.
