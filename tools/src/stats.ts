import { loadPatterns } from "./lib/patterns.js";

/** Quick catalogue statistics: counts by category/scale/maturity and coverage. */
function main(): void {
  const patterns = loadPatterns();
  const tally = (key: (p: ReturnType<typeof loadPatterns>[number]) => string) => {
    const m = new Map<string, number>();
    for (const p of patterns) m.set(key(p), (m.get(key(p)) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  console.log(`Total patterns: ${patterns.length}\n`);
  console.log("By category:");
  for (const [k, v] of tally((p) => p.category)) console.log(`  ${v.toString().padStart(3)}  ${k}`);
  console.log("\nBy scale:");
  for (const [k, v] of tally((p) => p.scale)) console.log(`  ${v.toString().padStart(3)}  ${k}`);
  console.log("\nBy maturity:");
  for (const [k, v] of tally((p) => p.maturity)) console.log(`  ${v.toString().padStart(3)}  ${k}`);
}

main();
