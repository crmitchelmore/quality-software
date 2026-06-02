import { test, after } from "node:test";
import assert from "node:assert/strict";
import { runHook, normalize } from "../src/adapters/runtimes.js";
import { makeProject, todoProfile, writeFile, cleanupAll } from "./helpers.js";

after(cleanupAll);

const LEAKY = `import { Db } from "../infrastructure/db";\nexport class S { constructor(private d: Db){} }\n`;

test("normalize handles camelCase, snake_case and PascalCase payloads", () => {
  const a = normalize({ toolName: "edit", toolArgs: { path: "x.ts", command: "ls" }, cwd: "/p", sessionId: "1" });
  assert.equal(a.toolName, "edit");
  assert.equal(a.args.path, "x.ts");
  assert.equal(a.command, "ls");

  const b = normalize({ tool_name: "Bash", tool_input: { command: "rm -rf /" }, working_directory: "/p", session_id: "2" });
  assert.equal(b.toolName, "Bash");
  assert.equal(b.command, "rm -rf /");
  assert.equal(b.sessionId, "2");

  const c = normalize({ name: "write", arguments: '{"path":"y.ts"}' }); // stringified args
  assert.equal(c.args.path, "y.ts");
});

test("claude dialect: post-write emits hookSpecificOutput.additionalContext", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  writeFile(dir, "src/domain/s.ts", LEAKY);
  const out = JSON.parse(
    await runHook("post-write", "claude", { cwd: dir, sessionId: "c1", tool_name: "Edit", tool_input: { path: "src/domain/s.ts" } }),
  );
  assert.equal(out.hookSpecificOutput.hookEventName, "PostToolUse");
  assert.match(out.hookSpecificOutput.additionalContext, /[Bb]oundary/);
});

test("claude dialect: guard-shell deny uses permissionDecision in hookSpecificOutput", async () => {
  const out = JSON.parse(await runHook("guard-shell", "claude", { tool_name: "Bash", tool_input: { command: "rm -rf /" } }));
  assert.equal(out.hookSpecificOutput.permissionDecision, "deny");
});

test("generic/codex dialect: decision + reason shape", async () => {
  const deny = JSON.parse(await runHook("guard-shell", "codex", { tool_input: { command: "rm -rf /" } }));
  assert.equal(deny.decision, "deny");
  assert.match(deny.reason, /guardrail/i);

  const allow = JSON.parse(await runHook("guard-shell", "generic", { tool_input: { command: "ls" } }));
  assert.equal(allow.decision, "allow");
});

test("copilot dialect via runHook matches the reference adapter output", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });
  const primer = JSON.parse(await runHook("session-start", "copilot", { cwd: dir }));
  assert.match(primer.additionalContext, /Hexagonal/i);
});

test("all dialects are fail-open on malformed payloads", async () => {
  for (const d of ["copilot", "claude", "codex", "generic"] as const) {
    const out = await runHook("post-write", d, { toolArgs: "nonsense" });
    // never throws; returns benign output
    assert.ok(typeof out === "string");
  }
});
