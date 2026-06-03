import { readFileSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import type { ChangeSet, Finding } from "../contract.js";
import { Engine } from "../engine.js";
import { loadCatalogue } from "../catalogue.js";
import { loadProfile } from "../profile.js";
import { sessionPrimer } from "../init.js";

/**
 * Runtime-neutral hook core + per-runtime output dialects (design 12.6 — the
 * multi-runtime expansion seam). Every agent runtime (Copilot CLI, Claude Code,
 * Codex, OpenCode, …) speaks a slightly different native hook JSON; this module
 * normalises the INPUT to one shape, runs the SAME engine, and projects a single
 * NeutralVerdict back into the requested dialect.
 *
 * All phases are FAIL-OPEN: any error → empty/allow output (the copilot.ts module
 * is the reference implementation; this generalises it).
 */

export type Phase = "session-start" | "post-write" | "guard-shell" | "turn-end";
export type Dialect = "copilot" | "claude" | "codex" | "generic";

const SESSION_DIR = ".conformance";

/** What the engine concluded, before any runtime-specific shaping. */
interface NeutralVerdict {
  additionalContext?: string;
  deny?: { reason: string };
  continue?: { reason: string };
}

/** Normalise the many native payload shapes into one. */
interface NormalPayload {
  cwd: string;
  sessionId?: string;
  toolName?: string;
  args: Record<string, unknown>;
  command?: string;
}

function firstString(...vals: unknown[]): string | undefined {
  for (const v of vals) if (typeof v === "string" && v) return v;
  return undefined;
}

function toObject(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object") return v as Record<string, unknown>;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return {};
    }
  }
  return {};
}

export function normalize(raw: Record<string, unknown>): NormalPayload {
  const args = toObject(raw.toolArgs ?? raw.tool_input ?? raw.toolInput ?? raw.arguments ?? raw.input);
  return {
    cwd: firstString(raw.cwd, raw.workingDirectory, raw.working_directory, raw.projectRoot) ?? process.cwd(),
    sessionId: firstString(raw.sessionId, raw.session_id, raw.conversationId, raw.conversation_id),
    toolName: firstString(raw.toolName, raw.tool_name, raw.tool, raw.name),
    args,
    command: firstString(args.command as string, args.cmd as string, args.commandLine as string),
  };
}

function buildEngine(cwd: string): Engine | undefined {
  const profilePath = join(cwd, "patterns.config.yaml");
  if (!existsSync(profilePath)) return undefined;
  const catalogue = loadCatalogue(cwd);
  return new Engine(loadProfile(profilePath, catalogue), catalogue);
}

function logFindings(cwd: string, sessionId: string | undefined, findings: Finding[]): void {
  if (!sessionId || findings.length === 0) return;
  try {
    mkdirSync(join(cwd, SESSION_DIR), { recursive: true });
    appendFileSync(
      join(cwd, SESSION_DIR, `session-${sessionId}.jsonl`),
      findings.map((f) => JSON.stringify(f)).join("\n") + "\n",
    );
  } catch {
    /* best effort */
  }
}

const DANGER = [
  /\brm\s+-[a-zA-Z]*\s+(\/(\s|$)|~|\$HOME)/,
  /\bgit\s+push\s+.*--force\b.*\b(main|master)\b/,
  /\b(curl|wget)\b[^|]*\|\s*(sh|bash)\b/,
];

