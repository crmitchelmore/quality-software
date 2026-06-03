# Ephemeral Environment

> Provision a complete isolated application stack per pull request or test run, then destroy it after verification.

**Scale:** integration · **Altitude:** high · **Category:** testing · **Maturity:** established

**Also known as:** Preview Environment, Environment per Pull Request, On-Demand Test Environment

## Description

Ephemeral Environments create a full but temporary deployment of services, databases, queues, configuration, and routes for a single change or test run. They remove contention for shared staging and make E2E, smoke, and exploratory checks safer. The pattern depends on automation, data isolation, cost controls, and reliable teardown.

**Problem.** Shared staging environments create race conditions, polluted data, and unreliable end-to-end results for concurrent teams.

**Context.** Use when system-level tests need realistic deployment topology, or reviewers need to exercise a PR before merging.

## Consequences / Trade-offs

- Gives each PR a clean, realistic target for smoke and E2E tests.
- Improves debugging because environment state belongs to one run.
- Requires infrastructure automation, teardown guarantees, secret handling, and cost limits.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often too much infrastructure unless E2E realism is essential. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Very useful for product teams with regular end-to-end checks. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large platforms where shared staging cannot support safe parallel delivery. |

## Examples

### Per-run compose environment

**❌ Negative (shell)**

```shell
TEST_ENV=staging npm run test:e2e
# multiple PRs mutate the same database
```

**✅ Positive (shell)**

```shell
docker compose up -d --wait
npm run test:e2e
docker compose down --volumes
```

*The positive flow creates and tears down isolated state for the run instead of competing for shared staging.*

## Relationships

**Synergies**

- [Test Pyramid](../testing/test-pyramid.md) — Ephemeral environments support the small but important E2E layer at the top of the pyramid.
- [Test Sharding](../testing/test-sharding.md) — Isolated environments prevent parallel shards from corrupting shared state.
- [Screenplay Pattern](../testing/screenplay-pattern.md) — High-level acceptance tasks can run against real isolated deployments.

**Conflicts with:** [Test Containers](../testing/test-containers.md)

**Alternatives:** [Test Containers](../testing/test-containers.md), [Consumer-Driven Contract Testing](../testing/contract-testing.md), [Flaky Test Quarantine](../testing/flaky-test-quarantine.md)

## Applicability tags

- **Languages:** language-agnostic, shell, typescript, go, python
- **Frameworks:** none, kubernetes, terraform, nodejs, spring-boot, dotnet
- **Project types:** microservices, distributed-system, web-api, web-frontend, backend-service, serverless
- **Tags:** preview-environment, e2e, isolation, ci-cd

