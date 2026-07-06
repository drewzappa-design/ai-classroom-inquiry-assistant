# Alibaba Cloud / Qwen Proof

## Backend Proof Summary

Qwen Teacher Intelligence uses a local Express backend proxy to connect the static frontend to Alibaba Cloud Model Studio / DashScope. The frontend never calls Alibaba Cloud directly and never receives the API key.

The app uses Live Qwen Mode for classroom analysis through the backend, and Mock Mode remains available for offline or fallback demos.

## Alibaba / Qwen Service Used

- Service: Alibaba Cloud Model Studio / DashScope
- API style: OpenAI-compatible Chat Completions
- API base URL:

```text
https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

## Model Configuration

The backend reads the model from:

```text
QWEN_MODEL
```

This allows the demo to use the configured Qwen model without changing frontend code.

## API Key Safety

The API key is read only from:

```text
server/.env
```

Environment variable:

```text
DASHSCOPE_API_KEY
```

The API key is never placed in frontend JavaScript, HTML, CSS, or documentation.

## Backend Endpoint Used By The App

The Qwen Teacher Intelligence frontend calls:

```text
POST /api/qwen/classroom-analysis
```

This endpoint receives a sanitized classroom snapshot, runs the chained Qwen agent pipeline through the backend, validates structured JSON, and returns a normalized classroom analysis object.

## Config Check Endpoint

Safe configuration check:

```text
GET /api/qwen/config-check
```

This endpoint returns only safe diagnostic fields such as whether a key exists, the first three key characters, key length, base URL, model, and server time. It does not return the full API key.

## Code Reference

Alibaba Cloud / DashScope API usage is implemented in:

[server/index.js](C:/Users/drewz/Documents/ai-classroom-inquiry-assistant/server/index.js)

The relevant backend code reads `DASHSCOPE_API_KEY`, uses `DASHSCOPE_BASE_URL`, reads `QWEN_MODEL`, and calls the DashScope-compatible `/chat/completions` endpoint from the server.

## Recording Checklist

- [ ] Start backend:

```powershell
cd server
npm start
```

- [ ] Open config check:

```text
http://localhost:3001/api/qwen/config-check
```

- [ ] Start frontend:

```powershell
py -m http.server 8000
```

- [ ] Open teacher workspace:

```text
http://localhost:8000/?role=teacher
```

- [ ] Open `Qwen Intelligence`
- [ ] Switch to `Live Qwen Mode`
- [ ] Click `Analyze Entire Classroom`
- [ ] Show visible agent orchestration
- [ ] Show backend logs
- [ ] Show `Live Qwen response received`

## Fallback Note

If the recording environment blocks network access to Alibaba Cloud, Mock Mode protects the demo. Mock Mode uses the same orchestration pattern locally, keeps the dashboard usable, and clearly avoids exposing any API key.