/** Run the engine for a phase and return a runtime-neutral verdict. */
export async function evaluatePhase(phase: Phase, p: NormalPayload): Promise<NeutralVerdict> {
  try {
    switch (phase) {
      case "session-start": {
        const profilePath = join(p.cwd, "patterns.config.yaml");
        if (!existsSync(profilePath)) return {};
        const catalogue = loadCatalogue(p.cwd);
        const profile = loadProfile(profilePath, catalogue);
        return { additionalContext: sessionPrimer(profile, catalogue, p.cwd) };
      }
      case "post-write": {
        const engine = buildEngine(p.cwd);
        if (!engine) return {};
        const rel = typeof p.args.path === "string" ? p.args.path : undefined;
        if (!rel) return {};
        const abs = isAbsolute(rel) ? rel : join(p.cwd, rel);
        if (!existsSync(abs)) return {};
        const change: ChangeSet = {
          event: "POST_WRITE_CONTENT",
          repoRoot: p.cwd,
          files: [{ path: abs, content: readFileSync(abs, "utf8") }],
        };
        const { verdict, findings } = await engine.evaluate(change);
        logFindings(p.cwd, p.sessionId, findings);
        return verdict.additionalContext ? { additionalContext: verdict.additionalContext } : {};
      }
      case "guard-shell": {
        const cmd = p.command ?? "";
        if (DANGER.some((re) => re.test(cmd))) {
          return { deny: { reason: `Blocked by conformance guardrail: unsafe command. (${cmd.slice(0, 80)})` } };
        }
        return {};
      }
      case "turn-end": {
        if (!p.sessionId) return {};
        const logPath = join(p.cwd, SESSION_DIR, `session-${p.sessionId}.jsonl`);
        if (!existsSync(logPath)) return {};
        const blocking = readFileSync(logPath, "utf8")
          .split("\n")
          .filter(Boolean)
          .map((l) => JSON.parse(l) as Finding)
          .filter((f) => f.severity === "block");
        if (blocking.length === 0) return {};
        return {
          continue: {
            reason:
              "Unresolved conformance issues before finishing:\n" +
              blocking.slice(0, 5).map((f) => `- ${f.path}${f.line ? `:${f.line}` : ""} — ${f.message}`).join("\n"),
          },
        };
      }
    }
  } catch {
    return {}; // fail-open
  }
}

/** Project a neutral verdict into a runtime's native hook JSON. */
export function project(dialect: Dialect, phase: Phase, v: NeutralVerdict): string {
  switch (dialect) {
    case "copilot":
      return projectCopilot(phase, v);
    case "claude":
      return projectClaude(phase, v);
    case "codex":
    case "generic":
      return projectGeneric(v);
  }
}

function projectCopilot(phase: Phase, v: NeutralVerdict): string {
  if (phase === "guard-shell" && v.deny) {
    return JSON.stringify({ permissionDecision: "deny", permissionDecisionReason: v.deny.reason });
  }
  if (phase === "turn-end" && v.continue) {
    return JSON.stringify({ decision: "block", reason: v.continue.reason });
  }
  if (v.additionalContext) return JSON.stringify({ additionalContext: v.additionalContext });
  return "{}";
}

function projectClaude(phase: Phase, v: NeutralVerdict): string {
  const eventName = {
    "session-start": "SessionStart",
    "post-write": "PostToolUse",
    "guard-shell": "PreToolUse",
    "turn-end": "Stop",
  }[phase];
  if (phase === "guard-shell" && v.deny) {
    return JSON.stringify({
      hookSpecificOutput: { hookEventName: eventName, permissionDecision: "deny", permissionDecisionReason: v.deny.reason },
    });
  }
  if (phase === "turn-end" && v.continue) {
    return JSON.stringify({ decision: "block", reason: v.continue.reason });
  }
  if (v.additionalContext) {
    return JSON.stringify({ hookSpecificOutput: { hookEventName: eventName, additionalContext: v.additionalContext } });
  }
  return "{}";
}

function projectGeneric(v: NeutralVerdict): string {
  const out: Record<string, unknown> = {};
  if (v.deny) {
    out.decision = "deny";
    out.reason = v.deny.reason;
  } else if (v.continue) {
    out.decision = "block";
    out.reason = v.continue.reason;
  } else {
    out.decision = "allow";
  }
  if (v.additionalContext) out.additionalContext = v.additionalContext;
  return JSON.stringify(out);
}

/** One-call entrypoint used by the CLI `hook` command. */
export async function runHook(phase: Phase, dialect: Dialect, raw: Record<string, unknown>): Promise<string> {
  const v = await evaluatePhase(phase, normalize(raw));
  return project(dialect, phase, v);
}
