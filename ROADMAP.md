# Roadmap

## Phase 1: Working Clickable Prototype

Goal: make the product understandable and clickable for a Board of Education demo.

Current status: mostly in progress and demo-ready.

Phase 1 includes:

- Role selection.
- Teacher dashboard.
- Clickable dashboard cards.
- Detail panels for Hot List, support needs, extension, misconceptions, question quality, Inquiry Credits, language usage, and resources.
- Teacher Setup Wizard.
- Student Profile Engine.
- Inquiry Credit allocation.
- Resource metadata manager.
- Resource detail panels.
- Student Lesson 6 workflow.
- DQB moderation.
- Guarded AI scaffolding simulation.
- Seeded demo data.
- LocalStorage persistence.

Remaining Phase 1 priorities:

1. Make the Add student button functional.
2. Make student filter buttons functional.
3. Add edit/delete actions for resources.
4. Add a simple parent/guardian preview screen as a non-production demo.
5. Add a clearer app name treatment for SIDW/BOTE vs. Inquiry Classroom.
6. Add export/download instructions for packaging the prototype.

## Phase 2: Classroom Pilot Version

Goal: make the app usable by one teacher with real students in a controlled pilot.

Needed work:

- Add authentication and role handling.
- Add a database or backend service.
- Replace localStorage with persisted records.
- Add real class creation.
- Add real student creation/import.
- Add safe student login or class-code join.
- Add teacher-owned lessons.
- Add real resource upload/link storage.
- Add student response history.
- Add teacher moderation history.
- Add privacy-aware student display names or anonymous IDs.
- Add basic data export for teacher review.
- Connect the AI Scaffolding Engine to a real AI provider through a server-side adapter.
- Keep rule-checking between the AI provider and student-facing output.

Pilot success criteria:

- Teacher can launch a lesson.
- Students can complete the activity flow.
- Teacher can see support needs and misconceptions.
- Teacher can approve DQB questions.
- Student data persists after refresh.
- AI guidance does not give direct answers.

## Phase 3: School/Team Version

Goal: support multiple classrooms, teachers, and school-level monitoring.

Needed work:

- School/team workspace.
- Multiple teacher accounts.
- Shared resource library.
- Grade/team lesson templates.
- Admin dashboard.
- Intervention tracking.
- Attendance, behavior, and academic monitoring.
- Cross-class Hot List and support views.
- Shared student profiles across classes.
- Resource shareability and permissions workflow.
- Parent/guardian summary view.
- Exportable student support reports.
- Audit trail for teacher/admin changes.

School/team success criteria:

- A school leader can see trends without exposing unnecessary student detail.
- Teachers can share resources only when allowed.
- Student support tags and intervention notes can follow students across periods or teams.
- Hot List movement can be tracked over time.

## Phase 4: Scalable Product Version

Goal: turn the prototype into a scalable, maintainable product.

Needed work:

- Production authentication and authorization.
- FERPA/COPPA-aware privacy model.
- Secure backend and database.
- AI provider abstraction.
- Usage controls and cost monitoring.
- Full file/resource library.
- Import/export tools.
- District-level admin controls.
- Deployment pipeline.
- Testing suite.
- Accessibility audit.
- Mobile/tablet polish.
- Data retention settings.
- Documentation for schools.
- App packaging, download, or deploy path.

Product success criteria:

- Multiple schools can use the platform safely.
- Teachers can configure and launch lessons without technical help.
- Students receive safe, scaffolded support.
- Admins can monitor trends and implementation.
- The app is deployable, maintainable, and explainable.

## Prioritized Next Steps

1. Finish all visible clickable navigation.
2. Add student creation/editing.
3. Add resource edit/delete.
4. Add parent/guardian preview.
5. Add admin dashboard preview.
6. Add backend data model.
7. Add authentication and roles.
8. Add real AI provider adapter.
9. Add real resource upload/storage.
10. Add export/download/deploy path.

## Known Issues

- No real backend yet.
- No real authentication.
- LocalStorage is the only persistence.
- Add student is not functional.
- Student filter buttons are not functional.
- Resources can be added but not edited or deleted.
- Seeded resources are metadata only; files are not processed.
- AI is simulated and rule-based.
- Parent/guardian view is not built.
- Admin dashboard is not built.
- Attendance, behavior, and academic monitoring are not built.
- Exportable reports are not built.
- Naming is not fully resolved between SIDW/BOTE, AI Classroom Inquiry Assistant, and Inquiry Classroom.

## Future Features

### Student Hot List

- Track students close to moving from Novice to Apprentice, Apprentice to Proficient, or Proficient to Distinguished.
- Show recommended scaffolding.
- Track movement over time.
- Connect Hot List status to intervention planning.

### Teacher Resource Uploads

- Upload PDFs, DOCX, PPTX, images, charts, and other files.
- Add Google Doc, Google Slides, YouTube, and website links.
- Store visibility and shareability metadata.
- Parse resources for lesson context when allowed.

### Parent/Guardian View

- Show family-friendly progress summaries.
- Show teacher-approved resources.
- Avoid exposing sensitive internal notes.
- Offer suggestions for supporting learning at home.

### Intervention Tracking

- Track support tags, notes, and interventions.
- Connect academic, behavior, and attendance patterns.
- Show student movement between proficiency levels.
- Export intervention notes.

### AI Assistant

- Connect `aiScaffoldingEngine.js` to a server-side model provider.
- Keep rule checking before student output.
- Allow teachers to set support level and lesson boundaries.
- Track misconception signals and support usage.

### Student Profiles

- Expand reading and math placeholders.
- Add attendance, behavior, academic, and interest data.
- Add teacher notes and support plans.
- Add parent/guardian communication status.

### Attendance, Behavior, Academic Monitoring

- Add overview cards and detail panels.
- Track trends over time.
- Connect patterns to intervention planning.

### File/Resource Library

- Add file storage.
- Add resource permissions.
- Add school/district sharing.
- Add copyright/license workflow.
- Add search and tags.

### Admin Dashboard

- Show school/team trends.
- Show usage and adoption.
- Show intervention patterns.
- Show resource sharing activity.

### Authentication And Roles

- Teacher login.
- Student login or class code.
- Parent/guardian access.
- Administrator access.
- Role-based permissions.

### Database/Backend Integration

- Replace localStorage with persistent data.
- Suggested entities: users, classes, students, student profiles, lessons, activities, responses, DQB questions, resources, misconception logs, Inquiry Credit usage, intervention notes, and audit events.

### Exportable/Downloadable App Path

- Add a deployable build process or static export.
- Add instructions for packaging the app.
- Add an export/report feature for teacher data.
- Add a clear path from prototype to school pilot.
