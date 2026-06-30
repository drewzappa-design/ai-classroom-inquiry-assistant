# Qwen Teacher Intelligence

**Project name:** Qwen Teacher Intelligence  
**Track fit:** Qwen Autopilot Agent workflow for education  
**Demo mode:** Local mock prototype, no live Qwen API calls yet

Qwen Teacher Intelligence is a teacher-facing Autopilot Agent workflow inside the Inquiry Classroom prototype. It turns classroom evidence into reviewable recommendations, routes those recommendations through a team of specialized agents, and stops at a teacher approval checkpoint before anything becomes an instructional action.

The core message:

**Teacher decision support only - no automated student decisions.**

## Problem

Teachers collect meaningful evidence every day: student writing, AI scaffold logs, conference notes, project artifacts, standards goals, misconceptions, and intervention plans. The problem is not that evidence does not exist. The problem is that teachers have too much of it, scattered across too many surfaces, and too little time to turn it into timely support.

Generic AI dashboards can make this worse if they jump straight from signal to decision. In classrooms, recommendations need context, teacher judgment, and a human approval step.

## Solution

Qwen Teacher Intelligence demonstrates a safer teacher-centered agent workflow:

1. Student learning evidence is summarized.
2. An agent team drafts insights, interventions, communications, and next steps.
3. The teacher reviews the recommendation.
4. The teacher can approve, edit, reject, or request more evidence.
5. Only approved recommendations appear in Approved Action History.

This makes the demo feel like an Autopilot Agent workflow without removing the teacher from the decision.

## Agent Team

- **Learning Analyst Agent:** identifies learning signals from student evidence.
- **Intervention Designer Agent:** drafts short instructional moves.
- **Standards Coach Agent:** checks alignment to lesson goals and standards.
- **Communication Agent:** drafts teacher-reviewable messages.
- **Opportunity Advisor Agent:** suggests enrichment or extension pathways.
- **Teacher Approval Agent:** keeps every recommendation behind human review.

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

From the repository root:

```powershell
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Click `Qwen Intelligence` in the teacher sidebar.

## Demo Path

Recommended judge/demo recording path:

1. Qwen Teacher Dashboard
2. Agent Workflow Page
3. Student Insight Page for Maya Rodriguez
4. Intervention Plan Page
5. Communication Drafts Page
6. Teacher Approval Page
7. Approved Action History

## Demo Boundaries

- Mock/demo mode only
- No live Qwen API calls
- No real student data
- No automatic student decisions
- No changes to student grades, hot list status, resources, credentials, or communications
- No changes to EduMemory, Sui/Walrus, Supabase, or student lesson flow
