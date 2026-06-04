import { globToRegExp } from "../globs.js";
export { globToRegExp };

export function matchesAny(path: string, globs: string[] | undefined): boolean {
  if (!globs || globs.length === 0) return true;
  return globs.some((g) => globToRegExp(g).test(path));
}

/** Normalise a path to repo-relative, forward-slash form. */
export function relPath(repoRoot: string, p: string): string {
  const rel = p.startsWith(repoRoot) ? p.slice(repoRoot.length) : p;
  return rel.replace(/^[/\\]+/, "").replace(/\\/g, "/");
}
