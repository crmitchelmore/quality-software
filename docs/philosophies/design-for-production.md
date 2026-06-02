# Design for Production / Stability

> Design systems for the conditions they will actually meet in production: failure, partial recovery, overload, latency, human operation and graceful degradation.

**Origin:** Michael Nygard · *Release It!* · (2007)

**Also known as:** Production-oriented design, Stability engineering, Release It! philosophy

## Description

Design for Production / Stability, associated most strongly with Michael Nygard's Release It!, treats production as the real test of design. Correct functionality is not enough: systems must survive slow dependencies, overload, bad data, stuck threads, cascading failures, retries, deployment mistakes and the need for humans to diagnose them under pressure. The philosophy names both stability anti-patterns and resilience patterns, pushing designers to add timeouts, circuit breakers, bulkheads, backpressure, health checks, observability and graceful degradation before the first outage proves the need. It is a pragmatic operational philosophy: design is good only if it keeps delivering acceptable service when reality is messy.

**In practice.** Put timeouts on every remote call; bound retries with backoff and jitter; isolate scarce pools; add circuit breakers and fallbacks around fragile dependencies; expose health endpoints and useful telemetry; test overload and dependency failure, not just correctness. Review designs by asking how they fail, recover and explain themselves to operators.

## Core tenets

- Assume dependencies will fail, slow down or return surprising results; design every integration with bounded waiting and explicit failure semantics.
- Prevent local failures from becoming systemic failures through isolation, bulkheads, circuit breakers and load shedding.
- Build for recovery as much as prevention: restarts, retries, fallbacks and degraded modes need deliberate design.
- Make production observable with health signals, logs, metrics, traces and correlation that operators can use during incidents.
- Treat capacity and overload as design inputs, not afterthoughts discovered by users.
- Prefer failing predictably and partially over hanging, amplifying traffic or corrupting shared resources.

## Key ideas

- **Stability patterns and anti-patterns** — Nygard catalogues recurring failure shapes and countermeasures, turning outage folklore into design vocabulary.
- **Production is the real test** — A design is not proven by passing happy-path tests; it is proven by behaviour under latency, overload, partial failure and operational intervention.
- **Graceful degradation** — Systems should preserve the most important user outcomes when secondary capabilities are impaired.

## Associated patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Timeout](../patterns/resilience/timeout.md) — Bounds waiting so one slow dependency cannot consume threads or requests indefinitely.
- [Circuit Breaker](../patterns/resilience/circuit-breaker.md) — Stops repeated calls to a failing dependency and gives it time to recover.
- [Bulkhead](../patterns/resilience/bulkhead.md) — Isolates resources so failure in one integration or tenant cannot sink the whole service.
- [Retry with Backoff](../patterns/resilience/retry.md) — Recovers from transient failure when bounded, delayed and paired with idempotency.
- [Fallback](../patterns/resilience/fallback.md) — Provides a reduced but useful response when the preferred dependency or feature is impaired.
- [Backpressure](../patterns/resilience/backpressure.md) — Communicates overload upstream instead of silently queuing work until collapse.
- [Health Endpoint Monitoring](../patterns/cloud-distributed/health-endpoint-monitoring.md) — Gives operators and orchestration systems a concrete signal for readiness, liveness and dependency health.

## Patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Service Locator](../patterns/implementation/service-locator.md) — Hidden dependencies make it harder to see which calls need timeouts, isolation, telemetry and fallbacks.
- [Singleton](../patterns/gof-creational/singleton.md) — Global shared state can become an unisolated failure or contention point unless designed with production limits in mind.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Release It! production case studies | Nygard's book derives its patterns and anti-patterns from production incidents and recovery work in large commercial systems. | primary source | Release It! |
| Netflix Hystrix and resilience engineering | Netflix popularised circuit breakers, fallbacks and latency tolerance in service-to-service calls through Hystrix and related resilience practices. | secondary source | Hystrix: Latency and Fault Tolerance for Distributed Systems |
| Cloud-native service operations | Health checks, timeouts, bulkheads, rate limits and graceful degradation are standard operational design elements in modern distributed systems. | inferred | Cloud-native resilience practice |

**Best for:** backend-service, distributed-system, microservices, web-api, high-throughput

## Relationships with other philosophies

**Complements:** [Continuous Delivery & Lean Software](continuous-delivery-lean.md), [Simple Made Easy](simple-made-easy.md), [Data-Oriented Design](data-oriented-design.md)

**In tension with**

- [Worse Is Better](worse-is-better.md) — Shipping a minimal implementation quickly can be valuable, but production design resists omitting stability controls whose absence only appears under real load.
- [Clean Architecture & SOLID](clean-architecture-solid.md) — Layered purity can hide operational failure modes if dependency boundaries are designed only for code organisation rather than timeouts, isolation and recovery.

## Criticisms / limits

- Stability mechanisms add moving parts and can themselves fail or mask problems if poorly tuned.
- Resilience patterns require realistic load and failure testing; configuration copied from another system can be worse than none.
- Designing for every possible outage can slow delivery unless teams prioritise the most likely and highest-impact failure modes.

## References

- Michael Nygard, Release It!: Design and Deploy Production-Ready Software, (2007)
- Michael Nygard, Release It!, second edition, (2018)
- Netflix, Hystrix: Latency and Fault Tolerance for Distributed Systems

