# Debounce / Throttle (UI)

> Limit how often high-frequency UI events trigger expensive work by waiting for quiet time or enforcing a maximum call rate.

**Scale:** frontend · **Category:** frontend · **Maturity:** time-tested

## Description

Debouncing delays work until events stop for a configured interval; throttling runs work at most once per interval while events continue. In UI code they protect search, resize, scroll, pointer and validation handlers from overwhelming rendering, network calls or analytics. The interval and edge behaviour are part of the UX contract: choose them based on user intent, not arbitrary magic numbers.

**Problem.** Input, scroll and resize events can fire dozens of times per second, causing janky rendering, duplicate requests and race-prone state updates.

**Context.** Use for typeahead search, autosave, resize measurement, scroll tracking and pointer-heavy interactions where every event does not need immediate expensive processing.

## Consequences / Trade-offs

- Reduces unnecessary rendering, network traffic and battery usage.
- Makes async interactions less noisy and more predictable.
- Adds latency when debounce windows are too long.
- Requires cleanup on unmount and cancellation of stale async results.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Easy and valuable for common search and resize cases, as long as the delay is user-tested. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for performance-sensitive UI flows with frequent events. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still useful, but large systems should pair it with request cancellation, telemetry and server-side protections. |

## Examples

### Debouncing typeahead requests

**❌ Negative (typescript)**

```typescript
function SearchBox() {
  const [results, setResults] = useState<Result[]>([]);
  return <input onChange={async event => {
    setResults(await api.search(event.currentTarget.value));
  }} />;
}
```

**✅ Positive (typescript)**

```typescript
function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (!debouncedQuery) return setResults([]);
    const controller = new AbortController();
    api.search(debouncedQuery, { signal: controller.signal }).then(setResults);
    return () => controller.abort();
  }, [debouncedQuery]);

  return <input value={query} onChange={event => setQuery(event.currentTarget.value)} />;
}
```

*The positive version waits for typing to pause and aborts stale requests, reducing server load and preventing older responses from replacing newer results.*

## Relationships

**Synergies**

- [Hooks](../frontend/hooks.md) — Custom hooks package timer setup and cleanup safely for component lifecycles.
- [Rate Limiting](../resilience/rate-limiting.md) — Client-side throttling complements, but does not replace, server-side rate limits.
- [Observer](../gof-behavioural/observer.md) — Event streams can be transformed with debouncing and throttling before observers update UI.
- [Backpressure](../resilience/backpressure.md) — Throttling is a UI-level backpressure mechanism for fast producers and slower consumers.

**Alternatives:** [Backpressure](../resilience/backpressure.md), [Cache-Aside](../cloud-distributed/cache-aside.md), [Memoization](../functional/memoization.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react, vue, angular, svelte, rxjs
- **Project types:** web-frontend, mobile-app, realtime-system
- **Tags:** performance, event-handling, timers

## References

- [Debounce and Throttle](https://css-tricks.com/debouncing-throttling-explained-examples/)

