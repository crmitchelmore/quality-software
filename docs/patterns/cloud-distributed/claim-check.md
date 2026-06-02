# Claim Check

> Store a large payload externally and send only a lightweight reference through the message channel, letting receivers retrieve the payload when needed.

**Scale:** integration · **Category:** cloud-distributed · **Maturity:** time-tested

## Description

Claim Check keeps messaging infrastructure fast and reliable by separating routing metadata from bulky content. The sender writes the full payload to a durable store, then publishes a message containing a secure reference, checksum, content type, and lifecycle metadata. Consumers use that reference to fetch the payload, process it, and optionally delete or expire it. This avoids broker size limits and repeated large-message copies, but requires careful access control and cleanup of orphaned payloads.

**Problem.** Large messages exceed broker limits, slow routing, increase memory pressure, and make retries expensive even when consumers only need metadata to decide routing.

**Context.** Use for documents, images, batch files, event attachments, and partner payloads when a broker should carry coordination signals rather than the full data body.

## Consequences / Trade-offs

- Keeps queues and topics lightweight, improving broker throughput and reliability.
- Allows payload storage to use appropriate retention, encryption, and access controls.
- Introduces a second resource lifecycle: references can become stale or orphaned.
- Consumers need permission and error handling for both message and payload store.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Avoid unless payloads are already hitting broker or API limits. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful for document and media workflows, with cleanup and permissions designed up front. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential when high-volume messaging carries large or regulated payloads. |

## Examples

### Sending references instead of large payloads

**❌ Negative (typescript)**

```typescript
// A multi-megabyte PDF is copied through the broker on every retry and route.
await broker.publish("documents.received", {
  documentId,
  customerId,
  pdfBytes: pdf.toString("base64"),
});
```

**✅ Positive (typescript)**

```typescript
const objectKey = `documents/${documentId}.pdf`;
await storage.putObject(objectKey, pdf, { contentType: "application/pdf" });
await broker.publish("documents.received", {
  documentId,
  customerId,
  claim: { objectKey, sha256: digest(pdf), expiresAt: addDays(new Date(), 7).toISOString() },
});
```

*The positive version keeps the broker message small and durable while placing the large payload in storage designed for size, retention, and encryption.*

## Relationships

**Synergies**

- [Valet Key](../cloud-distributed/valet-key.md) — The claim can be a short-lived signed URL that allows one consumer to fetch the payload.
- [Dead Letter Channel](../enterprise-integration/dead-letter-channel.md) — Failed claim retrievals should move to a DLQ with enough metadata for repair.
- [Transactional Outbox](../cloud-distributed/outbox.md) — Writing the payload reference and publishing the message atomically prevents lost claims.
- [Message Translator](../enterprise-integration/message-translator.md) — Translators can turn large inbound messages into claim checks before routing.

**Alternatives:** [Message Channel](../enterprise-integration/message-channel.md), [Guaranteed Delivery](../enterprise-integration/guaranteed-delivery.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** kafka, rabbitmq, nats, nodejs, spring-boot
- **Project types:** microservices, distributed-system, data-pipeline, backend-service
- **Tags:** large-payload, messaging, object-storage

## References

- [Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns; Claim Check, (2003)](https://www.enterpriseintegrationpatterns.com/patterns/messaging/StoreInLibrary.html)

