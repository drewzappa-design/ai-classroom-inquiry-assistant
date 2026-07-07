# Qwen Teacher Intelligence

## Judge Quickstart

**What this is:** Qwen Teacher Intelligence is a teacher-facing chained multi-agent workflow. It is not a single chatbot. `Analyze Entire Classroom` runs specialized teaching agents that pass structured JSON forward, then keeps recommendations behind teacher approval.

**Run the frontend:**

```powershell
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Click `Qwen Intelligence`.

**Run the backend for Live Qwen Mode:**

```powershell
cd server
npm install
copy .env.example .env
npm start
```

Set `DASHSCOPE_API_KEY`, `QWEN_MODEL`, and `DASHSCOPE_BASE_URL` in `server\.env`.

**Use Mock Mode:** leave the backend off or select `Mock Mode`, then click `Analyze Entire Classroom`. The same orchestration pattern runs locally for offline judging.

**Use Live Qwen Mode:** start the backend, select `Live Qwen Mode`, then click `Analyze Entire Classroom`. The frontend calls the Express proxy; the API key never enters frontend code.

**Open Demo Mode:** on the Qwen dashboard, click `Demo Mode`. Use Right Arrow / Left Arrow to navigate and Esc to exit.

**What judges should look for:**

- visible ordered agent orchestration during `Analyze Entire Classroom`
- Live Qwen backend proxy path and Mock Mode fallback
- strict teacher decision support boundary
- teacher approval before any recommendation becomes an action
- Approved Action History as the audit trail

**Project name:** Qwen Teacher Intelligence  
**Track fit:** Qwen Autopilot Agent workflow for education  
**Modes:** Mock Mode and Live Qwen Mode through an Express backend proxy

Qwen Teacher Intelligence is a teacher-facing Autopilot Agent workflow inside the Inquiry Classroom prototype. It is not a generic chatbot. `Analyze Entire Classroom` presents a chained multi-agent pipeline that turns classroom evidence into structured, reviewable teacher decision support. In Live Qwen Mode, the backend asks Qwen for that complete structured orchestration in one call for demo reliability.

The core message:

**Teacher decision support only - no automated student decisions.**

## Problem

Teachers collect meaningful evidence every day: student writing, AI scaffold logs, conference notes, project artifacts, standards goals, misconceptions, and intervention plans. The problem is not that evidence does not exist. The problem is that teachers have too much of it, scattered across too many surfaces, and too little time to turn it into timely support.

Generic AI dashboards can make this worse if they jump straight from signal to decision. In classrooms, recommendations need context, teacher judgment, and a human approval step.

## Solution

Qwen Teacher Intelligence demonstrates a safer teacher-centered agent workflow:

1. Student learning evidence is collected into a sanitized classroom snapshot.
2. `Analyze Entire Classroom` presents a chained sequence of specialized teaching agents.
3. The live backend sends the original classroom evidence and required agent roles to Qwen in one structured orchestration call.
4. Qwen returns structured JSON for the class analysis and all five agent outputs.
5. The backend normalizes the live JSON into the existing teacher dashboard shape.
6. Mock Mode keeps the local multi-agent orchestration pattern for offline/fallback demos.
7. The teacher reviews the recommendation.
8. The teacher can approve, edit, reject, or request more evidence.
9. Only approved recommendations appear in Approved Action History.

This makes the demo feel like an Autopilot Agent workflow without removing the teacher from the decision.

## Agent Team

Agent order:

1. **Learning Analyst:** analyzes learning evidence only.
2. **Standards Coach:** translates learning findings into standards alignment.
3. **Intervention Designer:** designs instructional actions.
4. **Communication Agent:** creates teacher-review communication drafts.
5. **Opportunity Advisor:** recommends enrichment opportunities.

Each agent has a strict responsibility and JSON schema. It receives:

- original classroom evidence
- structured output from previous agents

Each agent card now shows:

- input evidence used
- reasoning summary
- confidence level
- recommended action
- teacher approval status

## Analyze Entire Classroom

The `Analyze Entire Classroom` button runs the multi-agent pipeline and writes the normalized result to:

```js
state.qwenTeacherIntelligence.classAnalysis
```

The report includes:

- overall class health score
- number of students needing intervention
- number of students ready for enrichment
- major misconception clusters
- recommended whole-class action
- small group recommendation
- opportunity recommendations
- structured agent outputs

The class insight section highlights:

- CER writing support
- thermal energy misconception
- data analysis gap
- engineering design strength
- student opportunity matches

## Opportunity Advisor

The Opportunity Advisor Agent suggests teacher-review enrichment options such as:

- TSA Engineering Design
- Samsung Solve for Tomorrow
- Toshiba ExploraVision
- FIRST LEGO League / robotics
- Kentucky STEM camps or fellowships
- local ATC / tech school pathway

These are suggestions for teacher review, not automatic placement, nomination, or enrollment.

## Live Qwen And Mock Mode

Live Qwen Mode runs through the Express backend proxy in `server/`. The frontend never contains the API key.

```text
Browser UI
  -> Express backend proxy
  -> DashScope / Qwen
  -> single structured orchestration JSON with five agent outputs
  -> normalized class analysis
  -> existing teacher dashboard
