# Application Controller

> Centralise navigation and use-case flow decisions in an application-level object, keeping page, endpoint, or UI handlers focused on request parsing and response rendering.

**Scale:** design · **Category:** enterprise-application · **Maturity:** time-tested

## Description

An Application Controller represents the workflow of an application: given a command, screen event, or request, it decides which domain action to run and which view or next step follows. It is not the place for business rules; it coordinates application state, authorisation preconditions, transitions, and view selection. The pattern is useful when many controllers or handlers repeat the same branching logic and when a flow spans several screens or commands.

**Problem.** Page controllers and endpoint handlers often accumulate duplicated if/else navigation, permission checks, and next-view selection. The behaviour becomes hard to test because every route owns a fragment of the same workflow.

**Context.** Use when an enterprise application has multi-step flows, role-dependent navigation, or several presentation channels that should share workflow decisions. Avoid it for simple CRUD endpoints where routing and service calls are already explicit.

## Consequences / Trade-offs

- Makes use-case flow explicit and testable without rendering pages or invoking HTTP infrastructure.
- Reduces duplicated navigation and permission branching across page controllers, front controllers, and API handlers.
- Can become a god object if it absorbs domain rules, persistence, or view construction.
- Adds indirection; small applications may be clearer with direct controller-to-service calls.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually unnecessary for small apps; direct controller logic is easier unless flows are genuinely reused. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | A good fit when several routes, roles, or screens share workflow decisions. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable for complex enterprise workflows, but must be bounded by use case to avoid a central god controller. |

## Examples

### Checkout flow routing

**❌ Negative (typescript)**

```typescript
class CheckoutController {
  async post(req: Request, res: Response) {
    const basket = await baskets.get(req.user.id);
    if (basket.items.length === 0) return res.redirect('/basket');
    if (!req.user.emailVerified) return res.redirect('/verify-email');
    if (basket.total().greaterThan(1000) && !req.user.hasRole('manager')) {
      return res.redirect('/approval-required');
    }
    await checkoutService.confirm(req.user.id);
    return res.redirect('/receipt');
  }
}
```

**✅ Positive (typescript)**

```typescript
type CheckoutDecision =
  | { view: 'basket' }
  | { view: 'verify-email' }
  | { view: 'approval-required' }
  | { view: 'receipt'; command: ConfirmCheckout };

class CheckoutApplicationController {
  decide(user: User, basket: Basket): CheckoutDecision {
    if (basket.isEmpty()) return { view: 'basket' };
    if (!user.emailVerified) return { view: 'verify-email' };
    if (basket.requiresApproval() && !user.canApproveLargeOrders()) {
      return { view: 'approval-required' };
    }
    return { view: 'receipt', command: new ConfirmCheckout(user.id) };
  }
}

class CheckoutController {
  constructor(private readonly flow: CheckoutApplicationController) {}
  async post(req: Request, res: Response) {
    const decision = this.flow.decide(req.user, await baskets.get(req.user.id));
    if ('command' in decision) await commandBus.execute(decision.command);
    return res.redirect('/' + decision.view);
  }
}
```

*The positive version isolates workflow decisions in a unit-testable controller and leaves the HTTP controller responsible only for adapting request and response mechanics.*

## Relationships

**Synergies**

- [Front Controller](../enterprise-application/front-controller.md) — A Front Controller can parse and authenticate the request, then delegate workflow and view selection to an Application Controller.
- [Page Controller](../enterprise-application/page-controller.md) — Page Controllers stay thin when repeated flow decisions are extracted to a shared controller.
- [Service Layer](../enterprise-application/service-layer.md) — The Application Controller chooses which service operation to invoke while the Service Layer owns transaction-scoped business use cases.
- [Command](../gof-behavioural/command.md) — Commands give the controller a uniform representation of user intentions and make flows easier to test.

**Conflicts with:** [Transaction Script](../enterprise-application/transaction-script.md)

**Alternatives:** [Page Controller](../enterprise-application/page-controller.md), [Transaction Script](../enterprise-application/transaction-script.md)

## Applicability tags

- **Languages:** language-agnostic, java, typescript, csharp
- **Frameworks:** spring-boot, dotnet, nestjs, none
- **Project types:** web-api, backend-service, modular-monolith, monolith
- **Tags:** workflow, navigation, coordination

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

