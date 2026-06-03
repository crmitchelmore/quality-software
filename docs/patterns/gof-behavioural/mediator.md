# Mediator

> Centralise complex collaboration between peer objects in a mediator so peers do not depend on each other directly.

**Scale:** design · **Altitude:** low · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Coordinator, Controller Object

## Description

Mediator introduces a coordinating object that knows how colleagues interact, while each colleague knows only the mediator interface. It is most useful when a set of components has many-to-many communication, ordering rules, or consistency checks that would otherwise be duplicated across peers. The mediator should express a real workflow or policy; if it merely forwards every method call it becomes a god object and hides dependencies rather than simplifying them.

**Problem.** Peer components call and update each other directly, creating a dense dependency graph where a small change in one component ripples through many others.

**Context.** Use in UI forms, domain workflows, module coordination, or in-process messaging where several collaborators must react consistently to each other without knowing concrete peer types.

## Consequences / Trade-offs

- Reduces many-to-many coupling between peers to many-to-one coupling to the mediator.
- Centralises workflow policy and ordering, making it easier to test the collaboration as a whole.
- Can become an unbounded god object if it accumulates unrelated responsibilities.
- Colleagues may become passive if all behaviour is moved into the mediator; keep local invariants local.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often unnecessary in small code; direct collaboration or callbacks are clearer until dependencies become genuinely tangled. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for UI and application workflows with several peers and explicit coordination rules. |
| Large (>100k LOC) | ●●●●○ 4/5 | Useful for reducing coupling across modules, but large systems need bounded mediators per workflow to avoid creating central god objects. |

## Examples

### Checkout form coordination

**❌ Negative (typescript)**

```typescript
class ShippingForm {
  constructor(private readonly payment: PaymentForm, private readonly totals: TotalsPanel) {}

  setCountry(country: string): void {
    this.totals.recalculateForCountry(country);
    this.payment.requirePostalCode(country !== "IE");
  }
}

class PaymentForm {
  constructor(private readonly shipping: ShippingForm, private readonly totals: TotalsPanel) {}

  setCardType(cardType: string): void {
    this.totals.applyCardFee(cardType);
  }
}

class TotalsPanel {
  recalculateForCountry(country: string): void {}
  applyCardFee(cardType: string): void {}
}
```

**✅ Positive (typescript)**

```typescript
interface CheckoutMediator {
  shippingCountryChanged(country: string): void;
  cardTypeChanged(cardType: string): void;
}

class ShippingForm {
  constructor(private readonly mediator: CheckoutMediator) {}
  setCountry(country: string): void {
    this.mediator.shippingCountryChanged(country);
  }
}

class PaymentForm {
  constructor(private readonly mediator: CheckoutMediator) {}
  requirePostalCode(required: boolean): void {}
  setCardType(cardType: string): void {
    this.mediator.cardTypeChanged(cardType);
  }
}

class TotalsPanel {
  recalculateForCountry(country: string): void {}
  applyCardFee(cardType: string): void {}
}

class CheckoutCoordinator implements CheckoutMediator {
  constructor(private readonly payment: PaymentForm, private readonly totals: TotalsPanel) {}

  shippingCountryChanged(country: string): void {
    this.totals.recalculateForCountry(country);
    this.payment.requirePostalCode(country !== "IE");
  }

  cardTypeChanged(cardType: string): void {
    this.totals.applyCardFee(cardType);
  }
}
```

*The positive version removes direct dependencies between form widgets and centralises checkout coordination in one object with a workflow-shaped interface.*

## Relationships

**Synergies**

- [Observer](../gof-behavioural/observer.md) — Colleagues can notify the mediator via events while the mediator decides coordinated reactions.
- [Command](../gof-behavioural/command.md) — Mediators often dispatch commands to collaborators after validating workflow state.
- [Event Emitter (Pub-Sub in-process)](../implementation/event-emitter.md) — An event emitter is a lightweight mediator for in-process publish/subscribe coordination.
- [Application Controller](../enterprise-application/application-controller.md) — Application controllers mediate screen or use-case flow at an application boundary.

**Conflicts with:** [Service Locator](../implementation/service-locator.md)

**Alternatives:** [Observer](../gof-behavioural/observer.md), [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md), [Message Bus](../enterprise-integration/message-bus.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, react, angular, dotnet, spring-boot
- **Project types:** web-frontend, desktop-app, backend-service, modular-monolith
- **Tags:** coordination, decoupling, workflow, collaboration

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

