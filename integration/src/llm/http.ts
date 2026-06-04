import type { LLMClient, LLMRequest, LLMResponse, ModelTier } from "./types.js";

type Models = Partial<Record<ModelTier, string>>;

export interface HttpLLMClientOptions {
  endpoint: string;
  apiKey?: string;
  providerId?: string;
  models?: Models;
  timeoutMs?: number;
}

function isObj(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringAt(value: unknown, path: string[]): string | undefined {
  let current = value;
  for (const key of path) {
    if (!isObj(current)) return undefined;
    current = current[key];
  }
  return typeof current === "string" ? current : undefined;
}

function numberAt(value: unknown, path: string[]): number | undefined {
  let current = value;
  for (const key of path) {
    if (!isObj(current)) return undefined;
    current = current[key];
  }
  return typeof current === "number" ? current : undefined;
}

function firstChoice(value: unknown): unknown {
  if (!isObj(value) || !Array.isArray(value.choices)) return undefined;
  return value.choices[0];
}

function outputText(value: unknown): string {
  const choice = firstChoice(value);
  const chat = stringAt(choice, ["message", "content"]);
  if (chat) return chat;
  const text = stringAt(choice, ["text"]);
  if (text) return text;
  const direct = stringAt(value, ["output_text"]);
  if (direct) return direct;
  throw new Error("LLM response did not contain text");
}

export class HttpLLMClient implements LLMClient {
  readonly id: string;
  private readonly models: Required<Models>;

  constructor(private readonly opts: HttpLLMClientOptions) {
    this.id = opts.providerId ?? "http";
    this.models = {
      small: opts.models?.small ?? opts.models?.large ?? "gpt-5.4-mini",
      large: opts.models?.large ?? opts.models?.small ?? "gpt-5.4",
    };
  }

  modelFor(tier: ModelTier): string {
    return this.models[tier];
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    const controller = new AbortController();
    const timeout = this.opts.timeoutMs
      ? setTimeout(() => controller.abort(new Error("llm-http-timeout")), this.opts.timeoutMs)
      : undefined;
    try {
      const response = await fetch(this.opts.endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(this.opts.apiKey ? { authorization: `Bearer ${this.opts.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: req.model,
          messages: [
            { role: "system", content: req.system },
            { role: "user", content: req.user },
          ],
          temperature: req.temperature,
          max_tokens: req.maxOutputTokens,
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`LLM HTTP ${response.status}: ${await response.text()}`);
      const json: unknown = await response.json();
      const text = outputText(json);
      return {
        text,
        model: stringAt(json, ["model"]) ?? req.model,
        inputTokens: numberAt(json, ["usage", "prompt_tokens"]) ?? Math.ceil(req.user.length / 4),
        outputTokens: numberAt(json, ["usage", "completion_tokens"]) ?? Math.ceil(text.length / 4),
      };
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
}
