# Published Language

> Define a stable, documented language of messages or representations that bounded contexts use to integrate without sharing internal models.

**Scale:** integration · **Altitude:** high · **Category:** ddd-strategic · **Maturity:** time-tested

## Description

Published Language is a strategic DDD integration pattern in which a provider publishes the vocabulary, schemas, and semantics consumers should use at the boundary. It may be an OpenAPI schema, AsyncAPI event contract, protobuf definition, canonical event model, or XML/JSON vocabulary. The published language is not necessarily the provider's internal domain model; it is a deliberately stable contract designed for integration. It pairs naturally with open host service and can be translated by anti-corruption layers in downstream contexts.

**Problem.** Consumers integrate against internal tables, DTOs, or undocumented JSON. Provider refactors then break consumers, while consumer interpretations of fields drift because no stable shared contract exists.

**Context.** Use published language when multiple contexts exchange data or events and need stable semantics without sharing a code model or database schema.

## Consequences / Trade-offs

- Gives consumers a documented, versioned contract with explicit semantics.
- Allows providers to change internal models behind the boundary.
- Supports interoperability across languages and platforms.
- Requires governance, compatibility policy, and migration paths for contract changes.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often unnecessary for a single in-process consumer; direct types are simpler. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit when several services or teams exchange events or API payloads. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large integration landscapes where contracts must survive provider refactoring and multi-language consumers. |

## Examples

### Published event schema at the boundary

**❌ Negative (typescript)**

```typescript
// Consumers copy whatever the Billing ORM serialises today.
export type InvoiceRow = {
  id: string;
  acct_id: string;
  st: number;
  gross_cents: number;
};
```

**✅ Positive (typescript)**

```typescript
// Published language: billing-events/v1
export interface InvoicePaidV1 {
  eventType: "billing.invoice-paid";
  invoiceId: string;
  accountId: string;
  paidAt: string;
  amount: { cents: number; currency: "GBP" | "EUR" | "USD" };
}

// Billing maps from its internal Invoice aggregate to InvoicePaidV1 before publishing.
```

*The positive version publishes a stable integration vocabulary with business names and versioning. Consumers no longer depend on internal table abbreviations or status encodings.*

## Relationships

**Synergies**

- [Open Host Service](../ddd-strategic/open-host-service.md) — Open host services need a published language for request, response, and event payloads.
- [Canonical Data Model](../enterprise-integration/canonical-data-model.md) — A canonical data model can be the published language for broad integration, though it must not become an internal domain model everywhere.
- [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md) — Downstream contexts translate published-language payloads into their own model at the boundary.
- [Contract-First API (OpenAPI)](../api-design/contract-first-api.md) — Contract-first API tooling helps publish and validate the language before implementation details leak.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Shared Kernel](../ddd-strategic/shared-kernel.md), [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md), [Canonical Data Model](../enterprise-integration/canonical-data-model.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, spring-boot, dotnet, grpc, kafka
- **Project types:** backend-service, microservices, distributed-system, web-api, data-pipeline
- **Tags:** ddd, integration, contract, schema

## References

- Eric Evans, Domain-Driven Design, (2003)

