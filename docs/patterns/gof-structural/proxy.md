# Proxy

> Stand in for another object behind the same interface to control access, defer work, add protection, or represent a remote resource.

**Scale:** design · **Altitude:** low · **Category:** gof-structural · **Maturity:** time-tested

## Description

Proxy wraps a subject and exposes the same interface, but its primary intent is control rather than adding arbitrary responsibilities. A proxy may lazy-load an expensive object, check permissions before delegation, cache remote results, record access, or translate local calls into remote calls. Clients use the subject interface while the proxy manages lifecycle, location, or access policy.

**Problem.** Clients need to interact with a resource, but direct access is too expensive, unsafe, remote, or lifecycle-sensitive.

**Context.** Use for virtual loading, access control, remote service stubs, cache guards, and instrumentation around expensive subjects.

## Consequences / Trade-offs

- Keeps clients independent of lifecycle, location, or access-control mechanics.
- Enables lazy loading and protective checks without changing the subject.
- Can surprise callers if proxy behaviour differs observably from the real subject.
- Remote proxies can hide network latency and failure behind ordinary method calls.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for lazy or protected resources, but excessive if a direct call plus guard is sufficient. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for access control, remote clients, caching guards, and expensive resources behind stable interfaces. |
| Large (>100k LOC) | ●●●●○ 4/5 | Strong for standardising access policy and remote stubs, but document latency and failure semantics clearly. |

## Examples

### Protecting document access

**❌ Negative (typescript)**

```typescript
class DocumentController {
  constructor(private readonly store: DocumentStore) {}
  async get(user: User, id: string): Promise<Document> {
    const document = await this.store.load(id);
    if (!user.canRead(document.tenantId)) throw new Error("forbidden");
    return document;
  }
}

class ExportJob {
  constructor(private readonly store: DocumentStore) {}
  async export(user: User, id: string): Promise<Buffer> {
    const document = await this.store.load(id);
    return renderPdf(document);
  }
}
```

**✅ Positive (typescript)**

```typescript
interface DocumentReader {
  load(id: string): Promise<Document>;
}

class SecureDocumentReader implements DocumentReader {
  constructor(private readonly inner: DocumentReader, private readonly user: User) {}
  async load(id: string): Promise<Document> {
    const document = await this.inner.load(id);
    if (!this.user.canRead(document.tenantId)) throw new ForbiddenDocument(id);
    return document;
  }
}

class ExportJob {
  constructor(private readonly documents: DocumentReader) {}
  async export(id: string): Promise<Buffer> {
    return renderPdf(await this.documents.load(id));
  }
}
```

*The positive version puts access control in a proxy that implements the same reader interface. Every consumer receives the protected reader, so one forgotten permission check cannot bypass policy.*

## Relationships

**Synergies**

- [Lazy Initialization](../implementation/lazy-initialization.md) — Virtual proxies often instantiate the real subject only on first use.
- [Decorator](../gof-structural/decorator.md) — Both share the subject interface; Decorator adds responsibilities while Proxy controls access to the subject.
- [Principle of Least Privilege](../security/least-privilege.md) — Access-control proxies enforce least-privilege decisions at the object boundary before delegation.
- [Adapter](../gof-structural/adapter.md) — A remote proxy may also adapt transport-specific APIs to the subject interface.

**Alternatives:** [Decorator](../gof-structural/decorator.md), [Adapter](../gof-structural/adapter.md), [Facade](../gof-structural/facade.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** none, spring-boot, dotnet, nodejs
- **Project types:** backend-service, web-api, sdk, desktop-app
- **Tags:** access-control, lazy-loading, indirection

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

