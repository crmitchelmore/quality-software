# Feature Toggle

> Route behaviour through a named runtime switch so code can be released separately from enabling the feature for users.

**Scale:** implementation · **Altitude:** low · **Category:** implementation · **Maturity:** established

**Also known as:** Feature Flag, Feature Switch

## Description

Feature Toggle wraps an alternative behaviour behind a controlled decision point. The toggle can support progressive rollout, experiments, emergency disablement, or trunk-based development. A good toggle has an owner, expiry plan, default, and observable state; without that hygiene, flags accumulate into hidden product logic and create untested combinations.

**Problem.** Teams need to deploy code before exposing it broadly, or disable risky behaviour quickly without a new release.

**Context.** Use for short-lived rollouts, experiments, operational safety switches, and migrations where both old and new paths must coexist briefly.

## Consequences / Trade-offs

- Decouples deployment from release and supports progressive exposure.
- Provides a fast rollback mechanism for risky paths.
- Increases test matrix size while both paths exist.
- Long-lived toggles become confusing configuration and should be retired.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for risky releases, but manual deploys may be simpler for tiny apps. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for trunk-based delivery and controlled migrations. |
| Large (>100k LOC) | ●●●●○ 4/5 | Essential operationally, but governance and cleanup are mandatory. |

## Examples

### Named rollout decision

**❌ Negative (typescript)**

```typescript
async function calculatePrice(cart: Cart, user: User) {
  if (user.id === '42' || process.env.NEW_PRICING === 'true') {
    return newPricing(cart);
  }
  return oldPricing(cart);
}
```

**✅ Positive (typescript)**

```typescript
async function calculatePrice(cart: Cart, user: User, flags: FeatureFlags) {
  if (await flags.enabled('pricing-v2', { userId: user.id })) {
    return newPricing(cart);
  }
  return oldPricing(cart);
}
```

*The positive version centralises rollout rules behind a named flag instead of scattering ad hoc environment and user checks in business logic.*

## Relationships

**Synergies**

- [Strangler Fig](../architecture/strangler-fig.md) — Toggles help move traffic from legacy to replacement code during strangler migrations.
- [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md) — A toggle can choose whether traffic uses a legacy adapter or a new anti-corruption adapter during migration.
- [Circuit Breaker](../resilience/circuit-breaker.md) — Operational toggles can act as manual safety switches alongside automatic circuit breakers.
- [Strategy](../gof-behavioural/strategy.md) — A toggle can choose between strategy implementations without scattering conditionals.

**Alternatives:** [Strategy](../gof-behavioural/strategy.md), [Circuit Breaker](../resilience/circuit-breaker.md), [Strangler Fig](../architecture/strangler-fig.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, react, spring, dotnet, nodejs
- **Project types:** web-api, backend-service, web-frontend, microservices, mobile-app
- **Tags:** rollout, release, operations

## References

- Pete Hodgson, Feature Toggles, (2017)

