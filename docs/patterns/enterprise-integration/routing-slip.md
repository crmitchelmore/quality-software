# Routing Slip

> Attach a dynamic itinerary to a message so each processing step sends it to the next endpoint listed on the slip.

**Scale:** integration · **Altitude:** medium · **Category:** enterprise-integration · **Maturity:** time-tested

## Description

A Routing Slip carries the planned sequence of processing steps with the message, often as headers or metadata. Each endpoint performs its work, advances the slip, and forwards the message to the next destination. It is useful when the path is chosen at runtime but the steps are still simple, stateless transformations or validations. The slip should describe routing, not hidden business state; if the next step depends on accumulated outcomes, compensation, or long-running decisions, a Process Manager is usually clearer.

**Problem.** Static routes cannot express per-message processing itineraries, while embedding all possible conditional paths in each endpoint couples endpoints to the whole workflow.

**Context.** Use when each message needs a different but explicit sequence of endpoints, selected by configuration, customer, product, or message content before the flow starts.

## Diagram

```mermaid
flowchart LR
  In[Message with slip] --> A[Validate]
  A --> B[Translate]
  B --> C[Enrich]
  C --> Out[Publish]
```

## Consequences / Trade-offs

- Enables dynamic, per-message routing without central orchestration for every hop.
- Keeps endpoints simple: process the message, then follow the next slip entry.
- Makes auditing easier because the intended itinerary travels with the message.
- Slips can become unsafe if clients can inject destinations; validate and restrict allowed steps.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary where a simple method chain or router is clearer. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Situational for configurable integration pipelines with simple steps. |
| Large (>100k LOC) | ●●●●○ 4/5 | Useful for dynamic routing at scale, but prefer Process Manager for stateful, long-running workflows. |

## Examples

### Dynamic itinerary without hard-coded endpoint chains

**❌ Negative (java)**

```java
void process(Message message) {
  validate(message);
  if (message.customerTier().equals("enterprise")) {
    enrich(message);
    complianceCheck(message);
  }
  translate(message);
  publish(message);
}
```

**✅ Positive (java)**

```java
from("kafka:claims.in")
  .routeId("claims-routing-slip")
  .setHeader("routingSlip", method(ClaimItinerary.class, "forClaim"))
  .routingSlip(header("routingSlip"));

final class ClaimItinerary {
  String forClaim(Claim claim) {
    return claim.enterprise()
      ? "direct:validate,direct:enrich,direct:compliance,direct:publish"
      : "direct:validate,direct:publish";
  }
}
```

*The positive route computes a constrained itinerary once and lets the routing slip drive the flow. Endpoint code no longer contains every possible path.*

## Relationships

**Synergies**

- [Message Router](../enterprise-integration/message-router.md) — Routers can initialise or advance routing slips based on allowed endpoint names.
- [Message Endpoint](../enterprise-integration/message-endpoint.md) — Endpoints implement each itinerary step and forward to the next listed channel.
- [Process Manager](../enterprise-integration/process-manager.md) — A Process Manager can create a slip for simple subflows while retaining control of long-running decisions.
- [Message Translator](../enterprise-integration/message-translator.md) — Translation steps are common entries in a slip when messages cross partner boundaries.

**Conflicts with:** [Choreography](../cloud-distributed/choreography.md)

**Alternatives:** [Process Manager](../enterprise-integration/process-manager.md), [Content-Based Router](../enterprise-integration/content-based-router.md), [Chain of Responsibility](../gof-behavioural/chain-of-responsibility.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript
- **Frameworks:** spring-boot, rabbitmq, kafka, nodejs
- **Project types:** microservices, distributed-system, backend-service, etl
- **Tags:** eip, itinerary, dynamic-routing, workflow

## References

- [Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns, (2003)](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RoutingTable.html)

