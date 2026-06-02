# Active Record

> Combine a row-shaped domain object with persistence methods such as find, save, and destroy.

**Scale:** data · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Record object

## Description

Active Record represents a database row as an object that carries both data and persistence behaviour. It works well when business logic is close to CRUD and the table structure is a natural model for the application. The pattern favours speed and convention over persistence ignorance.

**Problem.** Small applications can waste effort building separate mappers and repositories when the domain is mostly validating and saving table-shaped records. Conversely, using raw SQL everywhere duplicates persistence code and validation.

**Context.** Use for simple web applications, admin tools, prototypes, and CRUD-heavy systems where the data model is stable and business rules are modest. Reconsider it as invariants span multiple records or storage decisions start leaking into policy.

## Consequences / Trade-offs

- Very productive for CRUD because the object knows how to load and save itself.
- Keeps simple validations close to persisted fields and benefits from framework conventions.
- Couples domain logic to database shape and framework lifecycle callbacks.
- Becomes awkward for rich Domain Models, complex transactions, and multiple persistence stores.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Excellent for prototypes, admin apps, and simple CRUD where convention matters more than isolation. |
| Medium (≤100k LOC) | ●●●○○ 3/5 | Useful for CRUD slices, but watch for callback webs and cross-record rules that want a service or mapper boundary. |
| Large (>100k LOC) | ●●○○○ 2/5 | Rarely a good core domain pattern in large systems; persistence coupling and lifecycle callbacks become hard to reason about. |

## Examples

### Simple invoice model

**❌ Negative (ruby)**

```ruby
class PayInvoice
  def call(id)
    row = DB[:invoices].where(id: id).first
    raise "paid" if row[:paid_at]

    DB[:invoices].where(id: id).update(paid_at: Time.now)
  end
end
```

**✅ Positive (ruby)**

```ruby
class Invoice < ApplicationRecord
  def pay!(clock: Time)
    raise AlreadyPaid if paid_at.present?
    update!(paid_at: clock.now)
  end
end

class PayInvoice
  def call(id)
    Invoice.find(id).pay!
  end
end
```

*The positive version puts the simple invariant next to the row-shaped object and uses the framework persistence API consistently. This is appropriate while the rule remains local to one record.*

## Relationships

**Synergies**

- [Transaction Script](../enterprise-application/transaction-script.md) — Transaction Script pairs naturally with Active Record for simple request handlers that orchestrate row objects.
- [Page Controller](../enterprise-application/page-controller.md) — Page Controller actions can load and save Active Records directly in small server-rendered applications.
- [Table Data Gateway](../enterprise-application/table-data-gateway.md) — A Table Data Gateway can be an intermediate step when Active Record models need thinner persistence responsibilities.

**Conflicts with:** [Data Mapper](../enterprise-application/data-mapper.md), [Domain Model](../enterprise-application/domain-model.md)

**Alternatives:** [Data Mapper](../enterprise-application/data-mapper.md), [Row Data Gateway](../enterprise-application/row-data-gateway.md), [Table Data Gateway](../enterprise-application/table-data-gateway.md)

## Applicability tags

- **Languages:** language-agnostic, ruby, php, python, typescript
- **Frameworks:** rails, django, laravel, typeorm
- **Project types:** prototype, web-api, backend-service, monolith
- **Tags:** crud, orm, productivity, record-object

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

