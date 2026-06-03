# Deterministic Simulation

> Run a whole system inside a seeded simulator that controls time, network, storage, randomness, and injected faults.

**Scale:** concurrency · **Altitude:** high · **Category:** testing · **Maturity:** emerging

**Also known as:** Deterministic Simulation Testing, DST, Deterministic Chaos, Simulation Testing

## Description

Deterministic Simulation virtualises non-deterministic runtime boundaries so failures can be replayed exactly from a seed. The simulator controls clocks, scheduling, network messages, disk errors, random numbers, and crash-restart cycles. It is a first-class architecture choice for systems where rare distributed failures dominate risk, as in FoundationDB and TigerBeetle-style testing.

**Problem.** Distributed systems fail through timing, scheduling, network, and disk interleavings that ordinary integration tests cannot reproduce.

**Context.** Use for databases, consensus systems, replicated storage, financial ledgers, and other systems that own enough of their runtime to virtualise non-determinism.

## Consequences / Trade-offs

- Makes rare fault scenarios reproducible and debuggable from a seed.
- Can run huge simulated time spans faster than wall clock.
- Extremely expensive to retrofit and only as trustworthy as the simulator model.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●○○○○ 1/5 | Avoid unless the product is itself a distributed systems engine. |
| Medium (≤100k LOC) | ●●○○○ 2/5 | Rarely justified outside specialised reliability-critical systems. |
| Large (>100k LOC) | ●●●●● 5/5 | Transformational for databases and consensus systems where rare interleavings are the core risk. |

## Examples

### Seeded fault schedule

**❌ Negative (language-agnostic)**

```language-agnostic
kill node-2
sleep 5
assert read("key") == "value"  # sometimes fails, rarely reproduces
```

**✅ Positive (language-agnostic)**

```language-agnostic
sim = Simulator(seed=12345)
sim.partition(nodes=[2], at_ms=1000, duration_ms=500)
sim.crash(node=3, at_ms=1200)
cluster = sim.spawn_cluster(5)
result = sim.run(workload="write_then_read")
assert result.no_data_loss
```

*The positive test controls time and faults from a seed, so any failure can be replayed exactly.*

## Relationships

**Synergies**

- [Fuzzing](../testing/fuzzing.md) — Seeded workloads and fault schedules can fuzz state-space rather than only input bytes.
- [Property-Based Testing](../testing/property-based-testing.md) — System invariants define what every simulated run must preserve.
- [Flaky Test Quarantine](../testing/flaky-test-quarantine.md) — The goal is the opposite of quarantine: make non-deterministic failures deterministic and reproducible.

**Conflicts with:** [Ephemeral Environment](../testing/ephemeral-environment.md)

**Alternatives:** [Ephemeral Environment](../testing/ephemeral-environment.md), [Fuzzing](../testing/fuzzing.md), [Property-Based Testing](../testing/property-based-testing.md)

## Applicability tags

- **Languages:** language-agnostic, cpp, c, rust, go
- **Frameworks:** none, tokio, actix
- **Project types:** distributed-system, data-pipeline, high-throughput, low-latency, safety-critical
- **Tags:** distributed-systems, fault-injection, simulation, reproducibility

