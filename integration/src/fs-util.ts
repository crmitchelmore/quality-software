import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", "coverage", ".next"]);
const SOURCE_RE = /\.(ts|tsx|js|jsx|mjs|cts|mts)$/;

/** Recursively yield source files under `dir` (best-effort, skips heavy dirs). */
export function* walkSourceFiles(dir: string): Generator<string> {
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
    if (st.isDirectory()) yield* walkSourceFiles(abs);
    else if (SOURCE_RE.test(name)) yield abs;
  }
}
