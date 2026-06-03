# Problem Details (RFC 7807 Errors)

> Return machine-readable HTTP error bodies with standard fields such as type, title, status, detail, and instance.

**Scale:** integration · **Altitude:** medium · **Category:** api-design · **Maturity:** established

## Description

Problem Details standardises error representations for HTTP APIs using the application/problem+json media type. Instead of every endpoint inventing an error shape, responses include a stable type URI or code, human title, HTTP status, optional detail, instance, and domain-specific extensions. The pattern improves client handling, documentation, logging correlation, and support workflows, especially when validation and concurrency failures need precise semantics.

**Problem.** Ad hoc error bodies force clients to parse strings, special-case endpoints, and lose important debugging context.

**Context.** Use for REST and HTTP APIs where clients need predictable error contracts. Avoid leaking stack traces, secrets, or internal table names in detail fields.

## Consequences / Trade-offs

- Improves client compatibility and support diagnostics through a consistent error envelope.
- Type identifiers become long-lived contracts and should be documented.
- Details must be safe for clients; internal causes belong in logs with correlation IDs.
- Framework defaults often need customisation to produce useful domain error types.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Low-cost improvement for small HTTP APIs. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for medium APIs with generated clients and validation errors. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large API ecosystems where clients need stable error contracts and diagnostics. |

## Examples

### Return structured errors

**❌ Negative (typescript)**

```typescript
res.status(409).send("Version is wrong");
```

**✅ Positive (typescript)**

```typescript
res.status(409).type("application/problem+json").json({
  type: "https://api.example.com/problems/concurrency-conflict",
  title: "Concurrency conflict",
  status: 409,
  detail: "The resource was modified after you loaded it.",
  instance: `/orders/${orderId}`,
  current_version: currentVersion
});
```

*The positive response gives clients a stable machine-readable problem type and safe details for recovery without parsing prose.*

## Relationships

**Synergies**

- [REST](../api-design/rest.md) — Problem Details complements REST status codes with a standard response body.
- [API Versioning](../api-design/api-versioning.md) — Error type stability must be managed across API versions.
- [Contract-First API (OpenAPI)](../api-design/contract-first-api.md) — OpenAPI contracts can enumerate problem responses and extension fields.
- [Idempotency Key](../api-design/idempotency-key.md) — Duplicate or mismatched idempotency keys need precise error types clients can branch on.

**Conflicts with:** [gRPC / RPC](../api-design/grpc-rpc.md)

**Alternatives:** [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md), [Published Language](../ddd-strategic/published-language.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python, csharp
- **Frameworks:** express, spring-boot, fastapi, aspnet, rails
- **Project types:** web-api, sdk, backend-service
- **Tags:** errors, rfc7807, http

