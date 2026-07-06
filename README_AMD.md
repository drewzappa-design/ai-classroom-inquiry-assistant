# AI Classroom Edge

AI Classroom Edge is the AMD Developer Challenge adaptation of the AI Classroom Inquiry Assistant. It reframes the existing teacher intelligence, EduMemory evidence model, and local fallback workflow as a privacy-first edge AI classroom platform.

## Pitch

AI Classroom Edge is the Edge AI Operating System for Education: a local-first classroom intelligence layer that keeps student context close to the school, works during unreliable connectivity, and uses cloud assist only when policy and teacher intent allow it.

## What Exists In This Phase

- AI Classroom Edge dashboard in `modules/amd-edge-classroom/`
- Edge Runtime Status cards
- Edge Runtime Monitor with demo route, latency, load, queue, and cloud-avoidance metrics
- Routing visualization from student evidence to optional cloud assist
- Rural Connectivity Simulator with Normal, Limited Bandwidth, Intermittent Internet, and Internet Outage modes
- Privacy console cards
- Rural connectivity scenario
- Quick actions into the existing teacher workspace and Qwen analysis flow

## Real Implementation

- Static browser module loaded by `index.html`
- Teacher workspace tab wired in `app.js`
- Local demo state through the existing app state/localStorage path
- Existing Qwen module remains separate and unchanged
- Existing EduMemory flow remains present

## Simulated In This Phase

- Latency estimate
- Memory/load estimate
- Offline queue depth
- Cloud calls avoided
- CPU/GPU/NPU path availability labels
- Local classroom server status on the AMD dashboard
- Connectivity mode changes and sync queue behavior
- Intermittent internet animation

## Hardware Claim Boundary

This phase does not claim real Ryzen AI NPU execution. The dashboard says "NPU-ready architecture" and "Future hardware acceleration path" because real ONNX Runtime, DirectML, or Ryzen AI SDK inference is not wired into the application yet.

## Run

From the repository root:

```powershell
py -m http.server 4173
```

Open:

```text
http://localhost:4173/?role=teacher
```

Click `AI Classroom Edge` in the teacher sidebar.
