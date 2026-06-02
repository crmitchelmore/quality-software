# Render Props

> Share stateful behaviour through a component prop that is a function, letting the caller decide exactly what UI to render.

**Scale:** frontend · **Category:** frontend · **Maturity:** established

**Also known as:** Function as Child

## Description

Render Props separate reusable behaviour from rendering by passing current state and actions into a function supplied by the consumer. The provider component owns subscriptions, measurements or async status; the caller owns markup. This pattern is especially useful when the consumer needs precise control over layout and semantics, though hooks have replaced it for many same-framework state-sharing cases.

**Problem.** Behaviour needs reuse across different visual treatments, but a wrapper component or HOC would impose unwanted DOM structure or hide data flow.

**Context.** Use when a library component must expose behaviour without prescribing markup, such as animation state, form field registration, drag-and-drop sensors or responsive measurements.

## Consequences / Trade-offs

- Gives consumers full control of DOM, accessibility and composition.
- Makes data flow explicit at the call site.
- Inline render functions can add nesting and unstable identities if misused.
- Hooks are often simpler for application code that does not need component-level inversion of rendering.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually more ceremony than a local hook in small apps unless authoring reusable library components. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for behavioural components where consumers require layout control. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful in shared UI SDKs, but excessive nesting hurts readability and hooks are generally preferred in feature code. |

## Examples

### Reusing mouse position without dictating markup

**❌ Negative (typescript)**

```typescript
function TrackingCard() {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  return <div onMouseMove={event => setPoint({ x: event.clientX, y: event.clientY })}>
    Pointer: {point.x}, {point.y}
  </div>;
}

function TrackingChart() {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  return <svg onMouseMove={event => setPoint({ x: event.clientX, y: event.clientY })} />;
}
```

**✅ Positive (typescript)**

```typescript
function PointerTracker({ children }: { children(point: Point): React.ReactNode }) {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  return <div onMouseMove={event => setPoint({ x: event.clientX, y: event.clientY })}>
    {children(point)}
  </div>;
}

<PointerTracker>
  {point => <output>Pointer: {point.x}, {point.y}</output>}
</PointerTracker>
```

*Pointer tracking is implemented once, but the caller controls the rendered element and accessibility semantics instead of accepting a hard-coded card or wrapper.*

## Relationships

**Synergies**

- [Component-Based UI](../frontend/component-based-ui.md) — Behaviour providers stay reusable while consumer components keep their own visual boundary.
- [Higher-Order Component](../frontend/higher-order-component.md) — Both solve behaviour reuse; render props are often clearer when the caller needs local rendering control.
- [Hooks](../frontend/hooks.md) — A render-prop component can be a compatibility shell around an internal hook.

**Alternatives:** [Hooks](../frontend/hooks.md), [Higher-Order Component](../frontend/higher-order-component.md), [Strategy](../gof-behavioural/strategy.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react
- **Project types:** web-frontend, library, sdk
- **Tags:** inversion-of-control, behaviour-reuse, composition

## References

- [Render Props](https://legacy.reactjs.org/docs/render-props.html)

