# Container / Presentational

> Split UI components that fetch, subscribe or mutate state from components that only render a view from explicit inputs and callbacks.

**Scale:** frontend · **Category:** frontend · **Maturity:** established

**Also known as:** Smart and Dumb Components, Connected and Pure Components

## Description

Container / Presentational separates a feature into data-aware orchestration components and pure rendering components. Containers talk to stores, routers, services and effects; presentational components receive already-shaped props and emit user intent through callbacks. The split is a boundary, not a folder rule: it is valuable when it removes knowledge of transport, state shape or framework subscriptions from reusable UI.

**Problem.** UI components often mix data fetching, global subscriptions, formatting and markup, making them hard to test, reuse or reason about when state sources change.

**Context.** Apply when multiple views share a visual component, when screens depend on stores or remote data, or when teams need stable display components independent from application plumbing.

## Consequences / Trade-offs

- Presentational components become easy to storybook, test and reuse.
- Containers centralise effects and adaptation from domain data to view models.
- Too much splitting can produce pass-through wrappers and prop drilling.
- Modern hooks reduce the need for rigid container hierarchies, but not for separating effects from presentation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when a component is already reused; otherwise the split can be ceremony in a small screen. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for feature teams because state, routing and display can evolve independently. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at scale, but prefer local hooks or typed view-model builders where wrapper stacks become hard to trace. |

## Examples

### Keeping store access out of the reusable view

**❌ Negative (typescript)**

```typescript
function UserMenu() {
  const user = useSelector((state: RootState) => state.session.user);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(logOut())}>
    Signed in as {user.displayName}
  </button>;
}
```

**✅ Positive (typescript)**

```typescript
type UserMenuViewProps = {
  displayName: string;
  onLogOut(): void;
};

function UserMenuView({ displayName, onLogOut }: UserMenuViewProps) {
  return <button onClick={onLogOut}>Signed in as {displayName}</button>;
}

function UserMenuContainer() {
  const displayName = useSelector((state: RootState) => state.session.user.displayName);
  const dispatch = useDispatch();
  return <UserMenuView displayName={displayName} onLogOut={() => dispatch(logOut())} />;
}
```

*The view can now be rendered in tests, documentation and other shells without a Redux provider, while the container owns the state-specific wiring.*

## Relationships

**Synergies**

- [Component-Based UI](../frontend/component-based-ui.md) — Component boundaries make it natural to keep rendering components free of infrastructure knowledge.
- [Redux (Unidirectional Store)](../frontend/redux-pattern.md) — Redux containers can select state and dispatch commands while leaf components remain pure.
- [Model-View-ViewModel (MVVM)](../frontend/model-view-viewmodel.md) — Containers often construct the view model consumed by a presentational view.
- [Hooks](../frontend/hooks.md) — Hooks can hold container logic when a separate wrapper component would only add noise.

**Alternatives:** [Hooks](../frontend/hooks.md), [Render Props](../frontend/render-props.md), [Model-View-Presenter (MVP)](../frontend/model-view-presenter.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react, vue, angular, svelte, redux
- **Project types:** web-frontend, mobile-app
- **Tags:** separation-of-concerns, testability, state-boundaries

## References

- Dan Abramov, Presentational and Container Components, (2015)

