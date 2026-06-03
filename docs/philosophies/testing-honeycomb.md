# Testing Honeycomb

> Treat the microservice as the unit: write mostly service-level integration tests, a few internal implementation tests, and as few cross-service integrated tests as possible.

**Discipline:** testing · **Origin:** Spotify, André Schaffer, Rickard Dybeck · *Testing of Microservices* · (2018)

**Also known as:** Microservice testing honeycomb

## Description

The Testing Honeycomb emerged from Spotify's microservice experience. It argues that, for a microservice, the service boundary is the meaningful unit of deployment and confidence. Most tests should exercise the service in isolation through its real API and persistence boundary, with only a small number of implementation-detail tests for complex internals and a strong bias against tests whose result depends on another live service.

**In practice.** Spin up the service with realistic persistence and local dependencies, drive it through the same API clients use, stub or contract-check other services, and keep only focused unit tests for internal logic that is naturally isolated and worth testing separately.

## Core tenets

- Test the deployable service through its public contract rather than through internal classes.
- Make service-level integration tests the dominant layer for microservices.
- Reserve implementation-detail tests for genuinely complex internal algorithms or transformations.
- Avoid integrated tests whose pass or fail result depends on another service's correctness.
- Use contracts or equivalent boundary checks to keep independent services compatible.

## Key ideas

- **The service is the unit** — In microservices, confidence comes from exercising the deployed service boundary, not from exhaustively isolating tiny internal objects.
- **Avoid integrated tests** — Tests involving several live services are slow, fragile and ambiguous because a failure may belong to any participant.

## Associated software patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Consumer-Driven Contract Testing](../patterns/testing/contract-testing.md) — Replaces fragile cross-service integrated tests with executable compatibility checks at service boundaries.
- [Test Pyramid](../patterns/testing/test-pyramid.md) — The honeycomb is a deliberate microservice-specific correction to pyramid-shaped portfolios.
- [Fake Object](../patterns/testing/fake-object.md) — Fakes can isolate hard external services while preserving realistic service-level flows.
- [Stub](../patterns/testing/stub.md) — Stubs provide controlled responses from awkward external collaborators during isolated service tests.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Spotify microservices | Spotify Engineering described moving away from the classic pyramid towards a honeycomb model in which service-level integration tests dominate and integrated tests across services are avoided. | primary source | [Testing of Microservices](https://engineering.atspotify.com/2018/01/testing-of-microservices/) |

## Relationships with other philosophies

**Complements:** [Extreme Programming & Test-Driven Development](extreme-programming-tdd.md)

**In tension with**

- [Testing Trophy](testing-trophy.md) — The honeycomb and trophy both emphasise integration, but they use the term for different contexts: isolated service testing in microservices versus collaborating frontend units.

## References

- [André Schaffer and Rickard Dybeck, Testing of Microservices, (2018)](https://engineering.atspotify.com/2018/01/testing-of-microservices/)
- [J.B. Rainsberger, Integrated Tests Are A Scam](http://blog.thecodewhisperer.com/permalink/integrated-tests-are-a-scam)

