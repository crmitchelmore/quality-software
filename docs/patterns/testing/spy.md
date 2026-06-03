# Spy

> Use a test double that records calls and arguments so the test can verify meaningful interactions after exercising the subject.

**Scale:** implementation · **Altitude:** low · **Category:** testing · **Maturity:** time-tested

**Also known as:** Test Spy, Recording Stub

## Description

A Spy is a test double that usually supplies simple stub behaviour while recording how it was used. The test performs normal Arrange-Act-Assert flow, then inspects recorded calls, arguments, or counts. It is lighter than a strict mock because expectations are not pre-programmed before the action, but it still risks coupling tests to implementation if used for incidental collaborator calls.

**Problem.** A behaviour is observable only through a command sent to a collaborator, but strict mock expectations would make the test brittle.

**Context.** Use for command-style collaborators such as notifications, audit publishers, or gateways where the call itself is part of the contract.

## Consequences / Trade-offs

- Makes interaction evidence explicit without pre-programming every expectation.
- Works well for hand-written doubles when a mocking framework would obscure intent.
- Can over-specify implementation details if used for query collaborators or incidental calls.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for a few outbound command checks without introducing a mocking framework. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit when teams need readable interaction tests but want to avoid brittle mock scripts. |
| Large (>100k LOC) | ●●●○○ 3/5 | Still valuable, but needs conventions so spies do not become broad implementation probes. |

## Examples

### Recording sent email

**❌ Negative (python)**

```python
mailer = Mock()
mailer.expect_send("ada@example.com", "Welcome")
service = RegisterUser(mailer)
service.register("ada@example.com")
mailer.verify()
```

**✅ Positive (python)**

```python
mailer = SpyMailer()
service = RegisterUser(mailer)

service.register("ada@example.com")

assert mailer.sent == [("ada@example.com", "Welcome")]
```

*The spy records the meaningful command and keeps the assertion after the act, avoiding a strict expectation script for the whole collaboration.*

## Relationships

**Synergies**

- [Test Double](../testing/test-double.md) — Spy is one member of the Meszaros/Fowler test double taxonomy.
- [Mock Object](../testing/mock-object.md) — Both verify interactions; spies inspect recorded calls after the act while mocks set expectations before it.
- [Arrange-Act-Assert](../testing/arrange-act-assert.md) — Recorded calls keep verification in the Assert phase rather than mixing expectations into setup.

**Conflicts with:** [Stub](../testing/stub.md)

**Alternatives:** [Mock Object](../testing/mock-object.md), [Stub](../testing/stub.md), [Fake Object](../testing/fake-object.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, microservices, modular-monolith
- **Tags:** test-double, interaction-testing, recording-calls

