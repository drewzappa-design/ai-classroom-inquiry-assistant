# AI Classroom Edge Demo Script

Target length: 3-5 minutes

## Setup

```powershell
py -m http.server 4173
```

Open:

```text
http://localhost:4173/?role=teacher
```

Click `AI Classroom Edge`.

## Talk Track

### 1. Opening

This is AI Classroom Edge, the Edge AI Operating System for Education. It adapts the existing AI Classroom Inquiry Assistant into a privacy-first AMD edge classroom platform.

### 2. Runtime Status

Show the Edge Runtime Status cards. The key idea is local-first classroom intelligence: local classroom server, offline readiness, local evidence store, teacher approval, and AMD AI PC readiness.

### 3. Edge Runtime Monitor

Open the Edge Runtime Monitor. Explain that the current route is Offline Edge by default. CPU and GPU paths are shown as available architecture paths. The NPU path is labeled as ready architecture and future acceleration. This demo does not claim real NPU inference.

### 4. AMD Model Router

Open the AMD Model Router. Walk through task type, privacy level, connectivity status, and estimated complexity. Show that sensitive student intervention work routes to Offline Edge Mode, local evidence lookup routes to the Local Classroom Server, and eligible aggregate work can route to Fireworks AI / AMD Cloud Assist.

Say: Fireworks AI is part of the AMD hackathon technology stack. Cloud Assist routes eligible tasks to Fireworks AI while sensitive or local-first tasks remain on the classroom edge.

Click `Route With Backend`. Clarify that the router now calls a real backend endpoint. Without `FIREWORKS_API_KEY`, eligible cloud tasks return a simulated Fireworks response labeled `Simulated`. With the key configured, eligible anonymized/public-sample high-complexity tasks can call Fireworks AI from the server. Sensitive and restricted tasks never call Fireworks.

### 5. Routing Visualization

Walk through:

```text
Student Evidence -> Local Evidence Graph -> Classroom Edge Agents -> Teacher Approval -> Optional Cloud Assist
```

The important privacy story is that cloud assist is optional and appears after the local evidence and teacher-control layers.

### 6. Rural Connectivity

Open the Rural Connectivity Simulator. Click through Normal Connectivity, Limited Bandwidth, Intermittent Internet, and Internet Outage.

For Internet Outage, point out that cloud connection becomes offline while Edge Runtime remains active, Teacher Workflow remains fully operational, Student Evidence stays local, and Cloud Sync is queued.

For Limited Bandwidth, point out hybrid routing, cloud assist only when necessary, and priority sync.

For Intermittent Internet, let the animated state cycle. Show edge taking over, cloud reconnecting, and the sync queue changing.

### 7. Teacher Workflow

Click `Run Edge Classroom Analysis`. This opens the existing teacher intelligence workflow and triggers the classroom analysis path. Teacher approval remains the boundary before recommendations become actions.

### 8. Privacy And Local Data Ownership

Open the Privacy & Local Data Ownership console. Show the data boundary overview: student evidence and teacher notes are local by default, approved actions are part of a local audit log, cloud assist is optional, and sync is teacher/district controlled.

Click `Enable Local Only Mode`, `Allow Hybrid Assist`, and `Pause Cloud Sync` to show that these are demo policy controls. Point out the labels: no real student data, no automatic student decisions, and no cloud upload without approval in the product vision.

Open the local audit log preview. Explain that this is a sample audit trail, not a legal compliance claim.

## Closing

AI Classroom Edge keeps student intelligence close to the school, lets teachers remain in control, and positions AMD AI PCs as the future local inference layer for classrooms.
