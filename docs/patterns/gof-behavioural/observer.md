# Observer

> Let interested observers subscribe to state changes in a subject so the subject can notify them without knowing their concrete types.

**Scale:** design · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Publish Subscribe, Listener

## Description

Observer defines a one-to-many dependency between a subject and observers. The subject owns the state or event source; observers register callbacks or listener objects and are notified when something relevant changes. This keeps the subject focused on its own invariants while enabling logging, projections, UI updates, cache invalidation, or side effects to be added externally. Robust implementations make subscription lifetimes explicit and define whether notifications are synchronous, asynchronous, ordered, replayed, or best-effort.

**Problem.** A state change must trigger several reactions, but hard-coding those reactions into the subject couples it to unrelated concerns and makes extension risky.

**Context.** Use for in-process events, UI model updates, domain notifications, and extension points where observers can come and go. For cross-process delivery, prefer messaging patterns with durable delivery semantics.

## Consequences / Trade-offs

- Decouples event producers from consumers and supports extension without editing the subject.
- Notification order, error handling, and re-entrancy must be deliberately specified.
- Subscriptions can leak memory or duplicate effects if lifecycle management is weak.
- Synchronous observers can make the subject slow or fragile; asynchronous observers need delivery semantics.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for UI and library extension points, but direct calls are clearer for one or two mandatory reactions. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for modular applications with optional in-process reactions, as long as ordering and error handling are explicit. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at module boundaries, but large systems must avoid invisible event chains and distinguish in-process observers from durable messaging. |

## Examples

### Account status notifications

**❌ Negative (typescript)**

```typescript
class Account {
  constructor(private readonly email: EmailClient, private readonly audit: AuditLog) {}

  suspend(reason: string): void {
    this.status = "suspended";
    this.email.send("account suspended: " + reason);
    this.audit.record("suspended: " + reason);
  }

  private status = "active";
}
```

**✅ Positive (typescript)**

```typescript
type AccountEvent = { type: "suspended"; reason: string };
type AccountObserver = (event: AccountEvent) => void;

class Account {
  private status = "active";
  private readonly observers = new Set<AccountObserver>();

  subscribe(observer: AccountObserver): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  suspend(reason: string): void {
    this.status = "suspended";
    for (const observer of this.observers) {
      observer({ type: "suspended", reason });
    }
  }
}

account.subscribe((event) => email.send("account suspended: " + event.reason));
account.subscribe((event) => audit.record("suspended: " + event.reason));
```

*The positive version keeps Account free of email and audit dependencies while making subscription lifetime explicit through the unsubscribe function.*

## Relationships

**Synergies**

- [Event Emitter (Pub-Sub in-process)](../implementation/event-emitter.md) — Event emitters are the common implementation form for in-process observer registration and dispatch.
- [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md) — Publish-subscribe generalises observer across messaging infrastructure and process boundaries.
- [Domain Event](../ddd-tactical/domain-event.md) — Domain events provide business-level notifications that observers can react to without coupling aggregates.
- [Mediator](../gof-behavioural/mediator.md) — A mediator can observe colleague events and coordinate broader workflow reactions.

**Conflicts with:** [Singleton](../gof-creational/singleton.md)

**Alternatives:** [Mediator](../gof-behavioural/mediator.md), [Message Bus](../enterprise-integration/message-bus.md), [Webhook](../api-design/webhook.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, javascript, java, csharp, python
- **Frameworks:** react, angular, vue, rxjs, nodejs
- **Project types:** web-frontend, backend-service, desktop-app, realtime-system, library
- **Tags:** events, notification, decoupling, subscription

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

