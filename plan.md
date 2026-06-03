
---
## RE-ARCHITECTURE: language-neutral + LLM-first detection (epic quality-software-4e4)

Driver: tool was JS-only; user wants (a) all languages and (b) LLM as the CORE
pattern-detection mechanism, regex/AST demoted to a supporting accelerator + the
only merge-gate verifier. Design validated by rubber-duck → docs 15 + 16.

Build order (rubber-duck): provider seam → L0 universal → Kotlin det. win →
LLM advisory → certified blocking (LLM blocking LAST).

- [x] Phase 1 (ypn): LanguageProvider seam + neutral code model (provenance/tiers).
- [x] Phase 2 (dr8): L0 universal provider (regex-line) for kotlin/java/scala/python/
      go/csharp/rust/ruby/php/swift + broad walker + orchestrator FQN/symbol index.
      standards-compliance Kotlin repo: 4 empty → 530 modules / 1265 edges.
- [~] Phase 3 (phn): tree-sitter L1 Kotlin — DEFERRED (user demoted deterministic
      parsing; L0 already unlocked all languages). Pick up before live JVM blocking.
- [x] Phase 4 (272): LLM advisory layer — provider-agnostic LLMClient + fake/offline,
      ModelRouter + hard Budget, catalogue-grounded judge, strict structured output,
      injection hardening (content-derived fence, code-as-data, span-in-region,
      relabel guard), fail-open, replay cache, full audit. advisory=true enforced at
      the Finding level so CI gates can NEVER block on an LLM finding (design 16.2).
- [x] Phase 5 (vnc): certified blocking evidence contract (policy/ deterministic
      certifier = ONLY source of block severity; corroborate() links LLM↔predicate)
      + eval harness (judge precision/recall by held-out set; certifier false-block
      rate with a 'promotable' gate).

Tests: integration suite 63/63 green (was 33). New: judge.test.ts (27), policy.test.ts,
multi-language model test. Design: docs 15, 16 (+16.13/16.14 impl notes), doc 13 amended.
Invariant held throughout: LLM-first for breadth/reasoning (advisory); deterministic
predicates for blocking. Offline ⇒ deterministic-only (no LLM findings).
