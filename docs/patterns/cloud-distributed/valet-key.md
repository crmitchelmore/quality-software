# Valet Key

> Give a client a short-lived, tightly scoped token or URL so it can access a specific resource directly without receiving broad service credentials.

**Scale:** integration · **Altitude:** medium · **Category:** cloud-distributed · **Maturity:** established

## Description

Valet Key delegates limited access to a resource by minting a constrained credential, commonly a pre-signed object-storage URL or scoped access token. The application authorises the user and decides the permitted operation, object, expiry, and constraints, then lets the client interact directly with storage or another service. This removes the application from high-volume data transfer while preserving least privilege and auditability when credentials are narrow and short lived.

**Problem.** Proxying every upload or download through the application wastes compute and bandwidth, but handing clients long-lived storage credentials is dangerous.

**Context.** Use for direct browser or mobile access to object storage, media uploads, partner file exchange, and any operation where the resource provider can enforce scope and expiry on delegated credentials.

## Consequences / Trade-offs

- Reduces application bandwidth and avoids buffering large payloads in API servers.
- Limits blast radius through object-specific permissions and short expiry.
- Requires careful validation of object names, content type, size, and expiry.
- Revocation is hard once a signed URL is issued unless the backing service supports it.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Not worth it for tiny files or internal-only tools. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for user uploads and downloads once API bandwidth or credential exposure matters. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for high-volume media and document systems using object storage. |

## Examples

### Direct upload without broad credentials

**❌ Negative (typescript)**

```typescript
// The API handles the whole file and uses broad storage credentials for every request.
app.post("/uploads", requireUser, upload.single("file"), async (req, res) => {
  await storage.putObject({ bucket: "media", key: req.file.originalname, body: req.file.buffer });
  res.sendStatus(201);
});
```

**✅ Positive (typescript)**

```typescript
app.post("/upload-requests", requireUser, async (req, res) => {
  const key = `users/${req.user.id}/${crypto.randomUUID()}.jpg`;
  const url = await storage.createSignedPutUrl({
    bucket: "media",
    key,
    expiresInSeconds: 300,
    contentType: "image/jpeg",
    maxBytes: 5_000_000,
  });
  res.json({ key, uploadUrl: url });
});
```

*The positive version authorises the user once and returns a narrow, expiring upload URL, so the client transfers directly to storage without broad credentials.*

## Relationships

**Synergies**

- [Token-Based Authentication](../security/token-based-auth.md) — The application first authenticates the user before minting a delegated token.
- [Principle of Least Privilege](../security/least-privilege.md) — The issued key should allow exactly one action on one resource for a short period.
- [Gatekeeper](../cloud-distributed/gatekeeper.md) — A gatekeeper can centralise the policy for which clients may request valet keys.
- [Audit Logging](../security/audit-logging.md) — Recording key issuance and resource identifiers preserves traceability when clients access storage directly.

**Alternatives:** [Gateway Offloading](../cloud-distributed/gateway-offloading.md), [API Gateway](../architecture/api-gateway.md), [Backend for Frontend (BFF)](../architecture/backend-for-frontend.md)

## Applicability tags

- **Languages:** language-agnostic, typescript, java, csharp, go, python
- **Frameworks:** nodejs, spring-boot, dotnet, fastapi, aws-lambda
- **Project types:** web-api, backend-service, mobile-app, serverless
- **Tags:** delegated-access, object-storage, least-privilege

## References

- [Microsoft Azure Architecture Center; Valet Key pattern](https://learn.microsoft.com/azure/architecture/patterns/valet-key)

