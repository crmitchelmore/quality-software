# Message Translator

> Convert messages between the data model, schema, protocol, or vocabulary expected by different applications while preserving business meaning.

**Scale:** integration · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

A Message Translator sits at an integration boundary and maps one message representation to another. It may rename fields, split or combine structures, enrich values, convert units, adapt schema versions, or translate from a partner vocabulary into a canonical model. Its purpose is not to hide semantic disagreements; it should make them explicit and testable. Translators are most maintainable when they are small, version-aware, and owned near the boundary whose contract they protect.

**Problem.** Independent applications rarely share the same field names, identifiers, units, schema versions, or business vocabulary. Directly sharing internal models couples release cycles and leaks local concepts across boundaries.

**Context.** Use when messages cross application, bounded-context, partner, or protocol boundaries and the sender's representation is not the receiver's stable contract.

## Consequences / Trade-offs

- Protects each system's internal model and release cadence.
- Creates an explicit place to test mapping rules, defaults, identifier conversion, and schema version handling.
- Mapping logic can become a hidden domain model if semantic decisions are not owned by the right team.
- Data loss is easy when fields are dropped; translation should be monitored and versioned.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when integrating with an external API, but unnecessary if one codebase owns both sides. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit once several systems or schema versions exchange data. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large estates with many vendors, bounded contexts, and long-lived contracts. |

## Examples

### Translating partner order messages into a canonical event

**❌ Negative (java)**

```java
void handle(PartnerOrderMessage message) {
  Order order = new Order();
  order.setId(message.orderNo());
  order.setTotal(message.amountCents()); // local code now depends on partner units
  order.setCountry(message.shipTo().countryCode());
  orderService.place(order);
}
```

**✅ Positive (java)**

```java
final class PartnerOrderTranslator {
  CanonicalOrderSubmitted translate(PartnerOrderMessage source) {
    return new CanonicalOrderSubmitted(
      OrderId.of(source.orderNo()),
      Money.ofMinorUnits(source.currency(), source.amountCents()),
      CountryCode.of(source.shipTo().countryCode()),
      source.schemaVersion()
    );
  }
}

void handle(PartnerOrderMessage message) {
  orderService.place(translator.translate(message));
}
```

*The positive version confines partner-specific names, units, and versions to a boundary translator. The core service receives a stable canonical command with domain-specific types.*

## Relationships

**Synergies**

- [Canonical Data Model](../enterprise-integration/canonical-data-model.md) — Translators map source-specific messages into and out of the canonical model.
- [Message Endpoint](../enterprise-integration/message-endpoint.md) — Endpoints often include boundary translation between broker messages and local application commands.
- [Content-Based Router](../enterprise-integration/content-based-router.md) — Routers should evaluate normalised fields after translation rather than source-specific formats.
- [Anti-Corruption Layer](../cloud-distributed/anti-corruption-layer.md) — A translator is one of the concrete mechanisms used to keep foreign models out of a domain.

**Conflicts with:** [Shared Kernel](../ddd-strategic/shared-kernel.md)

**Alternatives:** [Adapter](../gof-structural/adapter.md), [Mapper](../enterprise-application/mapper.md), [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** spring-boot, nodejs, dotnet, kafka
- **Project types:** microservices, distributed-system, backend-service, etl
- **Tags:** eip, transformation, schema, anti-corruption

## References

- [Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageTranslator.html)

