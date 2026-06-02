# Flyweight

> Share immutable intrinsic state across many fine-grained objects while keeping per-use extrinsic state outside the shared instance.

**Scale:** design · **Category:** gof-structural · **Maturity:** time-tested

## Description

Flyweight reduces memory footprint when an application needs large numbers of similar objects. Shared intrinsic state is stored once in immutable flyweight instances, usually obtained from a factory or cache. Context-specific extrinsic state is passed to operations or stored separately. The pattern is most effective when object counts are high, shared state is substantial, and identity is not tied to each logical occurrence.

**Problem.** Creating one full object per logical item wastes memory because many objects repeat the same immutable state.

**Context.** Use in renderers, parsers, games, editors, and high-throughput services where millions of small objects share a limited set of stable attributes.

## Consequences / Trade-offs

- Significantly reduces memory and allocation pressure for repeated immutable state.
- Makes sharing explicit and safe when flyweights are immutable.
- Separating intrinsic and extrinsic state complicates the API.
- Incorrectly sharing mutable state causes cross-item data corruption.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●○○○○ 1/5 | Avoid unless memory profiling proves repeated state is a problem; it adds complexity prematurely. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for editors, renderers, parsers, or services with high object counts. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable in memory-sensitive, high-throughput, or UI-heavy systems when backed by measurements and immutable state. |

## Examples

### Rendering map markers

**❌ Negative (typescript)**

```typescript
class Marker {
  constructor(
    readonly lat: number,
    readonly lon: number,
    readonly iconBytes: Uint8Array,
    readonly labelFont: string,
    readonly colour: string,
  ) {}
}

const markers = locations.map((loc) =>
  new Marker(loc.lat, loc.lon, loadIcon(loc.type), "Inter", loc.colour),
);
```

**✅ Positive (typescript)**

```typescript
class MarkerStyle {
  constructor(
    readonly iconBytes: Uint8Array,
    readonly labelFont: string,
    readonly colour: string,
  ) {}
}

class MarkerStyleFactory {
  private readonly styles = new Map<string, MarkerStyle>();
  styleFor(type: string, colour: string): MarkerStyle {
    const key = `${type}:${colour}`;
    let style = this.styles.get(key);
    if (!style) {
      style = new MarkerStyle(loadIcon(type), "Inter", colour);
      this.styles.set(key, style);
    }
    return style;
  }
}

type Marker = { lat: number; lon: number; style: MarkerStyle };
const styles = new MarkerStyleFactory();
const markers = locations.map((loc) => ({
  lat: loc.lat,
  lon: loc.lon,
  style: styles.styleFor(loc.type, loc.colour),
}));
```

*The positive version stores heavy icon and font state once per style and keeps coordinates outside the flyweight. The negative version allocates duplicate icon data for every marker.*

## Relationships

**Synergies**

- [Factory Method](../gof-creational/factory-method.md) — A factory method centralises lookup and reuse of flyweight instances.
- [Immutable Object](../concurrency/immutable-object.md) — Flyweights must be immutable or effectively immutable to be safely shared.
- [Object Pool](../implementation/object-pool.md) — Both reduce allocation pressure, but Flyweight shares state while Object Pool reuses whole objects with lifecycle management.
- [Prototype](../gof-creational/prototype.md) — Prototype copies configured objects, while Flyweight shares stable intrinsic parts; combining them clarifies copy versus share boundaries.

**Alternatives:** [Object Pool](../implementation/object-pool.md), [Cache-Aside](../cloud-distributed/cache-aside.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, cpp, python
- **Frameworks:** none
- **Project types:** game, desktop-app, backend-service, high-throughput
- **Tags:** memory, sharing, immutability

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

