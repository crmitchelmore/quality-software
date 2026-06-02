# Token-Based Authentication

> Authenticate requests with signed, time-bound tokens carrying identity, audience, issuer, and scope claims verified at each resource boundary.

**Scale:** integration · **Category:** security · **Maturity:** established

**Also known as:** Bearer token auth, JWT auth

## Description

Token-Based Authentication replaces server-local session lookups with verifiable credentials presented on each request, commonly OAuth access tokens or JWTs. Correct use requires validating signature, issuer, audience, expiry, not-before time, and scopes; tokens should be short-lived, transmitted only over TLS, and stored carefully by clients. The pattern supports distributed systems because services can authenticate callers consistently, but it is dangerous when tokens are treated as trusted just because they decode.

**Problem.** Distributed clients and services need portable identity proof, but naive bearer strings or unchecked JWTs enable impersonation and privilege escalation.

**Context.** Use for APIs, mobile clients, SPAs with backends, service-to-service calls, and federated identity integrations where requests cross process boundaries.

## Consequences / Trade-offs

- Scales authentication across services without central session state on every request.
- Enables scoped, audience-bound access decisions.
- Bearer tokens are high-value secrets; validation, storage, rotation, and revocation strategy must be designed.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for small APIs with external clients, but session cookies may be simpler for one web app. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Strong fit for service APIs and mobile/SPAs when implemented with a proven provider/library. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for large distributed systems, with key rotation, scopes, and revocation processes. |

## Examples

### JWT validation in an API

**❌ Negative (typescript)**

```typescript
app.get("/me", (req, res) => {
  const token = String(req.headers.authorization).replace("Bearer ", "");
  const claims = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  res.json({ subject: claims.sub, scopes: claims.scope });
});
```

**✅ Positive (typescript)**

```typescript
const verifier = createJwtVerifier({
  issuer: "https://issuer.example.com/",
  audience: "orders-api",
  jwksUri: "https://issuer.example.com/.well-known/jwks.json"
});

app.get("/me", async (req, res) => {
  const claims = await verifier.verifyBearer(req.headers.authorization);
  requireScope(claims, "profile:read");
  res.json({ subject: claims.sub });
});
```

*The positive code verifies signature, issuer, audience, expiry, and required scope before trusting claims. The negative code merely decodes attacker-controlled JSON.*

## Relationships

**Synergies**

- [Federated Identity](../cloud-distributed/federated-identity.md) — Federated identity providers issue standards-based tokens from centralised trust relationships.
- [Principle of Least Privilege](../security/least-privilege.md) — Scopes and audiences encode least privilege for each token.
- [Secrets Management](../security/secrets-management.md) — Signing keys, client secrets, and refresh tokens require managed storage and rotation.
- [Audit Logging](../security/audit-logging.md) — Token subject, issuer, and client identifiers are core fields for security audit trails.

**Alternatives:** [Secure by Default](../security/secure-by-default.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** nodejs, express, spring-boot, fastapi, django, grpc
- **Project types:** web-api, backend-service, microservices, mobile-app, distributed-system
- **Tags:** authentication, oauth, jwt

