# Model-View-Presenter (MVP)

> Keep a passive view thin by routing user events to a presenter that coordinates model access and updates the view through an interface.

**Scale:** frontend · **Altitude:** medium · **Category:** frontend · **Maturity:** time-tested

**Also known as:** MVP

## Description

Model-View-Presenter separates UI rendering from interaction logic by making the presenter the mediator between a view interface and the model or services. The view forwards events and exposes simple rendering methods; the presenter decides what to load, validate, enable or show. MVP is useful when views are hard to test directly or when UI technology should be replaceable behind a narrow view contract.

**Problem.** Screens mix event handling, service calls and rendering state, making logic difficult to test without a browser or native UI harness.

**Context.** Use for complex screens, legacy UI frameworks, test-heavy frontends or places where presentation logic should be framework-independent.

## Consequences / Trade-offs

- Presenter logic is testable with a fake view.
- The view becomes deliberately passive and technology-specific.
- View interfaces can become chatty if not designed around user outcomes.
- Less idiomatic in modern declarative frameworks than MVVM, hooks or state stores.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too formal for small declarative frontends unless a screen has complex presentation logic. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for legacy or highly tested screens where passive views pay off. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful in long-lived UI platforms, but many large web apps prefer MVVM, Redux or hooks for idiomatic framework integration. |

## Examples

### Presenter behind a passive checkout view

**❌ Negative (typescript)**

```typescript
class CheckoutPage {
  async onSubmit() {
    this.error.textContent = "";
    const result = await checkoutApi.pay(this.form.card.value, this.cart.total);
    if (!result.ok) this.error.textContent = result.message;
    else router.navigate("/thanks");
  }
}
```

**✅ Positive (typescript)**

```typescript
interface CheckoutView {
  cardNumber(): string;
  showError(message: string): void;
  showSuccess(): void;
}

class CheckoutPresenter {
  constructor(private readonly view: CheckoutView, private readonly payments: PaymentService) {}
  async submit(total: Money) {
    const result = await this.payments.pay(this.view.cardNumber(), total);
    result.ok ? this.view.showSuccess() : this.view.showError(result.message);
  }
}
```

*Payment decisions move into a presenter that can be tested with a fake view and fake payment service; the concrete page only adapts DOM events to the interface.*

## Relationships

**Synergies**

- [Observer](../gof-behavioural/observer.md) — Presenters often observe models and push updates to view interfaces.
- [Model-View-Controller (MVC)](../architecture/model-view-controller.md) — MVP is a stricter variant that moves more presentation decisions out of the view/controller boundary.
- [Command](../gof-behavioural/command.md) — Presenter methods expose user intent as explicit operations rather than letting the view call services directly.
- [Adapter](../gof-structural/adapter.md) — A concrete UI view adapts framework events and widgets to the presenter-facing interface.

**Alternatives:** [Model-View-ViewModel (MVVM)](../frontend/model-view-viewmodel.md), [Model-View-Controller (MVC)](../architecture/model-view-controller.md), [Container / Presentational](../frontend/container-presentational.md)

## Applicability tags

- **Languages:** typescript, javascript, csharp, java
- **Frameworks:** angular, react, vue, none
- **Project types:** web-frontend, mobile-app, desktop-app
- **Tags:** passive-view, presenter, testability

## References

- Martin Fowler, GUI Architectures, (2006)

