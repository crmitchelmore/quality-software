# Model-View-ViewModel (MVVM)

> Bind a view to a view model that exposes display-ready state and commands while shielding the view from domain model and service details.

**Scale:** frontend · **Category:** frontend · **Maturity:** time-tested

**Also known as:** MVVM

## Description

MVVM introduces a view model between the UI and the domain model. The view model adapts domain state into observable, display-ready properties and exposes commands for user intent. The view binds to those properties rather than querying services or mutating models directly. It is strongest in data-binding frameworks and rich forms where validation, derived fields and enablement rules need a testable home outside the template.

**Problem.** Views become packed with formatting, validation and service calls, while domain models are distorted to carry screen-specific state.

**Context.** Use in Angular, Vue, desktop-inspired web apps, mobile clients and complex forms where binding a stable view model to a view reduces template logic.

## Consequences / Trade-offs

- Keeps templates declarative and domain models free of UI-only state.
- View models are easy to test without a browser.
- Two-way binding can obscure update origins if not constrained.
- Additional mapping is unnecessary for simple read-only components.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for complex forms, but extra mapping is unnecessary for simple components. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for data-heavy frontends where view state deserves explicit tests. |
| Large (>100k LOC) | ●●●●○ 4/5 | Scales well with disciplined binding and view-model ownership; uncontrolled two-way binding can become difficult to trace. |

## Examples

### Moving form rules into a view model

**❌ Negative (typescript)**

```typescript
@Component({ template: `
  <input [value]="user.firstName" (input)="user.firstName = $any($event.target).value" />
  <button [disabled]="!user.firstName || saving" (click)="save()">Save</button>
` })
export class ProfileComponent {
  user!: User;
  saving = false;
  constructor(private readonly api: ProfileApi) {}
  save() { this.api.save(this.user); }
}
```

**✅ Positive (typescript)**

```typescript
class ProfileViewModel {
  firstName = new BehaviorSubject("");
  saving = new BehaviorSubject(false);
  canSave = combineLatest([this.firstName, this.saving]).pipe(
    map(([name, saving]) => name.trim().length > 0 && !saving),
  );

  constructor(private readonly api: ProfileApi) {}
  async save() {
    this.saving.next(true);
    try { await this.api.save({ firstName: this.firstName.value.trim() }); }
    finally { this.saving.next(false); }
  }
}
```

*The view model owns validation, command enablement and service interaction, so the template binds to display-ready state instead of embedding business rules.*

## Relationships

**Synergies**

- [Observer](../gof-behavioural/observer.md) — View models typically notify bound views when display state changes.
- [Model-View-Controller (MVC)](../architecture/model-view-controller.md) — MVVM solves a similar separation problem but moves presentation state into a bindable model rather than a controller.
- [Command](../gof-behavioural/command.md) — View-model commands represent user intent without exposing services to the view.
- [Container / Presentational](../frontend/container-presentational.md) — A container can build the view model consumed by a presentation component.

**Alternatives:** [Model-View-Presenter (MVP)](../frontend/model-view-presenter.md), [Model-View-Controller (MVC)](../architecture/model-view-controller.md), [Redux (Unidirectional Store)](../frontend/redux-pattern.md)

## Applicability tags

- **Languages:** typescript, javascript, csharp, swift
- **Frameworks:** angular, vue, react, rxjs
- **Project types:** web-frontend, mobile-app, desktop-app
- **Tags:** view-model, data-binding, forms

## References

- John Gossman, Introduction to Model/View/ViewModel pattern for building WPF apps, (2005)

