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
3. The teacher can run `Analyze Entire Classroom` to generate a mock class-level report.
4. The teacher reviews the recommendation.
5. The teacher can approve, edit, reject, or request more evidence.
6. Only approved recommendations appear in Approved Action History.

This makes the demo feel like an Autopilot Agent workflow without removing the teacher from the decision.

## Agent Team

- **Learning Analyst Agent:** identifies learning signals from student evidence.
- **Intervention Designer Agent:** drafts short instructional moves.
- **Standards Coach Agent:** checks alignment to lesson goals and standards.
- **Communication Agent:** drafts teacher-reviewable messages.
- **Opportunity Advisor Agent:** suggests enrichment or extension pathways.
- **Teacher Approval Agent:** keeps every recommendation behind human review.

Each agent card now shows:

- input evidence used
- reasoning summary
- confidence level
- recommended action
- teacher approval status

## Analyze Entire Classroom

The `Analyze Entire Classroom` button generates a mock middle school STEM/science report with:

- overall class health score
- number of students needing intervention
- number of students ready for enrichment
- major misconception clusters
- recommended whole-class action
- small group recommendation
- opportunity recommendations

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

- Mock/demo mode only
- No live Qwen API calls
- No real student data
- No automatic student decisions
- No changes to student grades, hot list status, resources, credentials, or communications
- No changes to EduMemory, Sui/Walrus, Supabase, or student lesson flow
