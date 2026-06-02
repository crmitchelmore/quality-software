# Platform Strategy

> Design a product as a platform with shared capabilities, APIs, extension points and ecosystem incentives so others can create value on top of it.

**Discipline:** Product Management · **Category:** product-strategy · **Maturity:** established

**Also known as:** Product Platform Strategy

## Description

Platform Strategy treats the product not only as an end-user experience but as a foundation for internal teams, partners, developers or customers to build upon. It requires choices about which capabilities become stable platform services, which interfaces are exposed, how governance works, and how the platform creates value for both producers and consumers. Successful platforms balance openness with coherence.

**Problem.** Products that should scale through ecosystems or shared capabilities remain a collection of bespoke features, integrations and internal services. Every new use case requires custom work.

**Context.** Use when multiple teams need shared capabilities, customers demand integrations or extensions, or ecosystem value could become a strategic advantage.

## Forces

- Platform consumers need stable contracts, while the core product still needs to evolve.
- Openness increases adoption but also increases support, security and governance burden.
- Network effects require enough valuable producers and consumers; platforms fail when one side has no reason to join.

## Solution

Define the platform's participants, core value exchange and governance model. Choose a small set of stable, high-leverage capabilities to expose through APIs, SDKs, extension points or internal services. Invest in documentation, onboarding, quality controls and metrics. Grow openness deliberately, protecting trust and coherence while reducing custom work.

## When to use

- Repeated integrations or extensions suggest a common platform capability.
- Internal teams duplicate enabling capabilities that could be shared.
- Partners or developers can create complementary value that the product team cannot build alone.

## Metrics

Signals that tell you whether this pattern is working:

- Number of active platform consumers and producer adoption over time.
- Percentage of integrations or extensions using standard platform interfaces instead of bespoke work.
- Time for a new internal team, partner or developer to build a supported use case.

## Ratings by organisation stage

| Stage | Score | Notes |
| --- | --- | --- |
| Early (pre-PMF / <10 people) | ●●○○○ 2/5 | Usually premature unless the product itself is a developer or marketplace platform from day one. |
| Growth (scaling team & users) | ●●●●○ 4/5 | Valuable once repeated integration and extension needs appear and the product has stable core use cases. |
| Enterprise (mature org / regulated) | ●●●●● 5/5 | Often essential for scale, reuse and ecosystem leverage, though governance and compatibility costs are high. |

## Examples

### Platform from repeated demand

**❌ Poorer approach**

Each enterprise customer receives a custom integration built directly against internal services.

**✅ Better approach**

After seeing repeated integration patterns, the team exposes a stable integration API with clear scopes, documentation, sandbox tooling and support commitments.

*Platforms should emerge around repeated value exchanges. The better version turns custom work into a reusable product surface.*

### Stable contracts

**❌ Poorer approach**

Internal database fields are documented as the partner API because it is quick.

**✅ Better approach**

The platform exposes a versioned API that reflects partner jobs while hiding internal model changes.

*A platform is a promise. Exposing internals creates brittle dependency and prevents the core product from evolving.*

## Anti-patterns

- Declaring a platform before there is clear demand from producers and consumers.
- Exposing unstable internals as public APIs and then being trapped by accidental contracts.
- Optimising for ecosystem growth while ignoring trust, safety, quality and support costs.

## Relationships

**Related product / UX patterns**

- [Build vs Buy vs Partner](../product-patterns/build-vs-buy-vs-partner.md) — Platform capabilities often require explicit decisions about which parts to build, buy or partner for.
- [Moat & Differentiation Analysis](../product-patterns/moat-and-differentiation.md) — A platform can become a moat through ecosystem, data, switching costs or network effects.

**Related software patterns**

- [Open Host Service](../patterns/ddd-strategic/open-host-service.md) — Open Host Service exposes a stable protocol others can use without bespoke integration.
- [Published Language](../patterns/ddd-strategic/published-language.md) — Platforms need a published language so partners and internal teams share stable semantics.

**Related philosophies**

- [Domain-Driven Design](../philosophies/domain-driven-design.md) — Strategic domain boundaries help decide what the platform should expose and what remains internal.
- [Conway's Law & Team Topologies](../philosophies/conways-law-team-topologies.md) — Platform strategy must align with team boundaries, ownership and enabling-team structures.

## Tags

- **Tags:** platform, ecosystem, api, network-effects
- **Product stages:** growth, enterprise

## References

- Geoffrey Parker, Marshall Van Alstyne and Sangeet Paul Choudary, Platform Revolution, (2016)

