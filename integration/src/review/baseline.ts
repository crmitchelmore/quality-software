import {
  moduleFromFile,
  parseModules,
  resolveLayerPrefixes,
  type BuildOptions,
  type ModuleInfo,
} from "../model/project-map.js";
import type { ChangeEntry, ReviewInput } from "./types.js";

/** Apply the reverse overlay that turns the head module set into the BASE module set. */
export function baselineModules(
  repoRoot: string,
  changes: ChangeEntry[],
  baseContent: ReviewInput["baseContent"],
  opts: BuildOptions,
): ModuleInfo[] {
  const byPath = new Map(parseModules(repoRoot, opts).map((m) => [m.path, m]));
  const registry = opts.registry;
  const prefixes = resolveLayerPrefixes(opts);
  const reAdd = (path: string) => {
    const content = baseContent(path);
    if (content === undefined) {
      byPath.delete(path);
      return;
    }
    const m = moduleFromFile(path, content, prefixes, registry);
    if (m) byPath.set(path, m);
    else byPath.delete(path);
  };
  for (const c of changes) {
    switch (c.status) {
      case "added":
        byPath.delete(c.path); // did not exist at base
        break;
      case "deleted":
        reAdd(c.path); // existed at base; restore it
        break;
      case "modified":
        reAdd(c.path); // restore the base version
        break;
      case "renamed":
        byPath.delete(c.path); // new path did not exist at base
        if (c.oldPath) reAdd(c.oldPath); // old path did
        break;
    }
  }
  return [...byPath.values()];
}
