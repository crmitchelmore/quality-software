# Test Sharding

> Partition a test suite across parallel workers or machines to reduce feedback time while preserving isolation.

**Scale:** concurrency · **Altitude:** high · **Category:** testing · **Maturity:** established

**Also known as:** Parallel Test Splitting, Suite Partitioning

## Description

Test Sharding assigns disjoint subsets of tests to workers, often by file, historical runtime, or framework-level distribution. It reduces wall-clock CI time without deleting coverage. The prerequisite is hermetic tests: no hidden ordering, shared mutable state, fixed ports, or shared databases that collapse under parallel execution.

**Problem.** A valuable suite has grown too slow for local or CI feedback, but dropping tests would reduce confidence.

**Context.** Use when test runtime is a delivery bottleneck and tests can be isolated by process, worker, database schema, container, or environment.

## Consequences / Trade-offs

- Shortens feedback loops while preserving coverage.
- Exposes hidden test interdependence and shared-state bugs.
- Requires runtime balancing, isolated resources, and deterministic ordering assumptions.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary until runtime is painful. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good once suites exceed the team feedback budget. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large CI systems, especially with runtime-aware balancing. |

## Examples

### Parallel pytest workers

**❌ Negative (python)**

```python
_global_sequence = 0
def next_id():
    global _global_sequence
    _global_sequence += 1
    return _global_sequence
```

**✅ Positive (python)**

```python
pytest --numprocesses=8 --dist=loadfile
# each worker uses its own database schema and randomised test order
```

*The positive command is safe only after shared mutable state has been removed or isolated for every worker.*

## Relationships

**Synergies**

- [Test Containers](../testing/test-containers.md) — Per-worker containers isolate databases, brokers, and caches.
- [Ephemeral Environment](../testing/ephemeral-environment.md) — Environment-per-run or per-shard isolation prevents cross-worker data collisions.
- [Flaky Test Quarantine](../testing/flaky-test-quarantine.md) — Flake tracking separates sharding bugs from genuinely non-deterministic tests.

**Conflicts with:** [Golden Master (Approval)](../testing/golden-master.md)

**Alternatives:** [Test Pyramid](../testing/test-pyramid.md), [Flaky Test Quarantine](../testing/flaky-test-quarantine.md), [Ephemeral Environment](../testing/ephemeral-environment.md)

## Applicability tags

- **Languages:** language-agnostic, python, javascript, typescript, java, go
- **Frameworks:** none, nodejs, spring-boot, fastapi, django, dotnet
- **Project types:** web-api, web-frontend, backend-service, microservices, monolith, high-throughput
- **Tags:** parallelisation, ci-speed, sharding, hermetic-tests

