import type { LLMClient } from "../llm/types.js";
import { OfflineLLMClient } from "../llm/types.js";
import { ModelRouter, Budget, scaleOf, type PatternScale } from "../llm/router.js";
import type { CanonicalEvent, Finding, Severity } from "../contract.js";
import { fingerprint } from "../contract.js";
import { loadPatternDef, type PatternDef } from "./patternDef.js";
import { parseVerdict, citedText, type CodeRegion } from "./schema.js";
import { systemPrompt, userPrompt, PROMPT_VERSION } from "./prompt.js";
import { fingerprintText, type AuditRecord } from "./audit.js";

/**
 * Catalogue-grounded LLM judge (design 16). LLM-FIRST for coverage and reasoning,
 * but ADVISORY ONLY: it never emits a blocking severity. Blocking is gated on a
 * deterministic predicate elsewhere (design 16.2/16.6). The judge:
 *   route → build grounded prompt (code as DATA) → client → parse/validate spans
 *   → entailment guard → advisory Finding + full audit record.
 */

const JUDGE_ID = "llm-judge";
const JUDGE_VERSION = "1.0.0";
const CATALOGUE_VERSION = "2026-06-03";

export interface JudgeResult {
  findings: Finding[];
  audits: AuditRecord[];
  /** True if a budget ceiling cut work short (design 16.4 graceful degradation). */
  incomplete: boolean;
}

export interface JudgeOptions {
  repoRoot: string;
  client: LLMClient;
  event: CanonicalEvent;
  budget?: Budget;
  router?: ModelRouter;
  /** Replay cache (design 16.7). Keyed by input fingerprint. */
  cache?: Map<string, string>;
  temperature?: number;
  maxOutputTokens?: number;
  /** Per-call timeout enforcing the wall-clock budget around the provider. */
  callTimeoutMs?: number;
  /**
   * Optional durable sink for full judge IO (design 16.7/16.8). Receives the exact
   * prompt and raw output so a blocking decision can later be replayed/appealed.
   */
  auditSink?: (io: { inputFingerprint: string; system: string; user: string; output: string; audit: AuditRecord }) => void;
}

/** Advisory severity cap — the judge can NEVER return "block" (design 16.2). */
function advisorySeverity(confidence: number): Severity {
  return confidence >= 0.75 ? "warning" : "advice";
}

function regionKey(r: CodeRegion): string {
  return `${r.file}:${r.startLine}-${r.endLine}`;
}

