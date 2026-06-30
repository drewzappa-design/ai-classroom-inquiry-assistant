# Qwen Teacher Intelligence Submission

## Project Title

Qwen Teacher Intelligence

## One-Sentence Pitch

Qwen Teacher Intelligence is a teacher-facing Autopilot Agent workflow that turns classroom evidence into reviewable recommendations while keeping every student-impacting decision under teacher control.

## Track

Qwen Autopilot Agent

## Problem Statement

Teachers have rich evidence about student learning, but it is scattered across writing, projects, AI scaffold logs, conference notes, and standards goals. Existing AI tools often jump from signal to suggestion without a clear human approval process. Classrooms need agentic support that reduces teacher planning load while preserving teacher judgment.

## Features

- Qwen Teacher Dashboard
- Student Insight Page for Maya Rodriguez
- Agent Workflow Page
- Intervention Plan Page
- Communication Drafts Page
- Teacher Approval Page
- Approved Action History
- Analyze Entire Classroom class-level report
- Evidence-based agent reasoning cards
- Class insight section: CER writing support, thermal energy misconception, data analysis gap, engineering design strength, student opportunity matches
- Opportunity Advisor suggestions for TSA Engineering Design, Samsung Solve for Tomorrow, Toshiba ExploraVision, FIRST LEGO League / robotics, Kentucky STEM camps or fellowships, and local ATC / tech school pathways
- Interactive actions: Approve, Edit, Reject, Request More Evidence
- Status labels: Draft Recommendation, Waiting for Teacher Review, Approved by Teacher, Rejected, More Evidence Needed
- Safety label: Teacher decision support only - no automated student decisions

## Demo Walkthrough

1. Run the local server with `py -m http.server 8000`.
2. Open `http://localhost:8000/?role=teacher`.
3. Click `Qwen Intelligence`.
4. Click `Analyze Entire Classroom`.
5. Review the class health panel, class insight section, and agent reasoning cards.
6. Open Agent Workflow to show the Autopilot Agent pipeline.
7. Open Maya Rodriguez's Student Insight Page.
8. Open Intervention Plan and Communication Drafts.
9. Open Teacher Approval Page.
10. Click Request More Evidence, Reject, Edit, then Approve.
11. Open Approved Action History to show the final teacher-approved action.

## Tech Stack

- Static HTML/CSS/JavaScript
- Existing Inquiry Classroom app shell
- Local browser state through `localStorage`
- Namespaced state: `state.qwenTeacherIntelligence`
- Mock Qwen Autopilot Agent workflow
- Mock class-level STEM/science analysis report
- No backend or live API calls in this milestone

## Future Roadmap

- Add backend/serverless proxy for live Qwen calls
- Define structured JSON schemas for recommendations
- Add authentication and role-based access
- Add audit logs for teacher approvals
- Add student data minimization/redaction layer
- Add district-configurable safety policies
- Add exportable teacher action summaries

## Risks / Limitations

- Current module is mock/demo only
- No live Qwen API integration yet
- Local state is browser-only demo persistence
- No production authentication or privacy hardening
- Uses mock student insight content, not real student data

## Final Submission Checklist

- [ ] Demo runs locally with `py -m http.server 8000`
- [ ] Qwen route opens from teacher sidebar
- [ ] Analyze Entire Classroom generates a class health report
- [ ] Safety label is visible
- [ ] Agent cards show evidence, reasoning, confidence, recommended action, and teacher approval status
- [ ] Opportunity Advisor suggestions are framed as teacher-review only
- [ ] Approval buttons work
- [ ] Rejected recommendations do not update action history
- [ ] Approved recommendations appear in Approved Action History
- [ ] Demo script has been rehearsed in 3-5 minutes
- [ ] Submission video clearly shows teacher approval workflow
