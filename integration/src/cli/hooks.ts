import { runHook, type Dialect, type Phase } from "../adapters/runtimes.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

export async function cmdHook(which: string, rest: string[]): Promise<void> {
  const raw = await readStdin();
  let payload: Record<string, unknown> = {};
  try {
    payload = raw.trim() ? JSON.parse(raw) : {};
  } catch {
    payload = {};
  }
  const rIdx = rest.indexOf("--runtime");
  const dialect = (rIdx >= 0 ? rest[rIdx + 1] : "copilot") as Dialect;
  const phases: Phase[] = ["session-start", "post-write", "guard-shell", "turn-end"];
  if (!phases.includes(which as Phase)) {
    process.stdout.write("{}");
    return;
  }
  process.stdout.write(await runHook(which as Phase, dialect, payload));
}
