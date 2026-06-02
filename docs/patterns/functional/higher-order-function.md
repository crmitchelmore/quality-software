# Higher-Order Function

> Accept functions as inputs or return functions as outputs to parameterise behaviour without inheritance or conditionals.

**Scale:** implementation · **Category:** functional · **Maturity:** time-tested

**Also known as:** Function as Argument, Function Factory

## Description

A Higher-Order Function treats behaviour as a first-class value. It can abstract traversal, resource handling, retry policy, validation, or transformation while the caller supplies the varying operation. This is the functional counterpart to many small strategy objects, and it is often simpler when no mutable strategy state is required.

**Problem.** Reusable control flow becomes duplicated because only one step varies, or classes are introduced merely to pass a single method around.

**Context.** Use in languages with first-class functions for callbacks, collection operations, decorators, middleware, resource scopes, and small policy seams.

## Consequences / Trade-offs

- Removes boilerplate classes for behaviour that fits in a function.
- Centralises control flow while leaving the variable step explicit at the call site.
- Can become hard to read if anonymous functions are deeply nested.
- Captured variables need the same care as any closure over mutable state.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | A core idiom in modern languages; usually the simplest abstraction for small behaviour seams. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for libraries, callbacks, and policy injection. |
| Large (>100k LOC) | ●●●●○ 4/5 | Still strong, but name important functions; avoid anonymous callback mazes in critical flows. |

## Examples

### Retrying an operation

**❌ Negative (typescript)**

```typescript
async function fetchUser(id: string): Promise<User> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await httpUser(id);
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
  throw new Error("unreachable");
}

async function fetchOrder(id: string): Promise<Order> {
  // same retry loop copied again
  return httpOrder(id);
}
```

**✅ Positive (typescript)**

```typescript
async function withRetry<T>(operation: () => Promise<T>, attempts = 3): Promise<T> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === attempts - 1) throw error;
    }
  }
  throw new Error("unreachable");
}

const user = await withRetry(() => httpUser(id));
const order = await withRetry(() => httpOrder(id));
```

*The positive version abstracts the invariant retry control flow and supplies only the operation that varies, avoiding duplicated loops or one-method classes.*

## Relationships

**Synergies**

- [Strategy](../gof-behavioural/strategy.md) — A higher-order function is often a lightweight strategy when behaviour has no identity or lifecycle.
- [Function Composition](../functional/function-composition.md) — Functions returned by higher-order helpers can be composed into larger behaviours.
- [Currying](../functional/currying.md) — Curried functions are higher-order functions that return the next argument stage.
- [Middleware Pipeline](../implementation/middleware-pipeline.md) — Middleware chains are higher-order functions around request handlers.

**Alternatives:** [Strategy](../gof-behavioural/strategy.md), [Template Method](../gof-behavioural/template-method.md), [Command](../gof-behavioural/command.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, javascript, python, scala, haskell, clojure
- **Frameworks:** none, react, rxjs, express
- **Project types:** library, web-frontend, web-api, backend-service
- **Tags:** first-class-functions, callbacks, behaviour-parameterisation

## References

- John Hughes, Higher-order functions, (1989)

