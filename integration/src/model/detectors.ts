import type { ModuleInfo, CandidatePattern, Layer } from "./project-map.js";

/**
 * Declarative structural detector registry (design 14, tier-3 advisory).
 *
 * These complement the bespoke detectors in `inferCandidates` (hexagonal, layered,
 * event-sourcing, cqrs, aggregate, domain-event, modular-monolith, strategy,
 * repository, factory) with a broad, data-driven sweep across the catalogue.
 *
 * IMPORTANT — honesty about reach: structural/naming/import signals reliably surface
 * patterns that have a *recognisable fingerprint* (a naming convention, a framework
 * import, a JDK type). Many catalogue patterns (e.g. guard-clause, dry, pure-function,
 * template-method) have no such fingerprint and are intentionally NOT covered here —
 * they are deferred to the semantic (LLM) detector. Every `patternId` below MUST exist
 * in the knowledge graph; ids are validated against the catalogue by the caller.
 *
 * Confidence is deliberately conservative: naming/import evidence is suggestive, not
 * proof, so most rules cap at `low`/`medium`.
 */

const TYPE_KINDS = new Set(["class", "interface", "enum", "type"]);

/** Match exported *type* declarations by name (whole-name regex). */
export interface NameRule {
  patternId: string;
  /** Regex applied to an exported type name. */
  re: RegExp;
  /** Minimum distinct matching type names to emit at all. */
  min: number;
  /** Count at which confidence becomes "medium" (else "low"). */
  medAt?: number;
  /** Human label for the matched things, e.g. "*Adapter type(s)". */
  label: string;
  /** Restrict to a layer (optional). */
  layer?: Layer;
  /** Restrict to a declaration kind (optional, e.g. only interfaces). */
  kind?: string;
}

/** Match modules by an import specifier (framework/JDK fingerprint). */
export interface ImportRule {
  patternId: string;
  re: RegExp;
  /** Minimum distinct modules importing a match. */
  min: number;
  medAt?: number;
  /** Human label, e.g. "Resilience4j circuit breaker". */
  label: string;
  /** Only count test modules (for testing-library fingerprints). Default: skip tests. */
  testOnly?: boolean;
}

