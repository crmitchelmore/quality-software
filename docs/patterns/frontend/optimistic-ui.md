# Optimistic UI

> Update the interface immediately as if an operation will succeed, then reconcile, confirm or roll back when the server responds.

**Scale:** frontend · **Altitude:** low · **Category:** frontend · **Maturity:** established

## Description

Optimistic UI treats user intent as the leading signal for local feedback. The client applies a predicted state change immediately, sends a command to the server, and later confirms, adjusts or rolls back based on the result. It is powerful for high-latency interactions such as likes, comments and drag-and-drop ordering, but only safe when failures are recoverable and operations have clear identity.

**Problem.** Waiting for every network round trip makes interfaces feel slow, encourages repeated clicks and hides whether the user's intent was captured.

**Context.** Use for reversible, low-risk actions with stable identifiers, predictable outcomes and server APIs that support idempotency or conflict handling.

## Consequences / Trade-offs

- Dramatically improves perceived performance and interaction confidence.
- Requires explicit pending, confirmed and failed states.
- Rollback can be confusing if the predicted outcome differs from server rules.
- Dangerous for irreversible, regulated or high-value actions without confirmation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational for simple reversible actions; avoid adding rollback machinery to rarely used operations. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for social, collaboration and commerce flows where latency would otherwise dominate UX. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at scale but requires consistent command IDs, telemetry and conflict handling across clients. |

## Examples

### Liking a post with rollback

**❌ Negative (typescript)**

```typescript
async function LikeButton({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.viewerLiked);
  return <button onClick={async () => {
    await api.like(post.id);
    setLiked(true);
  }}>{liked ? "Liked" : "Like"}</button>;
}
```

**✅ Positive (typescript)**

```typescript
function LikeButton({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.viewerLiked);
  const [pending, setPending] = useState(false);

  async function like() {
    const previous = liked;
    setLiked(true);
    setPending(true);
    try { await api.like(post.id, { idempotencyKey: crypto.randomUUID() }); }
    catch { setLiked(previous); }
    finally { setPending(false); }
  }

  return <button aria-busy={pending} disabled={pending} onClick={like}>{liked ? "Liked" : "Like"}</button>;
}
```

*The positive version gives immediate feedback but tracks pending state, supplies an idempotency key and restores the previous value if the command fails.*

## Relationships

**Synergies**

- [Idempotency](../resilience/idempotency.md) — Retried optimistic commands need server-side duplicate protection.
- [Command](../gof-behavioural/command.md) — A local optimistic update should be tied to a named command with an identity and rollback strategy.
- [Redux (Unidirectional Store)](../frontend/redux-pattern.md) — Action logs and reducers make pending, fulfilled and rejected transitions explicit.
- [State Machine UI](../frontend/state-machine-ui.md) — State machines model optimistic, confirming, failed and reverted states without boolean soup.

**Alternatives:** [Retry with Backoff](../resilience/retry.md), [Fallback](../resilience/fallback.md), [Pessimistic Offline Lock](../enterprise-application/pessimistic-offline-lock.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** react, vue, angular, svelte, redux
- **Project types:** web-frontend, mobile-app, realtime-system
- **Tags:** perceived-performance, latency-hiding, rollback

## References

- [Optimistic UI](https://www.apollographql.com/docs/react/performance/optimistic-ui/)

