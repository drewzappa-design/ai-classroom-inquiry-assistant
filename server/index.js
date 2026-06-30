import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const model = process.env.QWEN_MODEL || "qwen3.7-plus";
const defaultBaseUrl = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const dashScopeBaseUrl = (process.env.DASHSCOPE_BASE_URL || defaultBaseUrl).replace(/\/$/, "");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "qwen-teacher-intelligence-server",
    model,
  });
});

app.get("/api/qwen/config-check", (_req, res) => {
  const apiKey = process.env.DASHSCOPE_API_KEY || "";
  res.json({
    hasApiKey: Boolean(apiKey),
    apiKeyPrefix: apiKey ? apiKey.slice(0, 3) : "",
    apiKeyLength: apiKey.length,
    baseUrl: dashScopeBaseUrl,
    model,
    serverTime: new Date().toISOString(),
  });
});

app.post("/api/qwen/chat", async (req, res) => {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "DASHSCOPE_API_KEY is not configured on the server.",
    });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!messages || messages.length === 0) {
    return res.status(400).json({
      ok: false,
      error: "Request body must include a non-empty messages array.",
    });
  }

  try {
    const response = await fetch(`${dashScopeBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: typeof req.body?.temperature === "number" ? req.body.temperature : 0.2,
        stream: false,
        extra_body: {
          enable_thinking: true,
        },
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("DashScope request failed", {
        status: response.status,
        responseBody: data,
        baseUrl: dashScopeBaseUrl,
        model,
        hasApiKey: Boolean(apiKey),
      });
      return res.status(response.status).json({
        ok: false,
        error: "DashScope request failed.",
        status: response.status,
        details: data,
      });
    }

    return res.json({
      ok: true,
      model,
      provider: "dashscope",
      data,
      content: data?.choices?.[0]?.message?.content || "",
      usage: data?.usage || null,
    });
  } catch (error) {
    console.error("DashScope request error", {
      status: null,
      responseBody: error instanceof Error ? error.message : String(error),
      baseUrl: dashScopeBaseUrl,
      model,
      hasApiKey: Boolean(apiKey),
    });
    return res.status(502).json({
      ok: false,
      error: "Unable to reach DashScope Chat Completions API.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.use((err, _req, res, _next) => {
  res.status(500).json({
    ok: false,
    error: "Unexpected server error.",
    details: err instanceof Error ? err.message : String(err),
  });
});

app.listen(port, () => {
  console.log(`Qwen Teacher Intelligence server listening on http://localhost:${port}`);
});
