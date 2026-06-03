# Federated Identity

> Trust an external identity provider to authenticate users or workloads and use standard tokens to access applications across organisational or system boundaries.

**Scale:** integration · **Altitude:** high · **Category:** cloud-distributed · **Maturity:** established

## Description

Federated Identity separates authentication from each application. A relying party redirects users or workloads to a trusted identity provider, validates the returned token or assertion, and authorises local actions from claims and policy. Standards such as OIDC, OAuth 2.0, SAML, and workload identity federation make it possible to share identity across cloud accounts, vendors, enterprises, and services without synchronising passwords or issuing long-lived credentials to every application.

**Problem.** Each application managing its own users, passwords, MFA, and lifecycle creates duplicated risk, stale accounts, and inconsistent access controls.

**Context.** Use for SSO, B2B partner access, cloud workload identity, SaaS integration, and multi-tenant systems where identity lifecycle is owned by a central provider or customer tenant.

## Consequences / Trade-offs

- Centralises authentication, MFA, and account lifecycle in a specialised provider.
- Enables SSO and short-lived workload credentials across systems.
- Application availability and login experience depend on the identity provider.
- Claims, token audiences, clock skew, and key rotation must be validated rigorously.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Overhead is high for prototypes, though hosted identity can still be sensible for security. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit when SSO, MFA, or central lifecycle management matters. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for enterprise, multi-cloud, and multi-tenant distributed systems. |

## Examples

### Validating provider-issued tokens

**❌ Negative (typescript)**

```typescript
// Local passwords drift from corporate lifecycle and MFA policy.
app.post("/login", async (req, res) => {
  const user = await users.findByEmail(req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
    return res.sendStatus(401);
  }
  res.json({ session: createSession(user.id) });
});
```

**✅ Positive (typescript)**

```typescript
app.get("/callback", async (req, res) => {
  const tokenSet = await oidcClient.callback(redirectUri, req.query, { nonce: req.cookies.nonce });
  const claims = await verifier.verify(tokenSet.id_token, {
    issuer: "https://login.example.com/",
    audience: "orders-web",
  });
  const user = await users.findOrProvisionFederated(claims.sub, claims.email);
  res.json({ session: createSession(user.id) });
});
```

*The positive version delegates authentication to the identity provider while the application validates issuer, audience, and nonce before creating a local session.*

## Relationships

**Synergies**

- [Token-Based Authentication](../security/token-based-auth.md) — Federation usually issues JWTs or assertions that relying services validate locally.
- [Principle of Least Privilege](../security/least-privilege.md) — Federated claims should map to narrow roles and scopes rather than broad implicit trust.
- [Gatekeeper](../cloud-distributed/gatekeeper.md) — Edge gatekeepers can validate federated tokens before traffic reaches private services.
- [Audit Logging](../security/audit-logging.md) — Cross-system access needs correlation between external subject identifiers and local actions.

**Alternatives:** [Token-Based Authentication](../security/token-based-auth.md), [Service Locator](../implementation/service-locator.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** nodejs, spring-boot, dotnet, django, kubernetes
- **Project types:** web-api, web-frontend, backend-service, microservices, distributed-system
- **Tags:** identity, sso, oidc, zero-trust

## References

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)

