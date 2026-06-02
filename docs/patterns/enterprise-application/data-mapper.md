# Data Mapper

> Move data-transfer logic between database records and domain objects into a dedicated mapper layer.

**Scale:** data · **Category:** enterprise-application · **Maturity:** time-tested

**Also known as:** Mapper layer, Persistence mapper

## Description

Data Mapper keeps domain objects ignorant of persistence. Mappers load rows, construct domain objects, track identity, and write state back using SQL, metadata, or ORM infrastructure. This separation lets a rich Domain Model express business rules without inheriting database APIs or table-shaped compromises.

**Problem.** Embedding SQL and persistence lifecycle methods inside domain objects couples business rules to storage shape, makes tests slow, and tempts callers to bypass invariants by setting persisted fields directly.

**Context.** Use for complex domains, long-lived systems, or teams that need independent evolution of the object model and relational schema. It is the usual companion to Repository, Unit of Work, and Identity Map.

## Consequences / Trade-offs

- Enables persistence ignorance and richer domain objects with protected invariants.
- Allows schema and domain model to diverge deliberately through mapping code or metadata.
- Adds an indirection layer that can be expensive for CRUD-only applications.
- Requires discipline to avoid anaemic models plus huge mappers that merely shuffle data.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too much ceremony for simple CRUD or prototypes. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit when business rules start outgrowing table-shaped objects. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large enterprise systems where domain behaviour, schema evolution, testing, and transaction boundaries must be controlled separately. |

## Examples

### Separating account behaviour from SQL

**❌ Negative (python)**

```python
class Account:
    def __init__(self, id, balance, connection):
        self.id = id
        self.balance = balance
        self.connection = connection

    def withdraw(self, amount):
        if self.balance < amount:
            raise ValueError("insufficient funds")
        self.balance -= amount
        self.connection.execute(
            "update accounts set balance = ? where id = ?", (self.balance, self.id)
        )
```

**✅ Positive (python)**

```python
class Account:
    def __init__(self, id, balance):
        self.id = id
        self.balance = balance

    def withdraw(self, amount):
        if self.balance < amount:
            raise ValueError("insufficient funds")
        self.balance -= amount

class AccountMapper:
    def find(self, id):
        row = self.connection.execute(
            "select id, balance from accounts where id = ?", (id,)
        ).fetchone()
        return Account(row["id"], row["balance"])

    def update(self, account):
        self.connection.execute(
            "update accounts set balance = ? where id = ?",
            (account.balance, account.id),
        )
```

*The Account enforces the withdrawal rule without knowing how it is stored. Mapping and SQL are isolated, so tests can exercise business behaviour without a database and persistence can evolve independently.*

## Relationships

**Synergies**

- [Domain Model](../enterprise-application/domain-model.md) — Data Mapper lets a Domain Model focus on behaviour without public save/find methods or table-shaped APIs.
- [Unit of Work](../enterprise-application/unit-of-work.md) — Mappers commonly register loaded and changed objects with a Unit of Work for atomic commit.
- [Identity Map](../enterprise-application/identity-map.md) — The mapper checks Identity Map before constructing an object, preserving object identity.
- [Repository](../data-persistence/repository.md) — Repository hides mapper queries behind domain-specific collection methods.

**Conflicts with:** [Active Record](../enterprise-application/active-record.md)

**Alternatives:** [Active Record](../enterprise-application/active-record.md), [Table Data Gateway](../enterprise-application/table-data-gateway.md), [Row Data Gateway](../enterprise-application/row-data-gateway.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python, ruby
- **Frameworks:** hibernate, entity-framework, typeorm, sqlalchemy, rails
- **Project types:** backend-service, web-api, modular-monolith, monolith
- **Tags:** persistence-ignorance, mapping, orm, domain-model

## References

- Martin Fowler, Patterns of Enterprise Application Architecture, (2002)

