# AI Classroom Edge Architecture

## Current Architecture

```text
Browser teacher workspace
  -> AI Classroom Edge module
  -> Local app state / localStorage
  -> Existing classroom evidence helpers
  -> Existing Qwen Teacher Intelligence module when analysis is triggered
  -> Optional Express backend proxy for cloud assist
```

The AMD module is additive. It does not modify the Qwen module and does not remove EduMemory.

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

- Real architecture scaffold
- Simulated routing decisions
- Future Fireworks API connection
- No API keys in frontend code

Future endpoint documentation lives in `FIREWORKS_AMD_ENDPOINT.md`.

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

The AMD dashboard metrics are demo values. They are intended to communicate the target operating model for an AMD AI PC / classroom edge deployment.

## Future Hardware Path

Future versions can add:

- Local model runner
- ONNX Runtime or DirectML route
- Ryzen AI SDK integration where supported
- Real device capability detection
- Runtime telemetry from actual CPU/GPU/NPU execution
- Persisted offline sync queue

No current file claims real NPU inference.
