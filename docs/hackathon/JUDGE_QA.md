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

In this hackathon demo, Sui is mocked as a testnet-style credential object. The next technical step would be creating real Sui credential records behind a feature flag.

## Why use Walrus?

Walrus is a strong fit for long-term evidence preservation. Learning evidence can include reflections, design notebooks, prototype images, videos, teacher feedback, and AI growth analysis.

In this demo, Walrus is represented by a Learning Memory record with ID `WALRUS-2026-ENG-0001`.

## What is the current technical implementation?

The current implementation is an additive mode inside the existing AI Classroom Inquiry Assistant prototype.

- Vanilla JavaScript
- Local static server
- `localStorage` demo state
- Mock Sui credential
- Mock Walrus memory
- Existing teacher and student workflows preserved

## What is real versus mocked?

Real in the demo:

- EduMemory workflow
- Agent analysis UI
- Teacher verification flow
- Portfolio update
- Opportunity matching explanation

Mocked in the demo:

- Sui credential transaction
- Walrus evidence storage
- Live LLM calls
- Production authentication

## Why not build production blockchain integration now?

The hackathon goal is to demonstrate real-world impact and product quality. The current demo focuses on the workflow judges need to understand: AI documents growth, teachers verify, Sui proves ownership, and Walrus preserves evidence.

Production Sui and Walrus integration are clear next steps.

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
