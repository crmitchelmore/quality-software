# Data-Oriented Design

> Design around the data a program transforms and how that data is laid out, accessed and moved through real hardware, especially caches and memory bandwidth.

**Discipline:** software · **Origin:** Mike Acton, Richard Fabian · *Data-Oriented Design and C++* · (2014)

**Also known as:** DOD, Data-oriented programming

## Description

Data-Oriented Design argues that the purpose of a program is to transform data, so software should be designed from the shape, volume, lifetime and access patterns of that data outward. Popularised in game-engine circles by Mike Acton's CppCon talk and elaborated by Richard Fabian, it rejects abstractions that hide the actual work from the machine: pointer-heavy object graphs, per-object virtual dispatch and APIs that ignore cache lines, prefetching, SIMD and memory bandwidth. Instead of modelling the world as interacting objects, designers ask what data exists, how it changes, which operations touch it together and which layout makes those transformations cheap. Struct-of-arrays, batching, hot/cold splitting and measuring real hardware effects are typical consequences.

**In practice.** Inventory the data touched by the critical path; record cardinality and access frequency; design storage so the common loop streams contiguous memory; batch operations; avoid needless pointer chasing; use profiling counters before and after layout changes. Keep higher-level interfaces where they do not obscure or damage the measured data flow.

## Core tenets

- Start with the data: its size, frequency, lifetime, ownership, access order and transformation pipeline.
- Optimise for hardware reality, especially cache locality, memory bandwidth, branch prediction and vectorisation.
- Prefer layouts that match access patterns, often struct-of-arrays over array-of-structs for hot homogeneous processing.
- Separate hot data from cold metadata so common loops read only what they need.
- Question object-oriented abstractions when they scatter related data or hide the cost of indirection and dynamic dispatch.
- Measure with representative data and hardware; aesthetics of abstraction do not substitute for observed throughput and latency.

## Key ideas

- **Transform data** — The program is understood as a sequence of transformations over data sets, not primarily as a network of objects sending messages.
- **Data layout is design** — Field order, contiguity, grouping and lifetime influence performance and therefore belong in the core design discussion.
- **Hot and cold separation** — Frequently accessed fields are stored apart from rarely used fields so hot paths avoid unnecessary cache pollution.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Flyweight](../patterns/gof-structural/flyweight.md) — Shares intrinsic data to reduce memory footprint and improve locality for many similar objects.
- [Object Pool](../patterns/implementation/object-pool.md) — Controls allocation and reuse so memory behaviour is predictable in performance-sensitive paths.
- [Memoization](../patterns/functional/memoization.md) — Trades storage for repeated computation when the data access pattern makes cached results cheaper.
- [Cache-Aside](../patterns/cloud-distributed/cache-aside.md) — Makes the placement and reuse of frequently read data an explicit design concern.
- [Copy-on-Write](../patterns/concurrency/copy-on-write.md) — Separates read-heavy sharing from mutation, which can improve locality and avoid unnecessary copies when used carefully.
- [Map-Filter-Reduce](../patterns/functional/map-filter-reduce.md) — Expresses computation as bulk data transformations that can often be batched, streamed or parallelised.

## Software patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Active Record](../patterns/enterprise-application/active-record.md) — Row-shaped objects with behaviour tend to encourage per-entity access instead of batching and layout around hot transformations.
- [Domain Model](../patterns/enterprise-application/domain-model.md) — Rich object models can preserve domain expressiveness at the cost of pointer-heavy layouts and poor cache locality in tight loops.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Insomniac Games and game-engine performance work | Mike Acton presented data-oriented design from production game-development experience, emphasising measurement, cache behaviour and designing around actual data transforms. | primary source | Data-Oriented Design and C++ |
| Game engines and entity-component-system architectures | Modern game engines commonly use component arrays and batched systems for simulation and rendering workloads where data locality dominates frame time. | secondary source | Data-Oriented Design |
| Unity DOTS / ECS | Unity's Data-Oriented Technology Stack applies ECS and contiguous component data to improve performance for large numbers of entities. | secondary source | Unity Data-Oriented Technology Stack documentation |

**Best for:** game, realtime-system, high-throughput, low-latency, embedded

## Relationships with other philosophies

**Complements:** [Simple Made Easy](simple-made-easy.md), [Design for Production / Stability](design-for-production.md), [Worse Is Better](worse-is-better.md)

**In tension with**

- [Functional Core & Type-Driven Design](functional-core-type-driven.md) — Functional designs often default to immutable persistent structures and rich type abstractions; DOD may choose mutable contiguous buffers and simpler representations for hot data paths.
- [Domain-Driven Design](domain-driven-design.md) — DDD models concepts in domain terms, while DOD may deliberately reshape data away from the domain model to fit access patterns and hardware.

## Criticisms / limits

- It can reduce local domain readability when data is reshaped primarily for hardware access.
- The benefits are workload-dependent; applying it outside measured hot paths can add complexity without observable gain.
- Data layout optimisations may couple code to current hardware assumptions and require careful benchmarking over time.

## References

- Mike Acton, Data-Oriented Design and C++, (2014)
- Richard Fabian, Data-Oriented Design, (2018)
- Mike Acton, CppCon 2014: Data-Oriented Design and C++, (2014)

