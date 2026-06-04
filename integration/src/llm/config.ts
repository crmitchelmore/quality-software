import { HttpLLMClient } from "./http.js";
import { OfflineLLMClient, type LLMClient } from "./types.js";

function intEnv(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function llmClientFromEnv(env: NodeJS.ProcessEnv = process.env): LLMClient {
  const endpoint = env.CONFORMANCE_LLM_ENDPOINT;
  if (!endpoint) return new OfflineLLMClient();
  return new HttpLLMClient({
    endpoint,
    apiKey: env.CONFORMANCE_LLM_API_KEY,
    providerId: env.CONFORMANCE_LLM_PROVIDER_ID ?? "http",
    models: {
      small: env.CONFORMANCE_LLM_SMALL_MODEL ?? env.CONFORMANCE_LLM_MODEL ?? "gpt-5.4-mini",
      large: env.CONFORMANCE_LLM_LARGE_MODEL ?? env.CONFORMANCE_LLM_MODEL ?? "gpt-5.4",
    },
    timeoutMs: intEnv(env.CONFORMANCE_LLM_TIMEOUT_MS),
  });
}
