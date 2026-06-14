# Inquiry Classroom MVP

A build-free, interactive prototype for OpenSciEd 7.5 Ecosystem Dynamics & Biodiversity, Lesson 6.

## Run locally

From this folder:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Included

- Teacher dashboard with live lesson overview, setup wizard, student support signals, DQB moderation, analytics, resource inventory, and adjustable Inquiry Credit allocation.
- Student Lesson 6 workflow based on Slides A-G, with persistent responses, a guided Inquiry Coach, question improvement, and anonymous DQB submission.
- Seeded English and Spanish-aware demo data, richer student profiles, Hot List indicators, mastery goal configuration, and misconception tracking.
- Shared browser persistence using `localStorage`.
- Modular simulated AI layer in `ai-service.js` plus guarded scaffolding middleware in `aiScaffoldingEngine.js`.

## Files

- `index.html`: app entry point.
- `styles.css`: responsive classroom UI.
- `data.js`: typed-style data shape, Lesson 6 activities, resources, and seeded demo state.
- `ai-service.js`: replaceable inquiry-scaffolding provider.
- `aiScaffoldingEngine.js`: middleware-style rule checker that combines lesson context, teacher mastery goal, student profile, support level, and AI response guardrails.
- `app.js`: UI rendering and interactive workflows.

## New architecture notes

The app now models the product as a teacher-controlled scaffolding platform, not a lesson chatbot.

- Teacher Setup Wizard stores lesson identity, standard placeholder, mastery definition, prerequisite skills, expected misconceptions, support level, session limit, prompt limit, Spanish support, and resource visibility.
- Student Profile Engine stores proficiency, support tags, Hot List status, language preference, reading/math placeholders, interests, notes, and Inquiry Credit allocation.
- Inquiry Credits are demo-only usage controls shown as student allocation, used credits, remaining credits, and class pool usage.
- The scaffolding engine prevents direct answers, completing student work, off-topic replies, loose responses not tied to lesson materials, and overly long responses.
- Misconception detection logs common patterns for the teacher analytics view.
- Dashboard cards are now actionable. The app tracks `activePanel`, `selectedStudent`, `selectedResource`, `resourceList`, and `hotListStudents` in the same demo state object so Board-demo users can click into Hot List, support needs, extension, misconceptions, question quality, Inquiry Credits, language usage, and teacher resources.
- Resource rows open a detail panel with title, type, URL/file placeholder, connected lesson, visibility, shareability, license/copyright status, notes, and an Open Resource action when a URL exists.

## Next backend phase

Replace browser persistence with a backend such as Supabase, Firebase, or Atoms Cloud. Preserve the existing data shapes for students, responses, DQB questions, usage allocation, and lesson resources.

Replace `AIScaffoldingEngine.run()` with a secure server-side provider adapter. Keep API keys outside the browser. The future adapter should send the active activity, teacher mastery goal, lesson context, student profile, allowed support level, and language preference to the configured model provider, then run the rule checker before returning anything to students.

## Not included yet

- Production authentication or student-data security hardening
- Live LLM calls
- File uploads
- Voice input
- Google Classroom or Canvas integration
- District/admin dashboard
