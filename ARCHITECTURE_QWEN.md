# Qwen Teacher Intelligence Architecture

## Placement

The Qwen module lives in:

```text
modules/qwen-teacher-intelligence/
  qwen-teacher-intelligence.js
  qwen-teacher-intelligence.css
```

The app integrates it additively:

- `index.html` loads the module stylesheet and script.
- `app.js` adds one teacher navigation item and one route.
- `qwenTeacherPage()` passes shared rendering helpers and app state into `window.QwenTeacherIntelligence.render()`.

## State

The module stores only local demo workflow state under:

```js
state.qwenTeacherIntelligence
```

Primary fields:

- `provider`
- `currentRecommendation`
- `recommendationStatus`
- `actionHistory`
- `rejectionReason`
- `neededEvidence`
- `editedNote`
- `lastDecisionAt`

This state is saved through the existing app `save()` helper, so it follows the same localStorage demo persistence model as the rest of the prototype.

## Workflow

```text
Draft Recommendation
  -> Waiting for Teacher Review
  -> Teacher chooses Approve, Edit, Reject, or Request More Evidence
  -> Approved actions are copied into Approved Action History
```

Rejected recommendations do not update action history.

More Evidence Needed lists:

- additional written sample
- short student conference note
- assessment snapshot

## Safety Boundaries

The Qwen module does not modify:

- student lesson runtime
- EduMemory flow
- Sui/Walrus files
- Supabase files
- existing AI scaffolding behavior
- existing student dashboard behavior

Future live Qwen integration should use a backend proxy and explicit teacher approval before any write action.
