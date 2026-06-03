# Input Validation (Allow-List)

> Accept only inputs that match known-good shape, type, range, and business rules before they reach sensitive processing.

**Scale:** implementation · **Altitude:** low · **Category:** security · **Maturity:** time-tested

**Also known as:** Positive validation, Allow-list validation

## Description

Allow-list input validation defines what valid data looks like and rejects everything else. It is stronger than trying to block known-bad strings because attackers continuously invent new encodings and bypasses. Validation should happen at trust boundaries, preserve typed domain invariants internally, and produce safe error messages. It does not replace parameterised queries or output encoding; it reduces the set of data downstream code must safely handle.

**Problem.** Untrusted input with unexpected shape, length, encoding, or meaning can trigger injection, denial of service, data corruption, or broken access decisions.

**Context.** Use on API payloads, query parameters, file uploads, message consumers, CLI inputs, and any boundary where data crosses from untrusted to trusted code.

## Consequences / Trade-offs

- Reduces attack surface by rejecting malformed or out-of-policy data early.
- Improves internal type safety and error handling.
- Can reject legitimate clients if schemas are too narrow; version and communicate contracts.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●● 5/5 | Essential even for small APIs and CLIs that accept untrusted input. |
| Medium (≤100k LOC) | ●●●●● 5/5 | A baseline implementation practice for every service boundary. |
| Large (>100k LOC) | ●●●●● 5/5 | Non-negotiable at scale; pair with schema governance and fuzz/property tests. |

## Examples

### Express allow-list validation

**❌ Negative (typescript)**

```typescript
app.get("/reports", async (req, res) => {
  const sort = String(req.query.sort || "created_at");
  const rows = await db.query(`select * from reports order by ${sort}`);
  res.json(rows);
});
```

**✅ Positive (typescript)**

```typescript
const allowedSorts = new Map([
  ["created", "created_at"],
  ["name", "name"],
  ["status", "status"]
]);

app.get("/reports", async (req, res) => {
  const column = allowedSorts.get(String(req.query.sort ?? "created"));
  if (!column) return res.status(400).json({ error: "invalid sort" });

  const rows = await db.query(`select id, name, status from reports order by ${column}`);
  res.json(rows);
});
```

*The positive code maps client input to a known set of columns instead of interpolating arbitrary text. Only known-good values can influence the SQL fragment.*

## Relationships

**Synergies**

- [Output Encoding](../security/output-encoding.md) — Validation reduces bad input, but encoding still protects each output sink from data that is valid yet unsafe to render.
- [Secure by Default](../security/secure-by-default.md) — Default-deny validation makes safe behaviour the normal path.
- [Property-Based Testing](../testing/property-based-testing.md) — Generated hostile inputs help prove validators reject malformed cases without crashing.

**Alternatives:** [Defense in Depth](../security/defense-in-depth.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, express, spring-boot, fastapi, django
- **Project types:** web-api, backend-service, microservices, distributed-system, web-frontend
- **Tags:** validation, allow-list, injection-prevention

