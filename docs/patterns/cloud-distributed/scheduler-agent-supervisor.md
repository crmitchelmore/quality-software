# Scheduler-Agent-Supervisor

> Split distributed work into a scheduler that assigns jobs, agents that execute them, and a supervisor that monitors progress and recovery.

**Scale:** integration · **Category:** cloud-distributed · **Maturity:** established

## Description

Scheduler-Agent-Supervisor separates coordination from execution. The scheduler decides what work should run and where, agents perform isolated units of work, and the supervisor tracks heartbeats, deadlines, retries, cancellation, and escalation. The pattern is useful when long-running or resource-specific jobs need visibility and recovery beyond a simple queue consumer. Clear leases, idempotent job effects, and durable state prevent lost or duplicated work.

**Problem.** Background work spread across machines becomes hard to assign, observe, cancel, and recover when workers disappear or jobs exceed expected duration.

**Context.** Build farms, data processing, media transcoding, provisioning, scheduled operations, and any distributed job system requiring explicit supervision.

## Consequences / Trade-offs

- Gives clear ownership of assignment, execution, and recovery responsibilities.
- Improves observability for long-running work through heartbeats and job state.
- Adds coordination state and leases that must be kept consistent under failures.
- Requires idempotent agents because retries and reassignments are normal.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Too much machinery for simple cron jobs or one-process queues. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good fit for visible, retryable background work that outgrows basic queue consumers. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent for large job platforms where assignment, supervision, and recovery are core capabilities. |

## Examples

### Supervising export jobs

**❌ Negative (python)**

```python
def run_exports():
    for job in db.pending_exports():
        export_customer_file(job.customer_id)  # no lease, heartbeat, or recovery
        db.mark_done(job.id)
```

**✅ Positive (python)**

```python
def agent_loop(agent_id: str):
    job = scheduler.claim_next(agent_id, lease_seconds=60)
    if not job:
        return
    try:
        supervisor.heartbeat(job.id, agent_id)
        export_customer_file(job.customer_id, idempotency_key=job.id)
        supervisor.complete(job.id, agent_id)
    except Exception as exc:
        supervisor.fail_or_requeue(job.id, agent_id, str(exc))
```

*The positive version gives jobs a lease, heartbeat, completion, and requeue path, allowing the supervisor to recover work when agents fail mid-job.*

## Relationships

**Synergies**

- [Leader Election](../cloud-distributed/leader-election.md) — Only one scheduler should often make global assignment decisions for a queue or partition.
- [Competing Consumers](../cloud-distributed/competing-consumers.md) — Agents may consume independent jobs concurrently once the scheduler has partitioned work.
- [Idempotency](../resilience/idempotency.md) — Reassigned jobs can repeat after agent loss and must not duplicate side effects.
- [Timeout](../resilience/timeout.md) — Supervisors rely on deadlines to detect stuck or lost agents.

**Alternatives:** [Queue-Based Load Leveling](../cloud-distributed/queue-based-load-leveling.md), [Competing Consumers](../cloud-distributed/competing-consumers.md), [Actor Model](../concurrency/actor-model.md)

## Applicability tags

- **Languages:** language-agnostic, go, java, csharp, typescript, python
- **Frameworks:** kubernetes, celery, akka, rabbitmq, kafka
- **Project types:** backend-service, distributed-system, data-pipeline, etl, high-throughput
- **Tags:** jobs, supervision, scheduling, worker-pool

## References

- [Microsoft Azure Architecture Center; Scheduler Agent Supervisor pattern](https://learn.microsoft.com/azure/architecture/patterns/scheduler-agent-supervisor)

