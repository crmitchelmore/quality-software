import { test, after } from "node:test";
import assert from "node:assert/strict";
import { callTool } from "../src/mcp.js";
import { cleanupAll, makeProject, todoProfile } from "./helpers.js";

after(cleanupAll);

test("MCP check_change ignores malformed file params without crashing", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });

  const out = await callTool("conformance_check_change", {
    cwd: dir,
    files: [
      { path: 42, content: "not a valid file param" },
      { path: "src/domain/ports.ts", content: "export interface TodoRepository { save(): Promise<void>; }\n" },
    ],
  });

  assert.match(out.text, /No conformance findings|Conformance/);
});

test("MCP suggest_reuse defaults malformed optional params safely", async () => {
  const dir = makeProject({ profile: todoProfile("warn") });

  const out = await callTool("conformance_suggest_reuse", {
    cwd: dir,
    path: 123,
    content: false,
  });

  assert.equal(out.text, "No existing equivalent found — safe to add.");
});

test("MCP callTool rejects unknown tools explicitly", async () => {
  await assert.rejects(() => callTool("missing_tool", {}), /Unknown tool/);
});
