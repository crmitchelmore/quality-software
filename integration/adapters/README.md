# Multi-runtime adapters

The conformance engine is runtime-agnostic. Each agent runtime speaks a slightly
different native hook JSON, so a thin adapter normalises the **input** and projects
the engine's verdict into the runtime's **output** dialect. All of this lives in
`../src/adapters/runtimes.ts` (`normalize` → `evaluatePhase` → `project`), selected
with `conformance hook <phase> --runtime <name>`.

Supported dialects: `copilot` (default), `claude`, `codex`, `generic`.

Every adapter is **fail-open**: any error yields empty/allow output.

## GitHub Copilot CLI (reference)

See `../../.github/hooks/conformance.json`. No `--runtime` flag needed (copilot is
the default).

## Claude Code

`.claude/settings.json` in the target repo:

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "conformance hook session-start --runtime claude" }] }
    ],
    "PostToolUse": [
      { "matcher": "Write|Edit|MultiEdit", "hooks": [{ "type": "command", "command": "conformance hook post-write --runtime claude" }] }
    ],
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "conformance hook guard-shell --runtime claude" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "conformance hook turn-end --runtime claude" }] }
    ]
  }
}
```

Claude passes `tool_input.file_path`; the normaliser also reads `path`. (If your
Claude version uses `file_path` only, the post-write tool arg is mapped from
`tool_input` — extend `normalize()` if needed.)

## Codex

Codex's hook schema is still stabilising. Use `--runtime codex` (currently emits the
`generic` dialect: `{ "decision": "allow|deny|block", "reason", "additionalContext" }`)
and adapt the field projection in `project()` once the schema is fixed.

## OpenCode

OpenCode has no native hook surface but is MCP-capable — wire the **MCP server**
instead (see `../mcp-config.example.json`). The `conformance_check_change`,
`conformance_suggest_reuse`, `conformance_profile`, and `conformance_init` tools give
the same guidance through tool calls. This is also the most portable path for any
MCP-capable runtime.

## Adding a new runtime

1. Confirm the runtime's native input field names → extend `normalize()` if they are
   not already covered (it already handles camelCase / snake_case / PascalCase).
2. Add an output projector branch in `project()` for the runtime's response schema.
3. Add a config template here. No engine changes required.
