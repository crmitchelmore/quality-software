# Higher-Order Component

> Reuse component behaviour by wrapping a component in a function that returns an enhanced component with additional props or lifecycle wiring.

**Scale:** frontend · **Altitude:** low · **Category:** frontend · **Maturity:** established

**Also known as:** HOC

## Description

A Higher-Order Component is a function from component to component. It centralises cross-cutting UI behaviour such as authorisation gates, analytics, subscriptions or feature flags without modifying the wrapped component. HOCs pre-date hooks in React and remain useful where APIs must decorate components declaratively, but they should preserve prop types, display names and refs carefully to avoid obscuring ownership.

**Problem.** Multiple components need the same subscription or policy logic, and copy-pasting that logic leaks infrastructure concerns into otherwise focused views.

**Context.** Use in React codebases with class components, decorator-style framework APIs, or integration layers that must enhance arbitrary components while leaving their rendering contract intact.

## Consequences / Trade-offs

- Encapsulates cross-cutting concerns without inheritance.
- Can compose policy, data or telemetry around components uniformly.
- Wrapper nesting makes React DevTools and prop flow harder to read.
- Ref forwarding, static hoisting and generic props require care in TypeScript.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Rarely needed in modern small React apps; a hook or explicit component is usually clearer. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for shared policies, legacy class components or framework adapters, but avoid blanket wrapping. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful for platform teams exposing decorators, yet wrapper depth and typing complexity make hooks or composition preferable for feature code. |

## Examples

### Feature flag guard without leaking policy into the view

**❌ Negative (typescript)**

```typescript
function BillingPanel({ account }: { account: Account }) {
  const flags = useFlags();
  if (!flags.newBilling) return null;
  return <section>{account.planName}</section>;
}

function InvoicePanel({ invoice }: { invoice: Invoice }) {
  const flags = useFlags();
  if (!flags.newBilling) return null;
  return <section>{invoice.reference}</section>;
}
```

**✅ Positive (typescript)**

```typescript
function withFeature<P>(flag: string, Component: React.ComponentType<P>) {
  return function FeatureGuard(props: P) {
    const flags = useFlags();
    if (!flags[flag]) return null;
    return <Component {...props} />;
  };
}

function BillingPanel({ account }: { account: Account }) {
  return <section>{account.planName}</section>;
}

export const NewBillingPanel = withFeature("newBilling", BillingPanel);
```

*The positive version isolates the feature-flag policy in one wrapper, so BillingPanel remains a normal presentational component and future guarded panels reuse the same behaviour.*

## Relationships

**Synergies**

- [Component-Based UI](../frontend/component-based-ui.md) — HOCs preserve component contracts while adding reusable behaviour outside the component body.
- [Hooks](../frontend/hooks.md) — Hooks now implement many behaviours that HOCs used to wrap, and can live inside a small HOC adapter for legacy consumers.
- [Decorator](../gof-structural/decorator.md) — Both add responsibilities around an object/component without changing its public rendering role.
- [Proxy](../gof-structural/proxy.md) — Access-control HOCs behave like UI-level proxies that guard rendering and interaction.

**Alternatives:** [Hooks](../frontend/hooks.md), [Render Props](../frontend/render-props.md), [Container / Presentational](../frontend/container-presentational.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react
- **Project types:** web-frontend, mobile-app
- **Tags:** reuse, cross-cutting, wrapping

## References

- [Higher-Order Components](https://legacy.reactjs.org/docs/higher-order-components.html)

