# AI Classroom Intelligence Backend

Express backend for classroom intelligence provider routes used by the local prototype.

## Routes

### Qwen / DashScope

- `GET /api/qwen/config-check`
- `POST /api/qwen/chat`
- `POST /api/qwen/classroom-analysis`

DashScope environment variables:

```text
DASHSCOPE_API_KEY=your_dashscope_api_key_here
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen3.7-plus
QWEN_CLASSROOM_ANALYSIS_MODEL=qwen-turbo
```

### AMD / Fireworks

- `POST /api/amd/route-inference`

Fireworks environment variables:

```text
FIREWORKS_API_KEY=your_fireworks_api_key_here
FIREWORKS_BASE_URL=https://api.fireworks.ai/inference/v1
FIREWORKS_MODEL=accounts/fireworks/models/qwen3p7-plus
```

The AMD route performs a real backend routing decision and calls Fireworks Serverless only when the task is eligible for cloud assist.

Cloud-eligible conditions:

- `privacyLevel` is `anonymized` or `public_sample`
- `connectivity` is `normal`
- `complexity` is `high`

Privacy guard:

- `sensitive` and `restricted` tasks never call Fireworks AI
- offline connectivity routes to Offline Edge Mode
- limited or intermittent high-complexity tasks route to the Local Classroom Server
- low-complexity tasks route to the Local Classroom Server

Live vs simulated behavior:

- Eligible cloud route with `FIREWORKS_API_KEY`: live Fireworks Serverless call
- Eligible cloud route without `FIREWORKS_API_KEY`: simulated Fireworks response, clearly labeled
- Offline Edge and Local Classroom Server routes: simulated classroom-edge responses

## Setup

```bash
cd server
npm install
copy .env.example .env
npm start
```

On macOS/Linux:

```bash
cd server
npm install
cp .env.example .env
npm start
```

Keep `.env` local. Do not commit API keys.

## Health Check

```bash
curl http://localhost:3001/health
```

## AMD Route Test Without Fireworks Key

This verifies the route and privacy guard without making a live cloud call:

```bash
curl -X POST http://localhost:3001/api/amd/route-inference \
  -H "Content-Type: application/json" \
  -d "{\"taskType\":\"Teacher decision support\",\"privacyLevel\":\"sensitive\",\"connectivity\":\"normal\",\"complexity\":\"high\",\"prompt\":\"Test privacy guard\",\"classroomContext\":{}}"
```

Expected result: route is `offline_edge`, provider is `classroom_edge`, and `simulated` is `true`.

## AMD Live Fireworks Test

After setting `FIREWORKS_API_KEY` in `server/.env`:

```bash
curl -X POST http://localhost:3001/api/amd/route-inference \
  -H "Content-Type: application/json" \
  -d "{\"taskType\":\"Aggregated classroom analysis\",\"privacyLevel\":\"anonymized\",\"connectivity\":\"normal\",\"complexity\":\"high\",\"prompt\":\"Summarize anonymized classroom trends and suggest teacher-reviewed next steps.\",\"classroomContext\":{\"source\":\"manual backend test\"}}"
```

Expected live result:

- `route`: `fireworks_amd_cloud`
- `provider`: `fireworks_ai`
- `simulated`: `false`
- `model`: `accounts/fireworks/models/qwen3p7-plus`

## Frontend

Serve the static frontend from the repository root:

```bash
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Then open `AI Classroom Edge`.
