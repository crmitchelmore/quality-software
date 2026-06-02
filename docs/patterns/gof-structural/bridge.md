# Bridge

> Split an abstraction from its implementation hierarchy so both can vary independently without an explosion of subclasses.

**Scale:** design · **Category:** gof-structural · **Maturity:** time-tested

## Description

Bridge separates the high-level abstraction clients use from a lower-level implementor interface that performs platform- or provider-specific work. The abstraction delegates to the implementor through composition rather than inheritance. This is most useful when two dimensions vary independently, such as shapes and renderers, notifications and transports, or domain services and storage engines.

**Problem.** Combining two independent variation axes through inheritance creates a class for every combination and forces unrelated changes into the same hierarchy.

**Context.** Use when an abstraction and its implementation details both need to evolve, be selected at runtime, or be tested independently.

## Consequences / Trade-offs

- Avoids subclass explosion by replacing inheritance with composition.
- Lets implementations be swapped without changing the abstraction interface.
- Requires careful interface design; a leaky implementor couples the abstraction back to concrete platforms.
- Adds indirection that can feel unnecessary when only one axis varies.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually too abstract until two genuine variation axes appear. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for libraries, SDKs, and services with provider/platform implementations. |
| Large (>100k LOC) | ●●●●○ 4/5 | Helps large systems avoid inheritance matrices, but needs disciplined interface ownership. |

## Examples

### Notifications across transports

**❌ Negative (typescript)**

```typescript
class EmailInvoiceNotification {
  async send(invoice: Invoice): Promise<void> { await smtp.send(renderInvoice(invoice)); }
}
class SmsInvoiceNotification {
  async send(invoice: Invoice): Promise<void> { await twilio.send(renderInvoice(invoice)); }
}
class EmailPasswordResetNotification {
  async send(user: User): Promise<void> { await smtp.send(renderReset(user)); }
}
class SmsPasswordResetNotification {
  async send(user: User): Promise<void> { await twilio.send(renderReset(user)); }
}
```

**✅ Positive (typescript)**

```typescript
interface MessageTransport {
  send(to: string, body: string): Promise<void>;
}

abstract class Notification {
  constructor(protected readonly transport: MessageTransport) {}
  protected abstract render(): { to: string; body: string };
  async send(): Promise<void> {
    const message = this.render();
    await this.transport.send(message.to, message.body);
  }
}

class InvoiceNotification extends Notification {
  constructor(private readonly invoice: Invoice, transport: MessageTransport) { super(transport); }
  protected render() { return { to: this.invoice.email, body: renderInvoice(this.invoice) }; }
}

const notification = new InvoiceNotification(invoice, new SmsTransport(twilio));
await notification.send();
```

*The positive version varies message type and transport independently. Adding push notifications or a new notification kind no longer requires classes for every combination.*

## Relationships

**Synergies**

- [Composition over Inheritance](../implementation/composition-over-inheritance.md) — Bridge is a canonical object-level application of composition over inheritance.
- [Abstract Factory](../gof-creational/abstract-factory.md) — An abstract factory can provide compatible implementors for a chosen platform family.
- [Adapter](../gof-structural/adapter.md) — Implementors are often adapters around platform-specific APIs.
- [Strategy](../gof-behavioural/strategy.md) — Both delegate behaviour through an interface; Bridge emphasises separating abstraction and implementation axes.

**Alternatives:** [Adapter](../gof-structural/adapter.md), [Strategy](../gof-behavioural/strategy.md), [Template Method](../gof-behavioural/template-method.md)

## Applicability tags

- **Languages:** language-agnostic, java, csharp, typescript, python
- **Frameworks:** none
- **Project types:** library, sdk, desktop-app, backend-service
- **Tags:** composition, abstraction, variation

## References

- Gamma, Helm, Johnson, Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, (1994)

