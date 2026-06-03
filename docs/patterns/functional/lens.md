# Lens

> Focus on a nested part of immutable data with composable get and set/update operations.

**Scale:** design · **Altitude:** low · **Category:** functional · **Maturity:** established

**Also known as:** Functional Optic

## Description

A Lens packages two operations for a field or nested path: get the focused value and set or modify it, returning a new outer structure. Lenses compose, so complex immutable updates can be expressed once and reused without hand-written spread/copy code at every call site. They are powerful but introduce abstraction that must be justified by repeated nested updates.

**Problem.** Updating deeply nested immutable structures by hand creates noisy, error-prone copy code that obscures the actual field being changed.

**Context.** Use in functional domains, reducers, AST transformations, configuration editors, and immutable document models with repeated nested reads and updates.

## Consequences / Trade-offs

- Centralises nested access rules and keeps immutable updates concise.
- Composes small field lenses into reusable paths.
- Can be cryptic without library support and team familiarity.
- May hide expensive whole-structure copies unless backed by persistent data structures.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually overkill unless building a library or reducer with repeated nested edits. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Helpful for immutable document/state models, but introduce only with conventions and tests. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable in large functional codebases with deep immutable structures and standard optic libraries. |

## Examples

### Updating nested account settings

**❌ Negative (typescript)**

```typescript
type Account = { profile: { address: { city: string; postcode: string } } };

function move(account: Account, city: string): Account {
  return {
    ...account,
    profile: {
      ...account.profile,
      address: {
        ...account.profile.address,
        city,
      },
    },
  };
}
```

**✅ Positive (typescript)**

```typescript
type Lens<S, A> = {
  get(source: S): A;
  set(value: A, source: S): S;
};

const over = <S, A>(lens: Lens<S, A>, f: (value: A) => A, source: S): S =>
  lens.set(f(lens.get(source)), source);

const cityLens: Lens<Account, string> = {
  get: (account) => account.profile.address.city,
  set: (city, account) => ({
    ...account,
    profile: { ...account.profile, address: { ...account.profile.address, city } },
  }),
};

const moved = over(cityLens, () => "Leeds", account);
```

*The positive version gives the nested path a reusable name; callers update the city without repeating copy mechanics throughout the codebase.*

## Relationships

**Synergies**

- [Immutability](../functional/immutability.md) — Lenses make immutable nested updates practical without abandoning value semantics.
- [Persistent Data Structure](../functional/persistent-data-structure.md) — Structural sharing keeps lens updates efficient for large immutable trees.
- [Function Composition](../functional/function-composition.md) — Lenses compose to focus through multiple layers of data.
- [Value Object](../ddd-tactical/value-object.md) — Lenses preserve value-object replacement semantics instead of mutating internals.

**Alternatives:** [Builder](../gof-creational/builder.md), [Copy-on-Write](../concurrency/copy-on-write.md), [Data Transfer Object (DTO)](../enterprise-application/data-transfer-object.md)

## Applicability tags

- **Languages:** haskell, scala, clojure, typescript, rust
- **Frameworks:** none, redux
- **Project types:** library, web-frontend, data-pipeline, backend-service
- **Tags:** optics, nested-data, immutable-update

## References

- Jeremy Gibbons and Bruno Oliveira, The Essence of the Iterator Pattern, (2009)

