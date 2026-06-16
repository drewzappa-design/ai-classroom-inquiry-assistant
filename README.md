# EduMemory

**A lifelong AI-powered learning passport and opportunity network**

EduMemory is a Sui Overflow hackathon branch of the AI Classroom Inquiry Assistant. It extends the existing classroom inquiry prototype with an agentic learning passport demo: an AI agent documents student growth, a teacher verifies the achievement, Sui represents student-owned credentials, and Walrus represents preserved learning evidence.

**Track:** Agentic Web, Walrus-aligned concept

## Hackathon Demo

Run a local server, then open:

`http://localhost:4173/?role=edumemory`

```bash
python3 -m http.server 4173
```

On Windows, this also works:

```powershell
python -m http.server 4173
```

The original teacher dashboard and student lesson remain available at:

`http://localhost:4173`

## Problem

Students spend years building skills, earning awards, completing projects, joining competitions, and developing STEM readiness. When they apply for colleges, scholarships, internships, fellowships, career programs, and nonprofit opportunities, they often forget the evidence that proves they are qualified.

Teachers also struggle to track growth across time because evidence is scattered across reflections, project submissions, rubrics, notebooks, photos, and classroom conversations.

## Solution

EduMemory turns classroom learning into a student-owned record of verified growth.

The demo shows:

- Maya Rodriguez, a 7th grade engineering student
- An engineering reflection from a design challenge
- EduMemory Agent growth analysis
- A Walrus Learning Memory that preserves evidence
- Teacher verification of Engineering Design Level 1
- A mock Sui credential owned by the learner
- Opportunity matching for STEM programs and scholarships

The key message:

**AI did not replace the student's thinking. AI documented the student's growth and opened new opportunities.**

## Why Sui

Sui represents student ownership, verifiable credentials, and portable achievement records. In the hackathon demo, the Sui credential is mocked as a testnet-style learning credential so judges can understand the product workflow without requiring production blockchain infrastructure.

## Why Walrus

Walrus represents long-term learning memory: reflections, design notebooks, prototype images, teacher feedback, and AI growth analysis. In the demo, Walrus is mocked as a durable evidence layer aligned with lifelong student ownership.

## Demo Flow

1. Student Learning: Maya completes an engineering design reflection.
2. AI Agent Analysis: EduMemory identifies growth in constraints, iteration, and evidence-based reasoning.
3. Learning Memory Created: Walrus preserves the evidence bundle.
4. Teacher Verification: An instructor reviews the recommendation.
5. Sui Credential Issued: Engineering Design Level 1 becomes a student-controlled credential.
6. Opportunity Matching: The agent recommends STEM opportunities with match reasons.

## Existing App

This repository began as **Inquiry Classroom MVP**, a build-free interactive prototype for OpenSciEd 7.5 Ecosystem Dynamics & Biodiversity, Lesson 6.

Existing functionality remains intact:

- Teacher dashboard with lesson overview, setup wizard, student support signals, DQB moderation, analytics, resource inventory, and Inquiry Credit allocation
- Student Lesson 6 workflow with persistent responses, guided Inquiry Coach, question improvement, and anonymous DQB submission
- Seeded demo data, richer student profiles, Hot List indicators, misconception tracking, and localStorage persistence
- Modular simulated AI layer in `ai-service.js` plus guarded scaffolding middleware in `aiScaffoldingEngine.js`

## Files

- `index.html`: app entry point
- `styles.css`: responsive classroom and EduMemory demo UI
- `data.js`: lesson activities, resources, and seeded demo state
- `ai-service.js`: replaceable inquiry-scaffolding provider
- `aiScaffoldingEngine.js`: guarded scaffolding middleware
- `app.js`: UI rendering and interactive workflows
- `docs/hackathon/`: Sui Overflow submission package, pitch materials, and demo source notes

## Submission Checklist

- Project name: EduMemory
- Tagline: A lifelong AI-powered learning passport and opportunity network
- Track: Agentic Web, Walrus-aligned concept
- Local demo URL: `http://localhost:4173/?role=edumemory`
- Demo script: `docs/hackathon/PITCH_SCRIPT_5_MIN.md`
- Submission answers: `docs/hackathon/SUBMISSION_ANSWERS.md`
- Video shot list: `docs/hackathon/VIDEO_SHOT_LIST.md`
- Judge Q&A: `docs/hackathon/JUDGE_QA.md`
- Existing classroom app preserved

## Future Roadmap

- Connect EduMemory Agent to real student reflection and project data
- Add teacher approval states: approve, request revision, reject, archive
- Add configurable achievement rubrics by grade level, subject, and program
- Add family/student export views
- Integrate real Sui credential creation behind a feature flag
- Integrate real Walrus storage for artifacts behind a feature flag
- Build a student opportunity network for scholarships, internships, academies, competitions, and fellowships

## Not Included Yet

- Production authentication or student-data security hardening
- Live LLM calls
- Production Sui transactions
- Production Walrus uploads
- File uploads
- Google Classroom or Canvas integration
- District/admin dashboard
