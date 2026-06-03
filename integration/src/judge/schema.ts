/**
 * Structured judge output (design 16.3) + strict validation, including the
 * injection-hardening checks of design 16.9: evidence spans must reference ONLY
 * the supplied region, and cited text must actually appear in that region. A model
 * citing a file/line it was not given, or text that does not match, is rejected.
 */

export interface EvidenceSpan {
  file: string;
  startLine: number;
  endLine: number;
}

export type Verdict = "conforms" | "violates" | "na";

export interface JudgeVerdict {
  patternId: string;
  verdict: Verdict;
  confidence: number; // 0..1
  claim: string;
  evidenceSpans: EvidenceSpan[];
  whyThisViolatesPolicy?: string;
  requiredPredicate?: string;
  suggestedFix?: string;
}

/** A code region handed to the judge as DATA (never as instructions). */
export interface CodeRegion {
  file: string;
  startLine: number;
  endLine: number;
  /** Exact source lines for [startLine, endLine]. */
  content: string;
}

export interface ParseResult {
  ok: boolean;
  verdict?: JudgeVerdict;
  /** Why the output was rejected (recorded in the audit trail). */
  rejection?: string;
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Extract the first balanced top-level JSON object from a model response. */
function extractJson(text: string): string | undefined {
  const start = text.indexOf("{");
  if (start < 0) return undefined;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return undefined;
}

/**
 * Parse + validate a raw model response against the schema and the supplied
 * region. `region` is the ground truth for span validation (design 16.9).
 */
export function parseVerdict(raw: string, patternId: string, region: CodeRegion): ParseResult {
  const json = extractJson(raw);
  if (!json) return { ok: false, rejection: "no JSON object in model output" };
  let doc: unknown;
  try {
    doc = JSON.parse(json);
  } catch (e) {
    return { ok: false, rejection: `invalid JSON: ${(e as Error).message}` };
  }
  if (!isObj(doc)) return { ok: false, rejection: "output is not an object" };

  const verdict = doc.verdict;
  if (verdict !== "conforms" && verdict !== "violates" && verdict !== "na") {
    return { ok: false, rejection: `invalid verdict: ${String(verdict)}` };
  }
  const confidence = typeof doc.confidence === "number" ? doc.confidence : NaN;
  if (!(confidence >= 0 && confidence <= 1)) {
    return { ok: false, rejection: "confidence must be a number in [0,1]" };
  }
  // The model must not relabel — patternId is required and must match (injection guard).
  if (doc.patternId !== patternId) {
    return { ok: false, rejection: `patternId mismatch: asked ${patternId}, got ${String(doc.patternId)}` };
  }

  const spansRaw = Array.isArray(doc.evidenceSpans) ? doc.evidenceSpans : [];
  const spans: EvidenceSpan[] = [];
  for (const s of spansRaw) {
    if (!isObj(s)) return { ok: false, rejection: "evidenceSpan is not an object" };
    const file = s.file;
    const startLine = s.startLine;
    const endLine = s.endLine;
    if (typeof file !== "string" || typeof startLine !== "number" || typeof endLine !== "number") {
      return { ok: false, rejection: "evidenceSpan missing file/startLine/endLine" };
    }
    if (!Number.isInteger(startLine) || !Number.isInteger(endLine)) {
      return { ok: false, rejection: "evidenceSpan line numbers must be integers" };
    }
    // Span must reference ONLY the supplied region (design 16.9).
    if (file !== region.file) {
      return { ok: false, rejection: `span cites file outside supplied region: ${file}` };
    }
    if (startLine < region.startLine || endLine > region.endLine || startLine > endLine) {
      return {
        ok: false,
        rejection: `span [${startLine},${endLine}] outside region [${region.startLine},${region.endLine}]`,
      };
    }
    spans.push({ file, startLine, endLine });
  }

  // A "violates" verdict must cite at least one in-region span (no unevidenced blocks).
  if (verdict === "violates" && spans.length === 0) {
    return { ok: false, rejection: "violates verdict with no evidence spans" };
  }

  return {
    ok: true,
    verdict: {
      patternId,
      verdict,
      confidence,
      claim: typeof doc.claim === "string" ? doc.claim : "",
      evidenceSpans: spans,
      whyThisViolatesPolicy: typeof doc.whyThisViolatesPolicy === "string" ? doc.whyThisViolatesPolicy : undefined,
      requiredPredicate: typeof doc.requiredPredicate === "string" ? doc.requiredPredicate : undefined,
      suggestedFix: typeof doc.suggestedFix === "string" ? doc.suggestedFix : undefined,
    },
  };
}

/**
 * Entailment guard (design 16.9): the lines a span points at must actually exist
 * in the region. Returns the cited text, or undefined if the span doesn't line up
 * — necessary but not sufficient, which is why blocking is gated on a deterministic
 * predicate, not the model's interpretation.
 */
export function citedText(span: EvidenceSpan, region: CodeRegion): string | undefined {
  const lines = region.content.split("\n");
  const offset = span.startLine - region.startLine;
  const count = span.endLine - span.startLine + 1;
  if (offset < 0 || offset + count > lines.length) return undefined;
  return lines.slice(offset, offset + count).join("\n");
}
