# Transaction Script

> Organise business logic as one procedure per request or use case, usually with straightforward database access.

**Scale:** design · **Altitude:** medium · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Procedure script, Use-case script

## Description

Transaction Script handles a business transaction in a linear procedure: validate input, read state, make decisions, write changes, and return a result. It is intentionally simple and works best when rules are uncomplicated and mostly independent. The script owns orchestration; data may be passive records or Active Records.

**Problem.** For simple CRUD and workflow steps, building a rich object model can obscure the actual business procedure. Teams need a direct place to implement the few rules that exist without scattering logic in controllers.

**Context.** Use for small applications, admin workflows, simple integrations, and early-stage systems where each use case is mostly independent and domain rules do not need extensive reuse.

## Consequences / Trade-offs

- Fast to write and easy to trace from request to database update.
- Works well with explicit transactions, gateways, and simple record models.
- Duplicates rules as the domain grows and scripts start sharing partial logic.
- Can become a procedural blob with hidden coupling, especially when scripts call each other.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent for small CRUD and workflow applications because the control flow is obvious. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Still useful for simple use cases, but shared business rules need refactoring before duplication spreads. |
| Large (>100k LOC) | ●●○○○ 2/5 | Rarely suitable as the main organising pattern; large domains usually need Domain Model or Table Module boundaries. |

## Examples

### Simple refund use case

**❌ Negative (python)**

```python
class Refund:
    def __init__(self, order):
        self.order = order

    def amount(self):
        return sum(line.price for line in self.order.lines)

    def apply(self):
        self.order.status = "refunded"
        PaymentGateway().refund(self.order.payment_id, self.amount())
```

**✅ Positive (python)**

```python
def refund_order(order_id, actor, db, payments):
    order = db.orders.find(order_id)
    if order.status != "paid":
        raise ValueError("only paid orders can be refunded")

    amount = db.order_lines.total_for_order(order_id)
    payments.refund(order.payment_id, amount)
    db.orders.mark_refunded(order_id, actor.id)
    db.audit.record("order_refunded", order_id, actor.id)
```

*For a simple workflow the positive version is clearer as a use-case procedure. It makes the read, external call, write, and audit steps visible without inventing domain objects that add little behaviour.*

## Relationships

**Synergies**

- [Table Data Gateway](../enterprise-application/table-data-gateway.md) — Gateways keep SQL out of the script while preserving straightforward procedural flow.
- [Active Record](../enterprise-application/active-record.md) — Active Record gives scripts a quick row-oriented way to load, validate, and save simple objects.
- [Service Layer](../enterprise-application/service-layer.md) — A service layer can expose transaction scripts as application operations with consistent transaction and authorisation boundaries.
- [Idempotency](../resilience/idempotency.md) — Scripts that are triggered by retries should use idempotency to avoid duplicate writes.

**Conflicts with:** [Domain Model](../enterprise-application/domain-model.md)

**Alternatives:** [Domain Model](../enterprise-application/domain-model.md), [Table Module](../enterprise-application/table-module.md), [Service Layer](../enterprise-application/service-layer.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby
- **Frameworks:** spring-boot, dotnet, express, django, rails, laravel
- **Project types:** prototype, web-api, backend-service, monolith
- **Tags:** procedural, use-case, crud, orchestration

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

