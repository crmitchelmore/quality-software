# Worse Is Better

> Prefer a simple implementation that ships, spreads and evolves over a complete, perfectly correct system that arrives too late or is too hard to port.

**Origin:** Richard P. Gabriel · *The Rise of Worse Is Better* · (1991)

**Also known as:** New Jersey approach, Worse-is-better

## Description

Richard P. Gabriel's worse-is-better contrasts two design cultures. The MIT or "right thing" approach ranks correctness, consistency and completeness highly, even when implementation becomes hard. The New Jersey approach, associated with Unix and C, ranks implementation simplicity first: a design may be incomplete or less theoretically correct if it is easy to build, port and explain. Gabriel's unsettling claim is evolutionary rather than moral — the simple 90% solution is more likely to spread, survive contact with real users, and improve through use than the cleaner 100% solution that fails to propagate. Worse-is-better therefore values survivability, deployment and feedback over architectural perfection.

**In practice.** Ship the smallest coherent capability that solves the common case, keep the implementation easy to understand and port, and let real use determine which missing parts deserve investment. Prefer plain mechanisms, compatibility and incremental repair over grand rewrites. Make the trade-off explicit: do not disguise incompleteness as correctness.

## Core tenets

- Simplicity of implementation is the highest design priority; interfaces and semantics may bend if that keeps the system small and portable.
- A working 90% solution that users adopt can be better than a more complete design that arrives too late or is too hard to implement widely.
- Correctness, consistency and completeness matter, but they are deliberately traded off when they threaten implementation simplicity and adoption.
- Spread matters — a design that can be reimplemented, ported and understood by many people has evolutionary advantages.
- Real use is the forcing function; rough systems that survive can be repaired and extended after their value is proven.

## Key ideas

- **New Jersey vs MIT** — Gabriel contrasts Unix/C pragmatism with the Lisp/MIT "right thing" instinct. The first optimises for simple implementation and propagation; the second for conceptual completeness.
- **The 90% solution** — The missing 10% is a conscious trade: shipping a simple useful core creates adoption and feedback that can fund later improvement.
- **Evolution over perfection** — Worse-is-better is a theory of design fitness. Systems win by being habitable, portable and easy to clone, not only by being internally elegant.

## Associated patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Prototype](../patterns/gof-creational/prototype.md) — Captures the bias toward building a small working version early, learning from adoption and replacing or evolving it as facts emerge.
- [Pipes and Filters](../patterns/architecture/pipes-and-filters.md) — Unix pipelines embody the New Jersey instinct: simple pieces with narrow behaviour compose into useful systems without a complete central design.
- [Feature Toggle](../patterns/implementation/feature-toggle.md) — Allows incomplete or risky functionality to ship behind controlled switches, preserving the feedback loop without demanding full completeness up front.
- [Strangler Fig](../patterns/architecture/strangler-fig.md) — Evolves a rough but useful system incrementally rather than waiting for a perfect replacement to be designed and delivered.
- [Microkernel (Plugin) Architecture](../patterns/architecture/microkernel.md) — Keeps the shipped core small and lets capabilities grow through plug-ins, matching the idea of a simple survivable nucleus.
- [Fallback](../patterns/resilience/fallback.md) — Accepts imperfect behaviour in uncommon cases so the common path remains simple and the system continues to operate.

## Patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Contract-First API (OpenAPI)](../patterns/api-design/contract-first-api.md) — Contract-first work can front-load completeness and consistency; worse-is-better may choose a simple implemented interface and stabilise it only after use.
- [Domain Model](../patterns/enterprise-application/domain-model.md) — A rich domain model can be the right thing for complex domains, but is often too much upfront modelling for a worse-is-better first release.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Unix and C ecosystem | Gabriel presents Unix and C as the canonical New Jersey example: simple implementation and portability helped them spread faster than more complete "right thing" systems. | primary source | [The Rise of Worse Is Better](https://www.dreamsongs.com/RiseOfWorseIsBetter.html) |
| Early Unix tool culture | Small, portable tools with incomplete but composable semantics became widely adopted and then evolved through real use across Unix and later Unix-like systems. | secondary source | The Art of Unix Programming |
| Minimal viable product practice | Lean product practice uses a similar evolutionary argument: release a small viable system to learn from real users before investing in completeness. | secondary source | The Lean Startup |

**Best for:** prototype, cli-tool, backend-service, web-api, distributed-system

## Relationships with other philosophies

**Complements:** [The Unix Philosophy](unix-philosophy.md), [Continuous Delivery & Lean Software](continuous-delivery-lean.md), [Design for Production / Stability](design-for-production.md)

**In tension with**

- [A Philosophy of Software Design](a-philosophy-of-software-design.md) — APoSD favours strategic investment in clean, deep interfaces; worse-is-better accepts rougher interfaces when that lowers implementation cost and accelerates adoption.
- [Domain-Driven Design](domain-driven-design.md) — DDD invests in rich models and language before complexity leaks; worse-is-better often starts with a smaller, less complete model and improves only after use proves the need.
- [Design by Contract](design-by-contract.md) — DbC wants precise preconditions, postconditions and invariants, while worse-is-better may leave edge cases informal to keep the implementation small.

## Criticisms / limits

- It can become an excuse for avoidable defects, underspecified behaviour or permanent technical debt if teams forget the later repair and evolution step.
- The approach underweights domains where correctness and completeness are non-negotiable, such as safety-critical, financial or security-sensitive systems.
- Once a rough design spreads, compatibility pressure can freeze early mistakes for decades.

## References

- [Richard P. Gabriel, The Rise of Worse Is Better, (1991)](https://www.dreamsongs.com/RiseOfWorseIsBetter.html)
- Richard P. Gabriel, Lisp: Good News, Bad News, How to Win Big, (1991)
- Eric S. Raymond, The Art of Unix Programming, (2003)

