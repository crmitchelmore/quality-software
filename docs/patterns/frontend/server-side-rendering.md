# Server-Side Rendering

> Render initial HTML on the server so users and crawlers receive meaningful content before client-side JavaScript hydrates interactivity.

**Scale:** frontend · **Category:** frontend · **Maturity:** time-tested

**Also known as:** SSR

## Description

Server-Side Rendering runs the view layer on the server for the initial request, returning HTML that already contains page content. The client may then hydrate the markup to attach event handlers and continue as an interactive app. SSR improves first contentful paint, resilience and indexing for many content-heavy applications, but it introduces a dual runtime where code must be safe on both server and browser.

**Problem.** Pure client rendering can leave users staring at a blank shell while JavaScript downloads, parses, fetches data and renders the first meaningful screen.

**Context.** Use for content, commerce, marketing, dashboards and authenticated apps where initial load performance, SEO, share previews or low-end devices matter.

## Consequences / Trade-offs

- Improves perceived performance and crawlable content.
- Enables server-side data loading close to backends.
- Adds hydration complexity, caching strategy and server operational cost.
- Browser-only APIs must be isolated from server-rendered code paths.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for content-heavy small sites, but static generation may be simpler when data changes rarely. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong fit for commerce and product apps balancing interactivity with initial load performance. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable at scale, but requires careful caching, observability and hydration performance budgets. |

## Examples

### Moving first render data loading to the server

**❌ Negative (typescript)**

```typescript
export function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => { api.getProduct(location.pathname).then(setProduct); }, []);
  if (!product) return <Spinner />;
  return <ProductDetails product={product} />;
}
```

**✅ Positive (typescript)**

```typescript
export async function loader({ params }: LoaderArgs) {
  return json({ product: await catalogue.getProduct(params.slug) });
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  return <ProductDetails product={product} />;
}
```

*The positive version returns meaningful product HTML in the first response, avoiding a blank client shell and making data loading part of the route contract.*

## Relationships

**Synergies**

- [Client-Server](../architecture/client-server.md) — SSR formalises a client-server split where the server produces initial UI state and HTML.
- [Cache-Aside](../cloud-distributed/cache-aside.md) — Server-rendered pages often rely on caching data or fragments to avoid per-request bottlenecks.
- [Component-Based UI](../frontend/component-based-ui.md) — Isomorphic components can render on the server and hydrate on the client.
- [Islands Architecture](../frontend/islands-architecture.md) — Islands build on SSR by hydrating only interactive regions instead of the whole page.

**Alternatives:** [Islands Architecture](../frontend/islands-architecture.md), [Template View](../enterprise-application/template-view.md), [Client-Server](../architecture/client-server.md)

## Applicability tags

- **Languages:** typescript, javascript
- **Frameworks:** nextjs, remix, react, vue, angular
- **Project types:** web-frontend, web-api, serverless
- **Tags:** performance, hydration, seo

## References

- [Next.js Rendering](https://nextjs.org/docs/app/building-your-application/rendering)
- [Remix Data Loading](https://remix.run/docs/en/main/guides/data-loading)

