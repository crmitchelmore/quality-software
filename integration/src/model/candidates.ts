import { registryCandidates } from "./detectors.js";
import type { CandidatePattern, Layer, ModuleInfo } from "./project-map.js";

/** Tier-3 advisory inference — structural only, never authoritative. */
export function inferCandidates(
  modules: ModuleInfo[],
  edges: { from: string; to: string }[],
  byPath: Map<string, ModuleInfo>,
): CandidatePattern[] {
  const out: CandidatePattern[] = [];
  const layersPresent = new Set(modules.map((m) => m.layer));

  // Hexagonal / layered: needs a domain and an infrastructure layer.
  const domainModules = modules.filter((m) => m.layer === "domain" || m.layer === "application");
  if (layersPresent.has("domain") && layersPresent.has("infrastructure") && domainModules.length) {
    const violations = edges.filter((e) => {
      const from = byPath.get(e.from);
      const to = byPath.get(e.to);
      return from && to && (from.layer === "domain" || from.layer === "application") && to.layer === "infrastructure";
    });
    const violatingFiles = [...new Set(violations.map((v) => v.from))];
    const applied = domainModules.length - violatingFiles.length;
    out.push({
      patternId: "hexagonal-architecture",
      confidence: violatingFiles.length === 0 ? "medium" : "low",
      evidence: [
        `${domainModules.length} domain/application modules; ${layersPresent.has("infrastructure") ? "infrastructure layer present" : ""}`,
        `${violatingFiles.length} module(s) import infrastructure directly`,
      ].filter(Boolean),
      locations: violatingFiles,
      consistency: {
        applied,
        violations: violatingFiles.length,
        score: domainModules.length ? +(applied / domainModules.length).toFixed(2) : 1,
      },
    });
  }
  if ([...layersPresent].filter((l) => l !== "test" && l !== "other").length >= 3) {
    out.push({
      patternId: "layered-architecture",
      confidence: "low",
      evidence: [`distinct layers present: ${[...layersPresent].filter((l) => l !== "test").join(", ")}`],
      locations: [],
    });
  }

  // Repository: interfaces named *Repository (canonical) + implementers.
  const repoInterfaces = modules.flatMap((m) =>
    m.exports.filter((e) => e.kind === "interface" && /Repository$/.test(e.name)).map((e) => ({ path: m.path, name: e.name })),
  );
  if (repoInterfaces.length) {
    out.push({
      patternId: "repository",
      confidence: repoInterfaces.length >= 5 ? "medium" : "low",
      evidence: [`${repoInterfaces.length} *Repository interface(s): ${repoInterfaces.map((r) => r.name).join(", ")}`],
      locations: [...new Set(repoInterfaces.map((r) => r.path))],
    });
  }

  // --- Typed-suffix detectors (language-neutral; structural evidence only). ---
  // Count only real type declarations (class/interface/enum/type) whose name is a
  // proper *Suffix (e.g. StandardAggregate), excluding bare words and methods.
  const TYPE_KINDS = new Set(["class", "interface", "enum", "type"]);
  const typedBySuffix = (suffix: string): { name: string; path: string }[] => {
    const re = new RegExp(`^[A-Z][A-Za-z0-9]*${suffix}$`);
    return modules.flatMap((m) =>
      m.exports
        .filter((e) => TYPE_KINDS.has(e.kind) && e.name !== suffix && re.test(e.name))
        .map((e) => ({ name: e.name, path: m.path })),
    );
  };
  const locs = (xs: { path: string }[], n = 8): string[] => [...new Set(xs.map((x) => x.path))].slice(0, n);
  const names = (xs: { name: string }[], n = 8): string =>
    [...new Set(xs.map((x) => x.name))].slice(0, n).join(", ");

  const aggregates = typedBySuffix("Aggregate");
  const events = typedBySuffix("Event");
  const commands = typedBySuffix("Command");
  const queries = typedBySuffix("Query");
  const readModels = modules.flatMap((m) =>
    m.exports.filter((e) => TYPE_KINDS.has(e.kind) && /ReadModel|Projection/.test(e.name)).map((e) => ({ name: e.name, path: m.path })),
  );

  // Event Sourcing (architecture): aggregates + a body of domain events.
  if (aggregates.length >= 2 && events.length >= 5) {
    out.push({
      patternId: "event-sourcing",
      confidence: aggregates.length >= 3 && events.length >= 10 ? "high" : "medium",
      evidence: [
        `${aggregates.length} aggregate type(s): ${names(aggregates)}`,
        `${events.length} domain-event type(s) (e.g. ${names(events, 5)})`,
      ],
      locations: locs(aggregates),
    });
  }

  // CQRS (architecture): command/query (or read-model) separation.
  if (commands.length >= 3 && queries.length + readModels.length >= 3) {
    out.push({
      patternId: "cqrs",
      confidence: commands.length >= 5 && readModels.length >= 5 ? "high" : "medium",
      evidence: [
        `${commands.length} command type(s) (e.g. ${names(commands, 5)})`,
        `${queries.length} query type(s); ${readModels.length} read-model/projection type(s)`,
      ],
      locations: [...locs(commands, 4), ...locs(readModels, 4)],
    });
  }

  // Aggregate (ddd-tactical).
  if (aggregates.length >= 2) {
    out.push({
      patternId: "aggregate",
      confidence: aggregates.length >= 4 ? "medium" : "low",
      evidence: [`${aggregates.length} aggregate root(s): ${names(aggregates)}`],
      locations: locs(aggregates),
    });
  }

  // Domain Event (ddd-tactical).
  if (events.length >= 5) {
    out.push({
      patternId: "domain-event",
      confidence: events.length >= 12 ? "medium" : "low",
      evidence: [`${events.length} domain-event type(s): ${names(events)}`],
      locations: locs(events),
    });
  }

  // Modular Monolith (architecture): many feature packages each with an internal/ split.
  const featureRoots = new Set<string>();
  for (const m of modules) {
    const i = m.path.indexOf("/internal/");
    if (i > 0) featureRoots.add(m.path.slice(0, i));
  }
  if (featureRoots.size >= 5) {
    out.push({
      patternId: "modular-monolith",
      confidence: featureRoots.size >= 10 ? "medium" : "low",
      evidence: [`${featureRoots.size} feature module(s) with a public/internal split (encapsulated submodules)`],
      locations: [...featureRoots].slice(0, 8),
    });
  }

  // Strategy / polymorphism hub (gof-behavioural): an interface with many implementers.
  const hubs = modules.filter(
    (m) => m.inbound >= 8 && m.exports.some((e) => e.kind === "interface") && !/Repository$/.test(m.path),
  );
  for (const hub of hubs.slice(0, 3)) {
    const iface = hub.exports.find((e) => e.kind === "interface");
    out.push({
      patternId: "strategy",
      confidence: hub.inbound >= 15 ? "medium" : "low",
      evidence: [`'${iface?.name ?? hub.path}' has ${hub.inbound} dependents — a polymorphic strategy/abstraction hub`],
      locations: [hub.path],
    });
  }

  // Factory (gof-creational): several *Factory types.
  const factories = typedBySuffix("Factory");
  if (factories.length >= 3) {
    out.push({
      patternId: "factory-method",
      confidence: "low",
      evidence: [`${factories.length} *Factory type(s): ${names(factories)}`],
      locations: locs(factories),
    });
  }

  // Broad declarative sweep (naming + import fingerprints across the catalogue).
  out.push(...registryCandidates(modules));

  return mergeCandidates(out);
}

