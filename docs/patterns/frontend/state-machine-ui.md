# State Machine UI

> Model UI behaviour as explicit states, events and transitions so only valid screens and interactions are representable.

**Scale:** frontend · **Category:** frontend · **Maturity:** established

## Description

State Machine UI replaces scattered booleans with a finite set of named states and allowed transitions. Loading, editing, submitting, success and failure become mutually exclusive states rather than combinations of flags. Libraries such as XState add hierarchy, guards and effects, but the core pattern is independent: make the UI workflow explicit and drive rendering from the current state.

**Problem.** Complex screens accumulate boolean flags such as loading, saving, error and disabled that combine into invalid or untested states.

**Context.** Use for wizards, checkout, authentication, uploads, optimistic interactions and any UI workflow where valid transitions matter more than ad hoc state updates.

## Consequences / Trade-offs

- Invalid UI states become harder or impossible to represent.
- Transition diagrams improve shared understanding between design, product and engineering.
- Adds modelling overhead for simple screens.
- Effects must be attached carefully so the machine remains understandable and testable.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational for tricky workflows; avoid modelling every button as a machine. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for forms, wizards and async flows where invalid states have real UX cost. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large, regulated or collaborative frontends where explicit transition models support testing and product discussion. |

## Examples

### Replacing boolean soup with a discriminated state

**❌ Negative (typescript)**

```typescript
type UploadState = {
  uploading: boolean;
  complete: boolean;
  error?: string;
};

if (state.uploading && state.complete) {
  // Which screen should render?
}
```

**✅ Positive (typescript)**

```typescript
type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "failed"; message: string }
  | { status: "complete"; fileUrl: string };

function uploadReducer(state: UploadState, event: UploadEvent): UploadState {
  if (state.status === "idle" && event.type === "started") return { status: "uploading", progress: 0 };
  if (state.status === "uploading" && event.type === "failed") return { status: "failed", message: event.message };
  if (state.status === "uploading" && event.type === "completed") return { status: "complete", fileUrl: event.fileUrl };
  return state;
}
```

*The discriminated union encodes mutually exclusive states, and the reducer documents which events can move the UI between them.*

## Relationships

**Synergies**

- [State](../gof-behavioural/state.md) — The GoF State pattern supplies the underlying idea of behaviour depending on explicit state.
- [Optimistic UI](../frontend/optimistic-ui.md) — Optimistic, confirming, failed and reverted transitions are clearer as a machine than as booleans.
- [Model-View-ViewModel (MVVM)](../frontend/model-view-viewmodel.md) — A view model can expose the current machine state and commands to a bound view.
- [Redux (Unidirectional Store)](../frontend/redux-pattern.md) — Reducers and action logs pair well with explicit event-driven transitions.

**Alternatives:** [Redux (Unidirectional Store)](../frontend/redux-pattern.md), [Model-View-ViewModel (MVVM)](../frontend/model-view-viewmodel.md), [State](../gof-behavioural/state.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** xstate, react, vue, angular, svelte
- **Project types:** web-frontend, mobile-app, realtime-system
- **Tags:** finite-state-machine, workflows, invalid-states

## References

- [XState Docs](https://stately.ai/docs)