// --- Naming-convention rules (suffix/prefix/whole-name) -----------------------
// Ordered roughly by catalogue group. Each id is a real knowledge-graph node.
export const NAME_RULES: NameRule[] = [
  // GoF structural
  { patternId: "adapter", re: /^[A-Z][A-Za-z0-9]*Adapter$/, min: 2, medAt: 4, label: "*Adapter type(s)" },
  { patternId: "decorator", re: /^[A-Z][A-Za-z0-9]*Decorator$/, min: 2, medAt: 4, label: "*Decorator type(s)" },
  { patternId: "facade", re: /^[A-Z][A-Za-z0-9]*Facade$/, min: 1, medAt: 3, label: "*Facade type(s)" },
  { patternId: "proxy", re: /^[A-Z][A-Za-z0-9]*Proxy$/, min: 2, medAt: 4, label: "*Proxy type(s)" },
  { patternId: "composite", re: /^[A-Z][A-Za-z0-9]*Composite$/, min: 1, medAt: 3, label: "*Composite type(s)" },
  // GoF behavioural
  { patternId: "observer", re: /^[A-Z][A-Za-z0-9]*(Observer|Listener)$/, min: 3, medAt: 6, label: "*Observer/*Listener type(s)" },
  { patternId: "visitor", re: /^[A-Z][A-Za-z0-9]*Visitor$/, min: 2, medAt: 4, label: "*Visitor type(s)" },
  { patternId: "state", re: /^[A-Z][A-Za-z0-9]*StateMachine$/, min: 1, medAt: 2, label: "*StateMachine type(s)" },
  { patternId: "mediator", re: /^[A-Z][A-Za-z0-9]*Mediator$/, min: 1, medAt: 2, label: "*Mediator type(s)" },
  { patternId: "iterator", re: /^[A-Z][A-Za-z0-9]*Iterator$/, min: 2, medAt: 4, label: "*Iterator type(s)" },
  { patternId: "memento", re: /^[A-Z][A-Za-z0-9]*Memento$/, min: 1, medAt: 2, label: "*Memento type(s)" },
  { patternId: "interpreter", re: /^[A-Z][A-Za-z0-9]*Interpreter$/, min: 1, medAt: 2, label: "*Interpreter type(s)" },
  // GoF creational
  { patternId: "builder", re: /^[A-Z][A-Za-z0-9]*Builder$/, min: 2, medAt: 5, label: "*Builder type(s)" },
  { patternId: "abstract-factory", re: /^[A-Z][A-Za-z0-9]*AbstractFactory$/, min: 1, medAt: 2, label: "*AbstractFactory type(s)" },
  { patternId: "singleton", re: /^[A-Z][A-Za-z0-9]*Singleton$/, min: 1, medAt: 2, label: "*Singleton type(s)" },
  // DDD tactical
  { patternId: "value-object", re: /^[A-Z][A-Za-z0-9]*(ValueObject|VO)$/, min: 2, medAt: 5, label: "value-object type(s)" },
  { patternId: "entity", re: /^[A-Z][A-Za-z0-9]*Entity$/, min: 3, medAt: 8, label: "*Entity type(s)" },
  { patternId: "domain-service", re: /^[A-Z][A-Za-z0-9]*DomainService$/, min: 1, medAt: 3, label: "*DomainService type(s)" },
  { patternId: "specification", re: /^[A-Z][A-Za-z0-9]*Specification$/, min: 2, medAt: 4, label: "*Specification type(s)" },
  // Data persistence / enterprise
  { patternId: "data-access-object", re: /^[A-Z][A-Za-z0-9]*(Dao|DAO)$/, min: 2, medAt: 5, label: "*Dao type(s)" },
  { patternId: "data-transfer-object", re: /^[A-Z][A-Za-z0-9]*(Dto|DTO)$/, min: 3, medAt: 8, label: "*Dto type(s)" },
  { patternId: "data-mapper", re: /^[A-Z][A-Za-z0-9]*Mapper$/, min: 3, medAt: 8, label: "*Mapper type(s)" },
  { patternId: "unit-of-work", re: /^[A-Z][A-Za-z0-9]*UnitOfWork$/, min: 1, medAt: 2, label: "*UnitOfWork type(s)" },
  { patternId: "query-object", re: /^[A-Z][A-Za-z0-9]*QueryObject$/, min: 1, medAt: 3, label: "*QueryObject type(s)" },
  { patternId: "service-layer", re: /^[A-Z][A-Za-z0-9]*ApplicationService$/, min: 2, medAt: 5, label: "*ApplicationService type(s)" },
  // Enterprise integration / messaging
  { patternId: "message-router", re: /^[A-Z][A-Za-z0-9]*Router$/, min: 1, medAt: 3, label: "*Router type(s)" },
  { patternId: "message-translator", re: /^[A-Z][A-Za-z0-9]*Translator$/, min: 1, medAt: 3, label: "*Translator type(s)" },
  { patternId: "aggregator", re: /^[A-Z][A-Za-z0-9]*Aggregator$/, min: 1, medAt: 3, label: "*Aggregator type(s)" },
  { patternId: "splitter", re: /^[A-Z][A-Za-z0-9]*Splitter$/, min: 1, medAt: 3, label: "*Splitter type(s)" },
  { patternId: "process-manager", re: /^[A-Z][A-Za-z0-9]*ProcessManager$/, min: 1, medAt: 3, label: "*ProcessManager type(s)" },
  { patternId: "saga", re: /^[A-Z][A-Za-z0-9]*Saga$/, min: 1, medAt: 3, label: "*Saga type(s)" },
  { patternId: "dead-letter-channel", re: /^[A-Z][A-Za-z0-9]*DeadLetter[A-Za-z0-9]*$/, min: 1, medAt: 2, label: "dead-letter type(s)" },
  { patternId: "outbox", re: /^[A-Z][A-Za-z0-9]*Outbox[A-Za-z0-9]*$/, min: 1, medAt: 2, label: "outbox type(s)" },
  // Resilience
  { patternId: "circuit-breaker", re: /^[A-Z][A-Za-z0-9]*CircuitBreaker[A-Za-z0-9]*$/, min: 1, medAt: 2, label: "circuit-breaker type(s)" },
  { patternId: "rate-limiting", re: /^[A-Z][A-Za-z0-9]*(RateLimiter|RateLimit)$/, min: 1, medAt: 2, label: "rate-limiter type(s)" },
  { patternId: "bulkhead", re: /^[A-Z][A-Za-z0-9]*Bulkhead[A-Za-z0-9]*$/, min: 1, medAt: 2, label: "bulkhead type(s)" },
  // Security
  { patternId: "audit-logging", re: /^[A-Z][A-Za-z0-9]*AuditLog[A-Za-z0-9]*$/, min: 1, medAt: 3, label: "audit-log type(s)" },
  { patternId: "token-based-auth", re: /^[A-Z][A-Za-z0-9]*(Jwt|JWT)[A-Za-z0-9]*$/, min: 1, medAt: 3, label: "JWT/token type(s)" },
  // API design
  { patternId: "webhook", re: /^[A-Z][A-Za-z0-9]*Webhook[A-Za-z0-9]*$/, min: 1, medAt: 3, label: "webhook type(s)" },
  // Implementation
  { patternId: "object-pool", re: /^[A-Z][A-Za-z0-9]*Pool$/, min: 1, medAt: 3, label: "*Pool type(s)" },
  { patternId: "service-locator", re: /^[A-Z][A-Za-z0-9]*ServiceLocator$/, min: 1, medAt: 2, label: "*ServiceLocator type(s)" },
  { patternId: "null-object", re: /^Null[A-Z][A-Za-z0-9]*$/, min: 1, medAt: 3, label: "Null* object(s)" },
  { patternId: "middleware-pipeline", re: /^[A-Z][A-Za-z0-9]*(Middleware|Interceptor)$/, min: 2, medAt: 5, label: "*Middleware/*Interceptor type(s)" },
  // Frontend
  { patternId: "model-view-viewmodel", re: /^[A-Z][A-Za-z0-9]*ViewModel$/, min: 2, medAt: 5, label: "*ViewModel type(s)" },
  { patternId: "model-view-presenter", re: /^[A-Z][A-Za-z0-9]*Presenter$/, min: 2, medAt: 5, label: "*Presenter type(s)" },
  // Functional
  { patternId: "either-result", re: /^(Either|Result)$/, min: 1, medAt: 2, label: "Either/Result type(s)" },
  { patternId: "option-maybe", re: /^(Option|Maybe)$/, min: 1, medAt: 2, label: "Option/Maybe type(s)" },
  // Testing
  { patternId: "page-object", re: /^[A-Z][A-Za-z0-9]*Page$/, min: 2, medAt: 5, label: "*Page object(s)", layer: "test" },
  { patternId: "test-data-builder", re: /^[A-Z][A-Za-z0-9]*(TestDataBuilder|Mother)$/, min: 1, medAt: 3, label: "test-data builder(s)", layer: "test" },
];

