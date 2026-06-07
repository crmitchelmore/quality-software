import type { Finding } from "../contract.js";

export function printFindings(findings: Finding[]): void {
  if (findings.length === 0) {
    process.stdout.write("✔ No conformance findings.\n");
    return;
  }
  process.stdout.write(`Conformance findings (${findings.length}):\n`);
  for (const f of findings) {
    const loc = f.line ? `${f.path}:${f.line}` : f.path;
    process.stdout.write(`\n  [${f.severity}] ${loc}\n    ${f.message}\n`);
    if (f.suggestion) process.stdout.write(`    fix: ${f.suggestion}\n`);
    if (f.rationale) process.stdout.write(`    why: ${f.rationale}\n`);
  }
  process.stdout.write("\n");
}
