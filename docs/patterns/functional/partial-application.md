# Partial Application

> Create a new function by fixing some arguments of an existing function, leaving the remaining arguments to be supplied later.

**Scale:** implementation · **Category:** functional · **Maturity:** time-tested

**Also known as:** Argument Binding

## Description

Partial Application specialises a general function without changing its implementation. By binding stable inputs such as dependencies, configuration, or a predicate threshold, callers receive a smaller function with a more useful shape. Unlike currying, partial application does not require the original function to be unary at every step.

**Problem.** General functions often require contextual arguments that are constant at a call site, causing repetition and making the real varying input hard to see.

**Context.** Use when adapting a reusable function to a narrower interface: event handlers, collection callbacks, validators, logging helpers, or dependency-bound domain operations.

## Consequences / Trade-offs

- Removes repeated arguments and clarifies what varies at the call site.
- Adapts existing APIs without wrappers full of boilerplate.
- Can hide important configuration if the specialised function is poorly named.
- Binding mutable objects can create surprising behaviour if the captured value changes later.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Low ceremony and often clearer than small adapter classes. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for callbacks, dependency-bound functions, and functional service modules. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful internally, but public APIs should avoid excessive implicit binding that obscures dependencies. |

## Examples

### Binding a logger to an audit helper

**❌ Negative (typescript)**

```typescript
type Logger = { info(message: string, fields: Record<string, string>): void };

function audit(logger: Logger, actor: string, action: string): void {
  logger.info("audit", { actor, action });
}

audit(logger, user.id, "profile.updated");
audit(logger, user.id, "password.changed");
```

**✅ Positive (typescript)**

```typescript
type Logger = { info(message: string, fields: Record<string, string>): void };

function audit(logger: Logger, actor: string, action: string): void {
  logger.info("audit", { actor, action });
}

const auditFor = (logger: Logger, actor: string) =>
  (action: string) => audit(logger, actor, action);

const auditUser = auditFor(logger, user.id);
auditUser("profile.updated");
auditUser("password.changed");
```

*The positive version binds the stable logger and actor once, leaving a small, intention-revealing function for each audited action.*

## Relationships

**Synergies**

- [Currying](../functional/currying.md) — Curried APIs make partial application natural and type-directed.
- [Function Composition](../functional/function-composition.md) — Partially applied functions often have the unary shape needed for composition.
- [Dependency Injection](../implementation/dependency-injection.md) — Dependencies can be supplied once at the composition root, producing pure use-case functions.
- [Higher-Order Function](../functional/higher-order-function.md) — Partial application produces functions that are passed around as values.

**Alternatives:** [Options Object](../implementation/options-object.md), [Parameter Object](../implementation/parameter-object.md), [Factory Method](../gof-creational/factory-method.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, javascript, python, scala, haskell
- **Frameworks:** none, react, nodejs
- **Project types:** library, web-frontend, backend-service, cli-tool
- **Tags:** specialisation, closures, configuration

## References

- Paul Chiusano and Rúnar Bjarnason, Functional Programming in Scala, (2014)

