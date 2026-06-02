# Virtual DOM

> Render UI as an in-memory tree and reconcile it with the real DOM so code describes desired output rather than imperative mutations.

**Scale:** frontend · **Category:** frontend · **Maturity:** established

## Description

Virtual DOM uses a lightweight representation of the UI tree to compare previous and next render output, then applies a minimal set of DOM operations. The pattern lets developers express UI as a function of state while the framework handles reconciliation, event binding and batching. It is an implementation strategy rather than an application architecture, and it has trade-offs compared with compile-time reactivity or fine-grained signals.

**Problem.** Manual DOM updates scatter mutation logic across event handlers and easily leave the screen inconsistent with application state.

**Context.** Use through frameworks such as React or Vue when declarative rendering, component composition and predictable state-to-view updates matter more than the absolute lowest runtime overhead.

## Consequences / Trade-offs

- Simplifies mental model by treating render output as derived from state.
- Enables batching, diffing and component-level abstraction.
- Large trees can still be expensive without memoisation, keys and sensible state boundaries.
- Not always faster than direct DOM or compiled reactive approaches.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Helpful when already using React or Vue, but unnecessary for very small static pages. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | A strong fit for complex component trees where declarative rendering improves correctness. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at scale with profiling and memoisation; uncontrolled global renders can become costly. |

## Examples

### Declaring output instead of patching the DOM by hand

**❌ Negative (typescript)**

```typescript
function setUnread(count: number) {
  const badge = document.querySelector("#unread")!;
  badge.textContent = String(count);
  badge.classList.toggle("hidden", count === 0);
  document.title = count > 0 ? `(${count}) Inbox` : "Inbox";
}
```

**✅ Positive (typescript)**

```typescript
function InboxBadge({ unread }: { unread: number }) {
  useEffect(() => {
    document.title = unread > 0 ? `(${unread}) Inbox` : "Inbox";
  }, [unread]);

  return <span id="unread" hidden={unread === 0}>{unread}</span>;
}
```

*The component declares how the badge should look for a given state; reconciliation updates the DOM consistently rather than relying on scattered imperative patches.*

## Relationships

**Synergies**

- [Component-Based UI](../frontend/component-based-ui.md) — Components produce virtual tree fragments that are composed and reconciled by the framework.
- [Immutability](../functional/immutability.md) — Immutable state changes make it easier to decide when virtual subtrees should re-render.
- [Observer](../gof-behavioural/observer.md) — State subscriptions trigger new render passes that the virtual DOM reconciles.

**Alternatives:** [Observer](../gof-behavioural/observer.md), [Template View](../enterprise-application/template-view.md), [Flyweight](../gof-structural/flyweight.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react, vue
- **Project types:** web-frontend, mobile-app, desktop-app
- **Tags:** reconciliation, declarative-rendering, dom

## References

- [React Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html)

