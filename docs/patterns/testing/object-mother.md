# Object Mother

> Provide named factory methods for common test fixtures so tests can ask for well-known example objects in domain language.

**Scale:** implementation · **Category:** testing · **Maturity:** time-tested

**Also known as:** Fixture Mother

## Description

Object Mother centralises creation of canonical fixtures such as aPremiumCustomer, anExpiredSubscription, or aPaidInvoice. It is useful for communicating domain examples and reducing duplicated setup. Its weakness is rigidity: as scenarios multiply, one mother class can become a warehouse of subtly different fixtures. For variation-heavy tests, keep Object Mother methods as named shortcuts over Test Data Builders rather than returning hard-coded objects directly.

**Problem.** Repeated construction of common example objects clutters tests and leads to inconsistent fixture meanings.

**Context.** Use when the domain has a small set of named, widely understood examples used across many tests.

## Consequences / Trade-offs

- Improves readability for well-known examples and business scenarios.
- Centralises changes to canonical fixtures.
- Can become a fixture dumping ground; prefer Test Data Builder for per-test variation.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Helpful for a few canonical examples; avoid using it for every fixture. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good when combined with builders and disciplined naming. |
| Large (>100k LOC) | ●●○○○ 2/5 | Often becomes a maintenance bottleneck in large suites unless carefully modularised. |

## Examples

### Pytest canonical subscriptions

**❌ Negative (python)**

```python
def test_expired_subscription_cannot_stream():
    subscription = Subscription(
        id="s1", plan="pro", active=False,
        expires_on=date(2023, 1, 1), seats=3, country="GB"
    )
    assert not can_stream(subscription)
```

**✅ Positive (python)**

```python
class Subscriptions:
    @staticmethod
    def expired_pro():
        return SubscriptionBuilder().pro().expired_on(date(2023, 1, 1)).build()

def test_expired_subscription_cannot_stream():
    subscription = Subscriptions.expired_pro()
    assert not can_stream(subscription)
```

*The positive test uses a named domain example and delegates construction detail to a builder, avoiding both noisy literals and a rigid all-knowing fixture class.*

## Relationships

**Synergies**

- [Test Data Builder](../testing/test-data-builder.md) — Object Mother methods can call builders to provide named defaults with controlled overrides.
- [Given-When-Then (BDD)](../testing/given-when-then.md) — Named fixtures make BDD Given clauses read like domain examples.
- [Golden Master (Approval)](../testing/golden-master.md) — Stable named fixtures help approval tests produce reproducible outputs.

**Conflicts with:** [Test Data Builder](../testing/test-data-builder.md)

**Alternatives:** [Test Data Builder](../testing/test-data-builder.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, django, fastapi
- **Project types:** library, web-api, backend-service, microservices, modular-monolith
- **Tags:** fixtures, domain-examples, test-data

