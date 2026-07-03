# Final Qwen Submission Checklist

## Run Frontend

- [ ] From repository root, run `py -m http.server 8000`
- [ ] Open `http://localhost:8000/?role=teacher`
- [ ] Open `Qwen Intelligence` from the teacher sidebar

## Run Backend

- [ ] From `server/`, run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Add `DASHSCOPE_API_KEY`
- [ ] Confirm `QWEN_MODEL` is set
- [ ] Run `npm start`
- [ ] Confirm `GET /health` responds
- [ ] Confirm `GET /api/qwen/config-check` responds without exposing the full API key

## Confirm Mock Mode

- [ ] Select `Mock Mode`
- [ ] Click `Analyze Entire Classroom`
- [ ] Confirm visible agent orchestration appears
- [ ] Confirm class analysis populates after completion

## Confirm Live Mode

- [ ] Start backend with valid `.env`
- [ ] Select `Live Qwen Mode`
- [ ] Click `Analyze Entire Classroom`
- [ ] Confirm backend receives `POST /api/qwen/classroom-analysis`
- [ ] Confirm live analysis populates the existing dashboard

## Confirm Visible Orchestration

- [ ] Learning Analyst shows `analyzing evidence...`
- [ ] Standards Coach shows `aligning standards...`
- [ ] Intervention Designer shows `building intervention...`
- [ ] Communication Agent shows `drafting communication...`
- [ ] Opportunity Advisor shows `identifying enrichment...`
- [ ] `Classroom Analysis Complete` appears before dashboard results are reviewed

## Confirm Teacher Approval

- [ ] Open Teacher Approval page
- [ ] Approve a recommendation
- [ ] Confirm timestamp appears
- [ ] Confirm teacher remains final decision-maker
- [ ] Confirm approved action appears in Approved Action History

## Confirm Demo Mode

- [ ] Click `Demo Mode`
- [ ] Confirm Step 1 of 9 appears
- [ ] Confirm Next and Previous controls work
- [ ] Confirm Right Arrow, Left Arrow, and Esc shortcuts work
- [ ] Confirm Teacher Approval step shows approval status change

## Confirm No Keys Committed

- [ ] `.env` is not committed
- [ ] `DASHSCOPE_API_KEY` does not appear in frontend files
- [ ] `DASHSCOPE_API_KEY` does not appear in documentation except as an environment variable name

## Confirm Docs Ready

- [ ] `README_QWEN.md` has Judge Quickstart
- [ ] `ARCHITECTURE_QWEN.md` has Mermaid architecture diagram
- [ ] `DEMO_SCRIPT_QWEN.md` has final voiceover
- [ ] `SUBMISSION_QWEN.md` has Live Qwen Proof
- [ ] `server/README.md` explains backend setup and agent pipeline

## Confirm Video Recorded

- [ ] 3-5 minute recording completed
- [ ] Video shows visible agent orchestration
- [ ] Video says Qwen is not generating one paragraph
- [ ] Video shows teacher approval before action history
- [ ] Video ends with teacher decision support value proposition

## Confirm Screenshots Captured

- [ ] Teacher Dashboard
- [ ] Visible agent orchestration running
- [ ] Classroom Analysis Complete
- [ ] Teacher Approval Page
- [ ] Approved Action History

## Final Smoke Test

- [ ] Frontend loads
- [ ] Backend starts
- [ ] Mock Mode works
- [ ] Live Qwen Mode works
- [ ] Fallback to Mock Mode works if backend is unavailable
- [ ] Demo Mode works
- [ ] Working tree is clean before final submission
