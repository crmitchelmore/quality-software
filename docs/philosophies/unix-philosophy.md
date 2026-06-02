# The Unix Philosophy

> Build small programs that each do one thing well and compose them through uniform text interfaces, favouring simplicity, composability and clarity over monolithic features.

**Origin:** Doug McIlroy, Ken Thompson, Dennis Ritchie, Rob Pike · *The Bell System Technical Journal (Unix issue) and The Art of Unix Programming* · (1978)

**Also known as:** Do one thing well, McIlroy's tenets

## Description

The Unix philosophy emerged from Bell Labs as a set of pragmatic design maxims for building software out of small, sharp tools. McIlroy's summary — "write programs that do one thing and do it well; write programs to work together; write programs to handle text streams, because that is a universal interface" — captures its core. Programs are designed as composable filters connected by pipes, so capability comes from combination rather than from monolithic feature sets. The tradition prizes simplicity, transparency (favour readable text over binary), building prototypes early, and using software leverage and automation rather than bespoke effort. Eric Raymond later codified the broader rule-set (modularity, composition, separation, least surprise, silence, repair, economy) in The Art of Unix Programming.

**In practice.** Prefer composing existing commands over writing a new monolith; design CLIs that read stdin and write stdout so they pipe; emit machine-friendly text; keep flags orthogonal; let the shell and pipelines provide the glue. The same instincts shape good microservice and data-pipeline design.

## Core tenets

- Make each program do one thing well; if it grows, build a fresh tool rather than complicate the old one.
- Expect the output of every program to become the input to another as yet unknown program — design for composition.
- Prefer text streams as the universal interface, because they are inspectable and combine with every other tool.
- Build a prototype as soon as possible and iterate; throw away clumsy parts without hesitation.
- Use tools and automation to lighten programming, even if you must detour to build the tools.
- Rule of silence — programs should say nothing they don't have to, so they compose cleanly.

## Key ideas

- **Pipes and filters** — The pipe operator turns independent programs into a processing pipeline, the canonical mechanism of Unix composition.
- **Mechanism, not policy** — Tools should provide mechanism and leave policy to the caller, keeping them reusable across contexts.
- **Text as the narrow waist** — A single universal interface (lines of text) lets an open-ended set of tools interoperate without prior agreement.

## Associated patterns

Patterns from the catalogue that embody or operationalise this philosophy:

- [Pipes and Filters](../patterns/architecture/pipes-and-filters.md) — The direct architectural embodiment of Unix composition — independent stages connected by a uniform stream interface.
- [Middleware Pipeline](../patterns/implementation/middleware-pipeline.md) — Applies the same compose-small-stages idea inside a process, each handler doing one thing.
- [Strategy](../patterns/gof-behavioural/strategy.md) — Mechanism-not-policy: a tool exposes a slot for pluggable behaviour rather than hard-coding one policy.
- [Map-Filter-Reduce](../patterns/functional/map-filter-reduce.md) — Stream transformation composed from small, single-purpose operations mirrors filter pipelines.
- [Microservices](../patterns/architecture/microservices.md) — "Do one thing well" and compose over clear interfaces is the small-services rationale, scaled to the network.

## Patterns in tension

Patterns this philosophy would caution against or use sparingly:

- [Monolith](../patterns/architecture/monolith.md) — A single large program bundling many responsibilities is the opposite of small, composable tools.

## Reported applications

Where this philosophy has reportedly been applied (with source and evidence strength):

| Where | What | Evidence | Source |
| --- | --- | --- | --- |
| Unix / Linux userland | The coreutils and classic toolset (grep, sort, awk, sed, pipes) are the original and enduring demonstration of composable single-purpose tools. | primary source | The Bell System Technical Journal, Unix Time-Sharing System issue |
| Git | Git's plumbing-vs-porcelain split exposes small composable commands that scripts combine, a deliberately Unix-style design. | secondary source | [Pro Git — plumbing and porcelain](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain) |
| Go toolchain and standard library | Rob Pike (a Unix originator) carried the philosophy into Go's small orthogonal tools and io.Reader/io.Writer composition. | secondary source | Rob Pike, Notes on Programming and Go design talks |

**Best for:** cli-tool, data-pipeline, backend-service, microservices

## Relationships with other philosophies

**Complements:** [Worse Is Better](worse-is-better.md), [Simple Made Easy](simple-made-easy.md), [Information Hiding & Modular Decomposition](information-hiding.md)

**In tension with**

- [Domain-Driven Design](domain-driven-design.md) — Unix favours generic, context-free text tools; DDD favours rich, domain-specific models and a ubiquitous language tied to one bounded context.
- [Design by Contract](design-by-contract.md) — Text-stream composition relies on tolerant parsing and convention rather than the precise, checked interface contracts DbC prescribes.

## Criticisms / limits

- Text-stream interfaces push parsing and error handling onto every consumer and can lose type safety and structure.
- Doing only one thing well can fragment a problem into many tools whose orchestration becomes its own complexity.

## References

- Brian Kernighan, Rob Pike, The Unix Programming Environment, (1984)
- Eric S. Raymond, The Art of Unix Programming, (2003)
- Rob Pike, Brian Kernighan, Program Design in the UNIX Environment, (1984)