```

Mock Mode uses the same orchestration pattern locally for offline demos and fallback. It still runs the same ordered agent flow locally, while Live Qwen Mode uses one structured Qwen call for reliability during judging.

## Human-In-The-Loop Workflow

The Teacher Approval Page supports:

- **Approve:** marks the recommendation approved, records timestamp, approved intervention, agent source, and teacher decision.
- **Edit:** moves the recommendation back to draft with a sample teacher edit note.
- **Reject:** marks the recommendation rejected and records a sample reason without updating action history.
- **Request More Evidence:** asks for an additional written sample, short student conference note, and assessment snapshot.

Approved actions are stored only in local demo state under:

```js
state.qwenTeacherIntelligence
```

## Why This Matters For Teachers

Teachers need tools that reduce cognitive load without weakening professional judgment. This module shows how Qwen-style agents could help teachers notice patterns, prepare interventions, and document decisions while keeping the teacher as the final decision-maker.

The value is not automatic action. The value is a better review workflow.

## How To Run Locally

Frontend only:

From the repository root:

```powershell
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Click `Qwen Intelligence` in the teacher sidebar.

Live Qwen backend:

```powershell
cd server
npm install
copy .env.example .env
npm start
```

Then set `DASHSCOPE_API_KEY` in `server\.env`, open the Qwen dashboard, choose `Live Qwen Mode`, and click `Analyze Entire Classroom`.

## Demo Mode

For judging or recording, open Qwen Teacher Intelligence and click `Demo Mode` on the dashboard.

Demo Mode:

- hides non-essential navigation and developer controls
- maximizes the Qwen content area
- presents a clean guided layout
- shows `Step 1 of 9` through `Step 9 of 9`
- supports keyboard controls:
  - Right Arrow = Next
  - Left Arrow = Previous
  - Esc = Exit Demo Mode

Guided stages:

1. Welcome
2. Teacher Dashboard
3. Analyze Entire Classroom
4. Class Summary
5. Student Insight (Maya)
6. Agent Workflow
7. Teacher Approval
8. Approved Action History
9. Closing Vision

## Demo Path

Recommended judge/demo recording path:

Use `Demo Mode` for the cleanest presentation. If navigating manually, use:

1. Qwen Teacher Dashboard
2. Click `Analyze Entire Classroom`
3. Agent Workflow Page
4. Student Insight Page for Maya Rodriguez
5. Intervention Plan Page
6. Communication Drafts Page
7. Teacher Approval Page
8. Approved Action History

## Demo Boundaries

- Live Qwen calls only go through the Express backend proxy
- Mock Mode uses the same orchestration pattern for offline/fallback demos
- No real student data
- No automatic student decisions
- No changes to student grades, hot list status, resources, credentials, or communications
- No changes to EduMemory, Sui/Walrus, Supabase, or student lesson flow
