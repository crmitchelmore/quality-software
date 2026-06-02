# Flux

> Organise UI state changes as a one-way flow from actions through a dispatcher into stores, with views observing store updates.

**Scale:** frontend · **Category:** frontend · **Maturity:** established

## Description

Flux is an architectural state-management pattern introduced to make complex client-side interactions predictable. User or network events become actions, actions are dispatched centrally, stores update their state, and views re-render from those stores. The important property is unidirectional flow: state changes have a single route through the system rather than arbitrary two-way mutation between views and models.

**Problem.** Rich frontends with many dependent views can develop cyclic updates where one component mutates shared state and another reacts unpredictably.

**Context.** Use when client state is shared by multiple views, updates must be auditable, and teams need a simple mental model for how UI changes propagate.

## Consequences / Trade-offs

- Makes update paths explicit and easier to debug.
- Stores become the authoritative source for shared UI state.
- Boilerplate can be high compared with local component state.
- A single dispatcher is less common today, but the one-way flow remains influential.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too much structure for small apps with mostly local state. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Helpful when several features share state, though Redux or framework stores are usually more practical than classic Flux. |
| Large (>100k LOC) | ●●●●○ 4/5 | The unidirectional model remains valuable for large clients, especially where auditability and debugging matter. |

## Examples

### Replacing peer mutation with actions and a store

**❌ Negative (typescript)**

```typescript
function TodoItem({ todo }: { todo: Todo }) {
  return <input checked={todo.done} onChange={() => {
    todo.done = !todo.done;
    window.dispatchEvent(new Event("todos-changed"));
  }} />;
}
```

**✅ Positive (typescript)**

```typescript
type Action = { type: "todo/toggled"; id: string };

const todoStore = createTodoStore();
const dispatcher = createDispatcher<Action>();
dispatcher.register(action => {
  if (action.type === "todo/toggled") todoStore.toggle(action.id);
});

function TodoItem({ todo }: { todo: Todo }) {
  return <input checked={todo.done} onChange={() => dispatcher.dispatch({ type: "todo/toggled", id: todo.id })} />;
}
```

*The positive version routes changes through a named action and store, giving all views a consistent update path instead of mutating shared objects directly.*

## Relationships

**Synergies**

- [Redux (Unidirectional Store)](../frontend/redux-pattern.md) — Redux is a disciplined Flux derivative with reducers, immutable updates and strong tooling.
- [Observer](../gof-behavioural/observer.md) — Views observe store changes and re-render when the store publishes a new snapshot.
- [Command](../gof-behavioural/command.md) — Actions are command-like records of intended state changes.
- [Component-Based UI](../frontend/component-based-ui.md) — Components render snapshots and send actions rather than mutating peers directly.

**Alternatives:** [Model-View-ViewModel (MVVM)](../frontend/model-view-viewmodel.md), [Model-View-Controller (MVC)](../architecture/model-view-controller.md), [State Machine UI](../frontend/state-machine-ui.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react, vue, angular, redux
- **Project types:** web-frontend, mobile-app
- **Tags:** unidirectional-data-flow, shared-state, stores

## References

- [Flux Application Architecture](https://facebookarchive.github.io/flux/docs/in-depth-overview)

