# Qwen Teacher Intelligence Demo Script

**Target length:** 3-5 minutes  
**Audience:** judges, reviewers, demo recording  
**Demo URL:** `http://localhost:8000/?role=teacher`

## Setup

Run from the repository root:

```powershell
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Click `Qwen Intelligence`.

For the clean recording path, click `Demo Mode`.

Keyboard shortcuts:

- Right Arrow = Next
- Left Arrow = Previous
- Esc = Exit Demo Mode

## Screen Order And Talk Track

### 1. Welcome - 20 seconds

What to show:

- Full-screen Demo Mode
- Step 1 of 9
- Four core questions

What to say:

> This is Qwen Teacher Intelligence in Demo Mode. It is designed to feel like a modern AI operating system for teachers. It answers four questions immediately: Is my class healthy? Which students need me first? What should I do next? What opportunities am I missing?

Judging point:

- Strong first impression and clear product framing.

### 2. Teacher Dashboard - 35 seconds

What to show:

- Good Evening, Andrew
- AI Teaching Team Status
- Overall Class Health
- Today's Priorities
- Quick Actions

What to say:

> This is Qwen Teacher Intelligence, a teacher-facing Autopilot Agent workflow for classroom decision support. The key design principle is visible at the top: teacher decision support only - no automated student decisions. The agents can draft insights and interventions, but the teacher remains the final decision-maker.

Judging point:

- Dashboard immediately answers class health, student priority, next action, and missed opportunities.

### 3. Analyze Entire Classroom - 35 seconds

What to show:

- animated agent completion sequence:
  - Learning Analyst
  - Intervention Designer
  - Standards Coach
  - Communication Agent
  - Opportunity Advisor
  - Teacher Approval Ready

What to say:

> Now Qwen generates a mock class-level STEM report. It gives us a class health score, students who may need intervention, students ready for enrichment, misconception clusters, and recommended whole-class and small-group moves.

Judging point:

- Clear track fit: Autopilot Agent workflow with lightweight mock timing and human approval.

### 4. Class Summary - 30 seconds

What to show:

- Class health score
- CER writing support
- Thermal energy misconception
- Data analysis gap
- Engineering design strength
- Student opportunity matches

What to say:

> These are realistic middle school STEM signals. The class may need CER writing support, a small group may need data analysis help, and engineering design is emerging as a strength we can build on.

Judging point:

- The analysis feels instructionally specific, not generic.

### 5. Student Insight (Maya) - 30 seconds

What to show:

- Maya Rodriguez profile
- evidence list
- evidence-needed list
- read-only safety message

What to say:

> This student insight page uses a mock learner, Maya Rodriguez. Qwen is not changing her grades or profile. It is summarizing evidence: prototype reflection, design constraints, and places where a teacher might ask for one more evidence link.

Judging point:

- The demo avoids real student data and frames insight as reviewable evidence.

### 6. Agent Workflow - 35 seconds

What to show:

- Draft Recommendation
- Waiting for Teacher Review
- Teacher Decision
- Approved Action History
- Six agent cards with evidence, reasoning, confidence, recommendation, and approval status

What to say:

> The workflow starts with student evidence, then routes through specialized agents. Notice each agent now explains the input evidence it used, its reasoning, confidence, recommended action, and approval status. This makes the agent team more auditable and less like a black box.

Judging point:

- Multi-agent design is visible and purposeful.

### 7. Teacher Approval - 55 seconds

What to show and click:

1. Click `Approve`.
2. Show status changing from waiting to approved.
3. Show timestamp and approved intervention.

What to say:

> This is the center of the demo. The teacher remains the final decision-maker. The status changes only after approval, and only then does the recommendation become an approved instructional action.

Judging point:

- Human-in-the-loop approval is functional, not just text on a page.

### 8. Approved Action History - 30 seconds

What to show:

- approved recommendation
- student name
- agent source
- teacher decision
- date/time
- next instructional step

What to say:

> Approved Action History is the audit trail. It shows what was recommended, which agent produced it, when the teacher approved it, and the next instructional step. This separates AI-generated recommendations from teacher-approved actions.

Judging point:

- Demonstrates accountability and future auditability.

### 9. Closing Vision - 20 seconds

What to show:

- Closing Vision
- Safer, Faster, Fairer, Future-ready cards

What to say:

> The goal is not AI that decides for teachers. The goal is AI that makes teacher judgment faster, clearer, and better supported by evidence.

## Closing Pitch - 25 seconds

Say:

> Qwen Teacher Intelligence shows how Autopilot Agents can support teachers without replacing them. The agents summarize evidence, draft interventions, and prepare communication, but every meaningful action waits for teacher approval. For classrooms, that difference matters. The goal is not automatic decisions. The goal is better, faster, safer teacher judgment.

## Key Judging Points

- Strong Qwen Autopilot Agent track fit
- Multi-agent workflow is clear
- Analyze Entire Classroom produces a memorable class-level report
- Agent reasoning is evidence-based and reviewable
- Human approval checkpoint is interactive
- Demo has visible safety boundaries
- Opportunity recommendations are teacher-review suggestions, not automatic placement
- Practical teacher value is easy to understand
- Future live Qwen integration path is realistic
