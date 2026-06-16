# Sui Overflow Submission Answers

## Project Name

EduMemory

## Tagline

A lifelong AI-powered learning passport and opportunity network

## Track

Agentic Web, Walrus-aligned concept

## Short Description

EduMemory is an AI agent that documents student growth over time, routes achievements to teachers for verification, creates student-owned Sui credentials, and preserves learning evidence through a Walrus-aligned memory layer.

## Problem

Students often spend years building skills, winning awards, completing projects, joining competitions, earning certifications, and participating in STEM opportunities. When they apply for colleges, scholarships, internships, fellowships, technical programs, competitions, or nonprofit programs, they often forget the evidence that makes them qualified.

Teachers also struggle to track long-term student growth because evidence is scattered across reflections, notebooks, project submissions, rubrics, photos, videos, and conversations.

## Solution

EduMemory turns classroom learning into a student-owned learning passport.

The AI agent observes student work, identifies growth, generates evidence summaries, recommends credentials, and notifies a teacher for verification. Once the teacher approves, EduMemory creates a mock Sui credential and preserves the learning evidence in a mock Walrus memory record. The student portfolio then powers opportunity matching.

## Demo Flow

1. Maya Rodriguez completes an engineering design reflection.
2. EduMemory Agent analyzes her growth in constraints, iteration, and evidence-based reasoning.
3. A Walrus Learning Memory preserves the evidence bundle.
4. The teacher reviews the pending recommendation.
5. The teacher approves Engineering Design Level 1.
6. A mock Sui credential is issued to Maya.
7. Maya's portfolio updates.
8. EduMemory recommends STEM opportunities with match reasons.

## Why Sui

Sui represents verifiable, student-owned credentials. EduMemory uses Sui conceptually for portable learning achievements that can travel beyond one school, district, or platform.

In the current hackathon demo, Sui is mocked as a testnet-style credential object so the workflow is clear and demo-ready. Production Sui transaction integration is a future step.

## Why Walrus

Walrus represents durable learning memory. EduMemory needs a place to preserve reflections, project artifacts, prototype images, design notebooks, teacher feedback, and AI growth analysis.

In the current demo, Walrus is mocked as a Learning Memory record: `WALRUS-2026-ENG-0001`. Future work would connect this evidence bundle to real Walrus storage.

## Agentic Web Relevance

EduMemory is agentic because the AI is not a passive chatbot. It:

- Observes student learning evidence
- Analyzes growth patterns
- Recommends a credential
- Routes the recommendation to a teacher
- Preserves verified evidence
- Matches the learner to future opportunities

The agent's job is not to replace student thinking. Its job is to document growth and open doors.

## Real-World Application

EduMemory addresses a real equity and access problem: many students have meaningful achievements but weak documentation. A verified learning passport can help students apply for scholarships, internships, technical programs, fellowships, competitions, and summer academies using evidence they already earned.

## Technical Implementation

The demo is implemented as an additive mode inside the existing AI Classroom Inquiry Assistant prototype.

- Vanilla HTML/CSS/JavaScript
- No build step
- Local demo state through `localStorage`
- Existing teacher and student workflows preserved
- Mock Sui credential object
- Mock Walrus memory object
- Agent analysis and opportunity matching UI

## Local Run Instructions

From the repository root:

```bash
python3 -m http.server 4173
```

On Windows:

```powershell
python -m http.server 4173
```

Open:

`http://localhost:4173/?role=edumemory`

## Future Roadmap

### Short Term

- Connect EduMemory Agent to real student reflection and project data
- Add teacher approval states beyond approve
- Add configurable rubrics for different subjects and grade levels
- Add exportable student/family portfolio views

### Sui Integration

- Create real Sui credential records behind a feature flag
- Add wallet-based student ownership
- Add verification views for external opportunity providers

### Walrus Integration

- Store artifact bundles in Walrus
- Preserve reflection evidence, prototype images, notebooks, and teacher feedback
- Link credential metadata to durable evidence records

### Long Term

- Build a student opportunity network for scholarships, internships, academies, competitions, fellowships, and nonprofit STEM programs
- Support multiple years of learning history
- Add privacy-preserving opportunity discovery

## Submission Checklist

- Project name and tagline included
- Track identified
- Problem and solution described
- Demo flow documented
- Sui and Walrus roles explained
- Local run instructions included
- Pitch script included
- Video shot list included
- Judge Q&A included
- Existing classroom app preserved
