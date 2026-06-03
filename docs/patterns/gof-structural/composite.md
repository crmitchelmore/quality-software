# Composite

> Treat individual objects and tree-shaped groups uniformly through a shared component interface.

**Scale:** design · **Altitude:** low · **Category:** gof-structural · **Maturity:** time-tested

## Description

Composite models part-whole hierarchies where leaves and containers support the same operations. A composite object contains child components and implements behaviour by coordinating or aggregating those children, while leaves perform the actual primitive work. It fits UI trees, file systems, menus, rules, organisation charts, and expression trees where clients should not care whether they are operating on one item or a nested group.

**Problem.** Client code branches on whether an item is a leaf or a group, duplicating traversal and making recursive structures hard to extend.

**Context.** Use when the domain is naturally hierarchical and operations should apply uniformly to both single items and groups.

## Consequences / Trade-offs

- Simplifies clients by making leaf and container objects interchangeable.
- Localises recursive traversal and aggregation behaviour inside composites.
- Can make invalid operations visible on leaves if the common interface is too broad.
- Deep trees may need attention to performance, cycles, and stack depth.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful when a real hierarchy exists, but avoid imposing it on flat data. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong for UI, rule, menu, and document trees where uniform operations simplify clients. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable for complex hierarchical domains, though traversal performance and broad interfaces need governance. |

## Examples

### Pricing nested order bundles

**❌ Negative (typescript)**

```typescript
type OrderLine = ProductLine | BundleLine;

function total(line: OrderLine): number {
  if (line.kind === "product") return line.price;
  let sum = 0;
  for (const child of line.children) {
    if (child.kind === "product") sum += child.price;
    else sum += total(child);
  }
  return sum;
}
```

**✅ Positive (typescript)**

```typescript
interface PricedItem {
  total(): number;
}

class ProductLine implements PricedItem {
  constructor(private readonly price: number) {}
  total(): number { return this.price; }
}

class BundleLine implements PricedItem {
  constructor(private readonly children: PricedItem[]) {}
  total(): number {
    return this.children.reduce((sum, child) => sum + child.total(), 0);
  }
}

const order: PricedItem = new BundleLine([
  new ProductLine(20),
  new BundleLine([new ProductLine(5), new ProductLine(8)]),
]);
```

*The positive version lets products and bundles answer the same total message. Recursion is owned by BundleLine, so clients do not branch on every structural case.*

## Relationships

**Synergies**

- [Iterator](../gof-behavioural/iterator.md) — Iterator can traverse a composite tree without exposing its internal child structure.
- [Visitor](../gof-behavioural/visitor.md) — Visitor adds new operations over a composite hierarchy without changing every component interface.
- [Decorator](../gof-structural/decorator.md) — Decorators can wrap components uniformly because leaves and composites share an interface.
- [Null Object](../implementation/null-object.md) — A null component can represent an empty subtree without special-case checks.

**Alternatives:** [Visitor](../gof-behavioural/visitor.md), [Chain of Responsibility](../gof-behavioural/chain-of-responsibility.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, python
- **Frameworks:** none, react, angular, vue
- **Project types:** web-frontend, desktop-app, library, game
- **Tags:** tree, hierarchy, recursion

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

