# Separated Interface

> Define an interface in one package or layer while implementations live elsewhere, allowing clients to depend on a stable contract rather than concrete infrastructure.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

## Description

Separated Interface places a contract where the client can own or depend on it, and keeps implementations in another module, plugin, adapter, or infrastructure layer. The split supports independent deployment, replacement, and testing because the dependency points toward the abstraction. It is most useful when package dependencies matter; within a tiny codebase, a regular interface next to its implementation may be enough.

**Problem.** High-level modules become coupled to concrete database, message, or external-service implementations because the only available type lives in the infrastructure package.

**Context.** Use across architectural boundaries, package boundaries, or plugins where the caller should define what it needs and the provider supplies an implementation.

## Consequences / Trade-offs

- Inverts dependencies so domain or application code can remain independent of infrastructure.
- Enables alternate implementations for tests, local development, or different deployments.
- Requires disciplined packaging; too many tiny interfaces can obscure the actual behaviour.
- Interface drift is possible if no integration tests prove that implementations honour the contract.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful at hard boundaries, but excessive interfaces around every class slow small teams down. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good default for persistence, messaging, and third-party integrations. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large modular systems where package dependency direction and replaceability matter. |

## Examples

### Payment dependency direction

**❌ Negative (java)**

```java
package checkout;

import infra.stripe.StripeClient;

final class CheckoutService {
    private final StripeClient stripe;
    CheckoutService(StripeClient stripe) { this.stripe = stripe; }
    Receipt pay(Order order) { return stripe.charge(order.total(), order.cardToken()); }
}
```

**✅ Positive (java)**

```java
package checkout;

public interface PaymentGateway {
    Receipt charge(Money amount, CardToken token);
}

final class CheckoutService {
    private final PaymentGateway payments;
    CheckoutService(PaymentGateway payments) { this.payments = payments; }
    Receipt pay(Order order) { return payments.charge(order.total(), order.cardToken()); }
}

package infra.stripe;
final class StripePaymentGateway implements checkout.PaymentGateway {
    public Receipt charge(Money amount, CardToken token) { return stripe.charge(amount, token); }
}
```

*The positive version lets checkout own the contract it needs while the Stripe implementation depends inward, so tests and alternative payment providers do not change checkout code.*

## Relationships

**Synergies**

- [Hexagonal Architecture (Ports & Adapters)](../architecture/hexagonal-architecture.md) — Ports are separated interfaces owned by the core and implemented by adapters.
- [Dependency Injection](../implementation/dependency-injection.md) — Dependency Injection supplies concrete implementations without clients importing infrastructure packages.
- [Gateway](../enterprise-application/gateway.md) — A Gateway interface can sit in the application layer while HTTP or SDK implementations live in integration code.
- [Repository](../data-persistence/repository.md) — Repository contracts can be owned by the domain/application layer and implemented by persistence adapters.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Adapter](../gof-structural/adapter.md), [Facade](../gof-structural/facade.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, go
- **Frameworks:** spring-boot, dotnet, nestjs, none
- **Project types:** backend-service, microservices, modular-monolith, sdk
- **Tags:** dependency-inversion, ports, modularity

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

