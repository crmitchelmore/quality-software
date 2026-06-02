# Conformist

> Deliberately adopt an upstream model as-is when the downstream team has little influence and translation would cost more than conformity.

**Scale:** organisational · **Category:** ddd-strategic · **Maturity:** time-tested

## Description

Conformist is a context-map relationship where a downstream bounded context accepts the upstream model, language, and quirks rather than translating or negotiating changes. This is not failure by default; it can be pragmatic when the upstream model is stable, the downstream context is not strategically differentiating, or the cost of an anti-corruption layer is unjustified. The danger is unexamined conformity: the upstream model may silently distort downstream language and rules.

**Problem.** Teams often build elaborate translation layers around stable commodity systems, or accidentally conform to an upstream model while pretending their own model is independent. Both waste effort or hide coupling.

**Context.** Use conformist when the downstream context has low strategic value, little power over the upstream, and can safely align its model to the upstream contract.

## Consequences / Trade-offs

- Minimises integration cost and avoids needless translation layers.
- Makes lack of downstream influence explicit, enabling honest planning.
- Couples downstream language and design to the upstream model.
- Becomes harmful when the downstream domain needs concepts the upstream model cannot express cleanly.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Occasionally useful for a small app integrating a commodity provider, but often not worth naming formally. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational when a downstream team has low strategic differentiation and a stable upstream API. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at scale when made explicit on a context map; dangerous if applied to core differentiating domains. |

## Examples

### Pragmatic conformity to a payment provider

**❌ Negative (java)**

```java
final class PaymentStatusTranslator {
    LocalPaymentStatus translate(String providerStatus) {
        if (providerStatus.equals("authorized")) return LocalPaymentStatus.AUTHORISED;
        if (providerStatus.equals("requires_capture")) return LocalPaymentStatus.AUTHORISED;
        if (providerStatus.equals("succeeded")) return LocalPaymentStatus.SETTLED;
        throw new IllegalArgumentException(providerStatus);
    }
}

// The local model only renames provider states and adds confusion.
```

**✅ Positive (java)**

```java
enum ProviderPaymentStatus {
    AUTHORIZED,
    REQUIRES_CAPTURE,
    SUCCEEDED,
    FAILED
}

final class PaymentRecord {
    private ProviderPaymentStatus status;

    boolean canCapture() {
        return status == ProviderPaymentStatus.AUTHORIZED || status == ProviderPaymentStatus.REQUIRES_CAPTURE;
    }
}
```

*The positive version is honest that this context conforms to the provider's payment lifecycle. It avoids a fake local language that merely aliases upstream concepts.*

## Relationships

**Synergies**

- [Context Map](../ddd-strategic/context-map.md) — Conformist is a relationship type that should be visible so hidden coupling is acknowledged.
- [Bounded Context](../ddd-strategic/bounded-context.md) — It documents one bounded context choosing to adopt another context's model at the boundary.
- [Open Host Service](../ddd-strategic/open-host-service.md) — Downstream conformists often integrate through a provider's open host service.
- [Published Language](../ddd-strategic/published-language.md) — A published language reduces the risk of conforming to unstable internal structures.

**Conflicts with:** [Ubiquitous Language](../ddd-strategic/ubiquitous-language.md)

**Alternatives:** [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md), [Customer-Supplier](../ddd-strategic/customer-supplier.md), [Shared Kernel](../ddd-strategic/shared-kernel.md)

## Applicability tags

- **Languages:** language-agnostic, csharp, java, typescript
- **Frameworks:** none, spring-boot, dotnet, nodejs
- **Project types:** microservices, modular-monolith, backend-service, distributed-system
- **Tags:** ddd, strategic-design, integration, upstream-downstream

## References

- Eric Evans, Domain-Driven Design, (2003)

