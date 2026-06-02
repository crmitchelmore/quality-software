# State

> Represent each state of an object as a separate object so behaviour and allowed transitions vary with the current state without large conditional blocks.

**Scale:** design · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** State Object

## Description

State delegates state-dependent behaviour from a context to an object that represents the current state. Each state object implements the same operations but enforces the rules, side effects, and allowed transitions for one lifecycle phase. The context holds the current state and exposes stable behaviour to clients. This is different from Strategy: strategies are interchangeable algorithms selected by policy, while states model an object's lifecycle and normally transition in response to events.

**Problem.** A lifecycle-rich object accumulates switch statements over status values, and each new status requires editing many methods that must remain consistent.

**Context.** Use when behaviour changes by lifecycle state and transitions are governed by domain rules: orders, tickets, media players, workflow items, sessions, and protocol connections.

## Consequences / Trade-offs

- Localises state-specific rules and transitions, making invalid transitions easier to reject.
- Adds classes and indirection; a simple enum and guard clauses may be enough for tiny lifecycles.
- Transitions become explicit, but scattered transition calls can still be hard to audit without tests or diagrams.
- Persisted state needs careful mapping so stored status and runtime state objects cannot diverge.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for non-trivial lifecycles even in small apps, but overkill for two states with one transition. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for workflow-heavy services where invalid transitions are common production defects. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent when lifecycle rules are shared across teams; pair with diagrams, integration tests, and persistence mapping checks. |

## Examples

### Support ticket lifecycle

**❌ Negative (typescript)**

```typescript
class Ticket {
  status: "open" | "assigned" | "resolved" | "closed" = "open";

  assign(): void {
    if (this.status === "open") this.status = "assigned";
    else throw new Error("cannot assign from " + this.status);
  }

  resolve(): void {
    if (this.status === "assigned") this.status = "resolved";
    else throw new Error("cannot resolve from " + this.status);
  }

  reopen(): void {
    if (this.status === "resolved" || this.status === "closed") this.status = "open";
    else throw new Error("cannot reopen from " + this.status);
  }
}
```

**✅ Positive (typescript)**

```typescript
interface TicketState {
  name: string;
  assign(ticket: Ticket): void;
  resolve(ticket: Ticket): void;
  reopen(ticket: Ticket): void;
}

class Ticket {
  constructor(private state: TicketState = new Open()) {}
  transitionTo(state: TicketState): void { this.state = state; }
  assign(): void { this.state.assign(this); }
  resolve(): void { this.state.resolve(this); }
  reopen(): void { this.state.reopen(this); }
}

class Open implements TicketState {
  name = "open";
  assign(ticket: Ticket): void { ticket.transitionTo(new Assigned()); }
  resolve(): void { throw new Error("assign before resolving"); }
  reopen(): void { throw new Error("already open"); }
}

class Assigned implements TicketState {
  name = "assigned";
  assign(): void { throw new Error("already assigned"); }
  resolve(ticket: Ticket): void { ticket.transitionTo(new Resolved()); }
  reopen(ticket: Ticket): void { ticket.transitionTo(new Open()); }
}

class Resolved implements TicketState {
  name = "resolved";
  assign(): void { throw new Error("resolved"); }
  resolve(): void { throw new Error("already resolved"); }
  reopen(ticket: Ticket): void { ticket.transitionTo(new Open()); }
}
```

*The positive version places each transition rule beside the state it belongs to. Adding Escalated changes the lifecycle by adding a state class and targeted transitions, rather than editing every switch over status.*

## Relationships

**Synergies**

- [Type State](../implementation/type-state.md) — Type State pushes some transition legality into the type system for APIs that can afford stricter modelling.
- [Memento](../gof-behavioural/memento.md) — Mementos can snapshot an object before a state transition for undo or rollback.
- [Domain Event](../ddd-tactical/domain-event.md) — State transitions often emit domain events that describe the lifecycle change.
- [State Machine UI](../frontend/state-machine-ui.md) — UI state machines apply the same lifecycle discipline to frontend interaction states.

**Conflicts with:** [Strategy](../gof-behavioural/strategy.md)

**Alternatives:** [Strategy](../gof-behavioural/strategy.md), [Guard Clause (Early Return)](../implementation/guard-clause.md), [Type State](../implementation/type-state.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, xstate, spring-boot, dotnet
- **Project types:** backend-service, web-api, web-frontend, game, realtime-system
- **Tags:** lifecycle, state-machine, transitions, polymorphism

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

