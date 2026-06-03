# Shared Kernel

> Share a deliberately small, jointly owned subset of model or code between bounded contexts when divergence would be more costly than coordination.

**Scale:** organisational · **Altitude:** high · **Category:** ddd-strategic · **Maturity:** time-tested

## Description

A Shared Kernel is a context-map relationship where two or more teams agree to share a narrow part of the domain model: common value objects, identifiers, calculation rules, or schemas. It is not a casual utilities package. Changes require joint ownership, shared tests, and coordinated release discipline because the shared model affects multiple contexts. Used well, it prevents wasteful duplication for truly common concepts; used broadly, it becomes the enterprise model that bounded contexts were meant to avoid.

**Problem.** Some concepts must stay identical across contexts, but copying them creates divergent rules and incompatible data. Conversely, broad shared libraries freeze teams together and smuggle one context's assumptions into another.

**Context.** Use shared kernel only for stable, genuinely shared concepts where teams can collaborate closely and the shared surface can remain small.

## Consequences / Trade-offs

- Reduces duplication for critical shared concepts and calculations.
- Creates a strong compatibility contract backed by shared tests.
- Couples release cadence and governance across participating teams.
- Expands dangerously unless actively pruned and owned.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●○○○○ 1/5 | Avoid in tiny apps; a single module or local type is simpler. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for a few teams with stable shared concepts and disciplined ownership. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable but risky at scale: governance must keep the kernel small and prevent accidental enterprise-model growth. |

## Examples

### Small shared product code kernel

**❌ Negative (csharp)**

```csharp
// Sales
public sealed record ProductCode(string Value);

// Billing
public sealed record Sku(string Value);

// Each team validates the same code format differently and incidents follow.
```

**✅ Positive (csharp)**

```csharp
// Shared kernel package: Company.ProductIdentity
public sealed record ProductCode
{
    public string Value { get; }

    private ProductCode(string value) => Value = value;

    public static ProductCode Parse(string value)
    {
        if (!Regex.IsMatch(value, "^[A-Z]{3}-[0-9]{5}$")) throw new DomainException("Invalid product code");
        return new ProductCode(value);
    }
}

// Sales and Billing both depend on this tiny package and jointly approve changes.
```

*The positive version shares only the stable identity concept and its validation. It avoids duplicating a critical rule without forcing Sales and Billing to share their entire models.*

## Relationships

**Synergies**

- [Context Map](../ddd-strategic/context-map.md) — Shared kernel is a relationship type that should be explicit on a context map.
- [Bounded Context](../ddd-strategic/bounded-context.md) — It is an exception at the boundary between bounded contexts, not permission to merge their models.
- [Value Object](../ddd-tactical/value-object.md) — Stable value objects such as ProductCode or Currency are often suitable shared-kernel candidates.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Contract tests help protect shared behaviour and compatibility across teams.

**Conflicts with:** [Canonical Data Model](../enterprise-integration/canonical-data-model.md)

**Alternatives:** [Published Language](../ddd-strategic/published-language.md), [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md), [Conformist](../ddd-strategic/conformist.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, dotnet, spring-boot, nodejs
- **Project types:** modular-monolith, microservices, backend-service, distributed-system
- **Tags:** ddd, strategic-design, shared-model, governance

## References

- Eric Evans, Domain-Driven Design, (2003)

