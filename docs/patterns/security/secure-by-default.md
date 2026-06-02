# Secure by Default

> Design APIs, configurations, and workflows so the easiest path is the safe path and insecure behaviour requires explicit, visible opt-in.

**Scale:** design · **Category:** security · **Maturity:** time-tested

**Also known as:** Safe defaults, Default deny

## Description

Secure by Default moves security from optional diligence into product and API design. New routes require authentication unless marked public, cookies default to Secure and HttpOnly, debug features are off outside development, and generated credentials are scoped and short-lived. Defaults should fail closed and be hard to accidentally weaken. This pattern reduces reliance on every caller remembering every security knob and makes dangerous choices reviewable.

**Problem.** Insecure defaults are copied widely; teams ship exposed admin routes, permissive CORS, debug modes, or broad permissions because unsafe setup was the path of least resistance.

**Context.** Use when designing frameworks, service templates, platform defaults, libraries, and product features with security-relevant configuration.

## Consequences / Trade-offs

- Prevents classes of misconfiguration before code review or scanning.
- Makes exceptions explicit and auditable.
- Can frustrate rapid prototyping if escape hatches are unclear; provide safe local-development modes.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●●○ 4/5 | High leverage even in small apps because defaults are copied. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Excellent for service templates and shared libraries used by multiple teams. |
| Large (>100k LOC) | ●●●●● 5/5 | Essential for platforms and large organisations where configuration drift is inevitable. |

## Examples

### Authentication middleware defaults

**❌ Negative (typescript)**

```typescript
const router = express.Router();

router.get("/health", health);
router.get("/admin/users", adminUsers); // accidentally public
router.post("/admin/reindex", reindex); // accidentally public
```

**✅ Positive (typescript)**

```typescript
const router = express.Router();
router.use(requireAuthenticatedUser);

router.get("/health", allowAnonymous, health);
router.get("/admin/users", requireScope("users:admin:read"), adminUsers);
router.post("/admin/reindex", requireScope("search:admin:write"), reindex);
```

*The positive router requires authentication by default and makes public access the exception. Sensitive routes then add explicit scopes, reducing accidental exposure.*

## Relationships

**Synergies**

- [Principle of Least Privilege](../security/least-privilege.md) — Default-deny permissions make least privilege the natural starting point.
- [Input Validation (Allow-List)](../security/input-validation.md) — Reject-by-default validators embody secure-by-default at data boundaries.
- [Output Encoding](../security/output-encoding.md) — Auto-escaping templates make safe rendering the default path.
- [Defense in Depth](../security/defense-in-depth.md) — Secure defaults ensure each layer starts in its safest reasonable state.

**Alternatives:** [Defense in Depth](../security/defense-in-depth.md)

## Applicability tags

- **Languages:** language-agnostic, javascript, typescript, python, java
- **Frameworks:** none, nodejs, express, spring-boot, fastapi, django
- **Project types:** web-api, backend-service, microservices, distributed-system, web-frontend
- **Tags:** safe-defaults, default-deny, configuration

