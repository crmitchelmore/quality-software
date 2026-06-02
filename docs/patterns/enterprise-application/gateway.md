# Gateway

> Encapsulate access to an external system or resource behind a narrow object that hides protocol, SDK, authentication, and error-handling details.

**Scale:** integration · **Category:** enterprise-application · **Maturity:** time-tested

## Description

A Gateway is the application-facing object for an external system: payment processor, CRM, mainframe, filesystem, queue, or remote service. It translates the application's intent into the external API and translates responses, errors, retries, and authentication back into application concepts. It is thinner than a full anti-corruption layer but often becomes the boundary where such translation starts.

**Problem.** External API calls spread through services and controllers, coupling business code to vendor SDKs, wire formats, credentials, and transient failure semantics.

**Context.** Use whenever external integration details should be isolated, tested at a boundary, and replaceable. Keep domain decisions outside the gateway; it should adapt communication, not own policy.

## Consequences / Trade-offs

- Localises external API changes, authentication, rate limits, and protocol quirks.
- Provides a natural seam for contract tests and fake implementations.
- Can become an anemic pass-through if it merely mirrors a vendor SDK without application terminology.
- May need resilience patterns around timeouts, retries, circuit breaking, and idempotency.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Even small apps benefit from isolating third-party APIs behind a seam. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent default for service integrations with tests and provider change risk. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large systems with many providers, compliance constraints, and resilience requirements. |

## Examples

### Payment provider access

**❌ Negative (typescript)**

```typescript
class CheckoutService {
  async pay(order: Order) {
    const response = await fetch('https://api.payments.example/charges', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.PAYMENT_TOKEN },
      body: JSON.stringify({ cents: order.total.cents, card: order.cardToken })
    });
    if (response.status === 402) throw new CardDeclined();
    if (!response.ok) throw new Error('payment failed');
    return response.json();
  }
}
```

**✅ Positive (typescript)**

```typescript
interface PaymentGateway {
  charge(request: ChargeRequest): Promise<ChargeReceipt>;
}

class HttpPaymentGateway implements PaymentGateway {
  constructor(private readonly client: HttpClient, private readonly token: string) {}
  async charge(request: ChargeRequest): Promise<ChargeReceipt> {
    const response = await this.client.post('/charges', {
      cents: request.amount.cents,
      card: request.cardToken.value
    }, { bearerToken: this.token });

    if (response.status === 402) throw new CardDeclined();
    if (response.status >= 500) throw new PaymentProviderUnavailable();
    return ChargeReceipt.fromProvider(response.body);
  }
}
```

*The positive version confines protocol, token, wire format, and provider error mapping to a gateway, leaving checkout code expressed in application terms.*

## Relationships

**Synergies**

- [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md) — Gateways are often the technical edge inside an Anti-Corruption Layer that protects the domain from external concepts.
- [Adapter](../gof-structural/adapter.md) — Adapter shapes the external API into the interface the application expects; Gateway packages that adaptation around a remote resource.
- [Separated Interface](../enterprise-application/separated-interface.md) — The gateway contract can live in the application layer while SDK-specific implementations live in infrastructure.
- [Circuit Breaker](../resilience/circuit-breaker.md) — Remote gateways are ideal places to enforce circuit breaking and avoid cascading failures.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Adapter](../gof-structural/adapter.md), [Facade](../gof-structural/facade.md), [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** nodejs, spring-boot, dotnet, fastapi, none
- **Project types:** backend-service, web-api, microservices, distributed-system
- **Tags:** integration, external-system, boundary

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

