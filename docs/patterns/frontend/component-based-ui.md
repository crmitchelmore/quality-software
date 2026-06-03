# Component-Based UI

> Build interfaces from encapsulated, composable units that own their rendering contract and, where appropriate, local behaviour.

**Scale:** frontend · **Altitude:** medium · **Category:** frontend · **Maturity:** established

**Also known as:** Component Architecture, Component-Oriented UI

## Description

Component-Based UI decomposes screens into reusable elements with explicit inputs and outputs. A component should hide its markup, styling and small interaction details behind a stable contract while delegating shared state, routing and data loading to surrounding application layers. The pattern works best when components are cohesive, named after user concepts, and composed into larger features rather than treated as a dumping ground for every concern on a page.

**Problem.** Page-sized templates and controllers accumulate unrelated markup, state changes and event handlers, making UI changes risky and reuse accidental.

**Context.** Use for web frontends with repeated interaction patterns, multiple teams contributing to shared surfaces, or design systems that need durable contracts across React, Vue, Angular, Svelte or similar frameworks.

## Consequences / Trade-offs

- Improves reuse, testability and visual consistency by giving each UI unit a clear boundary.
- Supports incremental delivery because features can be assembled from stable primitives.
- Can create prop-drilling, wrapper-heavy trees and fragmented ownership when component boundaries are too small.
- Requires discipline around public props, accessibility and state ownership.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | A good default even for small apps, provided components map to real UI concepts rather than every div becoming a component. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent once shared screens and teams appear; component boundaries keep feature work from trampling design-system details. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large frontends, though governance around ownership, versioning and accessibility becomes as important as the code structure. |

## Examples

### Extracting a product card boundary

**❌ Negative (typescript)**

```typescript
export function ProductGrid({ products, onBuy }: Props) {
  return <div className="grid">
    {products.map(product => <div className="card" key={product.id}>
      <img alt="" src={product.imageUrl} />
      <h2>{product.name}</h2>
      <p>{new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(product.price)}</p>
      <button disabled={!product.inStock} onClick={() => onBuy(product.id)}>
        {product.inStock ? "Add" : "Sold out"}
      </button>
    </div>)}
  </div>;
}
```

**✅ Positive (typescript)**

```typescript
type ProductCardProps = {
  product: ProductSummary;
  onBuy(productId: string): void;
};

function ProductCard({ product, onBuy }: ProductCardProps) {
  const price = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(product.price);
  return <article className="card">
    <img alt="" src={product.imageUrl} />
    <h2>{product.name}</h2>
    <p>{price}</p>
    <button disabled={!product.inStock} onClick={() => onBuy(product.id)}>
      {product.inStock ? "Add" : "Sold out"}
    </button>
  </article>;
}

export function ProductGrid({ products, onBuy }: Props) {
  return <div className="grid">
    {products.map(product => <ProductCard key={product.id} product={product} onBuy={onBuy} />)}
  </div>;
}
```

*The positive version gives product presentation a named contract, making layout reuse, accessibility review and visual tests possible without editing the grid orchestration.*

## Relationships

**Synergies**

- [Atomic Design](../frontend/atomic-design.md) — Atomic Design gives a naming and composition hierarchy for component libraries.
- [Container / Presentational](../frontend/container-presentational.md) — Separating data-aware containers from view components keeps component contracts shallow.
- [Hooks](../frontend/hooks.md) — Hooks extract reusable behaviour without forcing every component through inheritance or wrapper layers.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Template View](../enterprise-application/template-view.md), [Model-View-Controller (MVC)](../architecture/model-view-controller.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react, vue, angular, svelte, solidjs
- **Project types:** web-frontend, mobile-app, desktop-app
- **Tags:** composition, encapsulation, design-system

## References

- [React Components and Props](https://react.dev/learn/your-first-component)
- [Vue Component Basics](https://vuejs.org/guide/essentials/component-basics.html)

