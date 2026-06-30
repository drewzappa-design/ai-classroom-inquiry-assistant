# Qwen Teacher Intelligence Server

Small Express backend for live Qwen Teacher Intelligence demos.

The frontend must not contain `DASHSCOPE_API_KEY`. This server reads the key from `.env`, calls Alibaba Cloud Model Studio / DashScope, and returns JSON to the static app.

## Install

```bash
cd server
npm install
```

## Configure

```bash
copy .env.example .env
```

Then edit `.env`:

```bash
DASHSCOPE_API_KEY=your_real_key
PORT=3001
QWEN_MODEL=qwen3.7-plus
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

Use the Model Studio endpoint for your key's region. For some regions, Alibaba recommends workspace-specific domains.

## Run

```bash
npm start
```

Health check:

```bash
curl http://localhost:3001/health
```

Safe Qwen configuration check:

```bash
curl http://localhost:3001/api/qwen/config-check
```

This returns whether a key is loaded, the first three key characters only, key length, base URL, model, and server time. It never returns the full API key.

Qwen chat endpoint:

```bash
curl -X POST http://localhost:3001/api/qwen/chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Summarize this class evidence.\"}]}"
```

## Frontend

Run the static app separately from the repository root:

```bash
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Go to `Qwen Intelligence`, switch to `Live Qwen Mode`, then run `Analyze Entire Classroom`.

If this backend is unavailable or returns an error, the frontend automatically falls back to Mock Mode.
