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

## Screen Order And Talk Track

### 1. Qwen Teacher Dashboard - 45 seconds

What to show:

- Status metrics
- Current recommendation status
- Agent cards
- Safety banner
- `Analyze Entire Classroom` button

What to say:

> This is Qwen Teacher Intelligence, a teacher-facing Autopilot Agent workflow for classroom decision support. The key design principle is visible at the top: teacher decision support only - no automated student decisions. The agents can draft insights and interventions, but the teacher remains the final decision-maker.

Click:

- `Analyze Entire Classroom`

Then say:

> Now Qwen generates a mock class-level STEM report. It gives us a class health score, students who may need intervention, students ready for enrichment, misconception clusters, and recommended whole-class and small-group moves.

Judging point:

- Clear track fit: Autopilot Agent workflow with class-level analysis and human approval.

### 2. Class Insight Signals - 25 seconds

What to show:

- CER writing support
- Thermal energy misconception
- Data analysis gap
- Engineering design strength
- Student opportunity matches

What to say:

> These are realistic middle school STEM signals. The class may need CER writing support, a small group may need data analysis help, and engineering design is emerging as a strength we can build on.

Judging point:

- The analysis feels instructionally specific, not generic.

### 3. Agent Workflow Page - 40 seconds

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

### 4. Student Insight Page For Maya Rodriguez - 30 seconds

What to show:

- Maya Rodriguez profile
- evidence list
- evidence-needed list
- read-only safety message

What to say:

> This student insight page uses a mock learner, Maya Rodriguez. Qwen is not changing her grades or profile. It is summarizing evidence: prototype reflection, design constraints, and places where a teacher might ask for one more evidence link.

Judging point:

- The demo avoids real student data and frames insight as reviewable evidence.

### 5. Intervention Plan Page - 35 seconds

What to show:

- mini-lesson recommendation
- priority conference
- exit check
- recommendation card

What to say:

> The intervention plan turns analysis into teacher-usable actions. These are intentionally small classroom moves: a five-minute mini-lesson, a short conference, and an exit check. This is where Qwen helps reduce planning load without taking control away from the teacher.

Judging point:

- Practical classroom utility.

### 6. Communication Drafts Page - 30 seconds

What to show:

- family growth note
- teacher team note
- student conference prompt
- communication boundary
- opportunity advisor recommendations

What to say:

> The Communication Agent can draft messages, but nothing is sent automatically. The Opportunity Advisor can also suggest pathways like TSA Engineering Design, Samsung Solve for Tomorrow, Toshiba ExploraVision, FIRST LEGO League, Kentucky STEM camps, or a local ATC pathway. These are teacher-review suggestions, not automatic placements.

Judging point:

- Safety-aware communication workflow.

### 7. Teacher Approval Page - 70 seconds

What to show and click:

1. Click `Request More Evidence`.
2. Show:
   - additional written sample
   - short student conference note
   - assessment snapshot
3. Click `Reject`.
4. Show rejection reason and note that no action history entry is created.
5. Click `Edit`.
6. Show Draft Recommendation status and teacher edit note.
7. Click `Approve`.
8. Show Approved by Teacher status and timestamp.

What to say:

> This is the center of the demo. The teacher can request more evidence, reject the recommendation, edit the draft, or approve it. Notice that rejection does not update the action history. Only after the teacher approves does the recommendation become an approved instructional action.

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
