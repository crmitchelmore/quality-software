import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadPatterns, type Pattern } from "./lib/patterns.js";
import { loadPhilosophies, type Philosophy } from "./lib/philosophies.js";
import { loadPractice, type PracticePattern } from "./lib/practice.js";

const DOCS = join(ROOT, "docs");
const DISCIPLINE_DIR: Record<string, string> = { product: "product-patterns", ux: "ux-patterns" };
const DISCIPLINE_LABEL: Record<string, string> = { product: "Product Management", ux: "UX Design" };
const STAGE_LABEL: Record<string, string> = {
  early: "Early (pre-PMF / <10 people)",
  growth: "Growth (scaling team & users)",
  enterprise: "Enterprise (mature org / regulated)",
};

function ratingBar(score: number): string {
  return "●".repeat(score) + "○".repeat(5 - score);
}

/** Link to a software pattern doc, relative to docs/<discipline>-patterns/. */
function swLink(p: Pattern | undefined, id: string): string {
  if (!p) return `\`${id}\``;
  return `[${p.title}](../patterns/${p.category}/${p.id}.md)`;
}

/** Link to a practice pattern doc, relative to docs/<discipline>-patterns/. */
function practiceLink(p: PracticePattern | undefined, id: string): string {
  if (!p) return `\`${id}\``;
  return `[${p.title}](../${DISCIPLINE_DIR[p.discipline]}/${p.id}.md)`;
}

/** Link to a philosophy doc, relative to docs/<discipline>-patterns/. */
function philLink(ph: Philosophy | undefined, id: string): string {
  if (!ph) return `\`${id}\``;
  return `[${ph.title}](../philosophies/${ph.id}.md)`;
}

