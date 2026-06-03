import type { FileFacts } from "../model/lang/types.js";
import { defaultRegistry, type ProviderRegistry } from "../model/lang/registry.js";

/**
 * Neutral fact access for detectors (design 15/16). A detector that wants
 * imports/exports must go through the LanguageProvider registry rather than
 * hand-rolling per-language regex, so the SAME deterministic flow covers every
 * supported language (TS via the L2 provider; Kotlin/Java/Python/… via L0).
 *
 * Returns undefined when no provider claims the file (e.g. a `.md`/binary).
 */
export function factsFor(
  rel: string,
  content: string,
  registry: ProviderRegistry = defaultRegistry(),
): FileFacts | undefined {
  const provider = registry.providerFor(rel);
  if (!provider) return undefined;
  try {
    return provider.extract(rel, content);
  } catch {
    return undefined;
  }
}

/**
 * Pure path resolution of a RELATIVE import specifier against the importing file,
 * with NO dependency on a project index (so it works at write-time on a single
 * file). Returns a repo-relative path with any extension stripped, or undefined
 * for bare/package specifiers (which are not local path references).
 */
export function resolveRelative(fromRel: string, spec: string): string | undefined {
  if (!spec.startsWith(".")) return undefined;
  const dir = fromRel.split("/").slice(0, -1);
  for (const part of spec.split("/")) {
    if (part === "." || part === "") continue;
    else if (part === "..") dir.pop();
    else dir.push(part);
  }
  return dir.join("/").replace(/\.(ts|tsx|js|jsx|mjs|cts|mts|kt|kts|java|py|scala|go|cs|rs|rb|php|swift)$/, "");
}
