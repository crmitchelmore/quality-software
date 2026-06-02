# Mapper

> Move data between two representations while keeping both sides independent of each other's structure and lifecycle.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Mapper is a family pattern: an object translates between domain objects, DTOs, records, messages, view models, or persistence rows. Its purpose is independence. Each side can have names, types, invariants, and lifecycle suited to its own layer, while the mapper owns the conversion rules. For complex persistence this becomes Data Mapper; for API boundaries it often maps domain objects to DTOs.

**Problem.** When layers directly expose each other's objects, changes in database columns, wire contracts, or UI needs ripple into the domain and application logic.

**Context.** Use at boundaries where two models have different reasons to change. Avoid mapping merely to copy identical objects inside the same layer.

## Consequences / Trade-offs

- Preserves independence between domain, persistence, API, and presentation models.
- Makes translation rules explicit and testable, including defaulting and value-object construction.
- Adds boilerplate and can hide missing fields if mapping is not covered by tests.
- Automated mappers reduce typing but can silently couple by convention.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful at external boundaries; avoid mapping identical internal shapes. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for APIs, message consumers, and persistence seams with independent models. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential when many teams depend on stable contracts while domain and storage models evolve. |

## Examples

### Domain to response model

**❌ Negative (typescript)**

```typescript
app.get('/customers/:id', async (req, res) => {
  const customer = await customers.get(req.params.id);
  res.json(customer); // leaks internal fields, methods, and naming
});
```

**✅ Positive (typescript)**

```typescript
type CustomerResponse = {
  id: string;
  displayName: string;
  status: 'active' | 'suspended';
};

class CustomerResponseMapper {
  static fromDomain(customer: Customer): CustomerResponse {
    return {
      id: customer.id.value,
      displayName: customer.name.formatForDisplay(),
      status: customer.isSuspended() ? 'suspended' : 'active'
    };
  }
}

app.get('/customers/:id', async (req, res) => {
  res.json(CustomerResponseMapper.fromDomain(await customers.get(req.params.id)));
});
```

*The positive version makes the API contract explicit and lets the domain keep richer types and behaviour without exposing them to clients.*

## Relationships

**Synergies**

- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper is the persistence-specialised form of Mapper for translating between domain objects and database rows.
- [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md) — DTOs usually need mappers to avoid leaking domain objects across process or API boundaries.
- [Value Object](../ddd-tactical/value-object.md) — Mappers can reconstruct value objects from primitive wire or database fields at the boundary.
- [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md) — An Anti-Corruption Layer uses mappers to translate foreign models into local concepts.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Active Record](../enterprise-application/active-record.md), [Table Data Gateway](../enterprise-application/table-data-gateway.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, spring-boot, dotnet, sqlalchemy, hibernate
- **Project types:** web-api, backend-service, microservices, modular-monolith
- **Tags:** translation, boundary, model-independence

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

