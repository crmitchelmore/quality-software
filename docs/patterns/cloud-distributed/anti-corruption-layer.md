# Anti-Corruption Layer

> Insert a translation boundary between systems so an external model, protocol, or lifecycle cannot leak into and distort the local domain model.

**Scale:** integration · **Category:** cloud-distributed · **Maturity:** time-tested

## Description

An Anti-Corruption Layer (ACL) protects a system from another system's language, assumptions, and data quality. It translates requests and responses, maps identifiers, normalises error semantics, and absorbs legacy quirks behind a deliberate boundary. The goal is not merely object mapping; it is preserving the integrity of the local model while still integrating with a partner, vendor, legacy platform, or neighbouring bounded context that evolves independently.

**Problem.** Direct integration with an external model causes foreign names, nullable fields, state transitions, and error codes to spread through local code until the local design becomes coupled to another system's constraints.

**Context.** Use at bounded-context seams, vendor integrations, legacy strangler migrations, and multi-team APIs where the external contract cannot be changed to match the consuming domain.

## Consequences / Trade-offs

- Keeps the local model clean and intention-revealing even when the remote system is messy.
- Makes integration assumptions explicit and testable at one boundary.
- Adds mapping code and a second vocabulary that must be maintained.
- Can become a dumping ground unless ownership and translation rules are clear.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often unnecessary for a small app with one simple, stable dependency. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Valuable when external contracts are owned by other teams or vendors. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential across bounded contexts and legacy migrations where model pollution is otherwise costly. |

## Examples

### Translating a vendor order model

**❌ Negative (typescript)**

```typescript
// Vendor fields and states leak into the local domain and tests.
async function canShip(orderId: string): Promise<boolean> {
  const raw = await vendor.get(`/ORD/${orderId}`);
  return raw.STS === "REL" && raw.HOLD_FLG !== "Y" && raw.ship_to?.cntry !== "BLOCKED";
}
```

**✅ Positive (typescript)**

```typescript
type FulfilmentStatus = "released" | "blocked" | "pending";

interface FulfilmentOrder {
  id: string;
  status: FulfilmentStatus;
  destinationCountry: string;
}

class VendorOrderAcl {
  async load(orderId: string): Promise<FulfilmentOrder> {
    const raw = await vendor.get(`/ORD/${orderId}`);
    return {
      id: raw.ORD_NO,
      status: raw.HOLD_FLG === "Y" ? "blocked" : raw.STS === "REL" ? "released" : "pending",
      destinationCountry: raw.ship_to?.cntry ?? "unknown",
    };
  }
}

async function canShip(orderId: string): Promise<boolean> {
  const order = await acl.load(orderId);
  return order.status === "released" && order.destinationCountry !== "BLOCKED";
}
```

*The positive version confines vendor field names and status codes to the ACL, so local code works with explicit domain concepts and can change independently.*

## Relationships

**Synergies**

- [Bounded Context](../ddd-strategic/bounded-context.md) — ACLs enforce the translation boundary between contexts with different ubiquitous languages.
- [Message Translator](../enterprise-integration/message-translator.md) — Message Translator is the integration-level mechanism often used inside an ACL.
- [Strangler Fig](../architecture/strangler-fig.md) — During migration, the ACL shields new code from legacy models while functionality is peeled away.
- [Hexagonal Architecture (Ports & Adapters)](../architecture/hexagonal-architecture.md) — The ACL naturally sits in an outbound or inbound adapter, keeping the application core pure.

**Alternatives:** [Canonical Data Model](../enterprise-integration/canonical-data-model.md), [Shared Kernel](../ddd-strategic/shared-kernel.md), [Conformist](../ddd-strategic/conformist.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** spring-boot, dotnet, nestjs, nodejs, grpc
- **Project types:** backend-service, microservices, modular-monolith, distributed-system
- **Tags:** translation, boundaries, legacy-integration

## References

- Eric Evans, Domain-Driven Design, (2003)

