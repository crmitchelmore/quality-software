# Middleware Pipeline

> Process a request through an ordered chain of small middleware components, each of which can inspect, enrich, short-circuit, or delegate to the next component.

**Scale:** design · **Altitude:** medium · **Category:** implementation · **Maturity:** established

**Also known as:** Interceptor Pipeline, Request Pipeline

## Description

Middleware Pipeline structures cross-cutting request behaviour as a sequence of composable steps. Authentication, logging, correlation IDs, compression, and error handling become independent middleware rather than being embedded in every handler. Ordering is part of the design: a security middleware before routing has different semantics from one after routing.

**Problem.** Cross-cutting request concerns get duplicated across handlers or tangled into a monolithic front controller.

**Context.** Use when a flow has many orthogonal steps that need a consistent order around a core handler.

## Consequences / Trade-offs

- Separates cross-cutting concerns into small reusable components.
- Makes flow ordering explicit and configurable.
- Incorrect order can create subtle security or observability defects.
- Too many tiny middleware steps can make debugging the full path harder.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Very useful in web apps once two or more cross-cutting concerns exist. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent fit for consistent security, logging, and error handling. |
| Large (>100k LOC) | ●●●●○ 4/5 | Powerful but needs pipeline conventions and tests for ordering. |

## Examples

### Request concerns outside handlers

**❌ Negative (typescript)**

```typescript
app.get('/orders', async (req, res) => {
  const started = Date.now();
  if (!req.headers.authorization) {
    res.status(401).send('missing token');
    return;
  }
  try {
    res.json(await orders.list(req.user.id));
  } finally {
    console.log('orders', Date.now() - started);
  }
});
```

**✅ Positive (typescript)**

```typescript
app.use(timingMiddleware);
app.use(authenticationMiddleware);

app.get('/orders', async (req, res) => {
  res.json(await orders.list(req.user.id));
});
```

*The positive version moves timing and authentication into ordered middleware, leaving the route handler focused on the order-listing behaviour.*

## Relationships

**Synergies**

- [Chain of Responsibility](../gof-behavioural/chain-of-responsibility.md) — Middleware is a request-oriented Chain of Responsibility where each link may call the next.
- [Pipes and Filters](../architecture/pipes-and-filters.md) — Both compose ordered processing stages; middleware usually shares request context and can short-circuit.
- [Decorator](../gof-structural/decorator.md) — Middleware decorates a core handler with behaviour before and after invocation.
- [Front Controller](../enterprise-application/front-controller.md) — A front controller often hosts the pipeline before dispatching to handlers.

**Alternatives:** [Chain of Responsibility](../gof-behavioural/chain-of-responsibility.md), [Pipes and Filters](../architecture/pipes-and-filters.md), [Front Controller](../enterprise-application/front-controller.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, csharp, java, python
- **Frameworks:** express, aspnet, fastapi, django, nestjs
- **Project types:** web-api, backend-service, microservices, web-frontend
- **Tags:** request-flow, cross-cutting, composition

## References

- Frank Buschmann, Kevlin Henney, Douglas C. Schmidt, Pattern-Oriented Software Architecture Volume 4, (2007)

