import type { ModelTier } from "./types.js";
import type { CanonicalEvent } from "../contract.js";

/**
 * Model routing & hard cost budgets (design 16.4). We route against the project's
 * SELECTED patterns — never all 275 — pre-screen deterministically, and degrade
 * gracefully when a budget is exhausted (report "incomplete", never fail the run).
 */

export type PatternScale = "code-block" | "module" | "architecture";

export interface BudgetLimits {
  maxFiles: number;
  maxRegions: number;
  maxPatternsPerRegion: number;
  maxCalls: number;
  maxTokens: number;
  maxWallClockMs: number;
}

export const DEFAULT_BUDGET: BudgetLimits = {
  maxFiles: 50,
  maxRegions: 200,
  maxPatternsPerRegion: 8,
  maxCalls: 400,
  maxTokens: 1_500_000,
  maxWallClockMs: 120_000,
};

/** Mutable budget tracker. `tryConsume*` return false once a ceiling is hit. */
export class Budget {
  private files = 0;
  private regions = 0;
  private calls = 0;
  private tokens = 0;
  private readonly perRegion = new Map<string, number>();
  private readonly startedAt = Date.now();
  /** Set true the first time any ceiling blocks work — surfaced as "incomplete". */
  exhausted = false;

  constructor(public readonly limits: BudgetLimits = DEFAULT_BUDGET) {}

  private hit(): false {
    this.exhausted = true;
    return false;
  }
  /** Force the incomplete/degraded state (e.g. on a provider error, design 16.4). */
  markExhausted(): void {
    this.exhausted = true;
  }
  tryFile(): boolean {
    if (this.files >= this.limits.maxFiles) return this.hit();
    this.files++;
    return true;
  }
  tryRegion(): boolean {
    if (this.regions >= this.limits.maxRegions) return this.hit();
    this.regions++;
    return true;
  }
  /** Enforce the per-region pattern ceiling (design 16.4). `key` identifies the region. */
  tryPatternForRegion(key: string): boolean {
    const n = this.perRegion.get(key) ?? 0;
    if (n >= this.limits.maxPatternsPerRegion) return this.hit();
    this.perRegion.set(key, n + 1);
    return true;
  }
  /** Reserve a call before issuing it; estimateTokens guards the token ceiling. */
  tryCall(estimateTokens: number): boolean {
    if (Date.now() - this.startedAt > this.limits.maxWallClockMs) return this.hit();
    if (this.calls >= this.limits.maxCalls) return this.hit();
    if (this.tokens + estimateTokens > this.limits.maxTokens) return this.hit();
    this.calls++;
    return true;
  }
  recordTokens(used: number): void {
    this.tokens += used;
    // Mark exhausted if actuals overran the estimate-based ceiling (design 16.4).
    if (this.tokens > this.limits.maxTokens) this.exhausted = true;
  }
  snapshot() {
    return {
      files: this.files,
      regions: this.regions,
      calls: this.calls,
      tokens: this.tokens,
      elapsedMs: Date.now() - this.startedAt,
      exhausted: this.exhausted,
    };
  }
}

export interface RouteDecision {
  tier: ModelTier;
  allowed: boolean;
  reason: string;
}

/**
 * Decide model tier & whether to run the LLM for a (scale, event) pair.
 * Write-time runs only small models, async/advisory; architecture checks at PR
 * time get the large tier. The judge separately enforces "never blocks".
 */
export class ModelRouter {
  route(scale: PatternScale, event: CanonicalEvent): RouteDecision {
    if (event === "POST_WRITE_CONTENT" || event === "PRE_WRITE_INTENT") {
      // Write-time: small + advisory only (design 16.5). Architecture checks are
      // too expensive/slow for the synchronous write path — defer them to PR.
      if (scale === "architecture") {
        return { tier: "small", allowed: false, reason: "architecture checks deferred to PR time" };
      }
      return { tier: "small", allowed: true, reason: "write-time small-model advisory" };
    }
    if (event === "PR_REVIEW" || event === "BATCH") {
      return scale === "code-block"
        ? { tier: "small", allowed: true, reason: "code-block check on small tier" }
        : { tier: "large", allowed: true, reason: `${scale} check on large tier` };
    }
    return { tier: "small", allowed: false, reason: `no LLM detection for event ${event}` };
  }
}

/** Map a catalogue `scale` string to the routing scale. */
export function scaleOf(rawScale: string | undefined): PatternScale {
  if (rawScale === "architectural" || rawScale === "architecture") return "architecture";
  if (rawScale === "module" || rawScale === "design") return "module";
  return "code-block";
}
