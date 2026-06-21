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

The AI agent observes student work, identifies growth, generates evidence summaries, recommends credentials, and notifies a teacher for verification. Once the teacher approves, EduMemory visualizes a Sui credential pathway and preserves the learning evidence in a Walrus Testnet learning memory. The student portfolio then powers opportunity matching.

## Demo Flow

1. Maya Rodriguez completes an engineering design reflection.
2. EduMemory Agent analyzes her growth in constraints, iteration, and evidence-based reasoning.
3. A Walrus Learning Memory preserves the evidence bundle.
4. The teacher reviews the pending recommendation.
5. The teacher approves Engineering Design Level 1.
6. A teacher-verified credential visualization references the deployed Sui Testnet package.
7. Maya's portfolio updates.
8. EduMemory recommends STEM opportunities with match reasons.

## Why Sui

Sui represents verifiable, student-owned credentials. EduMemory uses Sui conceptually for portable learning achievements that can travel beyond one school, district, or platform.

EduMemory has a deployed Sui Testnet Move package defining a `LearningCredential` object that can reference a Walrus Blob ID.

Sui Package ID:

`0x421376637844f477eac71c9be3d0d27244cb6c1d16f4ec12ca33210533015ec6`

Publish Transaction Digest:

`8DXeQtEuccvNtgMJZ3XtXevdgcUYn9qWTx6G4ForK5nr`

Module:

`edumemorycredential`

The current app visualizes teacher approval and credential creation. Live minting through `issue_credential()` is the next milestone.

## Why Walrus

Walrus represents durable learning memory. EduMemory needs a place to preserve reflections, project artifacts, prototype images, design notebooks, teacher feedback, and AI growth analysis.

EduMemory uploads a structured learning memory to Walrus Testnet and receives real proof identifiers.

Walrus Blob ID:

`0G1_9oZoizZayorL8_0G7uWNJvpoltyKvj-ud4hnPsE`

Walrus Object ID:

`0xe83e0009ced1fe531b28d7003f16396702ff5261dd42e5827ea5861801eb235f`

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
- Real Walrus Testnet learning memory proof
- Real Sui Testnet package deployment
- Prototype in-app credential minting visualization
- Agent analysis and opportunity matching UI

## What Is Real On Testnet

- Walrus Testnet learning memory upload
- Sui Testnet package deployment

## What Remains Prototype

- In-app credential minting
- Wallet-based teacher signing
- Live call to `issue_credential()`

## Package ID Field Answer

Use:

`0x421376637844f477eac71c9be3d0d27244cb6c1d16f4ec12ca33210533015ec6`

If there is a notes field, add:

"The Sui Testnet package is deployed and defines the LearningCredential object. The current app demo visualizes teacher approval; live minting through issue_credential() is the next milestone."

## Demo Video Talking Points

- AI documents Maya's growth; it does not replace her thinking.
- Walrus stores the structured learning memory on Testnet.
- Sui defines the credential ownership layer with a deployed Move package.
- Teacher verification keeps humans in the loop.
- Opportunity matching turns verified learning into future pathways.

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
