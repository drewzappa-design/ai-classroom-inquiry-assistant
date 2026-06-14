# Project Status

## Current Architecture

`classroom-ai-assistant` is currently a local-first browser demo using static files:

- `index.html` loads the app.
- `data.js` provides demo students, lesson data, resources, and setup defaults.
- `app.js` renders the teacher and student experiences.
- `resource-providers.js` contains the provider layer.
- `styles.css` controls the current visual design.

The active data provider is still `LocalResourceProvider`, backed by browser localStorage. Google Drive and Supabase are scaffolded but not live.

## Working Features

- Teacher dashboard with clickable cards and detail panels.
- Student support screen with filters and clickable student rows.
- Student profile page with notes, hotlist status, assigned resources, and quick actions.
- Add student form.
- Add resource form and resource library.
- Resource viewer for PDFs, images, websites, YouTube links, Google-style links, and plain text resources.
- Student-facing resource portal showing assigned and shared resources.
- Restart Demo flow with confirmation.
- Documentation and planning files for future sessions.

## Resource System Status

Working now:

- Local resources are stored in localStorage.
- Resources normalize into backend-ready metadata fields.
- Teachers can add local/link/text resources.
- Teachers can open, edit, delete, share, and unshare resources.
- Students can see resources assigned to them or shared with class/school/district/public visibility.
- Resource assignments are tracked on student records and mirrored into resource metadata.

Provider status:

- `LocalResourceProvider`: active default provider.
- `GoogleDriveProvider`: scaffold only.
- `SupabaseResourceProvider`: scaffold only.

## Hotlist Status

Working now:

- Hot List dashboard card opens the Hot List panel.
- Hot List panel shows tagged students.
- Hot List students can open their full student profiles.
- Student profile includes hotlist status, priority, date, reason, and edit actions.
- Hotlist data is still localStorage-backed.

## Google Drive Integration Status

Scaffolded but not connected.

Ready pieces:

- `GoogleDriveProvider` exists.
- Placeholder methods exist for authentication, Drive Picker, upload, list, open, share, and delete.
- Resource metadata includes `source`, `driveFileId`, `webViewLink`, and `downloadUrl`.
- `GOOGLE_DRIVE_INTEGRATION.md` documents the future connection path.

Not implemented yet:

- OAuth
- Google Drive Picker
- Drive API calls
- Workspace permission mapping
- Drive file metadata persistence in Supabase

## Supabase Integration Status

Scaffolded but not connected.

Ready pieces:

- `SupabaseResourceProvider` exists.
- Placeholder methods exist for auth, resources, assignments, classes, students, and hotlist items.
- SQL migrations exist in `supabase/migrations/`.
- Demo seed file exists at `supabase/seed_demo.sql`.
- `SUPABASE_SCHEMA.md` documents tables, fields, indexes, and RLS planning.

Not implemented yet:

- Supabase keys/config
- Supabase client
- Live API calls
- Real auth sessions
- Active RLS policies
- Data migration from localStorage to Supabase

## Known Limitations

- Data currently persists only in browser localStorage.
- Local file uploads use browser data URLs, which are demo-friendly but not production storage.
- Supabase seed data requires matching Supabase Auth users before it can run cleanly.
- RLS policies are placeholders/comments and must be reviewed before activation.
- Google Drive integration is structural only.
- No production authentication or role enforcement exists yet.
- No parent/guardian portal exists yet.

## Remaining Roadmap

1. Review Supabase migrations and schema.
2. Apply migrations to the dedicated `classroom-ai-assistant` Supabase project.
3. Create demo Auth users and run seed data.
4. Add safe environment config for Supabase URL and anon key.
5. Implement a Supabase client wrapper.
6. Connect `SupabaseResourceProvider` behind a feature flag.
7. Validate localStorage and Supabase parity.
8. Add real RLS policies.
9. Add Google Drive OAuth and Picker.
10. Store Google Drive metadata in Supabase resources.
