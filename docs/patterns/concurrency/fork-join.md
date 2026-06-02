# Fork-Join

> Split a task into independent subtasks, run them in parallel, then join their results into one deterministic outcome.

**Scale:** concurrency · **Category:** concurrency · **Maturity:** time-tested

**Also known as:** Divide and conquer parallelism, Work-stealing fork/join

## Description

Fork-Join applies divide-and-conquer to parallel execution. A task either solves a small base case directly or forks independent subtasks that can run concurrently; after the subtasks complete, the parent joins their results. Efficient implementations use work-stealing pools so idle workers can execute queued subtasks without oversubscribing threads. The pattern is best when subtasks are CPU-bound, independent, and balanced enough that parallel overhead is smaller than the saved work.

**Problem.** A large CPU-bound computation is too slow sequentially, but naive thread creation per item overwhelms the scheduler and makes result aggregation error-prone.

**Context.** Use for recursive or batch computations that can be partitioned into independent chunks: sorting, searching, tree processing, map/reduce-style transforms, image processing, and numerical workloads.

## Consequences / Trade-offs

- Uses available cores effectively for independent CPU-bound work.
- Work-stealing can balance uneven recursive tasks without manual worker assignment.
- Poor thresholds create either too many tiny tasks or too little parallelism.
- Blocking I/O inside fork-join workers can starve the pool and delay unrelated computations.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for small CPU-bound libraries, but unnecessary for ordinary request/response code. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Strong when there are clear independent partitions and measured CPU bottlenecks. |
| Large (>100k LOC) | ●●●●○ 4/5 | Valuable in computation-heavy systems, though pool isolation and blocking discipline become critical at scale. |

## Examples

### Summing a large array with sensible thresholds

**❌ Negative (java)**

```java
long sum(int[] values) throws Exception {
  List<Thread> threads = new ArrayList<>();
  AtomicLong total = new AtomicLong();
  for (int value : values) {
    Thread t = new Thread(() -> total.addAndGet(value));
    threads.add(t);
    t.start();
  }
  for (Thread t : threads) t.join();
  return total.get();
}
```

**✅ Positive (java)**

```java
final class SumTask extends RecursiveTask<Long> {
  private static final int THRESHOLD = 10_000;
  private final int[] values;
  private final int start;
  private final int end;

  SumTask(int[] values, int start, int end) {
    this.values = values;
    this.start = start;
    this.end = end;
  }

  @Override protected Long compute() {
    if (end - start <= THRESHOLD) {
      long total = 0;
      for (int i = start; i < end; i++) total += values[i];
      return total;
    }
    int mid = (start + end) >>> 1;
    SumTask left = new SumTask(values, start, mid);
    SumTask right = new SumTask(values, mid, end);
    left.fork();
    return right.compute() + left.join();
  }
}

long sum(int[] values) {
  return ForkJoinPool.commonPool().invoke(new SumTask(values, 0, values.length));
}
```

*The positive version uses a bounded work-stealing pool and a threshold that keeps task overhead reasonable. Each subtask reads immutable input ranges and returns a local result, so aggregation needs no shared counter contention.*

## Relationships

**Synergies**

- [Thread Pool](../concurrency/thread-pool.md) — Fork-Join normally runs on a specialised pool to reuse workers and avoid creating threads per subtask.
- [Immutable Object](../concurrency/immutable-object.md) — Immutable inputs and outputs avoid locks between subtasks and make joins deterministic.
- [Map-Filter-Reduce](../functional/map-filter-reduce.md) — Map/reduce operations are a common fork-join shape: partition, map in parallel, then reduce results.
- [Barrier](../concurrency/barrier.md) — Join points act like local barriers where all subtasks must arrive before aggregation proceeds.

**Conflicts with:** [Reactor](../concurrency/reactor.md)

**Alternatives:** [Producer-Consumer](../concurrency/producer-consumer.md), [Future / Promise](../concurrency/future-promise.md), [Thread Pool](../concurrency/thread-pool.md)

## Applicability tags

- **Languages:** language-agnostic, java, cpp, csharp, scala, rust
- **Frameworks:** none
- **Project types:** backend-service, data-pipeline, ml-system, high-throughput
- **Tags:** parallelism, divide-and-conquer, work-stealing

## References

- Doug Lea, A Java Fork/Join Framework, (2000)

