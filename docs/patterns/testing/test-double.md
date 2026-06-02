# Test Double

> Replace a real collaborator in a test with a controlled substitute so behaviour can be exercised without slow, unavailable, or nondeterministic dependencies.

**Scale:** implementation · **Category:** testing · **Maturity:** time-tested

**Also known as:** Dummy, Spy, Mock, Stub, Fake

## Description

A test double is the umbrella pattern for controlled stand-ins used during tests: dummies satisfy signatures, stubs return canned values, spies record calls, mocks verify expected interactions, and fakes provide lightweight working implementations. The important design choice is the seam: tests should replace external or unstable collaborators, not mask the behaviour being tested. Good doubles make tests faster and more deterministic while preserving the contract the real collaborator must honour.

**Problem.** Tests coupled to real databases, networks, clocks, queues, or payment systems are slow, flaky, and hard to run locally.

**Context.** Use at hard boundaries or when isolating a unit/component gives faster feedback than exercising the full stack.

## Consequences / Trade-offs

- Improves speed and determinism by removing external variability.
- Creates explicit seams that often improve production design.
- Can over-isolate code and miss contract drift unless complemented by integration or contract tests.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Useful whenever a small project touches I/O; avoid doubling pure in-process code unnecessarily. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent fit for keeping service tests fast while integration tests cover real adapters. |
| Large (>100k LOC) | ●●●●○ 4/5 | Necessary but risky if overused; pair with contract and end-to-end coverage to detect drift. |

## Examples

### Pytest mail boundary

**❌ Negative (python)**

```python
def test_signup_sends_email():
    user_id = signup("a@example.com", smtp=RealSmtp("smtp.example.com"))
    assert database.user(user_id).status == "pending"
```

**✅ Positive (python)**

```python
class RecordingMailer:
    def __init__(self):
        self.sent = []
    def send_welcome(self, email):
        self.sent.append(email)

def test_signup_sends_email():
    mailer = RecordingMailer()
    user_id = signup("a@example.com", mailer=mailer)

    assert database.user(user_id).status == "pending"
    assert mailer.sent == ["a@example.com"]
```

*The positive test replaces SMTP with a recording double, making the test local and deterministic while still checking the externally relevant effect: a welcome message was requested.*

## Relationships

**Synergies**

- [Mock Object](../testing/mock-object.md) — Mock Object is the interaction-verifying specialised form of a test double.
- [Stub](../testing/stub.md) — Stub is the simplest double for deterministic query responses.
- [Fake Object](../testing/fake-object.md) — Fake Object preserves more behaviour when pure canned responses are too weak.
- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Contract tests keep doubles honest when they stand in for remote services.

**Alternatives:** [Consumer-Driven Contract Testing](../testing/contract-testing.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, microservices, modular-monolith
- **Tags:** testability, isolation, determinism

