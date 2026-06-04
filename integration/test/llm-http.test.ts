import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer, type IncomingMessage } from "node:http";
import { HttpLLMClient } from "../src/llm/http.js";

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

test("HTTP LLM client sends OpenAI-compatible chat requests and parses responses", async () => {
  let capturedBody: unknown;
  let capturedAuth: string | undefined;
  const server = createServer(async (req, res) => {
    capturedAuth = req.headers.authorization;
    capturedBody = JSON.parse(await readBody(req));
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        model: "model-large",
        choices: [{ message: { content: "{\"verdict\":\"conforms\"}" } }],
        usage: { prompt_tokens: 12, completion_tokens: 3 },
      }),
    );
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const client = new HttpLLMClient({
      endpoint: `http://127.0.0.1:${address.port}/v1/chat/completions`,
      apiKey: "placeholder",
      models: { small: "model-small", large: "model-large" },
    });
    const response = await client.complete({
      system: "system",
      user: "user",
      tier: "large",
      model: client.modelFor("large"),
      temperature: 0,
      maxOutputTokens: 100,
      promptVersion: "test",
    });

    assert.equal(capturedAuth, "Bearer placeholder");
    assert.equal(response.text, "{\"verdict\":\"conforms\"}");
    assert.equal(response.model, "model-large");
    assert.equal(response.inputTokens, 12);
    assert.equal(response.outputTokens, 3);
    assert.deepEqual(
      (capturedBody as { messages: { role: string; content: string }[] }).messages.map((m) => m.role),
      ["system", "user"],
    );
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
