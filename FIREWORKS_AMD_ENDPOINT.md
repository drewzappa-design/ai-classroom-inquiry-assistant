# Future Fireworks AI / AMD Cloud Assist Endpoint

This document describes the planned server-side endpoint for AI Classroom Edge. It is documentation only in this phase.

## Goal

Route eligible classroom tasks to Fireworks AI as AMD Cloud Assist while keeping sensitive or local-first work on the classroom edge.

## Current Status

- Real architecture scaffold: yes
- Live Fireworks API call: no
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

## Proposed Endpoint

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

- Sensitive student context stays on Offline Edge Mode or Local Classroom Server.
- De-identified aggregate tasks may use Fireworks AI / AMD Cloud Assist.
- Internet outage routes to Local Classroom Server.
- Teacher approval remains required before student-impacting actions.

## Safety Boundary

This future endpoint should not receive raw student records by default. The router should pass only sanitized, teacher-approved, or aggregate context when Cloud Assist is allowed by policy.

