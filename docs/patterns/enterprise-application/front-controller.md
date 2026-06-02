# Front Controller

> Route all web requests through one controller entry point for shared dispatch, security, and request handling.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Application controller endpoint, Central request controller

## Description

Front Controller puts a single handler in front of web requests. It performs common work such as authentication, locale selection, error handling, command lookup, and dispatch to application controllers or service-layer operations. Modern web frameworks often implement it as a central router or middleware pipeline.

**Problem.** When every page or endpoint handles security, parsing, errors, and dispatch independently, behaviour drifts and cross-cutting changes require edits across many controllers.

**Context.** Use for web applications with many routes that need consistent request preprocessing, authorisation, command dispatch, and error mapping. It is especially useful when routes map to use cases rather than static pages.

## Consequences / Trade-offs

- Centralises cross-cutting request concerns and makes route dispatch consistent.
- Supports middleware, filters, and command lookup before invoking application logic.
- Can become a god object if it contains business logic rather than dispatching to services/controllers.
- Adds unnecessary indirection for very small static or page-specific applications.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Often supplied by the framework; useful but not something to over-design manually. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for consistent web/API request handling across many endpoints. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong fit when combined with middleware and service layers, provided dispatch stays thin and observable. |

## Examples

### Central request dispatch

**❌ Negative (typescript)**

```typescript
app.get("/orders/:id", requireLogin, withErrors(showOrder));
app.post("/orders", requireLogin, withErrors(createOrder));
app.post("/refunds", requireAdmin, withErrors(createRefund));
// Each route repeats security, parsing, and error conventions.
```

**✅ Positive (typescript)**

```typescript
const routes = new Map<string, Handler>([
  ["GET /orders/:id", showOrder],
  ["POST /orders", createOrder],
  ["POST /refunds", createRefund]
]);

app.use(async (req, res) => {
  const user = await authenticate(req);
  const handler = match(routes, req.method, req.path);
  try {
    await handler({ req, res, user });
  } catch (error) {
    renderProblem(res, error);
  }
});
```

*The positive version has one request entry point for authentication, route lookup, and error mapping. Individual handlers can focus on the application operation rather than repeated plumbing.*

## Relationships

**Synergies**

- [Service Layer](../enterprise-application/service-layer.md) — The front controller can route transport-specific requests into service-layer operations.
- [Application Controller](../enterprise-application/application-controller.md) — Application Controller can decide the next action or view after the front controller has normalised the request.
- [Template View](../enterprise-application/template-view.md) — After dispatch, the selected operation can render a Template View consistently.
- [Middleware Pipeline](../implementation/middleware-pipeline.md) — Middleware pipelines are a modern implementation mechanism for front-controller preprocessing.

**Conflicts with:** [Page Controller](../enterprise-application/page-controller.md)

**Alternatives:** [Page Controller](../enterprise-application/page-controller.md), [Model-View-Controller (MVC)](../architecture/model-view-controller.md), [API Gateway](../architecture/api-gateway.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby, php
- **Frameworks:** spring-boot, aspnet, express, django, rails, laravel, jakarta-ee
- **Project types:** web-api, backend-service, monolith, modular-monolith
- **Tags:** web, routing, controller, cross-cutting

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

