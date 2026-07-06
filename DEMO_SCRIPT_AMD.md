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

### 4. Routing Visualization

Walk through:

```text
Student Evidence -> Local Evidence Graph -> Classroom Edge Agents -> Teacher Approval -> Optional Cloud Assist
```

The important privacy story is that cloud assist is optional and appears after the local evidence and teacher-control layers.

### 5. Rural Connectivity

Show the rural connectivity scenario: internet loss, local AI continues, cloud sync later. This is the classroom resilience story for schools with inconsistent connectivity.

### 6. Teacher Workflow

Click `Run Edge Classroom Analysis`. This opens the existing teacher intelligence workflow and triggers the classroom analysis path. Teacher approval remains the boundary before recommendations become actions.

## Closing

AI Classroom Edge keeps student intelligence close to the school, lets teachers remain in control, and positions AMD AI PCs as the future local inference layer for classrooms.

