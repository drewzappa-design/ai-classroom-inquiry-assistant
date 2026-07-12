# AI Classroom Edge Architecture

## Current Architecture

```text
Browser teacher workspace
  -> AI Classroom Edge module
  -> Local app state / localStorage
  -> Existing classroom evidence helpers
  -> Existing teacher intelligence workflow when analysis is triggered
  -> Optional Express backend proxy for cloud assist
```

The AMD module is additive. It preserves existing non-AMD classroom workflows while presenting AI Classroom Edge as the AMD-focused experience.

## Edge Routing Model

```text
Student Evidence
  -> Local Evidence Graph
  -> Classroom Edge Agents
  -> Teacher Approval
  -> Optional Cloud Assist
```

## Runtime Monitor Fields

- Current inference route: Offline Edge, Local Server, or Cloud Assist
- Local Classroom Server status
- CPU path: available
- GPU path: available
- NPU path: ready architecture / future acceleration
- Model route decision
- Latency estimate
- Memory/load estimate
- Offline queue depth
- Cloud calls avoided

## AMD Model Router

The AMD Model Router evaluates task metadata and recommends one of three routes:

- Offline Edge Mode
- Local Classroom Server
- Fireworks AI / AMD Cloud Assist

Router inputs shown in the UI:

- Task type
- Privacy level
- Connectivity status
- Estimated complexity

Fireworks AI is part of the AMD hackathon technology stack. Cloud Assist routes eligible tasks to Fireworks AI while sensitive/local-first tasks remain on the classroom edge.

Current phase:

- Real backend route at `POST /api/amd/route-inference`
- Real server-side route decision rules
- Fireworks Serverless live call verified for eligible anonymized workloads
- Verified model: `accounts/fireworks/models/qwen3p7-plus`
- Simulated Fireworks response when `FIREWORKS_API_KEY` is missing
- No API keys in frontend code

Endpoint documentation lives in `FIREWORKS_AMD_ENDPOINT.md`.

Backend privacy guard:

- Sensitive or restricted tasks always route to Offline Edge Mode.
- Fireworks AI is never called for sensitive or restricted tasks.
- Offline connectivity routes to Offline Edge Mode.
- Eligible anonymized/public-sample high-complexity tasks on normal connectivity may route to Fireworks AI / AMD Cloud Assist.

## Verified Live Inference

The AMD Model Router has been verified against the live Fireworks Serverless endpoint through:

```text
POST /api/amd/route-inference
```

Observed live result:

- Provider: `fireworks_ai`
- Model: `accounts/fireworks/models/qwen3p7-plus`
- Route: Fireworks AI / AMD Cloud Assist
- Privacy classification: anonymized
- Connectivity: normal
- Complexity: high
- Status: Live, `simulated: false`
- Latency: approximately 6081 ms

The API key remains server-side. The frontend displays provider, model, route, privacy classification, latency, status, timestamp, response, and safety note after a backend route run.

## Rural Connectivity Simulator

The AMD module includes an interactive simulator for rural school connectivity:

- Normal Connectivity
- Limited Bandwidth
- Intermittent Internet
- Internet Outage

Each mode updates the dashboard readout for cloud connection, edge runtime, teacher workflow, student evidence, cloud sync queue, inference route, latency, and expected behavior. The intermittent mode cycles through simulated reconnecting states every few seconds.

No real networking changes occur.

## Privacy And Local Data Ownership Console

The privacy console is a simulated policy surface inside the AMD module. It shows:

- Student Evidence: local by default
- Teacher Notes: local by default
- Approved Actions: local audit log
- Cloud Assist: optional
- Sync Queue: teacher/district controlled

Demo controls include Local Only Mode, Hybrid Cloud Assist Allowed, Teacher Approval Required, Cloud Sync Paused, and Audit Trail Enabled. These controls update local UI state only; they do not enforce real storage, network, security, or legal compliance policy.

The privacy data flow is:

```text
Student Evidence
  -> Local Evidence Graph
  -> Edge Agent Analysis
  -> Teacher Approval
  -> Local Action Log
  -> Optional Cloud Sync
```

## Real Components

- `modules/amd-edge-classroom/amd-edge-classroom.js`
- `modules/amd-edge-classroom/amd-edge-classroom.css`
- Teacher navigation entry in `app.js`
- Static asset loading in `index.html`
- Existing Express proxy in `server/` for optional cloud provider calls
- Existing localStorage-backed classroom state

## Simulated Components

The AMD dashboard metrics are demo values. They are intended to communicate the target operating model for an AMD AI PC / classroom edge deployment. Offline Edge inference, Local Classroom Server inference, AMD AI PC/NPU/GPU execution, the Classroom Digital Twin, Rural Connectivity Simulator, runtime telemetry, and demo metrics remain simulated/future work.

## Future Hardware Path

Future versions can add:

- Local model runner
- ONNX Runtime or DirectML route
- Ryzen AI SDK integration where supported
- Real device capability detection
- Runtime telemetry from actual CPU/GPU/NPU execution
- Persisted offline sync queue

No current file claims real NPU inference.
