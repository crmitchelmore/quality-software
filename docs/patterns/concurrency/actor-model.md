# Actor Model

> Encapsulate mutable state inside independently scheduled actors that communicate only by asynchronous messages.

**Scale:** concurrency · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Actors, Share-nothing message passing

## Description

The Actor Model represents concurrent components as actors with private state, a mailbox, and behaviour for handling one message at a time. An actor may update its own state, send messages to other actors, create new actors, or change its behaviour for the next message, but it never exposes its state for direct shared-memory access. This turns many locking problems into message-routing, supervision, and protocol-design problems. It is especially strong where workloads are naturally partitioned by entity, session, device, room, or aggregate.

**Problem.** Shared mutable state protected by ad-hoc locks becomes fragile as the number of concurrent operations grows, producing races, deadlocks, and unclear ownership.

**Context.** Use when state can be partitioned into independent owners that process commands/events sequentially, and when asynchronous messaging is acceptable for coordination.

## Consequences / Trade-offs

- Eliminates data races inside each actor because only that actor mutates its private state.
- Aligns well with supervision, location transparency, and failure isolation in Erlang/Elixir/Akka-style systems.
- Requires explicit message protocols, mailbox sizing, and monitoring for stuck or overloaded actors.
- Cross-actor invariants are harder than in shared-memory transactions; they need sagas, choreography, or careful orchestration.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Often too much ceremony for small apps unless the domain is already event/session oriented. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong for chat, device, workflow, and game domains where state partitions naturally by identity. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent in large concurrent systems when paired with supervision, mailbox backpressure, and clear message contracts. |

## Examples

### Serialising account updates by actor ownership

**❌ Negative (scala)**

```scala
final class Account(var balance: BigDecimal)
val account = new Account(100)

def withdraw(amount: BigDecimal): Future[Boolean] = Future {
  if (account.balance >= amount) {
    account.balance = account.balance - amount // race under concurrent calls
    true
  } else false
}
```

**✅ Positive (scala)**

```scala
sealed trait AccountCommand
final case class Withdraw(amount: BigDecimal, replyTo: ActorRef[Boolean]) extends AccountCommand

final class AccountActor extends AbstractBehavior[AccountCommand] {
  private var balance: BigDecimal = 100

  override def onMessage(message: AccountCommand): Behavior[AccountCommand] = message match {
    case Withdraw(amount, replyTo) if balance >= amount =>
      balance = balance - amount
      replyTo ! true
      this
    case Withdraw(_, replyTo) =>
      replyTo ! false
      this
  }
}
```

*The positive version gives one actor exclusive ownership of the account balance. Concurrent callers enqueue messages, but the actor processes them one at a time, so the invariant is checked and updated atomically within the actor.*

## Relationships

**Synergies**

- [Communicating Sequential Processes (CSP)](../concurrency/communicating-sequential-processes.md) — Both use message passing; actors emphasise identity and mailboxes, while CSP emphasises channel topology and rendezvous.
- [Message Channel](../enterprise-integration/message-channel.md) — Actor mailboxes are specialised message channels with ownership, ordering, and delivery semantics that must be designed deliberately.
- [Saga](../cloud-distributed/saga.md) — Long-running workflows across actors often need sagas to coordinate state changes without shared transactions.
- [Bulkhead](../resilience/bulkhead.md) — Actor systems can isolate risky tenants or subsystems behind separate dispatchers, supervisors, or mailbox limits.

**Conflicts with:** [Thread-Specific Storage](../concurrency/thread-specific-storage.md)

**Alternatives:** [Communicating Sequential Processes (CSP)](../concurrency/communicating-sequential-processes.md), [Monitor Object](../concurrency/monitor-object.md), [Active Object](../concurrency/active-object.md)

## Applicability tags

- **Languages:** language-agnostic, erlang, elixir, scala, java, csharp
- **Frameworks:** akka, phoenix, none
- **Project types:** backend-service, realtime-system, distributed-system, game
- **Tags:** message-passing, share-nothing, supervision

## References

- Carl Hewitt, Peter Bishop, Richard Steiger, A Universal Modular ACTOR Formalism for Artificial Intelligence, (1973)
- Logan, Merritt, Carlsson, Erlang and OTP in Action, (2010)

