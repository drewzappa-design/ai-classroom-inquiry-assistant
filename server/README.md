# Qwen Teacher Intelligence Server

Small Express backend for live Qwen Teacher Intelligence demos.

The frontend must not contain `DASHSCOPE_API_KEY`. This server reads the key from `.env`, calls Alibaba Cloud Model Studio / DashScope, and returns JSON to the static app.

This backend is not a generic chatbot proxy for classroom analysis. `POST /api/qwen/classroom-analysis` asks Qwen for one structured orchestration response that contains the normalized class analysis plus outputs for the five conceptual teaching agents. Mock Mode still demonstrates the ordered local agent pipeline.

## Install

```bash
cd server
npm install
```

## Configure

```bash
copy .env.example .env
```

Then edit `.env`:

```bash
DASHSCOPE_API_KEY=your_real_key
PORT=3001
QWEN_MODEL=qwen3.7-plus
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

Use the Model Studio endpoint for your key's region. For some regions, Alibaba recommends workspace-specific domains.

## Run

```bash
npm start
```

Health check:

```bash
curl http://localhost:3001/health
```

Safe Qwen configuration check:

```bash
curl http://localhost:3001/api/qwen/config-check
```

This returns whether a key is loaded, the first three key characters only, key length, base URL, model, and server time. It never returns the full API key.

Qwen chat endpoint:

```bash
curl -X POST http://localhost:3001/api/qwen/chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Summarize this class evidence.\"}]}"
```

Classroom analysis endpoint:

```bash
curl -X POST http://localhost:3001/api/qwen/classroom-analysis \
  -H "Content-Type: application/json" \
  -d "{\"snapshot\":{\"lesson\":{\"title\":\"OpenSciEd 7.5 Lesson 6\",\"subject\":\"Science\",\"gradeLevel\":\"7\"},\"students\":[],\"safetyBoundary\":\"Teacher decision support only -- no automated student decisions.\"}}"
```

## Classroom Analysis Orchestration

For final-demo reliability, `POST /api/qwen/classroom-analysis` uses a single Qwen call that returns structured JSON for this conceptual agent order:

1. Learning Analyst
2. Standards Coach
3. Intervention Designer
4. Communication Agent
5. Opportunity Advisor

The live prompt includes:

- original sanitized classroom evidence
- required output shape for the class analysis
- required output shape for all five agent outputs

The conceptual agent responsibilities are:

- **Learning Analyst:** outputs `strengths`, `misconceptions`, `evidenceObserved`, `confidence`, and `learningTrends`. It must not recommend interventions.
- **Standards Coach:** outputs `priorityStandards`, `prerequisiteConcepts`, `learningObjectives`, and `progressionNotes`. It must not create lesson plans.
- **Intervention Designer:** outputs `tomorrowsIntervention`, `nextWeeksIntervention`, `differentiationStrategy`, `assessmentSuggestion`, and `estimatedTeacherTime`. It must not communicate with parents.
- **Communication Agent:** outputs `parentEmail`, `studentConferenceNotes`, and `administratorSummary`. It must never discuss grading changes.
- **Opportunity Advisor:** outputs `opportunities[]`, each with `opportunity`, `reason`, `confidence`, and `preparationNeeded`.

## Validation And Fallback

The backend validates the single live orchestration response:

- response must be parseable JSON
- response must be a JSON object

If the live response is unavailable, invalid, or times out, the frontend falls back to Mock Mode. Mock Mode keeps the local step-by-step agent orchestration for offline and fallback demos.

The normalized response includes:

- `analysis`
- `agentOutputs`
- `usage`

Teacher approval is still required in the frontend before any recommendation becomes an approved action.

## Frontend

Run the static app separately from the repository root:

```bash
py -m http.server 8000
```

Open:

```text
http://localhost:8000/?role=teacher
```

Go to `Qwen Intelligence`, switch to `Live Qwen Mode`, then run `Analyze Entire Classroom`.

If this backend is unavailable or returns an error, the frontend automatically falls back to Mock Mode.

Mock Mode uses the same orchestration pattern locally for offline/fallback demos.
