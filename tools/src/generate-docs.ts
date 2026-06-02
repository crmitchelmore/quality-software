import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadPatterns, type Pattern } from "./lib/patterns.js";

const DOCS = join(ROOT, "docs");
const PATTERN_DOCS = join(DOCS, "patterns");

function slugTitle(p: Pattern): string {
  return `${p.title}`;
}

function ratingBar(score: number): string {
  return "●".repeat(score) + "○".repeat(5 - score);
}

function codeBlock(lang: string, code: string): string {
  return "```" + lang + "\n" + code.trimEnd() + "\n```";
}

function byId(patterns: Pattern[]): Map<string, Pattern> {
  return new Map(patterns.map((p) => [p.id, p]));
}

function link(index: Map<string, Pattern>, id: string): string {
  const p = index.get(id);
  if (!p) return `\`${id}\``;
  return `[${p.title}](../${p.category}/${p.id}.md)`;
}

function renderPattern(p: Pattern, index: Map<string, Pattern>): string {
  const out: string[] = [];
  out.push(`# ${slugTitle(p)}`);
  out.push("");
  out.push(`> ${p.short_description}`);
  out.push("");
  out.push(
    `**Scale:** ${p.scale} · **Category:** ${p.category} · **Maturity:** ${p.maturity}`,
  );
  if (p.aka?.length) out.push(`\n**Also known as:** ${p.aka.join(", ")}`);
  out.push("");

  out.push("## Description\n");
  out.push(p.description);
  if (p.problem) out.push(`\n**Problem.** ${p.problem}`);
  if (p.context) out.push(`\n**Context.** ${p.context}`);
  out.push("");

  if (p.diagram) {
    out.push("## Diagram\n");
    out.push("```mermaid\n" + p.diagram.trimEnd() + "\n```");
    out.push("");
  }

  if (p.consequences?.length) {
    out.push("## Consequences / Trade-offs\n");
    for (const c of p.consequences) out.push(`- ${c}`);
    out.push("");
  }

  out.push("## Ratings by project size\n");
  out.push("| Project size | Score | Notes |");
  out.push("| --- | --- | --- |");
  out.push(
    `| Small (<10k LOC) | ${ratingBar(p.ratings.small.score)} ${p.ratings.small.score}/5 | ${p.ratings.small.notes} |`,
  );
  out.push(
    `| Medium (≤100k LOC) | ${ratingBar(p.ratings.medium.score)} ${p.ratings.medium.score}/5 | ${p.ratings.medium.notes} |`,
  );
  out.push(
    `| Large (>100k LOC) | ${ratingBar(p.ratings.large.score)} ${p.ratings.large.score}/5 | ${p.ratings.large.notes} |`,
  );
  out.push("");

  out.push("## Examples\n");
  for (const ex of p.examples) {
    if (ex.title) out.push(`### ${ex.title}\n`);
    out.push(`**❌ Negative (${ex.language})**\n`);
    out.push(codeBlock(ex.language, ex.negative));
    out.push("");
    out.push(`**✅ Positive (${ex.language})**\n`);
    out.push(codeBlock(ex.language, ex.positive));
    out.push("");
    out.push(`*${ex.explanation}*`);
    out.push("");
  }

  const relSections: Array<[string, string[]]> = [
    ["Works well with", p.works_well_with ?? (p.synergies ?? []).map((s) => s.pattern)],
    ["Conflicts with", p.conflicts_with ?? []],
    ["Alternatives", p.alternatives ?? []],
  ];
  if (relSections.some(([, l]) => l.length)) {
    out.push("## Relationships\n");
    if (p.synergies?.length) {
      out.push("**Synergies**\n");
      for (const s of p.synergies) {
        out.push(`- ${link(index, s.pattern)} — ${s.reason}`);
      }
      out.push("");
    } else if (p.works_well_with?.length) {
      out.push("**Works well with:** " + p.works_well_with.map((id) => link(index, id)).join(", "));
      out.push("");
    }
    if (p.conflicts_with?.length) {
      out.push("**Conflicts with:** " + p.conflicts_with.map((id) => link(index, id)).join(", "));
      out.push("");
    }
    if (p.alternatives?.length) {
      out.push("**Alternatives:** " + p.alternatives.map((id) => link(index, id)).join(", "));
      out.push("");
    }
  }

  out.push("## Applicability tags\n");
  out.push(`- **Languages:** ${p.languages.join(", ")}`);
  out.push(`- **Frameworks:** ${p.frameworks.join(", ")}`);
  out.push(`- **Project types:** ${p.project_types.join(", ")}`);
  if (p.tags?.length) out.push(`- **Tags:** ${p.tags.join(", ")}`);
  out.push("");

  if (p.references?.length) {
    out.push("## References\n");
    for (const r of p.references) {
      const bits = [r.author, r.title, r.year ? `(${r.year})` : ""].filter(Boolean).join(", ");
      out.push(`- ${r.url ? `[${bits}](${r.url})` : bits}`);
    }
    out.push("");
  }

  return out.join("\n");
}

function renderIndex(patterns: Pattern[]): string {
  const out: string[] = [];
  out.push("# Pattern Catalogue Index\n");
  out.push(`Total patterns: **${patterns.length}**\n`);

  const byCategory = new Map<string, Pattern[]>();
  for (const p of patterns) {
    (byCategory.get(p.category) ?? byCategory.set(p.category, []).get(p.category)!).push(p);
  }

  for (const category of [...byCategory.keys()].sort()) {
    const list = byCategory.get(category)!.sort((a, b) => a.title.localeCompare(b.title));
    out.push(`## ${category} (${list.length})\n`);
    out.push("| Pattern | Scale | Maturity | Small | Medium | Large |");
    out.push("| --- | --- | --- | :-: | :-: | :-: |");
    for (const p of list) {
      out.push(
        `| [${p.title}](patterns/${p.category}/${p.id}.md) | ${p.scale} | ${p.maturity} | ${p.ratings.small.score} | ${p.ratings.medium.score} | ${p.ratings.large.score} |`,
      );
    }
    out.push("");
  }
  return out.join("\n");
}

function main(): void {
  const patterns = loadPatterns();
  const index = byId(patterns);

  rmSync(PATTERN_DOCS, { recursive: true, force: true });
  mkdirSync(PATTERN_DOCS, { recursive: true });

  for (const p of patterns) {
    const dir = join(PATTERN_DOCS, p.category);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${p.id}.md`), renderPattern(p, index) + "\n");
  }

  writeFileSync(join(DOCS, "index.md"), renderIndex(patterns) + "\n");
  console.log(`✔ Generated docs for ${patterns.length} patterns.`);
}

main();
