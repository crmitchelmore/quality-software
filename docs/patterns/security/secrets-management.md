# Secrets Management

> Store, distribute, rotate, and audit credentials through dedicated mechanisms instead of source code, images, logs, or ad-hoc environment sprawl.

**Scale:** design · **Category:** security · **Maturity:** established

**Also known as:** Secret vaulting, Credential hygiene

## Description

Secrets Management treats passwords, API keys, signing keys, certificates, and refresh tokens as lifecycle-managed assets. Secrets should be generated with sufficient entropy, stored in a vault or platform secret store, injected at runtime with least privilege, rotated regularly and on exposure, and never logged or committed. Mature designs prefer short-lived credentials and workload identity over static secrets, reducing both leak probability and blast radius.

**Problem.** Hard-coded or casually shared secrets leak through repositories, build logs, images, tickets, and developer machines, often granting broad persistent access.

**Context.** Use for every application that talks to databases, third-party APIs, cloud resources, signing systems, or identity providers.

## Consequences / Trade-offs

- Reduces accidental leakage and enables revocation/rotation when exposure happens.
- Improves auditability of who or what accessed a secret.
- Adds operational dependency on secret stores and startup wiring; plan for local development and outages.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | Important even for small apps; use the platform secret store rather than inventing one. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent fit as soon as CI, cloud resources, and multiple services share credentials. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical at scale; automate rotation, access review, and incident response for leaked secrets. |

## Examples

### Runtime secret retrieval

**❌ Negative (python)**

```python
STRIPE_KEY = "replace-me-in-source"

def charge(customer_id, amount):
    return stripe.Charge.create(api_key=STRIPE_KEY, customer=customer_id, amount=amount)
```

**✅ Positive (python)**

```python
def stripe_client(secret_store, workload_identity):
    api_key = secret_store.read("payments/stripe/api-key", identity=workload_identity)
    return StripeClient(api_key=api_key)

def charge(customer_id, amount, client):
    return client.charge(customer=customer_id, amount=amount)
```

*The positive code retrieves the secret at runtime through an authorised identity and keeps the value out of source. Rotation can happen in the secret store without changing application code.*

## Relationships

**Synergies**

- [Principle of Least Privilege](../security/least-privilege.md) — Each secret should grant only the permissions the workload needs.
- [Federated Identity](../cloud-distributed/federated-identity.md) — Workload identity can replace many static secrets with short-lived credentials.
- [Token-Based Authentication](../security/token-based-auth.md) — Token signing keys, client secrets, and refresh tokens need rotation and controlled access.
- [Audit Logging](../security/audit-logging.md) — Secret access and rotation events should be auditable without exposing values.

**Alternatives:** [Secure by Default](../security/secure-by-default.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, spring-boot, kubernetes, terraform, fastapi
- **Project types:** web-api, backend-service, microservices, serverless, distributed-system
- **Tags:** secrets, rotation, credentials

