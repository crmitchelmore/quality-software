# Iterator

> Provide a uniform way to traverse elements of a collection without exposing the collection's internal representation.

**Scale:** design · **Altitude:** low · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Cursor, Enumerator

## Description

Iterator separates traversal from storage. A collection supplies an object or generator that yields elements in a defined order while hiding whether the data lives in an array, tree, paged API, database cursor, or composite structure. This lets client code use a stable traversal protocol and lets collections offer multiple traversals, such as depth-first, breadth-first, filtered, or paginated, without leaking internal fields.

**Problem.** Client code reaches into collection internals to loop over data, coupling itself to representation and duplicating traversal logic.

**Context.** Use when a collection has non-trivial traversal, may change representation, or should expose multiple traversal orders. Also use when streaming or pagination means callers should not materialise the whole collection at once.

## Consequences / Trade-offs

- Encapsulates representation and traversal order behind a stable protocol.
- Supports lazy traversal of large or remote data sets when implemented as generators or cursors.
- Concurrent mutation during iteration needs an explicit policy: snapshot, fail-fast, or weak consistency.
- An iterator can hide expensive I/O, so document whether iteration is in-memory, streaming, or remote.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Built into most languages and cheap to use; ideal whenever callers should not know collection internals. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for libraries, SDKs, and services that stream or page results while preserving a simple traversal contract. |
| Large (>100k LOC) | ●●●●○ 4/5 | Remains useful at scale, especially for APIs and data pipelines, but needs clear performance and consistency semantics. |

## Examples

### Traversing a tree without exposing nodes

**❌ Negative (typescript)**

```typescript
class MenuNode {
  constructor(public label: string, public children: MenuNode[] = []) {}
}

function render(menu: MenuNode): string[] {
  const labels: string[] = [];
  labels.push(menu.label);
  for (const child of menu.children) {
    labels.push(child.label);
    for (const grandChild of child.children) {
      labels.push(grandChild.label);
    }
  }
  return labels;
}
```

**✅ Positive (typescript)**

```typescript
class MenuNode {
  constructor(private readonly label: string, private readonly children: MenuNode[] = []) {}

  *depthFirst(): IterableIterator<string> {
    yield this.label;
    for (const child of this.children) {
      yield* child.depthFirst();
    }
  }
}

function render(menu: MenuNode): string[] {
  return [...menu.depthFirst()];
}
```

*The positive version keeps child storage private and makes traversal a named operation. Rendering no longer assumes a fixed tree depth or array-backed implementation.*

## Relationships

**Synergies**

- [Composite](../gof-structural/composite.md) — Iterators provide uniform traversal over tree-shaped composites without exposing child storage.
- [Pagination](../api-design/pagination.md) — Paginated APIs expose an iterator-like contract over remote pages.
- [Lazy Evaluation](../functional/lazy-evaluation.md) — Lazy iterators defer work until the caller pulls the next item.
- [Repository](../data-persistence/repository.md) — Repositories can return iterable result sets while hiding database cursor details.

**Alternatives:** [Visitor](../gof-behavioural/visitor.md), [Map-Filter-Reduce](../functional/map-filter-reduce.md), [Query Object](../enterprise-application/query-object.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, javascript, python, java, csharp
- **Frameworks:** none, nodejs, dotnet, spring-boot
- **Project types:** library, sdk, backend-service, data-pipeline, cli-tool
- **Tags:** traversal, collections, lazy, encapsulation

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

