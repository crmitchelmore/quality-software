import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ResolvedProfile } from "./contract.js";
import type { Catalogue } from "./catalogue.js";

/**
 * `conformance init` (design 11.5 + 13.8) — produces a CANDIDATE profile + report,
 * never a ready-to-enforce one. Philosophy-first: chosen philosophies expand (via
 * the knowledge graph) into candidate patterns. Everything defaults to `advise`;
 * NO hard bans are auto-generated (design 13.8). Repo-scan signals are preferred
 * over graph centrality when inferring defaults.
 */

export interface InitAnswers {
  projectType?: string;
  size?: "small" | "medium" | "large";
  philosophies?: string[];
}

interface RepoSignals {
  hasDomainLayer: boolean;
  hasInfraLayer: boolean;
  frameworks: string[];
}

function scanRepo(cwd: string): RepoSignals {
  const exists = (p: string) => existsSync(join(cwd, p));
  const frameworks: string[] = [];
  const pkgPath = join(cwd, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
      for (const f of ["react", "next", "express", "fastify", "nestjs", "@nestjs/core", "vue"]) {
        if (deps[f]) frameworks.push(f.replace("@nestjs/core", "nestjs"));
      }
    } catch {
      /* ignore */
    }
  }
  return {
    hasDomainLayer: exists("src/domain") || exists("src/application"),
    hasInfraLayer: exists("src/infrastructure") || exists("src/infra"),
    frameworks,
  };
}

function defaultPhilosophies(signals: RepoSignals, catalogue: Catalogue): string[] {
  const want = ["a-philosophy-of-software-design"];
  if (signals.hasDomainLayer && signals.hasInfraLayer) want.push("domain-driven-design");
  return want.filter((id) => catalogue.nodeById.has(id));
}

export interface InitResult {
  yaml: string;
  report: string;
}

export function proposeProfile(cwd: string, catalogue: Catalogue, answers: InitAnswers): InitResult {
  const signals = scanRepo(cwd);
  const philosophies =
    answers.philosophies && answers.philosophies.length
      ? answers.philosophies
      : defaultPhilosophies(signals, catalogue);
  const size = answers.size ?? "medium";

  // Expand philosophies -> candidate patterns via the graph.
  const candidate = new Map<string, { from: string; reason?: string }>();
  for (const phil of philosophies) {
    for (const p of catalogue.patternsForPhilosophy.get(phil) ?? []) {
      if (catalogue.nodeById.get(p.pattern)?.kind === "software-pattern" && !candidate.has(p.pattern)) {
        candidate.set(p.pattern, { from: phil, reason: p.reason });
      }
    }
  }

  // Build YAML (everything advise; boundary options inferred from repo layout; NO auto bans).
  const lines: string[] = [];
  lines.push("# patterns.config.yaml — CANDIDATE profile from `conformance init`.");
  lines.push("# Review before enforcing. Everything starts at `advise`; promote to `block`");
  lines.push("# only after measuring precision (design/validator/13-mvp-and-trust.md).");
  lines.push(`projectSize: ${size}`);
  lines.push("");
  lines.push("philosophies:");
  lines.push("  adopt:");
  for (const ph of philosophies) {
    const title = catalogue.nodeById.get(ph)?.title ?? ph;
    lines.push(`    - id: ${ph}        # ${title}`);
    lines.push(`      weight: primary`);
  }
  lines.push("  reject: []   # add philosophies you explicitly reject (their patterns get demoted)");
  lines.push("");
  lines.push("adopt:");
  const boundary = [...candidate.keys()].find((id) =>
    ["hexagonal-architecture", "clean-architecture", "layered-architecture"].includes(id),
  );
  for (const [id, src] of candidate) {
    const title = catalogue.nodeById.get(id)?.title ?? id;
    lines.push(`  - id: ${id}`);
    lines.push(`    enforcement: advise        # from: ${src.from} — ${title}`);
    if (id === boundary) {
      lines.push(`    options:`);
      lines.push(`      domainGlobs: ["src/domain/**", "src/application/**"]`);
      lines.push(`      forbidImportsFrom: ["src/infrastructure/**"]`);
    }
  }
  lines.push("");
  lines.push("# ban: []   # bans require explicit human selection — none auto-generated (design 13.8)");
  lines.push("");
  lines.push("phases:");
  lines.push("  write: { enabled: true, mode: advise, failMode: open, llm: false, block: false }");
  lines.push("  pr:    { enabled: true, llm: true, failOn: block }");
  lines.push("  later: { enabled: true }");
  const yaml = lines.join("\n") + "\n";

  // Candidate report with confidence + evidence.
  const report: string[] = [];
  report.push("conformance init — CANDIDATE report (not yet enforcing)");
  report.push("");
  report.push("Repo signals:");
  report.push(`  - domain layer:        ${signals.hasDomainLayer ? "yes" : "no"}`);
  report.push(`  - infrastructure layer:${signals.hasInfraLayer ? " yes" : " no"}`);
  report.push(`  - frameworks:          ${signals.frameworks.join(", ") || "none detected"}`);
  report.push("");
  report.push(`Proposed philosophies (${philosophies.length}):`);
  for (const ph of philosophies) {
    const conf = signals.hasDomainLayer && ph === "domain-driven-design" ? "high (repo has domain/infra layers)" : "medium";
    report.push(`  - ${ph}  [confidence: ${conf}]`);
  }
  report.push("");
  report.push(`Proposed patterns (${candidate.size}, all advise):`);
  for (const [id, src] of candidate) report.push(`  - ${id}  (from ${src.from})`);
  report.push("");
  report.push("Next: review patterns.config.yaml, adjust, add explicit bans if desired,");
  report.push("then open a PR to ratify (the profile is a version-controlled decision).");
  return { yaml, report: report.join("\n") };
}

/** Concise north-star primer injected at sessionStart (design 12.5). */
export function sessionPrimer(profile: ResolvedProfile, catalogue: Catalogue): string {
  const name = (id: string) => catalogue.nodeById.get(id)?.title ?? id;
  const parts: string[] = ["This project follows a conformance profile. Align your work to it:"];
  if (profile.philosophies.adopt.length) {
    parts.push("Design philosophies (the why): " + profile.philosophies.adopt.map((p) => name(p.id)).join("; ") + ".");
  }
  const enforced = profile.adopt.slice(0, 12).map((p) => `${name(p.id)} (${p.enforcement})`);
  if (enforced.length) parts.push("Adopted patterns: " + enforced.join("; ") + ".");
  if (profile.ban.length) parts.push("Banned (do not introduce): " + profile.ban.map((b) => name(b.id)).join("; ") + ".");
  parts.push("Reuse existing abstractions rather than reinventing them. Findings will cite the philosophy → pattern → fix chain.");
  return parts.join("\n");
}