function renderPattern(
  p: PracticePattern,
  swById: Map<string, Pattern>,
  practiceById: Map<string, PracticePattern>,
  philById: Map<string, Philosophy>,
): string {
  const out: string[] = [];
  out.push(`# ${p.title}`);
  out.push("");
  out.push(`> ${p.short_description}`);
  out.push("");
  out.push(
    `**Discipline:** ${DISCIPLINE_LABEL[p.discipline]} · **Category:** ${p.category} · **Maturity:** ${p.maturity}`,
  );
  if (p.aka?.length) out.push(`\n**Also known as:** ${p.aka.join(", ")}`);
  out.push("");

  out.push("## Description\n");
  out.push(p.description);
  out.push("");
  out.push(`**Problem.** ${p.problem}`);
  if (p.context) out.push(`\n**Context.** ${p.context}`);
  out.push("");

  if (p.forces?.length) {
    out.push("## Forces\n");
    for (const f of p.forces) out.push(`- ${f}`);
    out.push("");
  }

  out.push("## Solution\n");
  out.push(p.solution);
  out.push("");

  if (p.when_to_use?.length) {
    out.push("## When to use\n");
    for (const w of p.when_to_use) out.push(`- ${w}`);
    out.push("");
  }

  if (p.metrics?.length) {
    out.push("## Metrics\n");
    out.push("Signals that tell you whether this pattern is working:\n");
    for (const m of p.metrics) out.push(`- ${m}`);
    out.push("");
  }

  if (p.heuristics?.length) {
    out.push("## Heuristics\n");
    out.push("Rules of thumb for applying this pattern well:\n");
    for (const h of p.heuristics) out.push(`- ${h}`);
    out.push("");
  }

  out.push("## Ratings by organisation stage\n");
  out.push("| Stage | Score | Notes |");
  out.push("| --- | --- | --- |");
  for (const stage of ["early", "growth", "enterprise"] as const) {
    const r = p.ratings[stage];
    out.push(`| ${STAGE_LABEL[stage]} | ${ratingBar(r.score)} ${r.score}/5 | ${r.notes} |`);
  }
  out.push("");

  out.push("## Examples\n");
  for (const ex of p.examples) {
    if (ex.title) out.push(`### ${ex.title}\n`);
    out.push(`**❌ Poorer approach**\n`);
    out.push(ex.poor);
    out.push("");
    out.push(`**✅ Better approach**\n`);
    out.push(ex.better);
    out.push("");
    out.push(`*${ex.explanation}*`);
    out.push("");
  }

  if (p.anti_patterns?.length) {
    out.push("## Anti-patterns\n");
    for (const a of p.anti_patterns) out.push(`- ${a}`);
    out.push("");
  }

  const hasRel =
    p.related_practice_patterns?.length ||
    p.related_software_patterns?.length ||
    p.related_philosophies?.length;
  if (hasRel) {
    out.push("## Relationships\n");
    if (p.related_practice_patterns?.length) {
      out.push("**Related product / UX patterns**\n");
      for (const a of p.related_practice_patterns) {
        out.push(`- ${practiceLink(practiceById.get(a.pattern), a.pattern)} — ${a.reason}`);
      }
      out.push("");
    }
    if (p.related_software_patterns?.length) {
      out.push("**Related software patterns**\n");
      for (const a of p.related_software_patterns) {
        out.push(`- ${swLink(swById.get(a.pattern), a.pattern)} — ${a.reason}`);
      }
      out.push("");
    }
    if (p.related_philosophies?.length) {
      out.push("**Related philosophies**\n");
      for (const a of p.related_philosophies) {
        out.push(`- ${philLink(philById.get(a.philosophy), a.philosophy)} — ${a.reason}`);
      }
      out.push("");
    }
  }

  if (p.tags?.length || p.product_stages?.length) {
    out.push("## Tags\n");
    if (p.tags?.length) out.push(`- **Tags:** ${p.tags.join(", ")}`);
    if (p.product_stages?.length) out.push(`- **Product stages:** ${p.product_stages.join(", ")}`);
    out.push("");
  }

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

function renderIndex(
  discipline: "product" | "ux",
  patterns: PracticePattern[],
): string {
  const out: string[] = [];
  out.push(`# ${DISCIPLINE_LABEL[discipline]} Patterns\n`);
  out.push(`Total patterns: **${patterns.length}**\n`);

  const byCategory = new Map<string, PracticePattern[]>();
  for (const p of patterns) {
    (byCategory.get(p.category) ?? byCategory.set(p.category, []).get(p.category)!).push(p);
  }
  for (const category of [...byCategory.keys()].sort()) {
    const list = byCategory.get(category)!.sort((a, b) => a.title.localeCompare(b.title));
    out.push(`## ${category} (${list.length})\n`);
    out.push("| Pattern | Maturity | Early | Growth | Enterprise |");
    out.push("| --- | --- | :-: | :-: | :-: |");
    for (const p of list) {
      out.push(
        `| [${p.title}](${p.id}.md) | ${p.maturity} | ${p.ratings.early.score} | ${p.ratings.growth.score} | ${p.ratings.enterprise.score} |`,
      );
    }
    out.push("");
  }
  return out.join("\n");
}

/** Cross-source reverse index: which practice patterns reference each software pattern / philosophy. */
function renderCrossIndex(
  practice: PracticePattern[],
  swById: Map<string, Pattern>,
  philById: Map<string, Philosophy>,
): string {
  const out: string[] = [];
  out.push("# Cross-Source Connections\n");
  out.push(
    "Generated reverse index showing where product & UX patterns connect back to the software pattern catalogue and the design philosophies.\n",
  );

  const swRev = new Map<string, PracticePattern[]>();
  const philRev = new Map<string, PracticePattern[]>();
  for (const p of practice) {
    for (const a of p.related_software_patterns ?? []) {
      (swRev.get(a.pattern) ?? swRev.set(a.pattern, []).get(a.pattern)!).push(p);
    }
    for (const a of p.related_philosophies ?? []) {
      (philRev.get(a.philosophy) ?? philRev.set(a.philosophy, []).get(a.philosophy)!).push(p);
    }
  }

  const practiceRef = (p: PracticePattern) =>
    `[${p.title}](../${DISCIPLINE_DIR[p.discipline]}/${p.id}.md)`;

  out.push("## Software patterns referenced by product & UX patterns\n");
  out.push("| Software pattern | Referenced by |");
  out.push("| --- | --- |");
  for (const [id, list] of [...swRev.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const sw = swById.get(id);
    const name = sw ? `[${sw.title}](../patterns/${sw.category}/${sw.id}.md)` : `\`${id}\``;
    out.push(`| ${name} | ${list.map(practiceRef).join(", ")} |`);
  }
  out.push("");

  out.push("## Philosophies referenced by product & UX patterns\n");
  out.push("| Philosophy | Referenced by |");
  out.push("| --- | --- |");
  for (const [id, list] of [...philRev.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const ph = philById.get(id);
    const name = ph ? `[${ph.title}](../philosophies/${ph.id}.md)` : `\`${id}\``;
    out.push(`| ${name} | ${list.map(practiceRef).join(", ")} |`);
  }
  out.push("");
  return out.join("\n");
}

function main(): void {
  const swById = new Map(loadPatterns().map((p) => [p.id, p]));
  const philById = new Map(loadPhilosophies().map((p) => [p.id, p]));
  const practice = loadPractice();
  const practiceById = new Map(practice.map((p) => [p.id, p]));

  for (const discipline of ["product", "ux"] as const) {
    const dir = join(DOCS, DISCIPLINE_DIR[discipline]);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    const subset = practice.filter((p) => p.discipline === discipline);
    for (const p of subset) {
      writeFileSync(join(dir, `${p.id}.md`), renderPattern(p, swById, practiceById, philById) + "\n");
    }
    writeFileSync(join(dir, "index.md"), renderIndex(discipline, subset) + "\n");
  }

  writeFileSync(
    join(DOCS, "cross-source-connections.md"),
    renderCrossIndex(practice, swById, philById) + "\n",
  );

  console.log(`✔ Generated docs for ${practice.length} practice patterns.`);
}

main();
