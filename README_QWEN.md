# Qwen Teacher Intelligence

Qwen Teacher Intelligence is a mock/demo teacher-facing Autopilot Agent workflow inside the Inquiry Classroom prototype.

The module is intentionally local and read-only with respect to real student records. It uses `state.qwenTeacherIntelligence` for demo approval actions, action history, status labels, and local UI state.

## Demo Boundary

- Mock/demo mode only
- No real Qwen API calls
- No real student data
- No automatic student decisions
- No changes to student grades, hot list status, resources, credentials, or communications

Visible safety label:

`Teacher decision support only — no automated student decisions.`

## Screens

- Qwen Teacher Dashboard
- Student Insight Page for Maya Rodriguez
- Agent Workflow Page
- Intervention Plan Page
- Communication Drafts Page
- Teacher Approval Page
- Approved Action History

## Approval Actions

The Teacher Approval Page supports:

- Approve: marks the recommendation approved and adds it to Approved Action History.
- Edit: returns the recommendation to Draft Recommendation with a sample teacher edit note.
- Reject: marks it rejected and records a sample reason without adding action history.
- Request More Evidence: marks it More Evidence Needed and lists additional written sample, short student conference note, and assessment snapshot.

## Run Locally

```powershell
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Click `Qwen Intelligence` in the teacher sidebar.
