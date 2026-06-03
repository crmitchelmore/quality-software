# Event Emitter (Pub-Sub in-process)

> Let components publish named in-process events to registered listeners without directly calling every interested collaborator.

**Scale:** design · **Altitude:** low · **Category:** implementation · **Maturity:** established

**Also known as:** In-Process Pub-Sub, Event Dispatcher

## Description

Event Emitter decouples a local producer from local subscribers through named events and callback registration. It is useful for UI widgets, plugin hooks, and modular extension points inside one process. It is not a durable messaging system: listener order, error handling, and delivery guarantees are usually simple and must be documented if correctness depends on them.

**Problem.** A component that directly calls every side-effecting collaborator becomes coupled to optional behaviours and extension points.

**Context.** Use for in-process notifications where listeners are local, fast, and non-critical or where failures can be handled synchronously.

## Consequences / Trade-offs

- Decouples publishers from optional subscribers and plugin hooks.
- Allows multiple local reactions without changing the publisher.
- Can obscure control flow and make listener failures surprising.
- Does not provide persistence, retries, backpressure, or cross-process delivery.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Handy for UI and plugin hooks, but direct calls are clearer for one listener. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for modular in-process extension points with documented listener behaviour. |
| Large (>100k LOC) | ●●●○○ 3/5 | Use carefully; critical workflows often need durable messaging instead. |

## Examples

### Local extension point

**❌ Negative (typescript)**

```typescript
class UploadService {
  async upload(file: File) {
    const result = await storage.save(file);
    await thumbnailer.create(result.id);
    await analytics.track('uploaded', result.id);
    await cache.invalidate('uploads');
    return result;
  }
}
```

**✅ Positive (typescript)**

```typescript
class UploadService {
  constructor(private readonly events: EventEmitter) {}

  async upload(file: File) {
    const result = await storage.save(file);
    this.events.emit('upload.saved', { id: result.id });
    return result;
  }
}

events.on('upload.saved', event => thumbnailer.create(event.id));
events.on('upload.saved', event => analytics.track('uploaded', event.id));
```

*The positive version keeps upload persistence independent from optional local reactions, so new subscribers can be added without editing UploadService.*

## Relationships

**Synergies**

- [Observer](../gof-behavioural/observer.md) — Event Emitter is a named-event variant of Observer for in-process callbacks.
- [Inversion of Control](../implementation/inversion-of-control.md) — Subscribers invert control by registering callbacks that the emitter invokes later.
- [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md) — Publish-Subscribe Channel is the distributed/integration form with brokered delivery semantics.
- [Domain Event](../ddd-tactical/domain-event.md) — Domain events can be dispatched in-process before being promoted to durable integration events.

**Conflicts with:** [Request-Reply](../enterprise-integration/request-reply.md)

**Alternatives:** [Observer](../gof-behavioural/observer.md), [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md), [Message Bus](../enterprise-integration/message-bus.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, csharp
- **Frameworks:** nodejs, react, dotnet, none
- **Project types:** web-frontend, backend-service, desktop-app, library, sdk
- **Tags:** events, callbacks, decoupling

## References

- OpenJS Foundation, Node.js Events API

