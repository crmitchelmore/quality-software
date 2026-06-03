# Test Pyramid

> Balance the test suite with many fast low-level tests, fewer service/integration tests, and a small number of slow end-to-end journeys.

**Scale:** organisational · **Altitude:** medium · **Category:** testing · **Maturity:** established

**Also known as:** Testing pyramid

## Description

The Test Pyramid is a portfolio pattern for feedback speed and confidence. Most checks should be cheap and local, exercising domain logic and components; a smaller layer verifies integration boundaries; the smallest layer covers high-value end-to-end journeys through the deployed system. The aim is not a fixed ratio but an economic shape: failures should be precise, fast tests should carry most regression load, and slow brittle journeys should be reserved for contracts that lower layers cannot prove.

**Problem.** Teams often accumulate a slow, flaky end-to-end-heavy suite that gives late feedback and unclear failures.

**Context.** Use when designing or recovering a product test strategy across unit, integration, contract, UI, and deployment checks.

## Consequences / Trade-offs

- Improves feedback speed and failure localisation.
- Forces explicit decisions about which risks belong at which test level.
- Can be misapplied as a dogmatic unit-test quota; architecture and risk should shape the actual mix.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful guidance, but tiny projects may not need formal layers. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for keeping CI fast and meaningful as product complexity grows. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential organisational pattern for large systems with many teams and deployment risks. |

## Examples

### Replacing duplicate E2E coverage

**❌ Negative (javascript)**

```javascript
test("checkout rejects invalid coupon in browser", async ({ page }) => { /* full UI flow */ });
test("checkout rejects expired coupon in browser", async ({ page }) => { /* full UI flow */ });
test("checkout rejects used coupon in browser", async ({ page }) => { /* full UI flow */ });
```

**✅ Positive (javascript)**

```javascript
test.each(["invalid", "expired", "already-used"])("rejects %s coupon at service level", async (kind) => {
  await expect(applyCoupon(cart(), couponOf(kind))).rejects.toThrow(CouponRejected);
});

test("customer sees coupon error during checkout", async ({ page }) => {
  await checkoutPage(page).applyCoupon("expired-code");
  await expect(checkoutPage(page).couponError()).toBeVisible();
});
```

*The positive suite moves coupon variants to fast service tests and keeps one browser journey to prove UI wiring, reducing runtime and making failures more precise.*

## Relationships

**Synergies**

- [Consumer-Driven Contract Testing](../testing/contract-testing.md) — Contract tests form an efficient middle layer for service boundaries.
- [Page Object](../testing/page-object.md) — Page objects keep the small E2E layer maintainable.
- [Property-Based Testing](../testing/property-based-testing.md) — Property tests strengthen the broad base for invariant-heavy logic.
- [Golden Master (Approval)](../testing/golden-master.md) — Approval tests can protect legacy seams while the pyramid is being rebuilt.

**Alternatives:** [Given-When-Then (BDD)](../testing/given-when-then.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, react, fastapi
- **Project types:** web-api, web-frontend, backend-service, microservices, monolith
- **Tags:** test-strategy, feedback, ci

