import type { EvidenceMap } from "./project-map.js";

const ALLOWED_HYPHENATED_TERMS = new Set([
  "best-effort",
  "cross-cutting",
  "high-confidence",
  "low-confidence",
  "medium-confidence",
  "type-only",
  "warn-only",
]);

const COMMON_WORDS = new Set([
  "and",
  "app",
  "code",
  "core",
  "data",
  "file",
  "from",
  "into",
  "layer",
  "module",
  "project",
  "repo",
  "service",
  "shared",
  "test",
  "with",
]);

export function pathExistsInEvidenceMap(map: EvidenceMap, path: string): boolean {
  const modules = map.modules ?? [];
  const trimmed = path.trim().replace(/\/+$/, "");
  if (!trimmed) return false;
  return modules.some((m) => m.path === trimmed || m.path.startsWith(`${trimmed}/`));
}

function words(value: string): string[] {
  const spaced = value.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function repoVocabulary(map: EvidenceMap): Set<string> {
  const vocabulary = new Set<string>();
  for (const m of map.modules ?? []) {
    for (const word of words(m.path)) vocabulary.add(word);
    if (m.packageName) for (const word of words(m.packageName)) vocabulary.add(word);
    for (const exported of m.exports ?? []) {
      for (const word of words(exported.name)) vocabulary.add(word);
    }
  }
  return vocabulary;
}

export function missingRepoSpecificTerms(
  map: EvidenceMap,
  reasons: string[],
  knownTerms: Iterable<string>,
): string[] {
  const vocabulary = repoVocabulary(map);
  const known = new Set([...knownTerms].map((term) => term.toLowerCase()));
  const missing = new Set<string>();

  for (const reason of reasons) {
    for (const match of reason.matchAll(/\b[a-z][a-z0-9]+(?:-[a-z0-9]+)+\b/gi)) {
      const term = match[0].toLowerCase();
      if (known.has(term) || ALLOWED_HYPHENATED_TERMS.has(term)) continue;

      const significant = words(term).filter((word) => !COMMON_WORDS.has(word));
      if (significant.length < 2) continue;
      if (significant.every((word) => !vocabulary.has(word))) missing.add(term);
    }
  }

  return [...missing].sort();
}
