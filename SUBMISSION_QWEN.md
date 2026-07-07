# Qwen Teacher Intelligence Submission

## Project Title

Qwen Teacher Intelligence

## One-Sentence Pitch

Qwen Teacher Intelligence is a teacher-facing chained Autopilot Agent workflow that turns classroom evidence into reviewable recommendations while keeping every student-impacting decision under teacher control.

## Track

Qwen Autopilot Agent

## Problem Statement

Teachers have rich evidence about student learning, but it is scattered across writing, projects, AI scaffold logs, conference notes, and standards goals. Existing AI tools often jump from signal to suggestion without a clear human approval process. Classrooms need agentic support that reduces teacher planning load while preserving teacher judgment.

## Features

- Qwen Teacher Dashboard
- Chained multi-agent `Analyze Entire Classroom` experience, with Live Qwen using one structured orchestration call for reliability
- Live Qwen Mode through an Express backend proxy
- Mock Mode with the same orchestration pattern for offline/fallback demos
- Student Insight Page for Maya Rodriguez
- Agent Workflow Page
- Intervention Plan Page
- Communication Drafts Page
- Teacher Approval Page
- Approved Action History
- Analyze Entire Classroom class-level report
- Demo Mode for clean judging and recording
- Guided 9-step presentation flow with Next/Previous controls
- Keyboard shortcuts: Right Arrow, Left Arrow, Esc
- Evidence-based agent reasoning cards
- Class insight section: CER writing support, thermal energy misconception, data analysis gap, engineering design strength, student opportunity matches
- Opportunity Advisor suggestions for TSA Engineering Design, Samsung Solve for Tomorrow, Toshiba ExploraVision, FIRST LEGO League / robotics, Kentucky STEM camps or fellowships, and local ATC / tech school pathways
- Interactive actions: Approve, Edit, Reject, Request More Evidence
- Status labels: Draft Recommendation, Waiting for Teacher Review, Approved by Teacher, Rejected, More Evidence Needed
- Safety label: Teacher decision support only - no automated student decisions

This is not a single chatbot. Analyze Entire Classroom runs agents in this order:

1. Learning Analyst
2. Standards Coach
3. Intervention Designer
4. Communication Agent
5. Opportunity Advisor

Conceptually, each agent receives the original classroom evidence plus structured output from previous agents. For final-demo reliability, Live Qwen Mode asks Qwen for one structured orchestration response that includes all five conceptual agent outputs; Mock Mode keeps the local step-by-step agent pipeline.

## Live Qwen Proof

- Live classroom analysis endpoint: `POST /api/qwen/classroom-analysis`
- Safe configuration check endpoint: `GET /api/qwen/config-check`
- Classroom analysis uses `QWEN_CLASSROOM_ANALYSIS_MODEL` when set, otherwise `qwen-turbo`; general chat still uses `QWEN_MODEL`
- DashScope API key is read from `DASHSCOPE_API_KEY` on the server only
- The frontend never receives or stores the API key
- Live Qwen Mode calls the Express backend proxy instead of calling Qwen directly from browser code
- For final-demo reliability, the live endpoint uses one structured Qwen orchestration call that returns the class analysis plus all five conceptual agent outputs
- If the provider fails, the app automatically falls back to Mock Mode and keeps the dashboard usable
- Mock Mode uses the same orchestration pattern for offline and fallback demos

## Demo Walkthrough

1. Run the local server with `py -m http.server 8000`.
2. Open `http://localhost:8000/?role=teacher`.
3. Click `Qwen Intelligence`.
4. Click `Demo Mode`.
5. Use `Next` or Right Arrow to move through the 9-step presentation.
6. On Analyze Entire Classroom, explain that Qwen is running a sequence of specialized teaching agents, each building on the previous agent's structured output.
7. On Teacher Approval, click Approve and show the status change.
8. Open Approved Action History to show the final teacher-approved action.

## Tech Stack

- Static HTML/CSS/JavaScript
- Existing Inquiry Classroom app shell
- Express backend proxy
- DashScope / Qwen via `QWEN_CLASSROOM_ANALYSIS_MODEL` for classroom analysis and `QWEN_MODEL` for general chat
- Local browser state through `localStorage`
- Namespaced state: `state.qwenTeacherIntelligence`
- Chained Qwen Autopilot Agent workflow
- Backend JSON validation and timeout fallback
- Mock Mode fallback using the same orchestration pattern

## Future Roadmap

- Persist teacher-approved action history to a secure backend
- Add authentication and role-based access
- Expand structured JSON schemas for more subject areas
- Add audit logs for teacher approvals
- Add student data minimization/redaction layer
- Add district-configurable safety policies
- Add exportable teacher action summaries

## Risks / Limitations

- Live Qwen requires local backend configuration and a valid DashScope API key
- Local state is browser-only demo persistence
- No production authentication or privacy hardening
- Uses mock student insight content, not real student data

## Final Submission Checklist

- [ ] Demo runs locally with `py -m http.server 8000`
- [ ] Qwen route opens from teacher sidebar
- [ ] Analyze Entire Classroom generates a class health report
- [ ] Live Qwen Mode connects through the Express backend proxy
- [ ] Mock Mode fallback still works if backend is unavailable
- [ ] Demo explains that this is not a single chatbot
- [ ] Demo explains structured agent JSON handoffs
- [ ] Demo Mode launches from the Qwen dashboard
- [ ] Demo Mode shows Step 1 of 9 through Step 9 of 9
- [ ] Right Arrow, Left Arrow, and Esc shortcuts work
- [ ] Analyze Entire Classroom stage animates agent completion
- [ ] Teacher Approval stage animates approval status change
- [ ] Safety label is visible
- [ ] Agent cards show evidence, reasoning, confidence, recommended action, and teacher approval status
- [ ] Opportunity Advisor suggestions are framed as teacher-review only
- [ ] Approval buttons work
- [ ] Rejected recommendations do not update action history
- [ ] Approved recommendations appear in Approved Action History
- [ ] Demo script has been rehearsed in 3-5 minutes
- [ ] Submission video clearly shows teacher approval workflow