// --- Import-fingerprint rules (framework / JDK) -------------------------------
export const IMPORT_RULES: ImportRule[] = [
  // Implementation / IoC
  { patternId: "dependency-injection", re: /(springframework\.(context|beans|stereotype)|javax\.inject|jakarta\.inject|dagger|com\.google\.inject|koin)/, min: 5, medAt: 15, label: "DI container/annotations" },
  // Resilience
  { patternId: "circuit-breaker", re: /resilience4j\.circuitbreaker|hystrix/i, min: 1, medAt: 3, label: "Resilience4j/Hystrix circuit breaker" },
  { patternId: "retry", re: /resilience4j\.retry|springframework\.retry/i, min: 1, medAt: 3, label: "retry library" },
  { patternId: "rate-limiting", re: /resilience4j\.ratelimiter|bucket4j/i, min: 1, medAt: 3, label: "rate-limiter library" },
  { patternId: "bulkhead", re: /resilience4j\.bulkhead/i, min: 1, medAt: 2, label: "Resilience4j bulkhead" },
  // Concurrency (JDK fingerprints)
  { patternId: "thread-pool", re: /java\.util\.concurrent\.(Executors?|ThreadPoolExecutor|ScheduledExecutorService)/, min: 1, medAt: 4, label: "ExecutorService/thread pool" },
  { patternId: "future-promise", re: /java\.util\.concurrent\.(CompletableFuture|Future)|kotlinx\.coroutines\.Deferred/, min: 1, medAt: 4, label: "Future/Promise" },
  { patternId: "producer-consumer", re: /java\.util\.concurrent\.(BlockingQueue|ArrayBlockingQueue|LinkedBlockingQueue)/, min: 1, medAt: 3, label: "BlockingQueue producer/consumer" },
  { patternId: "read-write-lock", re: /java\.util\.concurrent\.locks\.ReentrantReadWriteLock/, min: 1, medAt: 2, label: "ReadWriteLock" },
  { patternId: "semaphore", re: /java\.util\.concurrent\.Semaphore/, min: 1, medAt: 2, label: "Semaphore" },
  { patternId: "actor-model", re: /akka\.actor|org\.apache\.pekko/, min: 1, medAt: 3, label: "Akka/Pekko actors" },
  // Messaging / integration
  { patternId: "publish-subscribe", re: /(kafka|rabbitmq|com\.rabbitmq|pulsar|google\.cloud\.pubsub|springframework\.kafka|springframework\.amqp)/i, min: 1, medAt: 3, label: "broker client (Kafka/Rabbit/PubSub)" },
  // Data persistence
  { patternId: "connection-pool", re: /com\.zaxxer\.hikari|apache\.commons\.dbcp|tomcat\.jdbc\.pool/, min: 1, medAt: 2, label: "connection pool (HikariCP/DBCP)" },
  // Security
  { patternId: "secrets-management", re: /(vault|azure\.security\.keyvault|amazonaws.*secretsmanager|google\.cloud\.secretmanager)/i, min: 1, medAt: 3, label: "secrets manager client" },
  { patternId: "token-based-auth", re: /(io\.jsonwebtoken|com\.auth0\.jwt|nimbusds\.jwt|springframework\.security\.oauth)/i, min: 1, medAt: 3, label: "JWT/OAuth library" },
  // API design
  { patternId: "rest", re: /(springframework\.web\.bind\.annotation|jakarta\.ws\.rs|javax\.ws\.rs|micronaut\.http\.annotation)/, min: 2, medAt: 8, label: "REST controllers/resources" },
  { patternId: "graphql", re: /(graphql-java|com\.netflix\.graphql|springframework\.graphql|apollographql)/i, min: 1, medAt: 3, label: "GraphQL library" },
  { patternId: "grpc-rpc", re: /(io\.grpc|com\.google\.protobuf)/, min: 1, medAt: 3, label: "gRPC/protobuf" },
  // Testing
  { patternId: "mock-object", re: /(org\.mockito|io\.mockk|com\.nhaarman\.mockitokotlin|jestjs|jest\.mock)/i, min: 1, medAt: 5, label: "mocking library (Mockito/MockK)", testOnly: true },
  { patternId: "property-based-testing", re: /(jqwik|kotest\.property|org\.scalacheck|fast-check|hypothesis)/i, min: 1, medAt: 2, label: "property-based testing library", testOnly: true },
  { patternId: "contract-testing", re: /(au\.com\.dius\.pact|springframework\.cloud\.contract|pactflow)/i, min: 1, medAt: 2, label: "contract testing (Pact/Spring Cloud Contract)", testOnly: true },
  // Frontend
  { patternId: "redux-pattern", re: /(^|\/)(redux|@reduxjs\/toolkit|react-redux)\b/, min: 1, medAt: 3, label: "Redux store" },
  { patternId: "server-side-rendering", re: /(^|\/)next\b|getServerSideProps/, min: 1, medAt: 3, label: "Next.js SSR" },
  { patternId: "state-machine-ui", re: /(^|\/)xstate\b/, min: 1, medAt: 2, label: "XState machine" },
  // AI/ML
  { patternId: "retrieval-augmented-generation", re: /(langchain|llama_index|pinecone|weaviate|qdrant|chromadb)/i, min: 1, medAt: 2, label: "RAG/vector-store library" },
  { patternId: "tool-use-function-calling", re: /(openai|anthropic|@google\/genai|google\.generativeai)/i, min: 1, medAt: 2, label: "LLM SDK" },
];

