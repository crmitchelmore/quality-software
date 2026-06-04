# Remote agent environments

How conformance gates **agent-authored** changes in remote/cloud environments, not
just local interactive sessions.

## GitHub Copilot cloud / coding agent

The cloud agent runs the **same** `.github/hooks/conformance.json` as the local CLI
(Linux sandbox; bash + http only; non-interactive — `preToolUse` "ask" becomes
"deny"). Two things must be true in the sandbox:

1. the `conformance` binary is on `PATH`, and
2. `CONFORMANCE_CATALOGUE_ROOT` points at a checkout/download of this catalogue.

`.github/workflows/copilot-setup-steps.yml` (copied into the target repo) does both:
it downloads a pinned public `crmitchelmore/quality-software` archive, `npm link`s
the binary, and exports the env var via `$GITHUB_ENV`. After that the advisory
write-time feedback and the shell guardrails apply to the cloud agent automatically.

> Because the cloud sandbox is non-interactive, keep write-time **advisory** (the
> default). Use the **PR gate** as the authoritative control for agent PRs.

## The authoritative gate: PR Action

`.github/workflows/conformance.yml` runs `conformance check --event PR_REVIEW` on
every PR — including PRs opened by the agent. Patterns marked `enforcement: block`
(backed by a certified detector) fail the check, so a non-conformant agent PR cannot
merge. This is the recommended enforcement point for any agentic workflow.

## GitHub agentic workflows (gh-aw and similar)

Any workflow that drives an agent in CI can call the same binary:

```yaml
- name: Conformance gate
  env:
    CONFORMANCE_CATALOGUE_ROOT: ${{ github.workspace }}/.conformance-catalogue
  run: node "$CONFORMANCE_CATALOGUE_ROOT/integration/bin/conformance.mjs" check --event PR_REVIEW --base "origin/${{ github.base_ref }}"
```

Or expose the MCP server (`conformance-mcp`) to an MCP-capable agent step for
in-loop guidance. Both paths use the identical engine and profile, so local, cloud,
and CI verdicts agree.

## Expansion

The same model extends to other remote runners (self-hosted, other CI). The only
requirements are Node 22, a catalogue download or checkout, and
`CONFORMANCE_CATALOGUE_ROOT`.
