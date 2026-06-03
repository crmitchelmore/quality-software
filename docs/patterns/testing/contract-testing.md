# Consumer-Driven Contract Testing

> Let API consumers define executable expectations that providers verify, catching integration breakage before services are deployed together.

**Scale:** integration · **Altitude:** medium · **Category:** testing · **Maturity:** established

**Also known as:** CDC testing, Pact testing

## Description

Consumer-Driven Contract Testing records the requests a consumer relies on and the responses it can handle, then has the provider verify those contracts in its own build. It is narrower than full end-to-end testing: contracts cover message shape, status codes, required fields, and compatibility rules rather than entire journeys. It works best with clear ownership, versioned publication of contracts, and provider states that make verification deterministic.

**Problem.** Independent services break each other when provider changes look safe locally but violate assumptions held by real consumers.

**Context.** Use for microservices, SDKs, and externally consumed APIs where teams deploy independently and end-to-end environments are slow or unreliable.

## Consequences / Trade-offs

- Finds incompatible API changes before deployment.
- Documents real consumer expectations instead of hypothetical schemas only.
- Requires disciplined contract ownership and should not replace provider behaviour tests or broader integration checks.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too much process for a single small app or library. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit once APIs have multiple consumers or independent deployments. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large microservice estates where full end-to-end coverage is slow and incomplete. |

## Examples

### Consumer expectation for account API

**❌ Negative (javascript)**

```javascript
test("loads account", async () => {
  const response = await fetch("https://accounts.dev/users/u1");
  expect((await response.json()).displayName).toBe("Ada");
});
```

**✅ Positive (javascript)**

```javascript
pact
  .given("user u1 exists")
  .uponReceiving("a request for a user profile")
  .withRequest({ method: "GET", path: "/users/u1" })
  .willRespondWith({
    status: 200,
    headers: { "content-type": "application/json" },
    body: { id: "u1", displayName: like("Ada") }
  });

test("loads account", async () => {
  const client = new AccountsClient(pact.mockService.baseUrl);
  await expect(client.user("u1")).resolves.toMatchObject({ displayName: "Ada" });
});
```

*The positive test records the consumer contract against a mock provider. The accounts provider must later verify the same interaction, catching incompatible response changes before release.*

## Relationships

**Synergies**

- [Contract-First API (OpenAPI)](../api-design/contract-first-api.md) — OpenAPI gives the broad provider contract; consumer contracts prove the parts real clients depend on.
- [Microservices](../architecture/microservices.md) — Independent service deployment needs executable compatibility checks between teams.
- [Test Double](../testing/test-double.md) — Consumer tests often use provider doubles generated from contracts.

**Alternatives:** [Golden Master (Approval)](../testing/golden-master.md), [Given-When-Then (BDD)](../testing/given-when-then.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java, go
- **Frameworks:** nodejs, spring-boot, fastapi, grpc, graphql
- **Project types:** microservices, web-api, backend-service, sdk, distributed-system
- **Tags:** api-compatibility, microservices, integration-testing

