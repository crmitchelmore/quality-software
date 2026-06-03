# Flaky Test Quarantine

> Detect non-deterministic tests, move them out of the blocking path, and track them until fixed or removed.

**Scale:** organisational · **Altitude:** high · **Category:** testing · **Maturity:** established

**Also known as:** Quarantine Lane, Non-Blocking Flake Tracking

## Description

Flaky Test Quarantine protects trust in the main pipeline by separating tests that fail non-deterministically. Quarantined tests still run and report, but they do not block unrelated changes while ownership, failure history, and repair deadlines remain visible. Quarantine is a short-term containment pattern, not permission to ignore broken tests.

**Problem.** A few non-deterministic tests make the whole CI signal untrustworthy, so teams start ignoring red builds.

**Context.** Use when flakes are detected repeatedly and cannot be fixed immediately without blocking the delivery pipeline.

## Consequences / Trade-offs

- Restores a reliable blocking CI signal for deterministic tests.
- Makes flaky tests visible with ownership and fix tracking.
- Can normalise broken tests if quarantine lacks deadlines, alerts, or removal policy.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Prefer fixing flakes directly in small suites. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Useful containment when a few flakes block many developers. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical for preserving CI trust at scale, provided ownership and expiry are enforced. |

## Examples

### Separate non-blocking flaky job

**❌ Negative (shell)**

```shell
jest.retryTimes(3)
npm test
# flaky test eventually passes and the cause is hidden
```

**✅ Positive (shell)**

```shell
pytest tests/ -m "not flaky"
pytest tests/ -m "flaky" || echo "reported to flake dashboard"
```

*The positive flow keeps the main lane deterministic while still running and reporting quarantined tests for repair.*

## Relationships

**Synergies**

- [Test Sharding](../testing/test-sharding.md) — Quarantine data helps distinguish true flakes from parallelisation and shared-state bugs.
- [Ephemeral Environment](../testing/ephemeral-environment.md) — Isolated environments remove many external causes of flakiness before quarantine is needed.
- [Test Pyramid](../testing/test-pyramid.md) — Layer metrics show whether flakes concentrate in overly broad E2E tests.

**Conflicts with:** [Snapshot Testing](../testing/snapshot-testing.md)

**Alternatives:** [Ephemeral Environment](../testing/ephemeral-environment.md), [Test Containers](../testing/test-containers.md), [Deterministic Simulation](../testing/deterministic-simulation.md)

## Applicability tags

- **Languages:** language-agnostic, shell, python, javascript, typescript
- **Frameworks:** none, nodejs, django, spring-boot, dotnet
- **Project types:** web-api, web-frontend, backend-service, microservices, distributed-system
- **Tags:** flaky-tests, ci, non-determinism, quarantine

