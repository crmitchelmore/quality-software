# Type State

> Encode an object's lifecycle state in its type so invalid operations are rejected at compile time rather than checked at runtime.

**Scale:** design · **Altitude:** low · **Category:** implementation · **Maturity:** established

**Also known as:** Typestate, State-Encoded Types

## Description

Type State represents each lifecycle phase with a distinct type or generic marker. Methods consume one state and return the next, exposing only operations valid for that phase. The idiom is strongest in languages with expressive type systems and ownership semantics, but it can also inform staged builders and API design in more mainstream languages.

**Problem.** Objects with implicit lifecycle flags allow callers to invoke operations in the wrong order, producing runtime failures that the compiler could prevent.

**Context.** Use for protocols with important ordering rules, such as open/authenticated/closed, draft/submitted/approved, or configured/started.

## Consequences / Trade-offs

- Makes invalid lifecycle transitions unrepresentable in well-typed code.
- Documents the protocol through method availability and return types.
- Adds type complexity that may be excessive for simple state checks.
- Dynamic inputs still need validation before entering the typed protocol.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Excellent for critical protocols, but may be too heavy for simple CRUD code. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for SDKs and domain lifecycles with costly invalid transitions. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at boundaries and safety-critical flows; complexity must be contained. |

## Examples

### Connected socket protocol

**❌ Negative (rust)**

```rust
struct Connection {
    connected: bool,
}

impl Connection {
    fn send(&self, bytes: &[u8]) {
        if !self.connected {
            panic!("not connected");
        }
        // write bytes
    }
}
```

**✅ Positive (rust)**

```rust
struct Disconnected;
struct Connected;

struct Connection<State> {
    state: std::marker::PhantomData<State>,
}

impl Connection<Disconnected> {
    fn connect(self) -> Connection<Connected> {
        Connection { state: std::marker::PhantomData }
    }
}

impl Connection<Connected> {
    fn send(&self, bytes: &[u8]) {
        // write bytes
    }
}
```

*The positive version exposes send only on Connection<Connected>, so code cannot compile if it tries to send before connecting.*

## Relationships

**Synergies**

- [State](../gof-behavioural/state.md) — State models runtime behaviour changes; Type State shifts legal operations into the static type system.
- [Smart Constructor](../implementation/smart-constructor.md) — Smart constructors create the initial valid state and hide raw constructors.
- [Fluent Interface](../implementation/fluent-interface.md) — Staged fluent APIs can return a new type at each valid step.
- [Builder](../gof-creational/builder.md) — Builders use typestate to require mandatory fields before build is available.

**Alternatives:** [State](../gof-behavioural/state.md), [Guard Clause (Early Return)](../implementation/guard-clause.md), [Builder](../gof-creational/builder.md)

## Applicability tags

- **Languages:** rust, typescript, java, csharp, haskell
- **Frameworks:** none
- **Project types:** library, sdk, safety-critical, backend-service, embedded
- **Tags:** types, lifecycle, invariants

## References

- Jonathan Aldrich, Joshua Sunshine, Darpan Saini, Zachary Sparks, Typestate-Oriented Programming, (2009)