/** Merge duplicate pattern ids: keep the highest confidence, union evidence/locations. */
function mergeCandidates(cands: CandidatePattern[]): CandidatePattern[] {
  const RANK = { low: 1, medium: 2, high: 3 } as const;
  const byId = new Map<string, CandidatePattern>();
  for (const c of cands) {
    const prev = byId.get(c.patternId);
    if (!prev) {
      byId.set(c.patternId, {
        ...c,
        evidence: [...c.evidence],
        locations: [...c.locations],
      });
      continue;
    }
    if (RANK[c.confidence] > RANK[prev.confidence]) {
      prev.confidence = c.confidence;
      prev.consistency = c.consistency ?? prev.consistency;
      // Promote the stronger candidate's evidence to the front so the headline
      // reason (evidence[0], used by proposal.ts) reflects why confidence rose.
      prev.evidence = [...c.evidence, ...prev.evidence.filter((e) => !c.evidence.includes(e))];
    }
    for (const e of c.evidence) if (!prev.evidence.includes(e)) prev.evidence.push(e);
    for (const l of c.locations) if (!prev.locations.includes(l)) prev.locations.push(l);
    prev.evidence = prev.evidence.slice(0, 6);
    prev.locations = prev.locations.slice(0, 12);
  }
  return [...byId.values()];
}