/** Race a promise against a timeout; reject with a tagged error on expiry. */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  if (!ms || ms <= 0) return p;
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("llm-call-timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

export class LLMJudge {
  private readonly router: ModelRouter;
  private readonly budget: Budget;
  private readonly cache: Map<string, string>;

  constructor(private readonly opts: JudgeOptions) {
    this.router = opts.router ?? new ModelRouter();
    this.budget = opts.budget ?? new Budget();
    this.cache = opts.cache ?? new Map();
  }

  /** Judge a set of (pattern × region) pairs. Offline ⇒ no findings (design 16.11). */
  async judge(pairs: { patternId: string; region: CodeRegion }[]): Promise<JudgeResult> {
    const findings: Finding[] = [];
    const audits: AuditRecord[] = [];
    if (this.opts.client instanceof OfflineLLMClient) {
      return { findings, audits, incomplete: false };
    }

    const seenFiles = new Set<string>();
    const seenRegions = new Set<string>();
    for (const { patternId, region } of pairs) {
      const def = loadPatternDef(this.opts.repoRoot, patternId);
      if (!def) continue;

      const scale = scaleOf(def.scale);
      const decision = this.router.route(scale, this.opts.event);
      if (!decision.allowed) continue;

      if (!seenFiles.has(region.file)) {
        if (!this.budget.tryFile()) break;
        seenFiles.add(region.file);
      }
      const rk = regionKey(region);
      if (!seenRegions.has(rk)) {
        if (!this.budget.tryRegion()) break;
        seenRegions.add(rk);
      }
      // Per-region pattern ceiling — skip this pattern but keep going on others.
      if (!this.budget.tryPatternForRegion(rk)) continue;

      const one = await this.judgeOne(def, region, scale);
      if (one) {
        if (one.finding) findings.push(one.finding);
        audits.push(one.audit);
      } else {
        break; // budget cut us off mid-stream
      }
    }
    return { findings, audits, incomplete: this.budget.snapshot().exhausted };
  }

  private async judgeOne(
    def: PatternDef,
    region: CodeRegion,
    scale: PatternScale,
  ): Promise<{ finding?: Finding; audit: AuditRecord } | null> {
    const sys = systemPrompt();
    const user = userPrompt(def, region);
    const tier = this.router.route(scale, this.opts.event).tier;
    const model = this.opts.client.modelFor(tier);
    const inputFingerprint = fingerprintText(`${model}\u0000${PROMPT_VERSION}\u0000${sys}\u0000${user}`);

    const estTokens = Math.ceil(user.length / 4) + (this.opts.maxOutputTokens ?? 600);
    const started = Date.now();

    let text: string;
    let cacheHit = false;
    let inTok = 0;
    let outTok = 0;
    const cached = this.cache.get(inputFingerprint);
    if (cached !== undefined) {
      text = cached;
      cacheHit = true;
    } else {
      if (!this.budget.tryCall(estTokens)) return null;
      try {
        const resp = await withTimeout(
          this.opts.client.complete({
            system: sys,
            user,
            tier,
            model,
            temperature: this.opts.temperature ?? 0,
            maxOutputTokens: this.opts.maxOutputTokens ?? 600,
            promptVersion: PROMPT_VERSION,
          }),
          this.opts.callTimeoutMs ?? this.budget.limits.maxWallClockMs,
        );
        text = resp.text;
        inTok = resp.inputTokens;
        outTok = resp.outputTokens;
        this.budget.recordTokens(inTok + outTok);
        this.cache.set(inputFingerprint, text);
      } catch (e) {
        // Fail-open (design 16.4): a provider error/timeout degrades gracefully —
        // record it, mark the run incomplete, emit no finding, and move on.
        this.budget.markExhausted();
        return {
          audit: {
            patternId: def.id,
            judgeId: JUDGE_ID,
            judgeVersion: JUDGE_VERSION,
            clientId: this.opts.client.id,
            modelId: model,
            promptVersion: PROMPT_VERSION,
            catalogueVersion: CATALOGUE_VERSION,
            providerTier: -1,
            inputFingerprint,
            outputFingerprint: "",
            verdict: "error",
            confidence: 0,
            blockingEligibility: "advisory-only: LLM finding never auto-blocks (design 16.2)",
            cacheHit: false,
            latencyMs: Date.now() - started,
            inputTokens: 0,
            outputTokens: 0,
            rejection: `llm-error: ${(e as Error).message}`,
          },
        };
      }
    }

    const baseAudit: AuditRecord = {
      patternId: def.id,
      judgeId: JUDGE_ID,
      judgeVersion: JUDGE_VERSION,
      clientId: this.opts.client.id,
      modelId: model,
      promptVersion: PROMPT_VERSION,
      catalogueVersion: CATALOGUE_VERSION,
      providerTier: -1, // LLM tier is distinct from deterministic provider tiers
      inputFingerprint,
      outputFingerprint: fingerprintText(text),
      verdict: "?",
      confidence: 0,
      blockingEligibility: "advisory-only: LLM finding never auto-blocks (design 16.2)",
      cacheHit,
      latencyMs: Date.now() - started,
      inputTokens: inTok,
      outputTokens: outTok,
    };
    this.opts.auditSink?.({ inputFingerprint, system: sys, user, output: text, audit: baseAudit });

    const parsed = parseVerdict(text, def.id, region);
    if (!parsed.ok || !parsed.verdict) {
      return { audit: { ...baseAudit, verdict: "rejected", rejection: parsed.rejection } };
    }
    const v = parsed.verdict;
    const audit: AuditRecord = { ...baseAudit, verdict: v.verdict, confidence: v.confidence };

    if (v.verdict !== "violates") {
      return { audit };
    }

    // Span-alignment guard (design 16.9): the cited span must line up with the
    // region. This is NECESSARY BUT NOT SUFFICIENT — a model can cite a real line
    // and still draw a wrong conclusion, which is exactly why blocking is gated on
    // a deterministic predicate (design 16.6), not the model's interpretation. A
    // full second-pass entailment verifier is future work tracked for Phase 5.
    const span = v.evidenceSpans[0];
    const cited = citedText(span, region);
    if (cited === undefined) {
      return { audit: { ...audit, rejection: "cited span does not align with region" } };
    }

    const finding: Finding = {
      fingerprint: fingerprint({
        patternId: def.id,
        detectorId: JUDGE_ID,
        detectorVersion: JUDGE_VERSION,
        evidence: cited,
        scopePath: region.file,
      }),
      detectorId: JUDGE_ID,
      detectorVersion: JUDGE_VERSION,
      patternId: def.id,
      severity: advisorySeverity(v.confidence),
      path: region.file,
      line: span.startLine,
      message: v.claim || `Possible deviation from ${def.title}`,
      suggestion: v.suggestedFix,
      evidence: cited,
      rationale: v.whyThisViolatesPolicy,
      advisory: true, // LLM-only — never merge-blocking (design 16.2)
    };
    return { finding, audit };
  }
}
