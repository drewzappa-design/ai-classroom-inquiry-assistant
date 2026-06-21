# EduMemory Judge Q&A

## What is EduMemory?

EduMemory is a lifelong AI-powered learning passport and opportunity network. It uses an AI agent to document student growth, route achievements to teachers for verification, preserve learning evidence, and match students to future opportunities.

## What problem does it solve?

Students often forget years of awards, skills, projects, competitions, and eligibility evidence when applying for colleges, scholarships, internships, fellowships, technical schools, and nonprofit STEM programs.

EduMemory helps students preserve verified evidence of growth over time.

## Is this replacing teachers?

No. EduMemory keeps teachers in the verification loop.

The AI agent recommends a credential based on evidence. The teacher reviews the evidence and approves the achievement. The demo is designed around teacher verification because credentials should be credible.

## Is this replacing student thinking?

No. The core message is:

**AI did not replace the student's thinking. AI documented the student's growth and opened new opportunities.**

Maya does the engineering reflection. The agent identifies and preserves evidence from her work.

## What makes it agentic?

The AI is not just a chatbot. It takes action across a workflow:

- Observes learning evidence
- Analyzes growth
- Recommends a credential
- Routes the recommendation to a teacher
- Preserves evidence
- Matches the student to opportunities

## Why use Sui?

Sui is a strong fit for student-owned credentials. A verified learning credential should belong to the learner and travel beyond one classroom, school, or district.

Yes. EduMemory has a deployed Sui Testnet Move package defining a `LearningCredential` object. The current demo visualizes teacher approval and credential creation; live minting through `issue_credential()` is the next milestone.

Package ID:

`0x421376637844f477eac71c9be3d0d27244cb6c1d16f4ec12ca33210533015ec6`

Publish transaction:

`8DXeQtEuccvNtgMJZ3XtXevdgcUYn9qWTx6G4ForK5nr`

## Why use Walrus?

Walrus is a strong fit for long-term evidence preservation. Learning evidence can include reflections, design notebooks, prototype images, videos, teacher feedback, and AI growth analysis.

Yes. EduMemory uploads a structured learning memory to Walrus Testnet and receives a real Blob ID and Object ID.

Blob ID:

`0G1_9oZoizZayorL8_0G7uWNJvpoltyKvj-ud4hnPsE`

Object ID:

`0xe83e0009ced1fe531b28d7003f16396702ff5261dd42e5827ea5861801eb235f`

## What is the current technical implementation?

The current implementation is an additive mode inside the existing AI Classroom Inquiry Assistant prototype.

- Vanilla JavaScript
- Local static server
- `localStorage` demo state
- Real Walrus Testnet learning memory proof
- Real Sui Testnet package deployment
- Prototype Sui credential visualization in the app
- Existing teacher and student workflows preserved

## What is real versus mocked?

Real in the demo:

- EduMemory workflow
- Agent analysis UI
- Teacher verification flow
- Portfolio update
- Opportunity matching explanation

Mocked in the demo:

- Live in-app call to `issue_credential()`
- Wallet-based credential minting
- Live LLM calls
- Production authentication

## Why not build production blockchain integration now?

The hackathon goal is to demonstrate real-world impact and product quality. The current demo focuses on the workflow judges need to understand: AI documents growth, teachers verify, Sui proves ownership, and Walrus preserves evidence.

The Sui package and Walrus memory proof are live on Testnet. The remaining next step is connecting the teacher approval button directly to `issue_credential()` so the app mints a live credential object.

## Why not just use a database?

Students need portable, verifiable, student-owned evidence that can survive beyond one classroom, school, or platform. A database can store records for one institution, but Sui and Walrus support a learner-owned proof layer that can travel with the student.

## Does AI automatically award credentials?

No. The AI recommends based on evidence. A teacher verifies before a credential is approved.

## Who are the target users?

- Students who need portable evidence of growth
- Teachers who verify learning achievements
- Families who need clearer records of student progress
- Schools and STEM programs
- Scholarship, internship, and opportunity providers

## What is the business or adoption path?

EduMemory could start as a classroom or STEM program portfolio layer, then expand into district-wide learning passports and an opportunity network for scholarships, internships, academies, competitions, and fellowships.

## How does opportunity matching work in the demo?

The demo matches Maya to opportunities based on verified credentials, preserved evidence, technical achievements, STEM engagement, and growth trajectory.

Examples:

- NASA STEM Fellowship: 92%
- Engineering Summer Academy: 87%
- Robotics Leadership Scholarship: 95%

Each match includes a reason so the recommendation feels explainable, not arbitrary.

## What would you build next?

1. Real Sui credential creation
2. Real Walrus artifact storage
3. Teacher rubric configuration
4. Student/family portfolio export
5. Privacy controls
6. Multi-year learning history
7. Opportunity provider verification views

## What should judges remember?

EduMemory turns learning moments into lifelong opportunity signals.

It helps a student carry proof of growth with them, instead of leaving that proof scattered across assignments, classrooms, and years.
