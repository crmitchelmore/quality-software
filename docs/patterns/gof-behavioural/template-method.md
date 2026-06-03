# Template Method

> Define the invariant skeleton of an algorithm in a base type while allowing subclasses to override selected steps.

**Scale:** design · **Altitude:** low · **Category:** gof-behavioural · **Maturity:** time-tested

**Also known as:** Skeleton Method

## Description

Template Method captures a stable algorithm sequence in one method and delegates variable steps to protected hooks or abstract operations. It is useful when the order, error handling, resource management, or transaction boundary must remain consistent across variants. Because it relies on inheritance, it should be used deliberately: keep the template small, make required hooks explicit, and avoid exposing broad base-class state that subclasses can misuse.

**Problem.** Several operations share the same sequence but duplicate the orchestration, causing subtle differences in validation, cleanup, metrics, or error handling.

**Context.** Use in frameworks, test fixtures, import/export pipelines, and application services where an invariant workflow should be reused while selected steps vary. Prefer Strategy when algorithm variants need runtime composition rather than inheritance.

## Consequences / Trade-offs

- Centralises invariant ordering, cleanup, and cross-cutting behaviour in one algorithm skeleton.
- Makes extension points explicit through abstract steps and hooks.
- Inheritance couples subclasses to the base class lifecycle and can lead to fragile base-class problems.
- Runtime swapping is awkward compared with composition-based Strategy.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too much inheritance for small code unless authoring a mini-framework or test harness. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational when a stable skeleton has several variants; prefer Strategy if variants need runtime selection. |
| Large (>100k LOC) | ●●●○○ 3/5 | Useful for framework-like extension points, but large systems should guard against fragile base classes and hidden subclass coupling. |

## Examples

### Import job skeleton

**❌ Negative (typescript)**

```typescript
class CsvCustomerImport {
  async run(file: string): Promise<void> {
    console.log("starting");
    const rows = await readCsv(file);
    for (const row of rows) await saveCustomer(row);
    console.log("finished");
  }
}

class CsvProductImport {
  async run(file: string): Promise<void> {
    const rows = await readCsv(file);
    for (const row of rows) await saveProduct(row);
    console.log("done");
  }
}
```

**✅ Positive (typescript)**

```typescript
abstract class ImportJob<T> {
  async run(file: string): Promise<void> {
    console.log("starting import");
    const records = await this.parse(file);
    for (const record of records) {
      await this.persist(record);
    }
    console.log("finished import");
  }

  protected abstract parse(file: string): Promise<T[]>;
  protected abstract persist(record: T): Promise<void>;
}

class CustomerImport extends ImportJob<CustomerRow> {
  protected parse(file: string): Promise<CustomerRow[]> {
    return readCsv(file);
  }

  protected persist(record: CustomerRow): Promise<void> {
    return saveCustomer(record);
  }
}
```

*The positive version guarantees consistent logging and iteration for every import job while leaving parsing and persistence as explicit subclass steps.*

## Relationships

**Synergies**

- [Strategy](../gof-behavioural/strategy.md) — Strategy is the composition-based alternative when variable steps should be injected rather than inherited.
- [Composition over Inheritance](../implementation/composition-over-inheritance.md) — Composition over Inheritance is the pressure-release valve when a template hierarchy becomes too rigid.
- [Dependency Injection](../implementation/dependency-injection.md) — A template can inject collaborators for shared steps while subclasses customise only domain-specific steps.
- [Guard Clause (Early Return)](../implementation/guard-clause.md) — Templates often enforce preconditions up front before calling variable subclass steps.

**Conflicts with:** [Strategy](../gof-behavioural/strategy.md)

**Alternatives:** [Strategy](../gof-behavioural/strategy.md), [Composition over Inheritance](../implementation/composition-over-inheritance.md), [Chain of Responsibility](../gof-behavioural/chain-of-responsibility.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** none, spring-boot, dotnet, django
- **Project types:** library, backend-service, cli-tool, data-pipeline, modular-monolith
- **Tags:** inheritance, algorithm-skeleton, hooks, reuse

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

