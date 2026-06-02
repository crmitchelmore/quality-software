# Layer Supertype

> Provide a common superclass or base abstraction for all objects in a layer so shared layer responsibilities have one consistent home.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Layer Supertype collects behaviour that is genuinely common to every object in a layer: identity semantics for domain entities, audit metadata for persistence records, validation hooks for view models, or domain event recording for aggregate roots. It is a narrow layer-specific contract, not a dumping ground for utilities. The value comes from expressing a layer invariant once and preventing each object from re-implementing it slightly differently.

**Problem.** Objects in the same layer often repeat small but important mechanisms such as version fields, audit timestamps, equality, validation, or event queues. Copy-paste makes those mechanisms inconsistent and hard to evolve.

**Context.** Use when a layer has a stable, universal responsibility that applies to nearly every type in that layer. Prefer interfaces or composition when only some objects need the behaviour.

## Consequences / Trade-offs

- Centralises layer-wide invariants and makes them discoverable.
- Reduces duplicated boilerplate in domain, persistence, DTO, or presentation model classes.
- Can create brittle inheritance hierarchies if used for optional behaviour.
- Framework base classes may leak infrastructure concepts into the domain model.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often too much ceremony; duplication may be cheaper than inheritance for a handful of classes. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful for stable common fields and methods, but keep the supertype narrow. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong fit when hundreds of layer objects must share audit, identity, version, or validation conventions. |

## Examples

### Domain entity identity

**❌ Negative (java)**

```java
final class Customer {
    private UUID id;
    private long version;
    public boolean sameIdentityAs(Customer other) {
        return other != null && id.equals(other.id);
    }
}

final class Invoice {
    private UUID id;
    private long version;
    public boolean sameAs(Invoice other) {
        return other != null && id.equals(other.id);
    }
}
```

**✅ Positive (java)**

```java
abstract class DomainEntity {
    private UUID id;
    private long version;

    protected DomainEntity(UUID id, long version) {
        this.id = Objects.requireNonNull(id);
        this.version = version;
    }

    public UUID id() { return id; }
    public long version() { return version; }

    public final boolean sameIdentityAs(DomainEntity other) {
        return other != null && getClass().equals(other.getClass()) && id.equals(other.id);
    }
}

final class Customer extends DomainEntity {
    Customer(UUID id, long version) { super(id, version); }
}
```

*The positive version puts identity and version semantics in one layer-specific abstraction, making entity equality and locking consistent across the domain layer.*

## Relationships

**Synergies**

- [Domain Model](../enterprise-application/domain-model.md) — Domain entities can share identity and domain-event support without every entity reimplementing it.
- [Optimistic Offline Lock](../enterprise-application/optimistic-offline-lock.md) — A persistent layer supertype can expose a version field consistently across mapped records.
- [Metadata Mapping](../enterprise-application/metadata-mapping.md) — Mapping metadata can recognise common base fields such as id, version, createdAt, and updatedAt.
- [Template Method](../gof-behavioural/template-method.md) — Shared algorithms in the supertype can call layer-specific hooks without duplicating orchestration.

**Conflicts with:** [Composition over Inheritance](../implementation/composition-over-inheritance.md)

**Alternatives:** [Composition over Inheritance](../implementation/composition-over-inheritance.md), [Separated Interface](../enterprise-application/separated-interface.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript
- **Frameworks:** spring-boot, dotnet, hibernate, entity-framework
- **Project types:** backend-service, modular-monolith, monolith
- **Tags:** inheritance, layer-invariant, boilerplate

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

