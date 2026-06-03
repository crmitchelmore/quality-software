import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "coverage", ".next",
  "target", "out", "vendor", ".gradle", ".idea", ".venv", "venv",
  "__pycache__", ".mvn", "bin", "obj",
]);
const SOURCE_RE = /\.(ts|tsx|js|jsx|mjs|cts|mts)$/;

/** Recursively yield TypeScript/JavaScript source files under `dir`. */
export function* walkSourceFiles(dir: string): Generator<string> {
  yield* walkMatching(dir, (name) => SOURCE_RE.test(name));
}

/**
 * Recursively yield ALL files under `dir` (skipping heavy/generated dirs).
 * Language-agnostic: the ProviderRegistry decides which files it can claim
 * (design 15.2). Used by the evidence map so non-JS languages are not gated out.
 */
export function* walkAllFiles(dir: string): Generator<string> {
  yield* walkMatching(dir, () => true);
}

function* walkMatching(dir: string, accept: (name: string) => boolean): Generator<string> {
  if (!existsSync(dir)) return;
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const abs = join(dir, name);
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isDirectory()) yield* walkMatching(abs, accept);
    else if (accept(name)) yield abs;
  }
}
