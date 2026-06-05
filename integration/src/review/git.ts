import { execFileSync } from "node:child_process";
import type { ChangeEntry } from "./types.js";

function git(repoRoot: string, args: string[]): string {
  return execFileSync("git", ["-C", repoRoot, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
}

/** Parse `git diff --name-status <base>...HEAD` into ChangeEntry[]. */
export function changesFromGit(repoRoot: string, base: string): ChangeEntry[] {
  let raw: string;
  try {
    raw = git(repoRoot, ["diff", "--name-status", "-M", `${base}...HEAD`]);
  } catch {
    return [];
  }
  const out: ChangeEntry[] = [];
  for (const line of raw.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const parts = line.split(/\t/);
    const code = parts[0];
    if (code.startsWith("R")) {
      out.push({ status: "renamed", oldPath: parts[1], path: parts[2] });
    } else if (code === "A") {
      out.push({ status: "added", path: parts[1] });
    } else if (code === "D") {
      out.push({ status: "deleted", path: parts[1] });
    } else if (code === "M" || code === "C" || code.startsWith("T")) {
      out.push({ status: "modified", path: parts[parts.length - 1] });
    }
  }
  return out;
}

/** Read a path's content at the base ref (undefined if absent). */
export function gitBaseContent(repoRoot: string, base: string): (path: string) => string | undefined {
  return (path: string) => {
    try {
      return git(repoRoot, ["show", `${base}:${path}`]);
    } catch {
      return undefined;
    }
  };
}
