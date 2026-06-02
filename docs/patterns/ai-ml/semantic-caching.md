# Semantic Caching

> Cache model responses by semantic similarity rather than exact prompt text to reduce cost and latency for repeated intent.

**Scale:** data · **Category:** ai-ml · **Maturity:** emerging

## Description

Semantic Caching embeds incoming prompts or normalised request objects and looks for sufficiently similar previous requests with reusable responses. Unlike exact caches, it can hit when users phrase the same intent differently. Production semantic caches need careful scope, freshness, permission boundaries, answer provenance, similarity thresholds, and invalidation; otherwise they can serve plausible but wrong answers across tenants, time, or context.

**Problem.** LLM calls are expensive and slow, while users often ask semantically equivalent questions that differ only in wording.

**Context.** Use for high-volume read-like prompts where answers are stable for a corpus, model, policy, and user permission scope. Avoid for personalised, time-sensitive, or mutating operations unless keys include every relevant context dimension.

## Consequences / Trade-offs

- Can significantly reduce model spend and latency for repeated questions.
- Similarity thresholds are product decisions: too low returns wrong answers, too high misses savings.
- Cache entries must be scoped by tenant, permissions, model version, prompt template, and corpus version.
- Observability needs hit quality, not just hit rate, because bad hits are silent correctness failures.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●○○○ 2/5 | Usually premature unless model cost is already material or prompts are highly repetitive. |
| Medium (≤100k LOC) | ●●●●○ 4/5 | Good for support and RAG workloads with stable corpora and measurable repeated intent. |
| Large (>100k LOC) | ●●●●● 5/5 | Excellent at high volume, but requires careful scoping, invalidation, and hit-quality evaluation. |

## Examples

### Scope semantic cache entries

**❌ Negative (python)**

```python
def answer(question: str) -> str:
    hit = cache.nearest(embed(question), min_score=0.80)
    if hit:
        return hit.answer
    answer = llm.complete(question)
    cache.put(embed(question), answer)
    return answer
```

**✅ Positive (python)**

```python
def answer(question: str, user: User, corpus_version: str) -> str:
    key_scope = {
        "tenant": user.tenant_id,
        "role": user.role,
        "model": MODEL_VERSION,
        "corpus": corpus_version,
    }
    hit = cache.nearest(embed(normalise(question)), scope=key_scope, min_score=0.92)
    if hit and still_fresh(hit.sources, corpus_version):
        return hit.answer
    generated = rag_answer(question, user)
    cache.put(embed(normalise(question)), generated.answer, scope=key_scope, sources=generated.sources)
    return generated.answer
```

*The positive version scopes and validates cache hits by tenant, role, model, corpus, and source freshness instead of sharing approximate answers globally.*

## Relationships

**Synergies**

- [Retrieval-Augmented Generation (RAG)](../ai-ml/retrieval-augmented-generation.md) — RAG answers can be cached with source ids and corpus versions so freshness remains checkable.
- [Write-Through Cache](../data-persistence/write-through-cache.md) — Critical cached answers may be refreshed synchronously when canonical content changes.
- [Cache-Aside](../cloud-distributed/cache-aside.md) — Semantic caching often wraps model calls as a cache-aside read path on misses.
- [LLM Evaluation Harness](../ai-ml/evaluation-harness.md) — Similarity thresholds and cache-hit quality need regression tests over near-duplicate prompts.

**Conflicts with:** [Idempotency Key](../api-design/idempotency-key.md)

**Alternatives:** [Cache-Aside](../cloud-distributed/cache-aside.md), [Write-Through Cache](../data-persistence/write-through-cache.md), [Memoization](../functional/memoization.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** openai, huggingface, pgvector, pinecone, redis
- **Project types:** ml-system, backend-service, high-throughput, web-api
- **Tags:** caching, embeddings, cost-control

