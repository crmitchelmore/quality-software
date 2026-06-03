# Adapter

> Translate one interface into another expected by the client, allowing incompatible APIs or external models to collaborate without changing either side.

**Scale:** design · **Altitude:** low · **Category:** gof-structural · **Maturity:** time-tested

**Also known as:** Wrapper

## Description

Adapter wraps an existing class, service, library, or data shape and exposes the interface the client already understands. It is a boundary pattern: the adapter absorbs naming differences, protocol quirks, error formats, and data conversion so the core code remains expressed in its own language. Good adapters are thin, explicit translators; they do not become a dumping ground for business rules.

**Problem.** Useful functionality exists behind an API that does not match the client interface, causing provider-specific details to leak through the codebase.

**Context.** Use at integration boundaries, legacy seams, third-party library wrappers, and tests where a fake must satisfy a production port.

## Consequences / Trade-offs

- Protects clients from vendor or legacy API churn.
- Keeps translation and error mapping close to the external dependency.
- Adds another layer to trace during debugging.
- A leaky adapter that exposes provider concepts defeats the purpose.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Useful even in small apps when wrapping a third-party API or keeping tests clean. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for integration seams and framework boundaries. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential in large systems to contain vendor churn, legacy interfaces, and team-owned contracts. |

## Examples

### Payment provider adapter

**❌ Negative (typescript)**

```typescript
class CheckoutService {
  async pay(totalPence: number, token: string): Promise<void> {
    const response = await adyen.payments({
      amount: { value: totalPence, currency: "GBP" },
      reference: crypto.randomUUID(),
      paymentMethod: { type: "scheme", encryptedCardNumber: token },
    });
    if (response.resultCode !== "Authorised") throw new Error(response.refusalReason);
  }
}
```

**✅ Positive (typescript)**

```typescript
interface PaymentGateway {
  charge(amount: Money, token: string): Promise<PaymentReceipt>;
}

class AdyenPaymentAdapter implements PaymentGateway {
  constructor(private readonly adyen: AdyenClient) {}
  async charge(amount: Money, token: string): Promise<PaymentReceipt> {
    const response = await this.adyen.payments({
      amount: { value: amount.pence, currency: amount.currency },
      reference: crypto.randomUUID(),
      paymentMethod: { type: "scheme", encryptedCardNumber: token },
    });
    if (response.resultCode !== "Authorised") throw new PaymentDeclined(response.refusalReason);
    return { providerReference: response.pspReference };
  }
}

class CheckoutService {
  constructor(private readonly payments: PaymentGateway) {}
  async pay(total: Money, token: string): Promise<void> {
    await this.payments.charge(total, token);
  }
}
```

*The positive version confines Adyen request shapes and result codes to one adapter. CheckoutService speaks in domain terms and can switch providers or use a fake gateway in tests.*

## Relationships

**Synergies**

- [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md) — Anti-Corruption Layer is an architectural use of adapters to protect a domain model from external models.
- [Hexagonal Architecture (Ports & Adapters)](../architecture/hexagonal-architecture.md) — Adapters implement ports at the edges of a hexagonal core.
- [Facade](../gof-structural/facade.md) — A facade may coordinate several adapters behind one simplified subsystem interface.
- [Repository](../data-persistence/repository.md) — A database-backed repository is often an adapter from domain collection semantics to persistence APIs.

**Alternatives:** [Facade](../gof-structural/facade.md), [Proxy](../gof-structural/proxy.md), [Bridge](../gof-structural/bridge.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python, go
- **Frameworks:** none, spring-boot, dotnet, nodejs
- **Project types:** backend-service, web-api, sdk, library
- **Tags:** integration, translation, boundary

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

