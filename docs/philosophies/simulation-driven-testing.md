# Simulation-Driven Testing

> Build the system around a deterministic, seeded simulator that controls time, I/O and faults so rare distributed failures can be reproduced.

**Discipline:** testing · **Origin:** FoundationDB engineering team, TigerBeetle engineering team, Antithesis · *Testing Distributed Systems with Deterministic Simulation* · 2010s-2020s

**Also known as:** Deterministic Simulation Testing, DST, Deterministic Chaos

## Description

Simulation-driven testing treats the simulator as a first-class test environment for whole-system correctness. Instead of relying on wall-clock integration tests, the system routes non-deterministic dependencies such as clocks, networking, disk I/O, scheduling and random numbers through deterministic interfaces. A harness can then inject faults, run many simulated histories, and replay any failure from a seed. The philosophy is strongest for distributed databases and fault-tolerant systems where the most dangerous bugs require precise timing, crashes or partitions that ordinary tests cannot reproduce.

**In practice.** Design runtime abstractions for clock, network, disk and randomness from the start; run simulated workloads continuously; publish failure seeds in CI; keep deterministic reproduction as a release gate for consensus, storage and settlement invariants.

## Core tenets

- Control every source of non-determinism through deterministic shims or interfaces.
- Make every failure replayable from a recorded seed so debugging is not guesswork.
- Inject faults such as packet loss, partitions, crashes, disk errors and clock changes as normal test inputs.
- Test the whole system under many simulated histories rather than only isolated components.

## Key ideas

- **Seeded replay** — A failing simulated execution records enough seed and schedule information to reproduce the same sequence of events exactly.
- **Fault-injected universe** — The simulator owns clocks, networking and storage behaviour, allowing adversarial but controlled failures that would be flaky in real time.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Deterministic Simulation](../patterns/testing/deterministic-simulation.md) — Deterministic, seeded simulation of the whole system is the core practice — the same inputs always reproduce the same execution, so failures are replayable.
- [Fuzzing](../patterns/testing/fuzzing.md) — Coverage-guided and randomised fault injection drives the simulator into rare interleavings and edge states.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| FoundationDB | The FoundationDB architecture paper describes simulation testing as a major part of how the database finds rare distributed-system failures before release. | primary source | [FoundationDB: A Distributed Unbundled Ordered Key-Value Store](https://www.foundationdb.org/files/fdb-paper.pdf) |
| TigerBeetle | TigerBeetle documents VOPR, its deterministic simulator, as a core correctness strategy for a financial accounting database built around reproducible fault injection. | primary source | [TigerBeetle repository](https://github.com/tigerbeetle/tigerbeetle) |
| Antithesis platform | Antithesis commercialises deterministic simulation and autonomous fault injection for reproducing hard-to-find distributed-system failures. | primary source | [Antithesis documentation](https://antithesis.com/docs/) |

**Best for:** distributed-database, consensus-system, storage-engine, financial-settlement-system, fault-tolerant-platform

## Relationships with other philosophies

**Complements:** [Risk-Based Testing](risk-based-testing.md), [Property-Based Thinking](property-based-thinking.md), [Design for Production / Stability](design-for-production.md)

**In tension with**

- [Write Tests. Not Too Many. Mostly Integration.](mostly-integration-testing.md) — Simulation-driven testing demands deep control of runtime interfaces, while pragmatic integration tests usually use real framework and infrastructure behaviour directly.

## Criticisms / limits

- It is difficult to retrofit because production code must be designed around controllable non-determinism.
- The simulator becomes complex infrastructure whose model can diverge from real deployment behaviour.
- Most product teams do not need the cost and expertise required for this level of testing.

## References

- [FoundationDB engineering team, FoundationDB: A Distributed Unbundled Ordered Key-Value Store, (2021)](https://www.foundationdb.org/files/fdb-paper.pdf)
- [TigerBeetle contributors, TigerBeetle repository](https://github.com/tigerbeetle/tigerbeetle)
- [Antithesis, Antithesis documentation](https://antithesis.com/docs/)
- [Will Wilson, Testing Distributed Systems with Deterministic Simulation](https://www.youtube.com/results?search_query=Testing+Distributed+Systems+with+Deterministic+Simulation)

