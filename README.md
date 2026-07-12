# AI Classroom Edge Intelligence

AI Classroom Edge Intelligence is a privacy-first AMD edge classroom platform that keeps student intelligence close to the school, works through unreliable connectivity, and uses Fireworks AI cloud assist only for eligible anonymized workloads.

## Problem

Schools increasingly need AI support for classroom evidence, intervention planning, and teacher workflow, but many districts cannot depend on always-on cloud AI. Rural schools may have unstable connectivity, and student evidence should not automatically leave the local school environment.

## Solution

AI Classroom Edge Intelligence presents a local-first classroom intelligence layer for teachers. It combines an AMD Model Router, rural connectivity simulator, edge runtime monitor, privacy console, classroom digital twin, and human-in-the-loop teacher approval workflow. The platform demonstrates how a classroom can keep sensitive work local while routing only eligible anonymized high-complexity tasks to cloud assist.

## Why AMD

AMD AI PCs and local classroom servers are a natural fit for schools that need private, resilient, edge-first AI. This project positions Ryzen AI / NPU-ready hardware as the future local inference layer, while Fireworks AI provides verified serverless cloud assist for tasks that policy allows.

## Live Fireworks Integration

The AMD backend includes a verified live route:

```text
POST /api/amd/route-inference
```

Verified cloud path:

- Provider: Fireworks AI
- Serverless model: `accounts/fireworks/models/qwen3p7-plus`
- API key stays server-side
- Sensitive and restricted data never routes to cloud
- Eligible cloud routing requires anonymized or public-sample privacy, normal connectivity, and high complexity

## Real Vs Simulated

| Capability | Status |
| --- | --- |
| AMD Model Router backend decision | Real |
| Fireworks Serverless call for eligible anonymized workloads | Real and verified |
| Fireworks model `accounts/fireworks/models/qwen3p7-plus` | Real and verified |
| Server-side API key handling | Real |
| Privacy guard blocking sensitive/restricted cloud routes | Real |
| Teacher approval workflow | Real UI workflow |
| Offline Edge inference | Simulated |
| Local Classroom Server inference | Simulated |
| AMD AI PC / GPU / NPU execution | Simulated future hardware path |
| Edge Runtime Monitor telemetry | Demo metrics |
| Rural Connectivity Simulator | Simulated scenario |
| Classroom Digital Twin | Simulated operations view |

## Feature Overview

- AMD Model Router for Offline Edge, Local Classroom Server, and Fireworks AI / AMD Cloud Assist routes
- Rural Connectivity Simulator for normal, limited, intermittent, and outage scenarios
- Edge Runtime Monitor with route, queue, latency, load, and hardware-readiness labels
- Privacy & Local Data Ownership Console with demo policy controls and audit preview
- Classroom Digital Twin operations-center visualization
- Live Fireworks AI response display with provider, model, route, status, latency, timestamp, and safety note
- Teacher approval / human-in-the-loop boundary before student-impacting actions

## Architecture Summary

```text
Browser teacher workspace
  -> AI Classroom Edge AMD module
  -> Local classroom state and evidence helpers
  -> Express backend
  -> /api/amd/route-inference
  -> privacy guard and route decision
  -> Offline Edge / Local Classroom Server simulated path
  -> Fireworks AI live cloud assist for eligible anonymized workloads
```

The frontend is plain HTML, CSS, and JavaScript. The backend is Node.js and Express.

## Setup

Clone and enter the repository:

```bash
git clone <your-repo-url>
cd ai-classroom-inquiry-assistant
git checkout amd-edge-classroom-intelligence
```

Install backend dependencies:

```bash
cd server
npm install
copy .env.example .env
```

On macOS/Linux, use:

```bash
cp .env.example .env
```

Edit `server/.env` and add:

```text
FIREWORKS_API_KEY=your_fireworks_api_key_here
FIREWORKS_BASE_URL=https://api.fireworks.ai/inference/v1
FIREWORKS_MODEL=accounts/fireworks/models/qwen3p7-plus
```

Start the backend:

```bash
npm start
```

Start the frontend from the repository root in a second terminal:

```bash
cd ..
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Click `AI Classroom Edge`.

## Run The Live Fireworks Test

1. Open `AI Classroom Edge`.
2. Find `AMD Model Router`.
3. Select `Classroom trend summary`.
4. Confirm demo settings:
   - Privacy: anonymized
   - Connectivity: normal
   - Complexity: high
5. Click `Route With Backend`.

Expected live result:

- Route: Fireworks AI / AMD Cloud Assist
- Provider: `fireworks_ai`
- Status: Live
- Simulated: `false`
- Model shown: `accounts/fireworks/models/qwen3p7-plus`
- Latency shown

If `FIREWORKS_API_KEY` is missing, the same endpoint returns a clearly labeled simulated Fireworks response instead of exposing keys in frontend code.

## Docker

Docker Compose runs the static frontend and Express backend without baking secrets into images.

Create `server/.env` from `server/.env.example`, then set `FIREWORKS_API_KEY`.

Run:

```bash
docker compose up --build
```

Open:

```text
http://localhost:8000/?role=teacher
```

Backend health check:

```text
http://localhost:3001/health
```

## Privacy And Claim Boundaries

- API keys stay server-side.
- Sensitive and restricted tasks never route to Fireworks AI.
- The project does not claim legal compliance certification.
- The project does not claim real Ryzen AI NPU, GPU, ROCm, DirectML, or local model execution.
- Offline Edge inference, Local Classroom Server inference, runtime telemetry, Digital Twin behavior, and rural connectivity changes remain simulated/future work.
- Teacher approval remains the human-in-the-loop boundary before student-impacting actions.

## Submission Checklist

- [x] AMD-focused root README
- [x] Live Fireworks Serverless route documented
- [x] `accounts/fireworks/models/qwen3p7-plus` documented
- [x] Privacy guard documented
- [x] Real vs simulated boundaries documented
- [x] Dockerfile and Docker Compose included
- [x] MIT License included
- [x] `server/.env` ignored and kept local
- [x] Plain HTML/CSS/JavaScript frontend documented
- [x] Node/Express backend documented
