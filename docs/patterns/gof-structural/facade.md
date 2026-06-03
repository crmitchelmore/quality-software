# Facade

> Provide a small, intention-revealing interface over a complex subsystem so clients use common workflows without knowing internal collaborators.

**Scale:** design · **Altitude:** low · **Category:** gof-structural · **Maturity:** time-tested

## Description

Facade defines a simpler entry point to a subsystem that would otherwise require callers to coordinate many classes, order-sensitive operations, or low-level APIs. It does not hide the subsystem from advanced use; it packages the common path behind a stable interface. A good facade expresses business or workflow intent, delegates to specialised collaborators, and keeps policy at the right layer rather than becoming a god object.

**Problem.** Clients repeatedly orchestrate the same subsystem steps, creating duplication, incorrect call order, and tight coupling to internal classes.

**Context.** Use when a subsystem has many moving parts but most clients need a small set of high-level workflows.

## Consequences / Trade-offs

- Reduces coupling between clients and subsystem internals.
- Centralises common orchestration and default choices.
- Can become an anemic pass-through if it adds no cohesive workflow.
- Can become a god object if unrelated operations accumulate behind one facade.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for simplifying awkward libraries, but can be unnecessary if there are only one or two calls. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for repeated workflows and module boundaries in services and modular monoliths. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for stabilising subsystem APIs across teams, provided ownership prevents facade bloat. |

## Examples

### Account onboarding subsystem

**❌ Negative (typescript)**

```typescript
class SignupController {
  async post(req: Request): Promise<Response> {
    const user = await users.create(req.body.email);
    await preferences.createDefaults(user.id);
    await billing.createTrialAccount(user.id);
    await mailer.sendWelcome(user.email);
    await audit.record("user.signup", user.id);
    return json({ id: user.id }, 201);
  }
}
```

**✅ Positive (typescript)**

```typescript
class OnboardingFacade {
  constructor(
    private readonly users: UserDirectory,
    private readonly preferences: PreferenceService,
    private readonly billing: BillingService,
    private readonly mailer: Mailer,
    private readonly audit: AuditLog,
  ) {}

  async onboard(email: string): Promise<UserId> {
    const user = await this.users.create(email);
    await this.preferences.createDefaults(user.id);
    await this.billing.createTrialAccount(user.id);
    await this.mailer.sendWelcome(user.email);
    await this.audit.record("user.signup", user.id);
    return user.id;
  }
}

class SignupController {
  constructor(private readonly onboarding: OnboardingFacade) {}
  async post(req: Request): Promise<Response> {
    return json({ id: await this.onboarding.onboard(req.body.email) }, 201);
  }
}
```

*The positive version gives controllers one cohesive onboarding operation and keeps subsystem ordering in one place. The underlying services remain separate and testable.*

## Relationships

**Synergies**

- [Adapter](../gof-structural/adapter.md) — A facade may expose a clean subsystem API while adapters translate individual external dependencies underneath.
- [Mediator](../gof-behavioural/mediator.md) — Mediator coordinates peer objects, while Facade gives clients a simple entry point to coordinated subsystem behaviour.
- [Service Layer](../enterprise-application/service-layer.md) — Service Layer is often an application-level facade over domain, repository, and integration collaborators.
- [API Gateway](../architecture/api-gateway.md) — API Gateway is an architectural facade over several backend services for external clients.

**Alternatives:** [Adapter](../gof-structural/adapter.md), [Mediator](../gof-behavioural/mediator.md), [Service Layer](../enterprise-application/service-layer.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** none, spring-boot, dotnet, nestjs
- **Project types:** backend-service, web-api, modular-monolith, library
- **Tags:** simplification, orchestration, subsystem

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

