# EduMemory Final Submission Copy

## Project Name

EduMemory

## Tagline

A lifelong AI-powered learning passport and opportunity network

## Track Recommendation

If multiple tracks are allowed:

**Walrus + Agentic Web**

If only one track is allowed:

**Walrus**

## GitHub Repo URL

`TODO_GITHUB_REPO_URL`

## GitHub Pages Demo URL

`TODO_GITHUB_PAGES_DEMO_URL/?role=edumemory`

## Short Description

EduMemory is an AI-powered learning passport that documents student growth, preserves verified learning evidence on Walrus, and connects teacher-verified achievements to portable Sui credentials and future opportunities.

## Long Description

Students often spend years building skills, winning awards, completing projects, and becoming eligible for scholarships, internships, academies, fellowships, and STEM programs. When it is time to apply, their evidence is scattered or forgotten.

EduMemory solves this with an agentic workflow. The AI observes student work, analyzes growth, recommends a credential, and routes the recommendation to a teacher. The teacher verifies the achievement. The learning memory is stored on Walrus Testnet, and the Sui credential layer defines student-owned verification.

The demo follows Maya Rodriguez, a 7th grade engineering student. EduMemory analyzes her engineering reflection, preserves the learning evidence, shows teacher approval, references a deployed Sui Move package, and matches her to STEM opportunities.

Main message:

**AI did not replace the student's thinking. AI documented the student's growth and opened new opportunities.**

## What Is Live

- Walrus Testnet learning memory upload
- Walrus Blob ID: `0G1_9oZoizZayorL8_0G7uWNJvpoltyKvj-ud4hnPsE`
- Walrus Object ID: `0xe83e0009ced1fe531b28d7003f16396702ff5261dd42e5827ea5861801eb235f`
- Sui Testnet package deployment
- Sui Package ID: `0x421376637844f477eac71c9be3d0d27244cb6c1d16f4ec12ca33210533015ec6`
- Sui Transaction Digest: `8DXeQtEuccvNtgMJZ3XtXevdgcUYn9qWTx6G4ForK5nr`

## What Is Prototype

- In-app credential minting visualization
- Wallet-based teacher signing
- Live `issue_credential()` call from the app
- Production student identity and privacy controls

## Why Walrus

Walrus stores the learning memory: a structured JSON package of reflection, growth analysis, teacher verification status, and credential recommendation. It gives student evidence durable storage beyond a single classroom or school platform.

## Why Sui

Sui defines the credential ownership layer. EduMemory's deployed Move package defines a `LearningCredential` object that can reference a Walrus Blob ID. The next milestone is connecting teacher approval directly to `issue_credential()`.

## Why Agentic Web

EduMemory's AI is not a chatbot. It observes evidence, analyzes growth, recommends action, routes work to a teacher, preserves memory, and matches opportunities.

## Package ID Field Answer

`0x421376637844f477eac71c9be3d0d27244cb6c1d16f4ec12ca33210533015ec6`

## Submission Notes Field

EduMemory has real Walrus Testnet proof and a deployed Sui Testnet Move package. The current app visualizes teacher approval and credential creation; live app minting through `issue_credential()` is the next milestone.
