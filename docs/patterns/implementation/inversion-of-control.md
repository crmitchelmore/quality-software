# Inversion of Control

> Let a framework, runtime, or composition root call application code at defined extension points instead of application code controlling every step directly.

**Scale:** design · **Category:** implementation · **Maturity:** time-tested

**Also known as:** IoC, Hollywood Principle

## Description

Inversion of Control reverses the usual direction of control flow. Rather than a module creating collaborators and orchestrating the whole lifecycle, it exposes hooks, handlers, or interfaces that an external orchestrator invokes. The pattern is common in frameworks, plugin systems, DI containers, and event loops: the local code owns a focused decision while the surrounding runtime owns sequencing.

**Problem.** Application code becomes rigid when every module drives construction, scheduling, and lifecycle decisions itself.

**Context.** Use when a stable orchestration mechanism needs to call variable application behaviour through narrow extension points.

## Consequences / Trade-offs

- Enables reusable frameworks and composition roots around specialised business code.
- Separates lifecycle orchestration from local policy decisions.
- Can make execution flow harder to follow because callbacks are invoked externally.
- Debugging requires understanding the container, framework, or event loop contract.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for libraries and frameworks, but direct calls are clearer in tiny codebases. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong fit for web apps, CLIs, and plugin points with repeated lifecycle patterns. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for framework consistency, provided extension points are documented. |

## Examples

### Framework-controlled request handling

**❌ Negative (java)**

```java
public final class Server {
    public void start() {
        var controller = new OrdersController();
        while (true) {
            Request request = readRequest();
            if (request.path().equals("/orders")) {
                controller.list(request);
            }
        }
    }
}
```

**✅ Positive (java)**

```java
public interface Handler {
    Response handle(Request request);
}

public final class OrdersController implements Handler {
    public Response handle(Request request) {
        return Response.ok("orders");
    }
}

router.get("/orders", new OrdersController());
```

*The positive version lets the routing framework own the request loop while the controller contributes one well-defined handler.*

## Relationships

**Synergies**

- [Dependency Injection](../implementation/dependency-injection.md) — DI applies IoC to object construction by giving wiring control to the outside.
- [Template Method](../gof-behavioural/template-method.md) — Template Method inverts control by letting a superclass define the algorithm and subclasses fill hooks.
- [Event Emitter (Pub-Sub in-process)](../implementation/event-emitter.md) — Event emitters invert control from direct calls to subscriber callbacks.
- [Hexagonal Architecture (Ports & Adapters)](../architecture/hexagonal-architecture.md) — Hexagonal systems use IoC at the boundary so adapters drive ports without domain code knowing the transport.

**Conflicts with:** [Service Locator](../implementation/service-locator.md)

**Alternatives:** [Service Locator](../implementation/service-locator.md), [Command](../gof-behavioural/command.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** spring, dotnet, nestjs, django, none
- **Project types:** web-api, backend-service, desktop-app, modular-monolith, library
- **Tags:** lifecycle, framework, callbacks

## References

- Martin Fowler, Inversion of Control Containers and the Dependency Injection pattern, (2004)

