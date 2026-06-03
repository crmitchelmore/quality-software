# Decorator

> Add responsibilities to an object by wrapping it with another object that implements the same interface and delegates to the wrapped component.

**Scale:** design · **Altitude:** low · **Category:** gof-structural · **Maturity:** time-tested

**Also known as:** Wrapper

## Description

Decorator composes behaviour at object level. Each decorator has the same interface as the component it wraps, performs work before or after delegation, and can be stacked with other decorators. It is a precise alternative to subclassing for cross-cutting or optional features such as caching, logging, retries, validation, compression, and access control.

**Problem.** Optional behaviours are implemented through inheritance or flags, causing subclass explosion and tangled conditional logic.

**Context.** Use when responsibilities must be combined independently and clients should continue to see the original interface.

## Consequences / Trade-offs

- Adds behaviour without modifying the original component.
- Allows runtime composition and ordering of responsibilities.
- Many nested decorators can make debugging call flow harder.
- Ordering matters; caching outside authorization can produce security bugs.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Good for optional behaviour when an interface already exists; avoid chains for one-off logic. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for composable infrastructure concerns such as caching, logging, validation, and resilience. |
| Large (>100k LOC) | ●●●●● 5/5 | Scales well across teams when decorator ordering is documented and assembled at the composition root. |

## Examples

### Caching product lookups

**❌ Negative (typescript)**

```typescript
class ProductService {
  private cache = new Map<string, Product>();
  constructor(private readonly api: ProductApi, private readonly enableCache: boolean) {}

  async bySku(sku: string): Promise<Product> {
    if (this.enableCache && this.cache.has(sku)) return this.cache.get(sku)!;
    const product = await this.api.fetchProduct(sku);
    audit("product fetched", sku);
    if (this.enableCache) this.cache.set(sku, product);
    return product;
  }
}
```

**✅ Positive (typescript)**

```typescript
interface ProductLookup {
  bySku(sku: string): Promise<Product>;
}

class ApiProductLookup implements ProductLookup {
  constructor(private readonly api: ProductApi) {}
  bySku(sku: string): Promise<Product> { return this.api.fetchProduct(sku); }
}

class AuditedProductLookup implements ProductLookup {
  constructor(private readonly inner: ProductLookup) {}
  async bySku(sku: string): Promise<Product> {
    const product = await this.inner.bySku(sku);
    audit("product fetched", sku);
    return product;
  }
}

class CachedProductLookup implements ProductLookup {
  private cache = new Map<string, Product>();
  constructor(private readonly inner: ProductLookup) {}
  async bySku(sku: string): Promise<Product> {
    if (this.cache.has(sku)) return this.cache.get(sku)!;
    const product = await this.inner.bySku(sku);
    this.cache.set(sku, product);
    return product;
  }
}
```

*The positive version separates API access, audit logging, and caching into stackable wrappers. Each responsibility can be tested and ordered deliberately instead of controlled by flags in one class.*

## Relationships

**Synergies**

- [Composition over Inheritance](../implementation/composition-over-inheritance.md) — Decorator replaces subclass combinations with composable wrappers.
- [Proxy](../gof-structural/proxy.md) — Both wrap an object behind the same interface; Proxy controls access while Decorator adds responsibilities.
- [Middleware Pipeline](../implementation/middleware-pipeline.md) — Middleware pipelines are decorator chains over request handlers.
- [Circuit Breaker](../resilience/circuit-breaker.md) — A circuit breaker is often implemented as a decorator around a remote client.

**Alternatives:** [Proxy](../gof-structural/proxy.md), [Chain of Responsibility](../gof-behavioural/chain-of-responsibility.md), [Strategy](../gof-behavioural/strategy.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, nodejs, spring-boot, dotnet
- **Project types:** backend-service, web-api, library, sdk
- **Tags:** composition, wrapping, cross-cutting

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

