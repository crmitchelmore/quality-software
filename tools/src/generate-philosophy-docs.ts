import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadPatterns, type Pattern } from "./lib/patterns.js";
import { loadPhilosophies, type Philosophy } from "./lib/philosophies.js";

const DOCS = join(ROOT, "docs");
const PHIL_DOCS = join(DOCS, "philosophies");

const STRENGTH_LABEL: Record<string, string> = {
  "primary-source": "primary source",
  "secondary-source": "secondary source",
  "inferred": "inferred",
};

function patternLink(p: Pattern | undefined, id: string): string {
  if (!p) return `\`${id}\``;
  return `[${p.title}](../patterns/${p.category}/${p.id}.md)`;
}

function philLink(ph: Philosophy | undefined, id: string): string {
  if (!ph) return `\`${id}\``;
  return `[${ph.title}](${ph.id}.md)`;
}

function renderPhilosophy(
  ph: Philosophy,
  patternsById: Map<string, Pattern>,
  philById: Map<string, Philosophy>,
): string {
  const out: string[] = [];
  out.push(`# ${ph.title}`);
  out.push("");
  out.push(`> ${ph.short_description}`);
  out.push("");
  const originBits = [
    ph.originators.join(", "),
    `*${ph.origin.title}*`,
    ph.origin.year ? `(${ph.origin.year})` : ph.origin.era ?? "",
  ].filter(Boolean).join(" · ");
  out.push(`**Origin:** ${originBits}`);
  if (ph.aka?.length) out.push(`\n**Also known as:** ${ph.aka.join(", ")}`);
  out.push("");

  out.push("## Description\n");
  out.push(ph.description);
  if (ph.in_practice) out.push(`\n**In practice.** ${ph.in_practice}`);
  out.push("");

  out.push("## Core tenets\n");
  for (const t of ph.core_tenets) out.push(`- ${t}`);
  out.push("");

  if (ph.key_ideas?.length) {
    out.push("## Key ideas\n");
    for (const k of ph.key_ideas) out.push(`- **${k.name}** — ${k.explanation}`);
    out.push("");
  }

  out.push("## Associated patterns\n");
  out.push("Patterns from the catalogue that embody or operationalise this philosophy:\n");
  for (const a of ph.associated_patterns) {
    out.push(`- ${patternLink(patternsById.get(a.pattern), a.pattern)} — ${a.reason}`);
  }
  out.push("");

  if (ph.at_odds_patterns?.length) {
    out.push("## Patterns in tension\n");
    out.push("Patterns this philosophy would caution against or use sparingly:\n");
    for (const a of ph.at_odds_patterns) {
      out.push(`- ${patternLink(patternsById.get(a.pattern), a.pattern)} — ${a.reason}`);
    }
    out.push("");
  }

  out.push("## Reported applications\n");
  out.push("Where this philosophy has reportedly been applied (with source and evidence strength):\n");
  out.push("| Where | What | Evidence | Source |");
  out.push("| --- | --- | --- | --- |");
  for (const s of ph.successfully_applied) {
    const src = s.source.url ? `[${s.source.title}](${s.source.url})` : s.source.title;
    out.push(`| ${s.where} | ${s.what} | ${STRENGTH_LABEL[s.evidence_strength]} | ${src} |`);
  }
  out.push("");

  if (ph.best_for?.length) {
    out.push(`**Best for:** ${ph.best_for.join(", ")}`);
    out.push("");
  }

  if (ph.complements?.length || ph.tensions_with?.length) {
    out.push("## Relationships with other philosophies\n");
    if (ph.complements?.length) {
      out.push("**Complements:** " + ph.complements.map((id) => philLink(philById.get(id), id)).join(", "));
      out.push("");
    }
    if (ph.tensions_with?.length) {
      out.push("**In tension with**\n");
      for (const t of ph.tensions_with) {
        out.push(`- ${philLink(philById.get(t.philosophy), t.philosophy)} — ${t.reason}`);
      }
      out.push("");
    }
  }

  if (ph.criticisms?.length) {
    out.push("## Criticisms / limits\n");
    for (const c of ph.criticisms) out.push(`- ${c}`);
    out.push("");
  }

  out.push("## References\n");
  for (const r of ph.references) {
    const bits = [r.author, r.title, r.year ? `(${r.year})` : ""].filter(Boolean).join(", ");
    out.push(`- ${r.url ? `[${bits}](${r.url})` : bits}`);
  }
  out.push("");

  return out.join("\n");
}

function renderIndex(
  philosophies: Philosophy[],
  patternsById: Map<string, Pattern>,
): string {
  const out: string[] = [];
  out.push("# Software Design Philosophies\n");
  out.push(`Total philosophies: **${philosophies.length}**\n`);
  out.push(
    "Each philosophy associates patterns from the [pattern catalogue](../index.md) and records where it has reportedly been applied.\n",
  );

  out.push("| Philosophy | Originators | Origin | Patterns |");
  out.push("| --- | --- | --- | :-: |");
  for (const ph of [...philosophies].sort((a, b) => a.title.localeCompare(b.title))) {
    out.push(
      `| [${ph.title}](${ph.id}.md) | ${ph.originators.join(", ")} | *${ph.origin.title}*${ph.origin.year ? ` (${ph.origin.year})` : ""} | ${ph.associated_patterns.length} |`,
    );
  }
  out.push("");

  // Reverse index: which philosophies motivate each pattern (generated, not stored).
  out.push("## Patterns and the philosophies that motivate them\n");
  const reverse = new Map<string, string[]>();
  for (const ph of philosophies) {
    for (const a of ph.associated_patterns) {
      (reverse.get(a.pattern) ?? reverse.set(a.pattern, []).get(a.pattern)!).push(ph.id);
    }
  }
  const philById = new Map(philosophies.map((p) => [p.id, p]));
  const rows = [...reverse.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  out.push("| Pattern | Motivated by |");
  out.push("| --- | --- |");
  for (const [pid, philList] of rows) {
    const p = patternsById.get(pid);
    const pName = p ? `[${p.title}](../patterns/${p.category}/${p.id}.md)` : `\`${pid}\``;
    const phs = philList.map((id) => philLink(philById.get(id), id)).join(", ");
    out.push(`| ${pName} | ${phs} |`);
  }
  out.push("");
  return out.join("\n");
}

function main(): void {
  const patterns = loadPatterns();
  const patternsById = new Map(patterns.map((p) => [p.id, p]));
  const philosophies = loadPhilosophies();
  const philById = new Map(philosophies.map((p) => [p.id, p]));

  rmSync(PHIL_DOCS, { recursive: true, force: true });
  mkdirSync(PHIL_DOCS, { recursive: true });

  for (const ph of philosophies) {
    writeFileSync(
      join(PHIL_DOCS, `${ph.id}.md`),
      renderPhilosophy(ph, patternsById, philById) + "\n",
    );
  }
  writeFileSync(join(PHIL_DOCS, "index.md"), renderIndex(philosophies, patternsById) + "\n");
  console.log(`✔ Generated docs for ${philosophies.length} philosophies.`);
}

main();
