# Continuous Delivery & Lean Software

> Keep software always releasable by working in small batches, automating the deployment pipeline, reducing work-in-progress and optimising flow with fast feedback.

**Origin:** Jez Humble, David Farley, Nicole Forsgren, Gene Kim, Mary Poppendieck, Tom Poppendieck · *Continuous Delivery and Lean Software Development* · (2010)

**Also known as:** CD, Lean Software Development, Accelerate

## Description

Continuous Delivery applies lean thinking to the path from idea to production. Humble and Farley argued that release should be a low-risk, routine business decision, not a rare technical event: every change passes through an automated deployment pipeline that proves the software is in a releasable state. Lean Software Development adds the flow lens: reduce work-in-progress, eliminate handoffs and queues, build quality in, deliver in small batches and learn quickly. Accelerate and the DORA research programme later connected these practices to measurable software delivery and organisational performance, popularising four key metrics: deployment frequency, lead time for changes, change failure rate and time to restore service.

**In practice.** Commit small changes to a shared mainline, run a fast build immediately, promote the same artefact through increasingly production-like checks, and release with feature toggles or progressive rollout techniques. Limit parallel work, make queues visible, measure delivery flow and treat deployment failures as process feedback that should improve automation, tests or operability.

## Core tenets

- Work in small batches so each change is easier to understand, test, deploy and roll back.
- Automate the deployment pipeline from commit through build, tests, environment provisioning and release evidence.
- Keep software always releasable; mainline should represent a production-quality candidate, not a parking place for partially integrated work.
- Build quality in with fast automated feedback rather than inspecting quality in at the end.
- Reduce work-in-progress and queues to improve flow, expose bottlenecks and shorten feedback loops.
- Use DORA metrics as outcome signals, balancing speed with stability rather than optimising one in isolation.

## Key ideas

- **Deployment pipeline** — A versioned, automated path that turns a commit into progressively stronger evidence that the release candidate is safe to deploy.
- **Always releasable** — The system is kept in a state where release is a business choice; technical release work is routine, rehearsed and mostly automated.
- **DORA metrics** — Deployment frequency, lead time for changes, change failure rate and time to restore service provide a balanced view of throughput and resilience.

## Associated patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Decouples deployment from release, letting incomplete or risky functionality be integrated and shipped safely in small batches.
- [Strangler Fig](../patterns/architecture/strangler-fig.md) — Enables incremental migration with continuously releasable slices rather than a risky big-bang replacement.
- [Circuit Breaker](../patterns/resilience/circuit-breaker.md) — Supports safe operation and faster recovery when frequent deployments expose integration or dependency failures.
- [Transactional Outbox](../patterns/cloud-distributed/outbox.md) — Makes state changes and message publication reliable across service boundaries, reducing failure modes in automated release pipelines.
- [Deployment Stamp (Cells)](../patterns/cloud-distributed/deployment-stamp.md) — Provides repeatable, isolated deployment units that make environment creation and progressive rollout more automatable.
- [Database per Service](../patterns/data-persistence/database-per-service.md) — Reduces cross-team release coupling by allowing services to evolve and deploy their own data model independently.

## Patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Monolith](../patterns/architecture/monolith.md) — A monolith is not inherently incompatible, but when all changes must release as one large batch it fights independent flow and low-risk deployment.
- [Service Locator](../patterns/implementation/service-locator.md) — Hidden runtime dependencies make automated release confidence weaker and production failures harder to localise quickly.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| DORA / State of DevOps research cohorts | The Accelerate research programme reported that continuous delivery capabilities correlate with higher software delivery performance and organisational outcomes across large survey samples. | primary source | Accelerate |
| Etsy continuous deployment practice | Etsy publicly described frequent production deployments, extensive automation and monitoring as part of its web operations culture. | secondary source | Web Operations |
| Amazon deployment practice | Public accounts from Amazon engineering leaders describe highly automated, frequent service deployments enabled by small teams and operational ownership. | secondary source | Velocity Conference talks and Amazon engineering accounts |

**Best for:** web-api, backend-service, microservices, distributed-system, web-frontend, data-pipeline

## Relationships with other philosophies

**Complements:** [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md), [Simple Made Easy](simple-made-easy.md), [The Unix Philosophy](unix-philosophy.md)

**In tension with**

- [Clean Architecture & SOLID](clean-architecture-solid.md) — CD/Lean prioritises flow and frequent release; heavyweight architecture governance or slow approval gates can become queues unless automated or narrowed.
- [Conceptual Integrity](conceptual-integrity.md) — Rapid decentralised delivery can erode a single coherent design vision unless architectural guardrails and ownership are explicit.

## Criticisms / limits

- Delivery metrics can be gamed if treated as individual targets rather than system-level health indicators.
- High deployment frequency without strong operability, testing and rollback discipline can simply increase production churn.
- Legacy systems, regulated domains and tightly coupled databases may require substantial enabling work before the benefits appear.

## References

- Jez Humble, David Farley, Continuous Delivery, (2010)
- Nicole Forsgren, Jez Humble, Gene Kim, Accelerate, (2018)
- Mary Poppendieck, Tom Poppendieck, Lean Software Development, (2003)

