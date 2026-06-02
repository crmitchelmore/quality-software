# Pure Function

> Write functions whose result depends only on inputs and that produce no observable side effects.

**Scale:** implementation · **Category:** functional · **Maturity:** time-tested

**Also known as:** Referentially Transparent Function

## Description

A Pure Function can be replaced by its returned value without changing program behaviour. It does not read hidden mutable state, mutate arguments, perform I/O, inspect time, or use randomness unless those values are explicit inputs. Purity turns code into deterministic transformations that are easy to test, compose, cache, parallelise, and reason about.

**Problem.** Business rules mixed with I/O, time, global state, or mutation are difficult to test and can behave differently between calls with the same visible inputs.

**Context.** Use for domain calculations, validators, parsers, reducers, mappers, pricing rules, and any logic that can be separated from effects at the boundary.

## Consequences / Trade-offs

- Deterministic tests require no mocks for the pure core.
- Safe to compose, memoize, parallelise, and reorder when dependencies allow.
- Requires effects to be pushed to the edges, which can add plumbing in effect-heavy workflows.
- Absolute purity is impractical at system boundaries; isolate effects rather than pretending they do not exist.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Immediate clarity and testability benefits, even in tiny modules. |
| Medium (≤100k LOC) | ●●●●● 5/5 | A default for domain logic; greatly reduces fixture and mock burden. |
| Large (>100k LOC) | ●●●●○ 4/5 | Highly valuable, but large systems still need disciplined effect boundaries and observability. |

## Examples

### Separating a discount calculation from time and I/O

**❌ Negative (typescript)**

```typescript
let currentCampaign = "WINTER";

function discount(customer: Customer): number {
  analytics.track("discount_checked", { id: customer.id });
  if (Date.now() > customer.memberUntil.getTime() && currentCampaign === "WINTER") {
    return 0.15;
  }
  return 0;
}
```

**✅ Positive (typescript)**

```typescript
type DiscountInput = {
  memberUntil: Date;
  now: Date;
  campaign: string;
};

function discount(input: DiscountInput): number {
  const expired = input.now > input.memberUntil;
  return expired && input.campaign === "WINTER" ? 0.15 : 0;
}

analytics.track("discount_checked", { id: customer.id });
const value = discount({ memberUntil: customer.memberUntil, now, campaign });
```

*The positive version makes time and campaign explicit inputs and moves analytics outside, so the rule is deterministic and can be tested with plain values.*

## Relationships

**Synergies**

- [Immutability](../functional/immutability.md) — Immutable inputs and outputs prevent accidental mutation from breaking referential transparency.
- [Memoization](../functional/memoization.md) — Memoization is correct only when a function returns the same result for the same inputs.
- [Property-Based Testing](../testing/property-based-testing.md) — Pure functions are ideal targets for property tests because generators can exercise them without fixtures.
- [Hexagonal Architecture (Ports & Adapters)](../architecture/hexagonal-architecture.md) — Ports keep I/O at the edge so the application core can be mostly pure.

**Alternatives:** [Transaction Script](../enterprise-application/transaction-script.md), [Active Record](../enterprise-application/active-record.md)

## Applicability tags

- **Languages:** language-agnostic, haskell, scala, clojure, typescript, rust
- **Frameworks:** none, redux
- **Project types:** library, backend-service, web-api, web-frontend, safety-critical
- **Tags:** determinism, testability, referential-transparency

## References

- John Hughes, Why Functional Programming Matters, (1989)

