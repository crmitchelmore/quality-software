# Builder

> Construct complex objects step by step through a focused builder API, separating validation and assembly from the final immutable product.

**Scale:** design · **Altitude:** low · **Category:** gof-creational · **Maturity:** time-tested

## Description

Builder is useful when an object has many optional parts, construction order matters, or invariants should be checked before the product becomes visible. Instead of passing long constructor argument lists or mutating a partially valid object, callers configure a builder and call build to receive a complete product. A good builder makes required data explicit, applies defaults consistently, and rejects invalid combinations at the boundary.

**Problem.** Constructors with many primitive parameters and optional flags are hard to read, easy to misorder, and often create partially valid objects.

**Context.** Use for complex value objects, requests, test data, or immutable aggregates where construction needs readable options and centralised validation.

## Consequences / Trade-offs

- Makes call sites intention-revealing and avoids telescoping constructors.
- Centralises defaults and invariant checks before producing the object.
- Can hide required fields if the builder is too permissive; type-state or smart constructors can strengthen this.
- Adds an extra type that is wasteful for simple data structures.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational; useful for complex test data or configuration, but excessive for simple constructors. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for immutable objects, SDK clients, and request construction where readability matters. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable for stable APIs and tests across teams, though generated or typed builders may be preferable for very large models. |

## Examples

### Building an HTTP client configuration

**❌ Negative (typescript)**

```typescript
const client = new HttpClient(
  "https://api.example.com",
  5000,
  true,
  undefined,
  3,
  "bearer",
);
```

**✅ Positive (typescript)**

```typescript
class HttpClientBuilder {
  private timeoutMs = 2_000;
  private retries = 0;
  private auth: "none" | "bearer" = "none";

  constructor(private readonly baseUrl: string) {}
  withTimeout(ms: number): this { this.timeoutMs = ms; return this; }
  withRetries(count: number): this { this.retries = count; return this; }
  withBearerAuth(): this { this.auth = "bearer"; return this; }

  build(): HttpClient {
    if (!this.baseUrl.startsWith("https://")) throw new Error("HTTPS required");
    if (this.retries > 0 && this.timeoutMs > 10_000) throw new Error("retry budget too high");
    return new HttpClient({ baseUrl: this.baseUrl, timeoutMs: this.timeoutMs, retries: this.retries, auth: this.auth });
  }
}

const client = new HttpClientBuilder("https://api.example.com")
  .withTimeout(5_000)
  .withRetries(3)
  .withBearerAuth()
  .build();
```

*The positive version names each option, applies defaults, and validates cross-field constraints before the HttpClient exists. The negative version relies on remembering parameter order and permits invalid combinations.*

## Relationships

**Synergies**

- [Fluent Interface](../implementation/fluent-interface.md) — Builders often expose fluent methods to make step-by-step configuration readable.
- [Parameter Object](../implementation/parameter-object.md) — A builder may assemble a parameter object for APIs with many named options.
- [Test Data Builder](../testing/test-data-builder.md) — Test data builders are specialised builders that keep behavioural tests concise.
- [Type State](../implementation/type-state.md) — Type State can encode required build steps so incomplete objects cannot be built.

**Alternatives:** [Factory Method](../gof-creational/factory-method.md), [Smart Constructor](../implementation/smart-constructor.md), [Options Object](../implementation/options-object.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, kotlin, python
- **Frameworks:** none, spring-boot, dotnet
- **Project types:** library, sdk, backend-service, web-api
- **Tags:** construction, readability, invariants

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

