# Webhook

> Send event notifications to customer- or partner-owned HTTP endpoints so external systems can react without polling.

**Scale:** integration · **Altitude:** medium · **Category:** api-design · **Maturity:** established

## Description

A webhook is an outbound HTTP callback triggered by an event in the provider system. Robust webhook APIs treat delivery as at least once: events have stable identifiers, signatures, timestamps, retry schedules, dead-letter visibility, and replay mechanisms. Payloads should be versioned and self-describing enough for consumers to process asynchronously, while secrets and personal data are minimised because events leave the provider boundary.

**Problem.** External consumers need timely updates, but polling wastes capacity, increases latency, and still misses state transitions unless clients implement complex sync logic.

**Context.** Use when third-party or separately deployed systems need event notifications over the public internet. Avoid using webhooks as the only source of truth; consumers should be able to reconcile.

## Consequences / Trade-offs

- Reduces polling and enables near-real-time integrations.
- Delivery is unreliable by nature: endpoints time out, certificates expire, and consumers deploy bugs.
- Security requires signature verification, secret rotation, and replay protection.
- Providers need event logs, retry controls, dashboards, and manual replay tools.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for integrations even in small products, but needs basic signing and retry visibility. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for partner ecosystems and asynchronous product integrations. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential at large scale, with event logs, replay, dead letters, and consumer observability. |

## Examples

### Sign and de-duplicate delivered events

**❌ Negative (typescript)**

```typescript
app.post("/webhook", async (req, res) => {
  await fulfil(req.body.order_id);
  res.sendStatus(200);
});
```

**✅ Positive (typescript)**

```typescript
app.post("/webhook", rawBody(), async (req, res) => {
  verifySignature(req.rawBody, req.header("Webhook-Signature"), secret);
  const event = JSON.parse(req.rawBody.toString());

  const inserted = await receivedEvents.insertOnce(event.id);
  if (inserted) await fulfil(event.data.order_id);
  res.sendStatus(200);
});
```

*The positive consumer verifies authenticity and records event IDs so provider retries do not repeat fulfilment.*

## Relationships

**Synergies**

- [Publish-Subscribe Channel](../enterprise-integration/publish-subscribe.md) — Webhooks are HTTP-based publish-subscribe across organisational boundaries.
- [Retry with Backoff](../resilience/retry.md) — Delivery needs bounded retry with backoff and visibility into exhausted attempts.
- [Idempotent Receiver](../enterprise-integration/idempotent-receiver.md) — Consumers must de-duplicate event IDs because providers will retry.
- [Transactional Outbox](../cloud-distributed/outbox.md) — Providers should enqueue webhook deliveries from committed events rather than inline with user transactions.

**Conflicts with:** [Request-Reply](../enterprise-integration/request-reply.md)

**Alternatives:** [Polling Consumer](../enterprise-integration/polling-consumer.md), [Event-Driven Consumer](../enterprise-integration/event-driven-consumer.md), [Message Channel](../enterprise-integration/message-channel.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, python, java, go
- **Frameworks:** express, fastapi, spring-boot, nodejs, none
- **Project types:** web-api, backend-service, serverless, distributed-system
- **Tags:** callbacks, integration, at-least-once

