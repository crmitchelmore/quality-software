# Memory & Context-Window Management

> Select, summarise, evict, and persist context deliberately so LLM workflows stay relevant, private, and within token limits.

**Scale:** design · **Category:** ai-ml · **Maturity:** emerging

## Description

Memory and Context-Window Management controls what information enters an LLM prompt and what survives across turns or runs. It combines short-term conversation state, retrieved facts, summaries, user preferences, task state, and durable memory with policies for relevance, recency, permissions, and deletion. The pattern matters because context is both capability and attack surface: too little loses continuity, too much wastes tokens and leaks irrelevant or sensitive data.

**Problem.** Naively appending every message or stored memory eventually exceeds context windows, increases cost, dilutes attention, and can expose stale or sensitive information.

**Context.** Use for chat, agents, copilots, and long-running workflows where state spans more than one model call. Avoid persistent memory unless users understand and can control what is stored.

## Consequences / Trade-offs

- Improves continuity and relevance while keeping prompts within token and latency budgets.
- Memory selection mistakes can cause stale instructions, privacy leaks, or missing critical facts.
- Summaries are lossy and need provenance when decisions depend on exact details.
- Durable memory requires deletion, consent, tenancy, and audit controls like any other data store.

## Ratings by project size

| Project size | Score | Notes |
| --- | --- | --- |
| Small (<10k LOC) | ●●●○○ 3/5 | Useful for chat prototypes, but persistent memory may be overkill without repeated users. |
| Medium (≤100k LOC) | ●●●●● 5/5 | Essential for production assistants with multi-turn tasks and privacy expectations. |
| Large (>100k LOC) | ●●●●● 5/5 | Critical at scale, requiring tenancy, retention, provenance, summarisation quality, and memory-access audits. |

## Examples

### Select relevant context instead of appending everything

**❌ Negative (typescript)**

```typescript
conversation.push(userMessage);
const answer = await model.complete(conversation.map(m => m.text).join("\n"));
```

**✅ Positive (typescript)**

```typescript
const recent = conversation.lastTurns(8);
const memories = await memory.search(user.id, userMessage.text, { limit: 5 });
const summary = await summaries.current(conversation.id);

const prompt = contextBuilder.build({
  system: policy.systemPrompt,
  summary,
  recent,
  memories: memories.filter(m => m.consent === "active"),
  maxTokens: 12_000
});

const answer = await model.complete(prompt);
```

*The positive version combines bounded recent turns, consented relevant memories, and a summary under a token budget instead of blindly appending the whole transcript.*

## Relationships

**Synergies**

- [Retrieval-Augmented Generation (RAG)](../ai-ml/retrieval-augmented-generation.md) — Retrieval can supply long-term factual context without stuffing everything into the prompt.
- [Semantic Caching](../ai-ml/semantic-caching.md) — Context fingerprints help decide whether a cached semantic answer is still reusable.
- [Repository](../data-persistence/repository.md) — A memory repository can encapsulate tenancy, retention, and relevance queries.
- [Principle of Least Privilege](../security/least-privilege.md) — Memory access should be scoped so agents cannot read unrelated user or tenant data.

**Conflicts with:** [Singleton](../gof-creational/singleton.md)

**Alternatives:** [Retrieval-Augmented Generation (RAG)](../ai-ml/retrieval-augmented-generation.md), [Memento](../gof-behavioural/memento.md), [Event Sourcing](../architecture/event-sourcing.md)

## Applicability tags

- **Languages:** language-agnostic, python, typescript
- **Frameworks:** langchain, llamaindex, openai, pgvector, none
- **Project types:** ml-system, backend-service, web-api, prototype
- **Tags:** memory, context-window, privacy

