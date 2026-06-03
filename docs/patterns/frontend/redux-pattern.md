# Redux (Unidirectional Store)

> Keep shared client state in a single predictable store updated by pure reducers in response to explicit actions.

**Scale:** frontend · **Altitude:** medium · **Category:** frontend · **Maturity:** established

**Also known as:** Redux, Reducer Store

## Description

Redux refines Flux into a small set of constraints: state is read from a store, changes are described by actions, and reducers compute the next immutable state. Side effects live at the edge in thunks, sagas, observables or query layers. The pattern is valuable when many components need shared state and when replayable action history, time-travel debugging or strict update discipline outweigh the boilerplate.

**Problem.** Complex client state becomes hard to trace when components mutate shared objects, trigger side effects directly and derive data inconsistently.

**Context.** Use for substantial React, Angular or Vue applications with shared state, collaborative teams, offline queues, or workflows where predictable transitions and debugging tools are worth explicit structure.

## Consequences / Trade-offs

- Reducers make state transitions deterministic and testable.
- DevTools, action logs and typed selectors improve operability.
- Boilerplate and indirection are poor fits for local form or purely server-cache state.
- Requires immutability discipline and careful separation of effects from reducers.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often overkill for small apps where local state and server cache solve the problem with less ceremony. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | A good fit when state is shared across routes and debugging predictable transitions pays back the boilerplate. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong for complex workflows and team scale, though large apps should avoid making Redux a dumping ground for all data. |

## Examples

### Moving implicit mutations into a reducer

**❌ Negative (typescript)**

```typescript
const cart: CartState = { lines: [] };

export function addSku(sku: string) {
  const line = cart.lines.find(item => item.sku === sku);
  if (line) line.quantity += 1;
  else cart.lines.push({ sku, quantity: 1 });
}
```

**✅ Positive (typescript)**

```typescript
type CartAction = { type: "cart/itemAdded"; sku: string };
type CartState = { lines: Array<{ sku: string; quantity: number }> };

function cartReducer(state: CartState = { lines: [] }, action: CartAction): CartState {
  if (action.type !== "cart/itemAdded") return state;
  const existing = state.lines.find(line => line.sku === action.sku);
  if (!existing) return { lines: [...state.lines, { sku: action.sku, quantity: 1 }] };
  return {
    lines: state.lines.map(line => line.sku === action.sku ? { ...line, quantity: line.quantity + 1 } : line),
  };
}
```

*The reducer version makes the state transition pure, serialisable and testable, so UI components dispatch intent instead of mutating a shared module variable.*

## Relationships

**Synergies**

- [Flux](../frontend/flux.md) — Redux keeps Flux's unidirectional flow but replaces mutable stores with reducer-driven immutable state.
- [Immutability](../functional/immutability.md) — Immutable updates make reducer outputs predictable and change detection cheap.
- [Command](../gof-behavioural/command.md) — Actions act as serialisable commands that describe user or system intent.
- [Container / Presentational](../frontend/container-presentational.md) — Containers select from the store and dispatch actions while presentational components stay pure.

**Alternatives:** [Flux](../frontend/flux.md), [State Machine UI](../frontend/state-machine-ui.md), [Model-View-ViewModel (MVVM)](../frontend/model-view-viewmodel.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** redux, react, angular, vue, rxjs
- **Project types:** web-frontend, mobile-app, desktop-app
- **Tags:** reducers, immutable-state, devtools

## References

- [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)

