# Qwen Teacher Intelligence Demo Script

## Setup

Run:

```powershell
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Click `Qwen Intelligence`.

## Talk Track

1. Start on Qwen Teacher Dashboard.
   - Point out the label: `Teacher decision support only — no automated student decisions.`
   - Explain that this is a local mock Autopilot Agent workflow, not a live Qwen API call.

2. Open Agent Workflow Page.
   - Show the workflow from Draft Recommendation to Waiting for Teacher Review.
   - Emphasize that agents draft support but cannot apply decisions.

3. Open Student Insight Page for Maya Rodriguez.
   - Show the demo insight and evidence.
   - Explain that no real student profile fields are updated.

4. Open Teacher Approval Page.
   - Click `Request More Evidence`.
   - Show the needed evidence list: additional written sample, short student conference note, assessment snapshot.
   - Click `Reject`.
   - Show the sample rejection reason and note that no history entry is created.
   - Click `Edit`.
   - Show the draft/edit status.
   - Click `Approve`.

5. Open Approved Action History.
   - Show approved recommendation, student name, agent source, teacher decision, date/time, and next instructional step.
   - Close by explaining that the teacher remains the final decision-maker.

## Key Message

Qwen Teacher Intelligence is not replacing teacher judgment. It is a decision-support workflow that turns classroom evidence into reviewable recommendations, then waits for the teacher.
