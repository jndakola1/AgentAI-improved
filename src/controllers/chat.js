import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION,
});

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

/**
 * POST /api/chat
 * Streams the Bedrock agent response back to the client via Server-Sent Events.
 * Client receives incremental text chunks, then a final `done` event with sessionId.
 */
export const chat = async (req, res) => {
  const inputText = String(req.body?.message || "").trim();
  if (!inputText) {
    return res.status(400).json({ error: "Message is required." });
  }

  // Reuse the session across turns so the agent retains conversation memory.
  const sessionId =
    req.body?.sessionId ||
    `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // SSE headers — must be set before any body is written.
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable Nginx/proxy buffering
  res.flushHeaders();

  const send = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    const agentId      = requireEnv("AWS_AGENT_ID");
    const agentAliasId = requireEnv("AWS_AGENT_ALIAS_ID");

    const cmd = new InvokeAgentCommand({ agentId, agentAliasId, sessionId, inputText });
    const response = await client.send(cmd);
    const decoder  = new TextDecoder("utf-8");

    if (response.completion) {
      for await (const event of response.completion) {
        if (event.chunk?.bytes) {
          const chunk = decoder.decode(event.chunk.bytes, { stream: true });
          if (chunk) send("chunk", { text: chunk });
        }
      }
    }

    send("done", { sessionId });
    res.end();
  } catch (err) {
    console.error("❌ /api/chat error:", err);
    if (res.headersSent) {
      send("error", { message: "Agent encountered an error. Please try again." });
      res.end();
    } else {
      res.status(500).json({ error: "Server error while invoking agent." });
    }
  }
};
