# Fireworks AI / AMD Cloud Assist Endpoint

This document describes the verified server-side Fireworks Serverless endpoint for AI Classroom Edge.

## Goal

Route eligible classroom tasks to Fireworks AI as AMD Cloud Assist while keeping sensitive or local-first work on the classroom edge.

## Current Status

- Live Fireworks AI integration verified: yes
- Real backend endpoint: yes
- Real backend routing decision: yes
- Live Fireworks Serverless call: verified for eligible anonymized workloads when `FIREWORKS_API_KEY` is configured
- Verified model: `accounts/fireworks/models/qwen3p7-plus`
- Simulated Fireworks response: yes, when `FIREWORKS_API_KEY` is missing
- Frontend API key exposure: no
- Existing Qwen backend modified: no

## Environment

`server/.env.example` includes placeholders:

```text
FIREWORKS_API_KEY=your_fireworks_api_key_here
FIREWORKS_BASE_URL=https://api.fireworks.ai/inference/v1
FIREWORKS_MODEL=accounts/fireworks/models/qwen3p7-plus
```

These values should remain server-side.

## Endpoint

```text
POST /api/amd/route-inference
```

Request body:

```json
{
  "taskType": "Aggregated classroom analysis",
  "privacyLevel": "De-identified aggregate",
  "connectivity": "normal",
  "complexity": "high",
  "prompt": "Summarize anonymized classroom trends and suggest teacher-reviewed next steps.",
  "classroomContext": {}
}
```

Decision rules:

- `privacyLevel` sensitive or restricted routes to `offline_edge`.
- Offline connectivity routes to `offline_edge`.
- Limited/intermittent connectivity with high complexity routes to `local_classroom_server`.
- Anonymized or public-sample high-complexity tasks with normal connectivity may use `fireworks_amd_cloud`.
- Low complexity routes to `local_classroom_server`.
- Default route is `local_classroom_server`.
- Teacher approval remains required before student-impacting actions.

## Safety Boundary

The endpoint should not receive raw student records by default. The router should pass only sanitized, anonymized, teacher-approved, or aggregate context when Cloud Assist is allowed by policy.

Sensitive and restricted tasks never route to Fireworks AI. The API key stays server-side and is never exposed to frontend code.

## Verified Live Result

Observed through `POST /api/amd/route-inference`:

- Route: Fireworks AI / AMD Cloud Assist
- Provider: `fireworks_ai`
- Status: Live
- Simulated: `false`
- Model: `accounts/fireworks/models/qwen3p7-plus`
- Latency: approximately 6081 ms
- Privacy classification: anonymized
- Connectivity: normal
- Complexity: high
