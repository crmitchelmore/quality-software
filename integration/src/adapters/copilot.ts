import { readFileSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import type { CanonicalEvent, ChangeSet, ConformanceVerdict, Finding } from "../contract.js";
import { Engine } from "../engine.js";
import { loadCatalogue } from "../catalogue.js";
import { loadProfile } from "../profile.js";
import { sessionPrimer } from "../init.js";

/**
 * GitHub Copilot CLI adapter (design 12.5). Translates native hook payloads to a
 * canonical ChangeSet, runs the shared engine, and projects the verdict back to
 * Copilot's stdout JSON schema (verified against the hooks-reference).
 *
 * Every entry point is FAIL-OPEN (design 13.3): on any error it emits empty
 * output / allow, so a validator bug never blocks the agent. (preToolUse is
 * fail-closed at the runtime level, so guard-shell must stay cheap + defensive.)
 */

interface CopilotPayload {
  sessionId?: string;
  cwd?: string;
  toolName?: string;
  toolArgs?: unknown;
  source?: string;
}

const SESSION_DIR = ".conformance";

function parseArgs(toolArgs: unknown): Record<string, unknown> {
  if (toolArgs && typeof toolArgs === "object") return toolArgs as Record<string, unknown>;
  if (typeof toolArgs === "string") {
    try {
      return JSON.parse(toolArgs);
    } catch {
      return {};
    }
  }
  return {};
}

function buildEngine(cwd: string): { engine: Engine; cwd: string } | undefined {
  const profilePath = join(cwd, "patterns.config.yaml");
  if (!existsSync(profilePath)) return undefined; // no profile => engine does nothing (design 09)
  const catalogue = loadCatalogue(cwd);
  const profile = loadProfile(profilePath, catalogue);
  return { engine: new Engine(profile, catalogue), cwd };
}

function logFindings(cwd: string, sessionId: string | undefined, findings: Finding[]): void {
  if (!sessionId || findings.length === 0) return;
  try {
    const dir = join(cwd, SESSION_DIR);
    mkdirSync(dir, { recursive: true });
    appendFileSync(
      join(dir, `session-${sessionId}.jsonl`),
      findings.map((f) => JSON.stringify(f)).join("\n") + "\n",
    );
  } catch {
    /* best-effort */
  }
}

/** sessionStart -> inject profile priming as additionalContext (the north star). */
export function handleSessionStart(payload: CopilotPayload): string {
  try {
    const cwd = payload.cwd ?? process.cwd();
    const profilePath = join(cwd, "patterns.config.yaml");
    if (!existsSync(profilePath)) return "{}";
    const catalogue = loadCatalogue(cwd);
    const profile = loadProfile(profilePath, catalogue);
    return JSON.stringify({ additionalContext: sessionPrimer(profile, catalogue, cwd) });
  } catch {
    return "{}";
  }
}

/** postToolUse (edit|create) -> advisory feedback via additionalContext. */
export async function handlePostWrite(payload: CopilotPayload): Promise<string> {
  try {
    const cwd = payload.cwd ?? process.cwd();
    const built = buildEngine(cwd);
    if (!built) return "{}";
    const args = parseArgs(payload.toolArgs);
    const p = typeof args.path === "string" ? args.path : undefined;
    if (!p) return "{}";
    const abs = isAbsolute(p) ? p : join(cwd, p);
    if (!existsSync(abs)) return "{}";
    const content = readFileSync(abs, "utf8");
    const change: ChangeSet = {
      event: "POST_WRITE_CONTENT",
      repoRoot: cwd,
      files: [{ path: abs, content }],
    };
    const { verdict, findings } = await built.engine.evaluate(change);
    logFindings(cwd, payload.sessionId, findings);
    return verdict.additionalContext ? JSON.stringify({ additionalContext: verdict.additionalContext }) : "{}";
  } catch {
    return "{}";
  }
}

/** preToolUse (bash) -> destructive-command guardrail. Cheap + defensive (fail-closed runtime). */
export function handleGuardShell(payload: CopilotPayload): string {
  try {
    const args = parseArgs(payload.toolArgs);
    const cmd = typeof args.command === "string" ? args.command : "";
    const danger = [
      /\brm\s+-[a-zA-Z]*\s+(\/(\s|$)|~|\$HOME)/, // rm -rf / (root), ~ or $HOME
      /\bgit\s+push\s+.*--force\b.*\b(main|master)\b/,
      /\b(curl|wget)\b[^|]*\|\s*(sh|bash)\b/, // pipe-to-shell
    ];
    if (danger.some((re) => re.test(cmd))) {
      return JSON.stringify({
        permissionDecision: "deny",
        permissionDecisionReason: `Blocked by conformance guardrail: command matches a destructive/unsafe pattern. (${cmd.slice(0, 80)})`,
      });
    }
    return "{}";
  } catch {
    return "{}"; // never block on guardrail error beyond the runtime's own fail-closed behaviour
  }
}

/** agentStop -> if unresolved BLOCK findings this session, ask for one more turn. */
export function handleTurnEnd(payload: CopilotPayload): string {
  try {
    const cwd = payload.cwd ?? process.cwd();
    if (!payload.sessionId) return "{}";
    const logPath = join(cwd, SESSION_DIR, `session-${payload.sessionId}.jsonl`);
    if (!existsSync(logPath)) return "{}";
    const findings = readFileSync(logPath, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as Finding);
    const blocking = findings.filter((f) => f.severity === "block");
    if (blocking.length === 0) return "{}";
    const reason =
      "Unresolved conformance issues before finishing:\n" +
      blocking.slice(0, 5).map((f) => `- ${f.path}${f.line ? `:${f.line}` : ""} — ${f.message}`).join("\n");
    return JSON.stringify({ decision: "block", reason });
  } catch {
    return "{}";
  }
}

export const CANONICAL_BY_HOOK: Record<string, CanonicalEvent> = {
  "session-start": "SESSION_START",
  "post-write": "POST_WRITE_CONTENT",
  "guard-shell": "PRE_SHELL",
  "turn-end": "TURN_END",
};

export type { ConformanceVerdict };
