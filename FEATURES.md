# Features

## Current App Structure

This is currently a build-free single-page web app.

Root files:

- `index.html`: loads the app.
- `styles.css`: responsive UI styles.
- `data.js`: seeded Lesson 6 data, student profiles, resources, DQB questions, lesson setup, and demo state.
- `ai-service.js`: simple question-improvement helper.
- `aiScaffoldingEngine.js`: guarded AI scaffolding middleware.
- `app.js`: UI rendering, navigation, panels, localStorage state, and interactions.
- `README.md`: setup and architecture notes.

The app is served locally with:

```bash
python3 -m http.server 4173
```

Main URL:

```text
http://localhost:4173
```

Role-specific demo URLs:

```text
http://localhost:4173/?role=teacher
http://localhost:4173/?role=student
```

## Current Routes And Screens

The app does not use real routes yet. It uses `activeRole`, `teacherTab`, `studentTab`, and `activePanel` in localStorage-backed state.

## Role Selection Screen

Purpose:

- Let the demo user choose Teacher workspace or Student lesson.
- Provide a reset demo data action.

Clickable items:

- Teacher workspace
- Student lesson
- Reset demo data

Expected behavior:

- Teacher workspace opens the teacher dashboard.
- Student lesson opens the student Lesson 6 flow.
- Reset demo data clears local demo changes and returns to seeded state.

## Teacher Workspace

Teacher navigation tabs:

- Overview
- Setup wizard
- Students
- DQB moderation
- Analytics
- Inquiry Credits
- Resources

### Overview

Purpose:

- Give the teacher a fast read of lesson status and support needs.
- Show the active Lesson 6 context.
- Surface clickable cards for deeper panels.

Clickable cards and panels:

- Students active opens the Students Needing Support panel.
- Hot List students opens the Hot List students panel.
- Questions to review opens the Question Quality Trends panel.
- Inquiry Credits used opens the Inquiry Credit Usage panel.
- Students needing support opens a support panel.
- Hot List movement opens the Hot List students panel.
- Common misconceptions opens the Misconceptions panel.
- Question quality trends opens the Question Quality panel.
- Students ready for extension opens the Extension panel.
- Teacher resources opens the Resource Manager panel.
- English/Spanish usage opens the Language Usage panel.

Other clickable items:

- Configure lesson opens the Setup wizard tab.
- Preview student view switches to the student role.

### Setup Wizard

Purpose:

- Let the teacher configure a lesson before launching it.

Current fields:

- Lesson title
- Grade level
- Subject
- State
- Standard placeholder
- Allowed AI support
- Session time limit
- Prompt limit
- English/Spanish support
- Student-facing resources
- Mastery goal
- Prerequisite skills
- Expected misconceptions

Seeded standard path:

- Kentucky -> Grade 7 -> Science -> Ecosystems -> MS-LS2-4

Clickable items:

- Launch configured lesson returns to Overview.
- Form fields are editable and save into localStorage state.

### Students

Purpose:

- Show student profile data used for differentiated scaffolding.

Current student profile fields:

- name or anonymous ID
- grade
- class
- language preference
- reading level placeholder
- math level placeholder
- proficiency level
- support tags
- interest
- Inquiry Credit allocation
- teacher notes
- Hot List target movement

Clickable/editable items:

- Proficiency dropdowns are editable.
- Hot List checkboxes are editable.

Started but limited:

- The filter buttons for All students, Hot list, Needs support, and Multilingual appear visually but do not filter yet.
- Add student button is visual only.

### DQB Moderation

Purpose:

- Allow teachers to review student Driving Question Board submissions.

Clickable items:

- Pending, Approved, and Hidden tabs.
- Approve button.
- Hide button.
- Move to review button.

Expected behavior:

- Questions move between pending, approved, and hidden states.
- Approved questions appear on the student Class DQB board.

### Analytics

Purpose:

- Show progress, misconception detection, and instructional next steps.

Current features:

- Lesson completion metric.
- Strong question metric.
- Support signal metric.
- English/Spanish usage metric.
- Progress through Lesson 6.
- Misconception detection summary.
- Instructional next steps.

Clickable areas:

- The Analytics page itself is navigable.
- On Overview, Common Misconceptions and related cards open detail panels.

Started but limited:

- Analytics are seeded/demo-derived, not calculated from a backend.

### Inquiry Credits

Purpose:

- Demonstrate teacher-controlled AI usage allocation.

Current features:

- Class Inquiry Credit pool.
- Used credits.
- Remaining credits.
- Recommended shifts.
- Student allocation sliders from 0% to 100% in 5% increments.

Clickable/editable items:

- Allocation sliders are editable.
- Overview Inquiry Credits card opens a detail panel with the same type of allocation controls.

### Resources

Purpose:

- Store lesson resource metadata and eventually support file/resource uploads.

Current fields:

- Resource title.
- Resource type.
- URL or file placeholder.
- Visibility.
- Shareability.
- Notes/copyright status.

