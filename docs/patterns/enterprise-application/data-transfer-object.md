# Data Transfer Object (DTO)

> Carry data across process, layer, or network boundaries in simple serialisable structures tailored to the contract rather than the domain model.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

## Description

A Data Transfer Object is a data-only shape designed for communication: API responses, request payloads, messages, RPC calls, and batch imports. It deliberately omits domain behaviour and usually uses primitive or serialisable value shapes. DTOs protect the domain model from wire-contract churn and let callers receive exactly the data they need. They are not a replacement for domain objects inside the core.

**Problem.** Exposing domain entities directly across network or presentation boundaries leaks internal fields, persistence concerns, lazy-loading behaviour, and invariants that clients should not rely on.

**Context.** Use at remote, public, or layer boundaries where serialisation, versioning, and compatibility matter. Avoid DTO proliferation for purely internal calls within the same cohesive module.

## Consequences / Trade-offs

- Stabilises external contracts while domain and persistence models evolve independently.
- Reduces over-fetching and accidental exposure of sensitive or internal fields.
- Requires mapping code and contract tests to keep DTOs in sync with behaviour.
- Anemic DTOs should not be mistaken for the domain model in business logic.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Strong at public API boundaries, though internal-only apps may not need many DTOs. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for services with versioned APIs, message contracts, or multiple clients. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large distributed systems where contract stability and data minimisation matter. |

## Examples

### Customer API response

**❌ Negative (typescript)**

```typescript
app.get('/customers/:id', async (req, res) => {
  const customer = await repository.get(req.params.id);
  res.json(customer); // exposes passwordHash, domain methods, and persistence fields
});
```

**✅ Positive (typescript)**

```typescript
type CustomerDto = {
  id: string;
  name: string;
  email: string;
  links: { self: string };
};

function toCustomerDto(customer: Customer): CustomerDto {
  return {
    id: customer.id.value,
    name: customer.name.fullName(),
    email: customer.email.value,
    links: { self: '/customers/' + customer.id.value }
  };
}

app.get('/customers/:id', async (req, res) => {
  res.json(toCustomerDto(await repository.get(req.params.id)));
});
```

*The positive version publishes an explicit API contract and prevents internal fields, methods, and persistence details from leaking to clients.*

## Relationships

**Synergies**

- [Mapper](../enterprise-application/mapper.md) — Mappers translate between DTOs and domain models without either side knowing the other's structure.
- [Data Mapper](../enterprise-application/data-mapper.md) — Data Mapper keeps persistence mapping separate from DTO mapping, preventing database rows from becoming API contracts.
- [Contract-First API (OpenAPI)](../api-design/contract-first-api.md) — Contract-first schemas define DTO shapes explicitly for clients before implementation.
- [Gateway](../enterprise-application/gateway.md) — Gateways often send and receive DTOs for external service calls while hiding provider wire formats.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Parameter Object](../implementation/parameter-object.md), [Data Mapper](../enterprise-application/data-mapper.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** spring-boot, dotnet, nestjs, fastapi, graphql
- **Project types:** web-api, backend-service, microservices, sdk
- **Tags:** api-contract, serialisation, boundary

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

