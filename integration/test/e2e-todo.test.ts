import { test, after } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { handlePostWrite, handleSessionStart } from "../src/adapters/copilot.js";
import { loadCatalogue } from "../src/catalogue.js";
import { loadProfile } from "../src/profile.js";
import { Engine } from "../src/engine.js";
import { makeProject, todoProfile, writeFile, cleanupAll } from "./helpers.js";

/**
 * END-TO-END: a small Todo app governed by a hexagonal + DDD profile.
 *
 * Simulates an AI agent ("the model") authoring the app file-by-file through the
 * Copilot postToolUse hook, and asserts that:
 *   1. conformant code passes silently,
 *   2. deviations are caught the moment they are written (advisory feedback),
 *   3. a refactor back to the pattern clears the finding,
 *   4. banned constructs and missed reuse are surfaced,
 *   5. the PR gate blocks an unfixed violation.
 */

after(cleanupAll);

// Files the agent "writes" via a create/edit tool. Paths are repo-relative.
async function modelWrites(dir: string, path: string, content: string): Promise<any> {
  writeFile(dir, path, content);
  const out = await handlePostWrite({
    cwd: dir,
    sessionId: "todo-build",
    toolName: "create",
    toolArgs: { path },
  });
  return JSON.parse(out);
}

const PORTS = `export interface TodoRepository {
  save(todo: Todo): Promise<void>;
  byId(id: string): Promise<Todo | undefined>;
}
export interface Todo { id: string; title: string; done: boolean; }
`;

const CLEAN_SERVICE = `import { Todo, TodoRepository } from "./ports";
export class TodoService {
  constructor(private readonly repo: TodoRepository) {}
  async complete(id: string): Promise<void> {
    const t = await this.repo.byId(id);
    if (t) await this.repo.save({ ...t, done: true });
  }
}
`;

const LEAKY_SERVICE = `import { PostgresClient } from "../infrastructure/postgres";
export class TodoService {
  constructor(private readonly db: PostgresClient) {}
  async complete(id: string): Promise<void> { await this.db.query("update todos set done=true"); }
}
`;

test("e2e: agent scaffolds the domain conformantly — no findings", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });

  // Primer is available at session start (the north star the agent is given).
  const primer = JSON.parse(handleSessionStart({ cwd: dir }));
  assert.match(primer.additionalContext, /Hexagonal Architecture/i);

  const ports = await modelWrites(dir, "src/domain/ports.ts", PORTS);
  assert.equal(ports.additionalContext, undefined, "clean ports file → silent");

  const svc = await modelWrites(dir, "src/domain/todo-service.ts", CLEAN_SERVICE);
  assert.equal(svc.additionalContext, undefined, "clean service depending on a port → silent");
});

test("e2e: agent deviates (domain imports infrastructure) — caught at write time", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  await modelWrites(dir, "src/domain/ports.ts", PORTS);

  const leaky = await modelWrites(dir, "src/domain/todo-service.ts", LEAKY_SERVICE);
  assert.ok(leaky.additionalContext, "deviation must produce advisory feedback");
  assert.match(leaky.additionalContext, /[Bb]oundary violation/);
  assert.match(leaky.additionalContext, /infrastructure/);
  assert.match(leaky.additionalContext, /why:/, "feedback explains the philosophy→pattern rationale");
});

test("e2e: refactor back to a port clears the finding (deviation prevented)", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  await modelWrites(dir, "src/domain/ports.ts", PORTS);
  const before = await modelWrites(dir, "src/domain/todo-service.ts", LEAKY_SERVICE);
  assert.ok(before.additionalContext, "starts deviated");

  const after = await modelWrites(dir, "src/domain/todo-service.ts", CLEAN_SERVICE);
  assert.equal(after.additionalContext, undefined, "refactor to the port → clean");
});

test("e2e: banned construct (service locator) is surfaced", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  const out = await modelWrites(
    dir,
    "src/application/wiring.ts",
    `export function build() { return ServiceLocator.get("todoRepo"); }\n`,
  );
  assert.ok(out.additionalContext, "banned construct should be flagged");
  assert.match(out.additionalContext, /Service Locator/i);
});

test("e2e: missed reuse (duplicate abstraction) is surfaced", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  // The canonical port already exists on disk...
  writeFile(dir, "src/domain/ports.ts", PORTS);
  // ...and the agent introduces a parallel TodoRepository elsewhere.
  const out = await modelWrites(
    dir,
    "src/infrastructure/repo.ts",
    `export interface TodoRepository { save(x: unknown): void; }\n`,
  );
  assert.ok(out.additionalContext, "duplicate export should be flagged");
  assert.match(out.additionalContext, /TodoRepository/);
  assert.match(out.additionalContext, /duplicate|already exported|Reuse/i);
});

test("e2e: PR gate blocks an unfixed boundary violation (enforcement: block)", async () => {
  const dir = makeProject({ profile: todoProfile("block") });
  writeFile(dir, "src/domain/ports.ts", PORTS);
  const leakyAbs = writeFile(dir, "src/domain/todo-service.ts", LEAKY_SERVICE);

  const catalogue = loadCatalogue(dir);
  const profile = loadProfile(join(dir, "patterns.config.yaml"), catalogue);
  const engine = new Engine(profile, catalogue);
  const { findings } = await engine.evaluate({
    event: "PR_REVIEW",
    repoRoot: dir,
    files: [{ path: leakyAbs, content: LEAKY_SERVICE }],
  });
  const blocking = findings.filter((f) => f.severity === "block");
  assert.ok(blocking.length >= 1, "PR gate must produce a blocking finding for CI to fail on");
  assert.equal(blocking[0].patternId, "hexagonal-architecture");
});
