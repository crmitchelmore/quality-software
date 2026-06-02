# Page Object

> Encapsulate UI test selectors and user interactions behind page-level methods so tests express behaviour instead of DOM mechanics.

**Scale:** implementation · **Category:** testing · **Maturity:** time-tested

**Also known as:** Screen Object

## Description

A Page Object wraps a page or component surface with intention-revealing operations such as signIn, addLineItem, or errorMessage. Tests call these operations instead of scattering CSS selectors, waits, and click sequences. The object should model user-visible capabilities, not mirror the DOM tree; if it exposes every button and field as public data, it becomes a brittle selector dump rather than a test-facing API.

**Problem.** End-to-end tests become fragile and unreadable when every test repeats low-level selectors and timing work.

**Context.** Use for browser or mobile UI tests with repeated flows, especially when selectors or UI mechanics change more often than user scenarios.

## Consequences / Trade-offs

- Centralises selectors and waiting behaviour, reducing brittle duplication.
- Makes UI tests read like user workflows.
- Can hide too much; assertions should still be visible in tests, and page objects should not contain business decisions.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Worth it only when selectors are reused; direct locators are fine for one or two simple tests. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong fit once UI flows repeat and selector churn becomes expensive. |
| Large (>100k LOC) | ●●●●○ 4/5 | Helpful, but very large suites need composition to avoid enormous god page objects. |

## Examples

### Playwright login flow

**❌ Negative (typescript)**

```typescript
test("user can sign in", async ({ page }) => {
  await page.goto("/login");
  await page.locator("input[name=email]").fill("a@example.com");
  await page.locator("input[name=password]").fill("correct horse battery staple");
  await page.locator("button[type=submit]").click();
  await expect(page.locator("[data-testid=user-menu]")).toContainText("a@example.com");
});
```

**✅ Positive (typescript)**

```typescript
class LoginPage {
  constructor(private readonly page: Page) {}
  async open() { await this.page.goto("/login"); }
  async signIn(email: string, password: string) {
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }
  userMenu() { return this.page.getByTestId("user-menu"); }
}

test("user can sign in", async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.signIn("a@example.com", "correct horse battery staple");
  await expect(login.userMenu()).toContainText("a@example.com");
});
```

*The positive test keeps the user story visible and isolates selector changes inside LoginPage. It still leaves the final assertion in the test so the expected outcome is explicit.*

## Relationships

**Synergies**

- [Given-When-Then (BDD)](../testing/given-when-then.md) — Page object methods make Given/When/Then UI steps readable and stable.
- [Test Data Builder](../testing/test-data-builder.md) — Builders create the users or orders that page scenarios need before the UI flow starts.
- [Component-Based UI](../frontend/component-based-ui.md) — Component boundaries often map well to smaller component objects inside a page object.

**Alternatives:** [Arrange-Act-Assert](../testing/arrange-act-assert.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, javascript, python, java
- **Frameworks:** react, angular, vue, nodejs, spring-boot
- **Project types:** web-frontend, web-api, backend-service, monolith
- **Tags:** e2e-testing, selectors, ui-testing

