# Audit Logging

> Record security-relevant decisions and state changes with enough integrity and context to support detection, investigation, and accountability.

**Scale:** design · **Altitude:** medium · **Category:** security · **Maturity:** time-tested

**Also known as:** Security audit trail

## Description

Audit Logging captures who did what, to which resource, when, from where, and whether it succeeded. It differs from debug logging: audit events are intentionally designed records for authentication, authorisation, privileged actions, data access, configuration changes, and secret usage. Good audit logs avoid sensitive payloads, use stable event names and correlation identifiers, are tamper-resistant, and are retained according to risk and regulation.

**Problem.** Without reliable audit trails, teams cannot investigate incidents, prove compliance, detect abuse, or understand the blast radius of compromised credentials.

**Context.** Use for systems with privileged operations, personal data, financial actions, tenant boundaries, production administration, or regulated workflows.

## Consequences / Trade-offs

- Enables incident investigation, anomaly detection, and accountability.
- Supports access reviews and compliance evidence.
- Can leak sensitive data or overwhelm storage if events are poorly designed; log metadata, not secrets or full payloads.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Situational for tiny tools, but essential for admin or data-sensitive actions. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong fit for services with user data, roles, billing, or production operations. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large systems and regulated environments; design retention, integrity, and searchability. |

## Examples

### Auditing privileged changes

**❌ Negative (java)**

```java
@PostMapping("/users/{id}/roles")
void changeRole(@PathVariable String id, @RequestBody RoleChange request) {
  users.changeRole(id, request.role());
  log.info("role changed");
}
```

**✅ Positive (java)**

```java
@PostMapping("/users/{id}/roles")
void changeRole(@PathVariable String id, @RequestBody RoleChange request, Authentication auth) {
  users.changeRole(id, request.role());
  audit.record("user_role_changed", Map.of(
      "actor", auth.getName(),
      "targetUser", id,
      "newRole", request.role(),
      "requestId", MDC.get("requestId")));
}
```

*The positive audit event has a stable event name and investigation context without dumping the whole request. It can answer who changed whose role and under which request.*

## Relationships

**Synergies**

- [Principle of Least Privilege](../security/least-privilege.md) — Audit data reveals excessive or unused privileges and validates access-review decisions.
- [Token-Based Authentication](../security/token-based-auth.md) — Token subject, client, scope, issuer, and audience provide essential audit context.
- [Defense in Depth](../security/defense-in-depth.md) — Audit logging is a detective layer that shows when preventive controls are bypassed.
- [Secrets Management](../security/secrets-management.md) — Secret reads, rotations, and denials are high-value audit events.

**Alternatives:** [Golden Master (Approval)](../testing/golden-master.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, express, spring-boot, fastapi, django
- **Project types:** web-api, backend-service, microservices, distributed-system, monolith
- **Tags:** audit, forensics, security-logging

