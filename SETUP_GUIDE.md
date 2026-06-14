# Setup Guide

## Local Setup

This app currently runs as a static local demo.

From the project root:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/?role=teacher
```

Student view:

```text
http://localhost:4173/?role=student
```

The current app uses browser localStorage. Use Restart Demo in the app to reset sample data.

## Supabase Project Setup

Use the dedicated Supabase project:

```text
classroom-ai-assistant
```

Do not reuse a Supabase project from another app.

No real Supabase keys are currently stored in this repo.

## Running Migrations

Migration files are in:

```text
supabase/migrations/
```

Apply them in filename order:

1. `202606120001_create_profiles.sql`
2. `202606120002_create_students.sql`
3. `202606120003_create_classes.sql`
4. `202606120004_create_class_memberships.sql`
5. `202606120005_create_resources.sql`
6. `202606120006_create_resource_assignments.sql`
7. `202606120007_create_hotlist_items.sql`
8. `202606120008_create_student_notes.sql`

These migrations:

- create tables
- add foreign keys
- add useful indexes
- add `created_at` and `updated_at` timestamps
- add an `updated_at` trigger helper
- enable RLS
- include starter RLS policy placeholders as comments

## Auth User Setup

Before running seed data, create or map Supabase Auth users.

The seed file includes demo profile IDs that reference `auth.users(id)`. Because `profiles.id` references `auth.users(id)`, the seed file will only work if matching auth users exist or the profile IDs are adjusted.

Recommended demo users:

- Teacher: `ms.rivera@example.edu`
- Admin: `admin@example.edu`

## Seed Data Setup

Seed file:

```text
supabase/seed_demo.sql
```

Run this only after Auth users exist or after editing the profile UUIDs to match real Auth user IDs.

Seed data includes:

- Ms. Rivera teacher profile
- Demo admin profile
- Period 2 Science class
- Six demo students
- Class memberships
- Demo resources
- Resource assignments
- Hotlist items
- Student notes

## Future Google Drive Setup

Google Drive is not connected yet.

Future setup will require:

- Google Cloud project
- OAuth client ID
- Approved Drive scopes
- Google Drive Picker setup
- Workspace permission decisions
- Shared folder or Shared Drive strategy
- Supabase storage of Drive file metadata

The current scaffold lives in `GoogleDriveProvider`.

## Environment Variables Needed Later

Supabase:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Google Drive:

```text
GOOGLE_CLIENT_ID=
GOOGLE_API_KEY=
GOOGLE_DRIVE_PICKER_APP_ID=
```

Do not commit real keys to this repo.

## Provider Defaults

Current active provider:

```text
LocalResourceProvider
```

Scaffolded future providers:

```text
SupabaseResourceProvider
GoogleDriveProvider
```

Do not switch the active provider until migrations, auth, seed data, RLS, and provider parity are ready.
