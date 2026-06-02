# Identity Map

> Keep exactly one in-memory object instance for each database identity within a business transaction.

**Scale:** data · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Session cache, First-level cache

## Description

Identity Map stores objects by their persistent identity as they are loaded. Subsequent requests for the same row return the same object instance, so changes and relationship navigation are coherent until the unit of work ends. It is a consistency pattern, not a general cache: its lifetime should be short and scoped to one request, command, or ORM session.

**Problem.** Without an identity map, a use case can load the same row twice, mutate two different objects, overwrite changes in an arbitrary order, or compare object references that should represent the same entity. Lazy loading and graph traversal amplify the risk.

**Context.** Use inside Data Mapper, Unit of Work, and rich Domain Model persistence where object identity matters and where repeated loads may occur during one transaction.

## Consequences / Trade-offs

- Preserves object identity and prevents conflicting in-memory copies of the same row.
- Reduces repeated database reads during one use case without pretending to be a cross-request cache.
- Requires clear scoping and eviction; a long-lived identity map leaks memory and serves stale data.
- Needs careful key design for tenant-scoped ids and composite keys.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary unless an ORM already provides it; a small script can reload explicitly. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for ORM-backed services with relationship traversal and multiple repositories per request. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent fit for complex object graphs, multi-tenant domains, and high-concurrency systems where duplicate in-memory identities cause subtle data loss. |

## Examples

### Avoiding duplicate entity instances

**❌ Negative (java)**

```java
Customer a = mapper.find(customerId);
Order order = orderMapper.find(orderId);
Customer b = mapper.find(order.customerId());

a.rename("Acme Ltd");
b.suspend();
mapper.update(a);
mapper.update(b); // later update may overwrite the first instance's state
```

**✅ Positive (java)**

```java
final class Session {
    private final Map<CustomerId, Customer> customers = new HashMap<>();

    Customer customer(CustomerId id, Supplier<Customer> load) {
        return customers.computeIfAbsent(id, ignored -> load.get());
    }
}

Customer a = session.customer(customerId, () -> mapper.find(customerId));
Order order = orderMapper.find(orderId);
Customer b = session.customer(order.customerId(), () -> mapper.find(order.customerId()));

assert a == b;
a.rename("Acme Ltd");
a.suspend();
```

*Both access paths return the same Customer object, so mutations compose on one instance and the unit of work can write one coherent final state.*

## Relationships

**Synergies**

- [Unit of Work](../enterprise-application/unit-of-work.md) — The Unit of Work uses the Identity Map to know which instance should be checked for dirty changes and written once.
- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper consults the Identity Map before hydrating a row, preventing duplicate domain objects.
- [Lazy Load](../enterprise-application/lazy-load.md) — Lazy Load should resolve through Identity Map so relationship navigation reuses already-loaded entities.
- [Repository](../data-persistence/repository.md) — Repositories can be the public access point while the identity map stays hidden inside the persistence implementation.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Cache-Aside](../cloud-distributed/cache-aside.md), [Repository](../data-persistence/repository.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby
- **Frameworks:** hibernate, entity-framework, typeorm, sqlalchemy, rails
- **Project types:** backend-service, web-api, modular-monolith, monolith
- **Tags:** identity, session-cache, orm, consistency

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

