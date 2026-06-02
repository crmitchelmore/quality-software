# Contract-First API (OpenAPI)

> Design and review the API contract before implementation, then generate docs, clients, tests, or server stubs from it.

**Scale:** integration · **Category:** api-design · **Maturity:** established

## Description

Contract-First API development treats the API description as a versioned product artefact. Teams define paths, schemas, status codes, security, examples, and error responses in OpenAPI before or alongside code. This enables parallel client work, design review, mock servers, compatibility checks, and generated SDKs. The pattern only works when the contract is verified against implementation; stale specifications are worse than none.

**Problem.** Code-first APIs often ship undocumented behaviours, inconsistent errors, and late-breaking client surprises because the contract is discovered after implementation.

**Context.** Use when APIs have multiple consumers, SDKs, external partners, or independent frontend/backend teams. Keep the contract close to CI so implementation and specification cannot drift silently.

## Consequences / Trade-offs

- Improves reviewability, documentation, mocking, and generated clients.
- Can slow exploratory work if every experiment requires formal schema design.
- Requires contract tests or validators to prevent spec/implementation drift.
- OpenAPI describes HTTP well but is less natural for event streams or GraphQL schemas.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Helpful for small public APIs, but may be too formal for a throwaway prototype. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for medium teams with parallel client/server work. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical for large API platforms with SDKs, compatibility checks, and governance. |

## Examples

### Specify errors and versions before coding

**❌ Negative (yaml)**

```yaml
paths:
  /orders/{id}:
    get:
      responses:
        "200":
          description: OK
# Implementation also returns 404 and 409, but clients cannot see their shapes.
```

**✅ Positive (yaml)**

```yaml
paths:
  /v1/orders/{id}:
    get:
      responses:
        "200":
          description: Order found
        "404":
          $ref: "#/components/responses/NotFoundProblem"
        "409":
          $ref: "#/components/responses/ConcurrencyProblem"
```

*The positive contract documents success and failure shapes so clients, tests, and generated SDKs share the same expectations before implementation details leak.*

## Relationships

**Synergies**

- [API Versioning](../api-design/api-versioning.md) — Versioned contract files make breaking and additive changes explicit during review.
- [Problem Details (RFC 7807 Errors)](../api-design/problem-details.md) — Standard problem responses should be declared once and reused across operations.
- [REST](../api-design/rest.md) — REST resource contracts are well represented by OpenAPI paths, methods, schemas, and status codes.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Consumer-driven tests can verify real services honour the published contract.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [GraphQL Schema](../api-design/graphql.md), [gRPC / RPC](../api-design/grpc-rpc.md), [Published Language](../ddd-strategic/published-language.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, python, csharp
- **Frameworks:** express, spring-boot, fastapi, aspnet, none
- **Project types:** web-api, sdk, microservices, backend-service
- **Tags:** openapi, contract, sdk-generation

