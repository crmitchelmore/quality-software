# Screenplay Pattern

> Model acceptance tests around actors with abilities performing tasks and asking questions, rather than page-centric scripts.

**Scale:** integration · **Altitude:** medium · **Category:** testing · **Maturity:** established

**Also known as:** Actor Pattern, Tasks and Abilities

## Description

The Screenplay Pattern scales UI and acceptance tests by decomposing behaviour into Actors, Abilities, Tasks, Interactions, and Questions. Instead of one large page object per screen, tests express user goals as composable tasks and assertions as questions. It is especially useful for multi-actor workflows or suites where page objects have become god objects.

**Problem.** Large UI test suites built around page objects accumulate duplicated flows and oversized classes that are hard to compose.

**Context.** Use for medium-to-large acceptance suites with repeated user journeys, multiple actors, or several interaction channels such as browser plus API.

## Consequences / Trade-offs

- Encourages reusable user-goal tasks instead of low-level UI scripts.
- Handles multi-actor scenarios more naturally than page objects.
- Introduces vocabulary and framework conventions that may be too heavy for small suites.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too much structure for a small UI suite. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit when page objects are becoming hard to compose. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large acceptance suites with many journeys and actors. |

## Examples

### Checkout as actor task

**❌ Negative (typescript)**

```typescript
const checkout = new CheckoutPage(page)
await checkout.fillAddress(address)
await checkout.selectShipping("express")
await checkout.applyDiscount("SAVE10")
await checkout.submitPayment(card)
```

**✅ Positive (typescript)**

```typescript
await actor.attemptsTo(
  CompleteCheckout.with(cart, address, card),
  Confirm.orderSummary()
)
expect(await actor.asksAbout(OrderTotal.displayed())).toEqual("£108.00")
```

*The positive test composes user goals and questions rather than growing a page object that knows every checkout detail.*

## Relationships

**Synergies**

- [Page Object](../testing/page-object.md) — Screenplay can wrap page-level details behind lower-level interactions or questions.
- [Given-When-Then (BDD)](../testing/given-when-then.md) — Tasks and questions map naturally onto BDD scenario steps.
- [Ephemeral Environment](../testing/ephemeral-environment.md) — Acceptance tasks are more trustworthy when run against isolated full environments.

**Conflicts with:** [Page Object](../testing/page-object.md)

**Alternatives:** [Page Object](../testing/page-object.md), [Given-When-Then (BDD)](../testing/given-when-then.md), [Test Pyramid](../testing/test-pyramid.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, javascript, java, csharp
- **Frameworks:** none, nodejs, react, angular, spring-boot, dotnet
- **Project types:** web-frontend, web-api, microservices, monolith, modular-monolith
- **Tags:** acceptance-testing, ui-testing, actors, tasks

