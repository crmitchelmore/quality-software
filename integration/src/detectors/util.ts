/** Minimal glob matcher (supports `**`, `*`, `?`) — avoids a dependency. */
export function globToRegExp(glob: string): RegExp {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        re += ".*";
        i++;
        if (glob[i + 1] === "/") i++; // consume slash after **
      } else {
        re += "[^/]*";
      }
    } else if (c === "?") {
      re += "[^/]";
    } else if (".+^${}()|[]\\".includes(c)) {
      re += "\\" + c;
    } else {
      re += c;
    }
  }
  return new RegExp("^" + re + "$");
}

export function matchesAny(path: string, globs: string[] | undefined): boolean {
  if (!globs || globs.length === 0) return true;
  return globs.some((g) => globToRegExp(g).test(path));
}

/** Normalise a path to repo-relative, forward-slash form. */
export function relPath(repoRoot: string, p: string): string {
  const rel = p.startsWith(repoRoot) ? p.slice(repoRoot.length) : p;
  return rel.replace(/^[/\\]+/, "").replace(/\\/g, "/");
}
