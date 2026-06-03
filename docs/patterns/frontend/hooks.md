# Hooks

> Encapsulate reusable stateful behaviour in functions that compose directly inside components without wrapper components or inheritance.

**Scale:** frontend · **Altitude:** low · **Category:** frontend · **Maturity:** established

**Also known as:** Composable Hooks, Custom Hooks

## Description

Hooks are framework-supported functions for declaring state, effects, subscriptions and derived behaviour inside component execution. Custom hooks package a coherent behaviour behind an intention-revealing API, such as useBasket or useDebouncedValue. Good hooks hide effect lifecycles and cleanup, return domain-shaped values, and avoid becoming global service locators. They are a composition tool, not a licence to scatter side effects across every view.

**Problem.** Stateful UI behaviour is duplicated or forced through HOCs, mixins and render props, producing wrapper trees and unclear ownership of effects.

**Context.** Use in modern React and similar reactive frameworks when behaviour belongs to a component lifecycle but should be reused across views or tested separately.

## Consequences / Trade-offs

- Removes wrapper layers and colocates stateful behaviour with the component that needs it.
- Custom hooks create small, testable units for subscriptions, forms, media queries and async workflows.
- Dependency arrays and stale closures can cause subtle bugs without linting and disciplined APIs.
- Overuse can hide data dependencies and make components perform too many effects.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Excellent for avoiding duplicated effects, though tiny components should not extract hooks prematurely. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong default for shared behaviour across features when paired with linting and clear naming. |
| Large (>100k LOC) | ●●●●○ 4/5 | Very valuable, but large systems need conventions to prevent hooks from becoming hidden global orchestration layers. |

## Examples

### Extracting debounced search state

**❌ Negative (typescript)**

```typescript
function ProductSearch() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(query), 250);
    return () => window.clearTimeout(id);
  }, [query]);
  const results = useProducts(debounced);
  return <SearchBox value={query} onChange={setQuery} results={results} />;
}
```

**✅ Positive (typescript)**

```typescript
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function ProductSearch() {
  const [query, setQuery] = useState("");
  const results = useProducts(useDebouncedValue(query, 250));
  return <SearchBox value={query} onChange={setQuery} results={results} />;
}
```

*The hook gives debouncing one lifecycle-correct implementation while ProductSearch stays focused on product search, not timer cleanup.*

## Relationships

**Synergies**

- [Component-Based UI](../frontend/component-based-ui.md) — Hooks keep reusable behaviour out of component markup while preserving component composition.
- [Higher-Order Component](../frontend/higher-order-component.md) — Hooks often replace HOCs; legacy HOCs can delegate to hooks internally.
- [Render Props](../frontend/render-props.md) — Render-prop components can expose hook-powered behaviour to consumers that need rendering inversion.
- [Observer](../gof-behavioural/observer.md) — Subscription hooks are a lightweight observer boundary between external stores and components.

**Alternatives:** [Higher-Order Component](../frontend/higher-order-component.md), [Render Props](../frontend/render-props.md), [Container / Presentational](../frontend/container-presentational.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react, vue, solidjs, svelte
- **Project types:** web-frontend, mobile-app, library
- **Tags:** composition, stateful-behaviour, effects

## References

- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

