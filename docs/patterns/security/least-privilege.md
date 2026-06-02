# Principle of Least Privilege

> Grant each user, service, token, and process only the permissions required for its current task, for the shortest practical time.

**Scale:** design · **Category:** security · **Maturity:** time-tested

**Also known as:** PoLP, Least authority

## Description

Least Privilege constrains blast radius by designing permissions around specific duties instead of convenience. It applies to human roles, service accounts, database users, cloud IAM policies, OAuth scopes, file access, and runtime capabilities. Effective least privilege is continuously reviewed: permissions are explicit, default-deny, time-bounded where possible, and separated by environment and tenant. The design goal is that a compromised component cannot freely move sideways or mutate unrelated data.

**Problem.** Broad credentials and shared administrator roles turn ordinary bugs or credential leaks into full-system compromise.

**Context.** Use whenever code, people, services, or automation access protected resources, especially across service or cloud boundaries.

## Consequences / Trade-offs

- Reduces blast radius and lateral movement after compromise.
- Improves auditability because permissions express intended duties.
- Requires ongoing permission discovery and can initially slow teams if roles are too coarse or workflows are poorly understood.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Worth applying even in small services, though roles may be coarse at first. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent fit as teams and credentials multiply. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential at scale; broad shared privileges become existential risk. |

## Examples

### Scoped database access in Node.js

**❌ Negative (javascript)**

```javascript
// The web app connects as a database owner and can drop or rewrite any table.
const pool = new Pool({ connectionString: process.env.ADMIN_DATABASE_URL });

app.get("/orders/:id", async (req, res) => {
  const { rows } = await pool.query("select * from orders where id = $1", [req.params.id]);
  res.json(rows[0]);
});
```

**✅ Positive (javascript)**

```javascript
// ORDER_READ_DATABASE_URL belongs to a role with SELECT on orders_view only.
const pool = new Pool({ connectionString: process.env.ORDER_READ_DATABASE_URL });

app.get("/orders/:id", requireScope("orders:read"), async (req, res) => {
  const { rows } = await pool.query(
    "select id, total, status from orders_view where id = $1 and tenant_id = $2",
    [req.params.id, req.user.tenantId]
  );
  res.json(rows[0] ?? null);
});
```

*The positive version narrows both token scope and database capability. If the endpoint is compromised, the credential cannot modify data or read unrelated tenant tables.*

## Relationships

**Synergies**

- [Token-Based Authentication](../security/token-based-auth.md) — Tokens should carry narrow scopes and audiences that enforce least privilege at resource boundaries.
- [Federated Identity](../cloud-distributed/federated-identity.md) — Federation can issue short-lived, scoped credentials instead of long-lived shared secrets.
- [Audit Logging](../security/audit-logging.md) — Audit trails reveal unused or excessive privileges and support access reviews.
- [Secure by Default](../security/secure-by-default.md) — Default-deny posture makes least privilege the baseline rather than an afterthought.

**Alternatives:** [Defense in Depth](../security/defense-in-depth.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, express, spring-boot, fastapi, django
- **Project types:** web-api, backend-service, microservices, distributed-system, web-frontend
- **Tags:** access-control, iam, blast-radius

