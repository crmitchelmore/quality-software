import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Shared test helpers. Points the catalogue at THIS repo so detectors resolve the
 * generated knowledge graph, and builds throwaway "governed projects" on disk so
 * the file-reading detectors (boundary, reuse) run against real files.
 */

const here = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(here, "..", "..");

// Every test run resolves the catalogue from this repo, regardless of cwd.
process.env.CONFORMANCE_CATALOGUE_ROOT = REPO_ROOT;

export interface ProjectSpec {
  profile: string;
  files?: Record<string, string>;
}

const created: string[] = [];

/** Create a temp project dir with a patterns.config.yaml + optional source files. */
export function makeProject(spec: ProjectSpec): string {
  const dir = mkdtempSync(join(tmpdir(), "conformance-e2e-"));
  created.push(dir);
  writeFileSync(join(dir, "patterns.config.yaml"), spec.profile);
  for (const [rel, content] of Object.entries(spec.files ?? {})) {
    writeFile(dir, rel, content);
  }
  return dir;
}

/** Write (or overwrite) a single file in a project, creating parent dirs. */
export function writeFile(dir: string, rel: string, content: string): string {
  const abs = join(dir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  return abs;
}

export function cleanupAll(): void {
  for (const d of created.splice(0)) {
    try {
      rmSync(d, { recursive: true, force: true });
    } catch {
      /* best effort */
    }
  }
}

/** A realistic hexagonal/DDD profile for a todo app. `enforcement` is parameterised. */
export function todoProfile(boundaryEnforcement: "advise" | "warn" | "block" = "warn"): string {
  return `projectSize: small
philosophies:
  adopt:
    - id: a-philosophy-of-software-design
      weight: primary
    - id: domain-driven-design
      weight: primary
  reject: []
adopt:
  - id: hexagonal-architecture
    enforcement: ${boundaryEnforcement}
    options:
      domainGlobs: ["src/domain/**", "src/application/**"]
      forbidImportsFrom: ["src/infrastructure/**"]
  - id: repository
    enforcement: advise
ban:
  - id: service-locator
    reason: Hides dependencies.
  - id: active-record
    reason: Couples domain to persistence.
phases:
  write: { enabled: true, mode: advise, failMode: open, llm: false, block: false }
  pr:    { enabled: true, llm: true, failOn: block }
  later: { enabled: true }
`;
}