const NAME_CONF = (count: number, medAt?: number): "low" | "medium" =>
  medAt && count >= medAt ? "medium" : "low";

/** Evaluate the declarative registry against a module set. */
export function registryCandidates(modules: ModuleInfo[]): CandidatePattern[] {
  const out: CandidatePattern[] = [];

  // Naming rules.
  for (const rule of NAME_RULES) {
    const hits: { name: string; path: string }[] = [];
    const seen = new Set<string>();
    for (const m of modules) {
      if (rule.layer && m.layer !== rule.layer) continue;
      if (!rule.layer && m.isTest) continue; // production rules ignore tests
      if (rule.layer === "test" && !m.isTest) continue;
      for (const e of m.exports) {
        if (!TYPE_KINDS.has(e.kind)) continue;
        if (rule.kind && e.kind !== rule.kind) continue;
        if (!rule.re.test(e.name) || seen.has(e.name)) continue;
        seen.add(e.name);
        hits.push({ name: e.name, path: m.path });
      }
    }
    if (hits.length < rule.min) continue;
    out.push({
      patternId: rule.patternId,
      confidence: NAME_CONF(hits.length, rule.medAt),
      evidence: [`${hits.length} ${rule.label}: ${hits.slice(0, 8).map((h) => h.name).join(", ")}`],
      locations: [...new Set(hits.map((h) => h.path))].slice(0, 8),
    });
  }

  // Import rules.
  for (const rule of IMPORT_RULES) {
    const hitPaths: string[] = [];
    for (const m of modules) {
      // Testing-library fingerprints look in test files; everything else skips them.
      if (rule.testOnly ? !m.isTest : m.isTest) continue;
      if (m.imports.some((i) => rule.re.test(i.spec))) hitPaths.push(m.path);
    }
    if (hitPaths.length < rule.min) continue;
    out.push({
      patternId: rule.patternId,
      confidence: NAME_CONF(hitPaths.length, rule.medAt),
      evidence: [`${rule.label} imported in ${hitPaths.length} module(s)`],
      locations: [...new Set(hitPaths)].slice(0, 8),
    });
  }

  return out;
}
