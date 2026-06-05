import type { Finding } from "../contract.js";
import type { ReviewResult } from "./types.js";

export function summarise(
  decision: ReviewResult["decision"],
  blocking: Finding[],
  advisories: Finding[],
  llmIncomplete = false,
): string {
  const lines: string[] = [];
  lines.push(
    decision === "block"
      ? `BLOCK: ${blocking.length} net-new boundary violation(s) introduced by this PR.`
      : "PASS: no net-new boundary violations introduced.",
  );
  for (const f of blocking.slice(0, 20)) lines.push(`  [block] ${f.path} — ${f.message}`);
  const policy = advisories.filter((a) => a.detectorId.startsWith("policy-certifier:"));
  if (policy.length) {
    lines.push(`Policy advisories (${policy.length}):`);
    for (const f of policy.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const consistency = advisories.filter((a) => a.detectorId === "consistency.candidate-pattern");
  if (consistency.length) {
    lines.push(`Consistency advisories (${consistency.length}):`);
    for (const f of consistency.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const reuse = advisories.filter((a) => a.detectorId === "reuse.canonical-baseline");
  if (reuse.length) {
    lines.push(`Reuse advisories (${reuse.length}):`);
    for (const f of reuse.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const semanticReuse = advisories.filter((a) => a.detectorId === "reuse.signature-baseline");
  if (semanticReuse.length) {
    lines.push(`Signature-reuse advisories (${semanticReuse.length}):`);
    for (const f of semanticReuse.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const capBypass = advisories.filter((a) => a.detectorId === "reuse.capability-bypass");
  if (capBypass.length) {
    lines.push(`Capability-bypass advisories (${capBypass.length}):`);
    for (const f of capBypass.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  const llm = advisories.filter((a) => a.detectorId === "llm-judge");
  if (llm.length) {
    lines.push(`LLM advisories (${llm.length}, advisory-only):`);
    for (const f of llm.slice(0, 20)) lines.push(`  [${f.severity}] ${f.path} — ${f.message}`);
  }
  if (llmIncomplete) lines.push("LLM advisory pass incomplete: provider/budget failed open.");
  return lines.join("\n");
}
