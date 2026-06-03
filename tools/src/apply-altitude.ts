/**
 * One-shot maintenance script: tag every software pattern with an `altitude`
 * (low | medium | high) describing its scope of application:
 *   low    — method / class / file        (e.g. Strategy, Factory, Builder)
 *   medium — component / service          (e.g. Repository, CQRS, Event-Driven)
 *   high   — application / platform       (e.g. Microservices, Event Sourcing, Hexagonal)
 *
 * Altitude is curated per pattern (a category default plus deliberate overrides)
 * because scope does not follow `category` cleanly — e.g. CQRS and Event-Driven
 * Architecture sit in the `architecture` category but are component/service scope.
 *
 * The field is inserted surgically after the `category:` line to preserve the
 * hand-authored YAML formatting. Idempotent: skips files that already declare one.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { patternFiles, loadPatterns } from "./lib/patterns.js";

type Altitude = "low" | "medium" | "high";

const CATEGORY_DEFAULT: Record<string, Altitude> = {
  "gof-creational": "low",
  "gof-structural": "low",
  "gof-behavioural": "low",
  implementation: "low",
  functional: "low",
  concurrency: "low",
  testing: "low",
  "data-persistence": "medium",
  "enterprise-application": "medium",
  "enterprise-integration": "medium",
  "ddd-tactical": "medium",
  "api-design": "medium",
  security: "medium",
  resilience: "medium",
  frontend: "medium",
  "ai-ml": "medium",
  architecture: "high",
  "ddd-strategic": "high",
  "cloud-distributed": "high",
};

// Deliberate per-pattern overrides where scope differs from the category default.
const OVERRIDE: Record<string, Altitude> = {
  // architecture (default high) — these are component/service-scope structures
  cqrs: "medium",
  "event-driven-architecture": "medium",
  "model-view-controller": "medium",
  "pipes-and-filters": "medium",
  // cloud-distributed (default high) — component/service-scope tactics
  ambassador: "medium",
  "anti-corruption-layer": "medium",
  "cache-aside": "medium",
  "claim-check": "medium",
  "compensating-transaction": "medium",
  "competing-consumers": "medium",
  gatekeeper: "medium",
  "health-endpoint-monitoring": "medium",
  "leader-election": "medium",
  "materialized-view": "medium",
  outbox: "medium",
  "queue-based-load-leveling": "medium",
  sidecar: "medium",
  throttling: "medium",
  "valet-key": "medium",
  // concurrency (default low) — component-scope coordination models
  "actor-model": "medium",
  "communicating-sequential-processes": "medium",
  "half-sync-half-async": "medium",
  proactor: "medium",
  reactor: "medium",
  // data-persistence (default medium)
  "connection-pool": "low",
  "database-per-service": "high",
  "polyglot-persistence": "high",
  // ddd-tactical (default medium) — single-class building blocks
  entity: "low",
  "value-object": "low",
  factory: "low",
  specification: "low",
  // enterprise-application (default medium) — class-level helpers
  "data-transfer-object": "low",
  "layer-supertype": "low",
  "lazy-load": "low",
  mapper: "low",
  "separated-interface": "low",
  "special-case": "low",
  // enterprise-integration (default medium)
  "canonical-data-model": "high",
  "message-bus": "high",
  "correlation-identifier": "low",
  "wire-tap": "low",
  // frontend (default medium)
  "container-presentational": "low",
  "debounce-throttle-ui": "low",
  "higher-order-component": "low",
  hooks: "low",
  "optimistic-ui": "low",
  "render-props": "low",
  "islands-architecture": "high",
  "micro-frontends": "high",
  "server-side-rendering": "high",
  // implementation (default low)
  "middleware-pipeline": "medium",
  // security (default medium)
  "defense-in-depth": "high",
  "least-privilege": "high",
  "secure-by-default": "high",
  "input-validation": "low",
  "output-encoding": "low",
  // testing (default low)
  "contract-testing": "medium",
  "test-pyramid": "medium",
  // ai-ml (default medium)
  "agent-orchestration": "high",
  "structured-output": "low",
  "tool-use-function-calling": "low",
  "reflection-self-critique": "low",
};

function altitudeFor(id: string, category: string): Altitude {
  return OVERRIDE[id] ?? CATEGORY_DEFAULT[category] ?? "medium";
}

function main(): void {
  const patterns = loadPatterns();
  const byFile = new Map(patterns.map((p) => [p.__file, p]));
  let written = 0;
  let skipped = 0;
  const dist: Record<Altitude, number> = { low: 0, medium: 0, high: 0 };

  for (const file of patternFiles()) {
    const p = byFile.get(file);
    if (!p) continue;
    const altitude = altitudeFor(p.id, p.category);
    dist[altitude]++;

    const src = readFileSync(file, "utf8");
    if (/^altitude:\s/m.test(src)) {
      skipped++;
      continue;
    }
    const lines = src.split("\n");
    const catIdx = lines.findIndex((l) => /^category:\s/.test(l));
    if (catIdx === -1) {
      console.error(`! no top-level category: line in ${file}`);
      continue;
    }
    lines.splice(catIdx + 1, 0, `altitude: ${altitude}`);
    writeFileSync(file, lines.join("\n"));
    written++;
  }

  console.log(`✔ altitude tagged: ${written} written, ${skipped} already had it.`);
  console.log(`  distribution — low: ${dist.low}, medium: ${dist.medium}, high: ${dist.high}`);
}

main();
