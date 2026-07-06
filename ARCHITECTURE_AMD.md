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

## Rural Connectivity Simulator

The AMD module includes an interactive simulator for rural school connectivity:

- Normal Connectivity
- Limited Bandwidth
- Intermittent Internet
- Internet Outage

Each mode updates the dashboard readout for cloud connection, edge runtime, teacher workflow, student evidence, cloud sync queue, inference route, latency, and expected behavior. The intermittent mode cycles through simulated reconnecting states every few seconds.

No real networking changes occur.

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
