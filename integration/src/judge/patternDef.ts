import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { load as parseYaml } from "js-yaml";

/**
 * Loads the full pattern definition YAML (design 16.1: the catalogue IS the rule
 * definition for the LLM judge). The knowledge graph only carries id/title/group,
 * so the judge reads the source YAML for description, problem, context and the
 * positive/negative examples used as grounding.
 *
 * NOTE (design 16.10): examples used here as grounding must NOT also be used as the
 * eval set — that circularity is handled by the eval harness, not this loader.
 */

export interface PatternExample {
  language?: string;
  title?: string;
  positive?: string;
  negative?: string;
  explanation?: string;
}

export interface PatternDef {
  id: string;
  title: string;
  scale?: string;
  category?: string;
  short_description?: string;
  description?: string;
  problem?: string;
  context?: string;
  consequences?: string[];
  languages?: string[];
  examples: PatternExample[];
}

let cache: Map<string, PatternDef> | null = null;
let cacheRoot: string | null = null;

function* walkYaml(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) yield* walkYaml(abs);
    else if (name.endsWith(".yaml") || name.endsWith(".yml")) yield abs;
  }
}

function buildIndex(repoRoot: string): Map<string, PatternDef> {
  const index = new Map<string, PatternDef>();
  const patternsDir = join(repoRoot, "patterns");
  for (const file of walkYaml(patternsDir)) {
    let doc: Record<string, unknown>;
    try {
      doc = (parseYaml(readFileSync(file, "utf8")) ?? {}) as Record<string, unknown>;
    } catch {
      continue;
    }
    const id = doc.id as string | undefined;
    if (!id) continue;
    index.set(id, {
      id,
      title: (doc.title as string) ?? id,
      scale: doc.scale as string | undefined,
      category: doc.category as string | undefined,
      short_description: doc.short_description as string | undefined,
      description: doc.description as string | undefined,
      problem: doc.problem as string | undefined,
      context: doc.context as string | undefined,
      consequences: (doc.consequences as string[]) ?? undefined,
      languages: (doc.languages as string[]) ?? undefined,
      examples: ((doc.examples as PatternExample[]) ?? []).map((e) => ({
        language: e.language,
        title: e.title,
        positive: e.positive,
        negative: e.negative,
        explanation: e.explanation,
      })),
    });
  }
  return index;
}

export function loadPatternDef(repoRoot: string, patternId: string): PatternDef | undefined {
  if (!cache || cacheRoot !== repoRoot) {
    cache = buildIndex(repoRoot);
    cacheRoot = repoRoot;
  }
  return cache.get(patternId);
}

/** Test/diagnostic helper: clear the memoised index. */
export function _resetPatternDefCache(): void {
  cache = null;
  cacheRoot = null;
}
