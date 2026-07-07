# Future Fireworks AI / AMD Cloud Assist Endpoint

This document describes the server-side endpoint for AI Classroom Edge.

## Goal

Route eligible classroom tasks to Fireworks AI as AMD Cloud Assist while keeping sensitive or local-first work on the classroom edge.

## Current Status

- Real architecture scaffold: yes
- Real backend endpoint: yes
- Live Fireworks API call: yes, when `FIREWORKS_API_KEY` is configured
- Simulated Fireworks response: yes, when `FIREWORKS_API_KEY` is missing
- Frontend API key exposure: no
- Existing Qwen backend modified: no

## Environment

`server/.env.example` includes placeholders:

```text
FIREWORKS_API_KEY=your_fireworks_api_key_here
FIREWORKS_BASE_URL=https://api.fireworks.ai/inference/v1
FIREWORKS_MODEL=accounts/fireworks/models/llama-v3p1-70b-instruct
```

These values should remain server-side.

## Endpoint

```text
POST /api/amd/fireworks/route
```

Request body:

```json
{
  "taskType": "Aggregated classroom analysis",
  "privacyLevel": "De-identified aggregate",
  "connectivityStatus": "Online",
  "estimatedComplexity": "High",
  "sanitizedPayload": {}
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

This future endpoint should not receive raw student records by default. The router should pass only sanitized, teacher-approved, or aggregate context when Cloud Assist is allowed by policy.