Resource types:

- PDF
- DOCX
- PPTX
- Google Doc link
- Google Slides link
- YouTube link
- Website URL
- Image/chart/graph

Shareability:

- Private
- Share with school
- Share with district
- Public/open resource
- AI-created
- Teacher-created
- Copyright restricted / do not share

Clickable items:

- Add resource adds a metadata-only resource.
- Open manager opens the Resource Manager detail panel.
- Seeded and uploaded resource rows are clickable.
- Resource detail panel shows an Open Resource button when a URL exists.

Warning shown:

> Only share resources you created, have permission to share, or that are openly licensed.

Started but limited:

- There is no real file upload yet.
- File processing and storage are placeholders.

## Student Lesson

Purpose:

- Let students complete the OpenSciEd Lesson 6 flow with guarded AI scaffolding.

Current Lesson 6 activities:

1. Navigation / Turn and Talk
2. Define the Problem
3. Build a Better Palm Farm
4. Criteria and Constraints
5. Driving Question Board
6. Class DQB
7. Next Steps

Clickable items:

- Back.
- Save and continue.
- Submit for teacher review.
- Improve my question.
- Class DQB.
- Chat submit button.
- Top-right switch role button.

Current features:

- Student response text areas.
- Activity progress sidebar.
- Seeded responses.
- Class DQB board for approved questions.
- AI question improvement.
- Scaffolding Engine chat panel.
- Session limit and prompt limit display.

## AI Scaffolding Engine

Purpose:

- Prevent raw AI-style responses from going directly to students.

Current flow:

```text
Student message
-> activity context
-> teacher mastery goal
-> student profile
-> allowed support level/session limits
-> draft scaffold
-> rule checker
-> final scaffolded response
```

Current rule checker detects:

- direct answer requests
- off-topic requests
- responses not tied to lesson materials
- overly long responses
- misconceptions

Current misconception categories:

- Palm oil is just bad
- They should just stop using palm oil
- Confusing criteria and constraints
- Ignoring farmer income
- Ignoring ecosystem stability
- Not connecting habitat loss to population change

## Current Features Already Built

- Role selection.
- Teacher dashboard.
- Teacher Setup Wizard.
- Student Profile Engine.
- Hot List indicators and editable Hot List panel.
- Inquiry Credit allocation.
- Resource metadata manager.
- Clickable resource details.
- DQB moderation.
- Student Lesson 6 flow.
- Class DQB board.
- Guarded scaffolding engine.
- Differentiated support based on student profile.
- Misconception detection.
- English/Spanish support indicators.
- LocalStorage persistence.
- Responsive layout for smaller screens.

## Started But Unfinished

- Add student button exists but does not create a student.
- Student list filter buttons do not filter yet.
- Authentication and real roles are not implemented.
- Parent/guardian view is not implemented.
- Admin dashboard is not implemented.
- Live AI provider integration is not implemented.
- Real file upload, storage, and parsing are not implemented.
- Attendance, behavior, and academic monitoring are not implemented.
- Export/download/deploy path is not implemented.
- Database/backend integration is not implemented.

## Previously Missing Clickable Areas

These were identified as important and are now at least partially fixed:

- Hot List is clickable from Overview and opens an editable Hot List panel.
- Teacher Resources card opens a Resource Manager panel.
- Actual resource items are clickable and open a Resource Detail panel.

Still worth checking in future sessions:

- Make all non-functional buttons either work or appear disabled.
- Add keyboard-visible focus to every interactive card.
- Make resource manager and Resources tab share one consistent form model.
- Add edit/delete actions for resources.

## Suggested User Flows

### Teacher Board Demo Flow

1. Open Teacher workspace.
2. Click Hot List students.
3. Show target proficiency, support notes, and Inquiry Credit allocation.
4. Close panel.
5. Click Teacher resources.
6. Add a sample resource with shareability metadata.
7. Click the resource and show the detail panel.
8. Click Common misconceptions.
9. Explain how the app helps a teacher plan next instruction.

### Teacher Lesson Setup Flow

1. Open Setup wizard.
2. Review standard path and mastery goal.
3. Edit expected misconceptions.
4. Set support level, session limit, and prompt limit.
5. Launch configured lesson.

### Student Flow

1. Open Student lesson.
2. Read the activity prompt.
3. Ask the Scaffolding Engine for help.
4. Save and continue through the lesson.
5. Improve a DQB question.
6. Submit it for teacher review.
7. View approved anonymous class questions.

## Notes For Future Codex Sessions

- Do not rebuild the app unless explicitly asked.
- Keep the Lesson 6 flow intact.
- Prefer adding small interactive panels or pages over rewriting the UI.
- Preserve seeded sample data so the app remains demo-ready.
- If adding backend support, keep the existing data shapes in `data.js` as the migration guide.
- Keep AI responses guarded by `aiScaffoldingEngine.js`; do not send raw model output directly to students.
