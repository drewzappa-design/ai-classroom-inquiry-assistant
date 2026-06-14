# Supabase Schema Plan

## Project

Dedicated Supabase project: `classroom-ai-assistant`

No live Supabase URL, anon key, OAuth, or API calls are configured yet. The app should keep using `LocalResourceProvider` until Supabase auth, tables, seed data, and RLS policies are ready.

Config placeholders for later:

- `SUPABASE_URL`: classroom-ai-assistant project URL
- `SUPABASE_ANON_KEY`: classroom-ai-assistant anon public key

## Design Goals

- Preserve the current localStorage demo until backend parity is ready.
- Support teachers, students, admins, and future parent/guardian views.
- Store resources in a way that supports local uploads, text resources, links, Google Drive metadata, and future file storage.
- Keep student access controlled through assignments, class membership, and visibility.
- Enable Row Level Security on every student/resource-related table.

## Tables

### `profiles`

Purpose:
App-level user profile tied to Supabase Auth. This is the base record for teachers, students, admins, and future guardians.

Primary key:
- `id` uuid primary key, references `auth.users(id)` on delete cascade

Suggested fields:
- `email` text not null
- `full_name` text
- `role` text not null check in `teacher`, `student`, `admin`, `guardian`
- `school_id` uuid nullable
- `district_id` uuid nullable
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

Foreign keys:
- `id` references `auth.users(id)`

Basic indexes:
- `profiles_email_idx` on `email`
- `profiles_role_idx` on `role`
- `profiles_school_id_idx` on `school_id`

### `students`

Purpose:
Student records used by teacher dashboards, profiles, hotlists, notes, and resource assignments.

Primary key:
- `id` uuid primary key default `gen_random_uuid()`

Suggested fields:
- `profile_id` uuid nullable
- `student_number` text nullable
- `first_name` text
- `last_name` text
- `display_name` text not null
- `grade_level` text
- `language` text default `English`
- `reading_level` text nullable
- `math_level` text nullable
- `support_tags` text[] default empty array
- `status` text default `active`
- `notes_summary` text nullable
- `school_id` uuid nullable
- `created_by` uuid nullable
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

Foreign keys:
- `profile_id` references `profiles(id)` on delete set null
- `created_by` references `profiles(id)` on delete set null

Basic indexes:
- `students_profile_id_idx` on `profile_id`
- `students_school_id_idx` on `school_id`
- `students_grade_level_idx` on `grade_level`
- `students_status_idx` on `status`
- `students_display_name_idx` on `display_name`

### `classes`

Purpose:
Classroom/course sections owned by teachers and managed by admins.

Primary key:
- `id` uuid primary key default `gen_random_uuid()`

Suggested fields:
- `name` text not null
- `subject` text
- `grade_level` text
- `period` text nullable
- `school_id` uuid nullable
- `teacher_id` uuid not null
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

Foreign keys:
- `teacher_id` references `profiles(id)` on delete restrict

Basic indexes:
- `classes_teacher_id_idx` on `teacher_id`
- `classes_school_id_idx` on `school_id`
- `classes_grade_level_idx` on `grade_level`

### `class_memberships`

Purpose:
Connects students, teachers, co-teachers, and support staff to classes.

Primary key:
- `id` uuid primary key default `gen_random_uuid()`

Suggested fields:
- `class_id` uuid not null
- `student_id` uuid nullable
- `profile_id` uuid nullable
- `member_role` text not null check in `teacher`, `co_teacher`, `student`, `support_staff`
- `created_at` timestamptz default now()

Foreign keys:
- `class_id` references `classes(id)` on delete cascade
- `student_id` references `students(id)` on delete cascade
- `profile_id` references `profiles(id)` on delete cascade

Basic indexes:
- `class_memberships_class_id_idx` on `class_id`
- `class_memberships_student_id_idx` on `student_id`
- `class_memberships_profile_id_idx` on `profile_id`
- unique partial index on `class_id, student_id` where `student_id is not null`
- unique partial index on `class_id, profile_id, member_role` where `profile_id is not null`

### `resources`

Purpose:
Stores teacher-created resources, links, text resources, local-upload metadata, and future Google Drive file metadata.

Primary key:
- `id` uuid primary key default `gen_random_uuid()`

Suggested fields:
- `title` text not null
- `description` text nullable
- `type` text not null
- `source` text not null check in `local`, `google_drive`, `website`, `youtube`, `text`
- `drive_file_id` text nullable
- `web_view_link` text nullable
- `download_url` text nullable
- `text_content` text nullable
- `visibility` text not null default `private` check in `private`, `class`, `school`, `district`, `public`
- `license_status` text nullable
- `subject` text nullable
- `grade_level` text nullable
- `tags` text[] default empty array
- `created_by` uuid not null
- `school_id` uuid nullable
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()
- `deleted_at` timestamptz nullable

Foreign keys:
- `created_by` references `profiles(id)` on delete restrict

Basic indexes:
- `resources_created_by_idx` on `created_by`
- `resources_school_id_idx` on `school_id`
- `resources_visibility_idx` on `visibility`
- `resources_source_idx` on `source`
- `resources_drive_file_id_idx` on `drive_file_id`
- GIN index on `tags`
- partial index on `deleted_at` where `deleted_at is null`

### `resource_assignments`

Purpose:
Connects resources to individual students and/or classes.

Primary key:
- `id` uuid primary key default `gen_random_uuid()`

Suggested fields:
- `resource_id` uuid not null
- `student_id` uuid nullable
- `class_id` uuid nullable
- `assigned_by` uuid not null
- `assigned_at` timestamptz default now()
- `removed_at` timestamptz nullable

Foreign keys:
- `resource_id` references `resources(id)` on delete cascade
- `student_id` references `students(id)` on delete cascade
- `class_id` references `classes(id)` on delete cascade
- `assigned_by` references `profiles(id)` on delete restrict

Basic indexes:
- `resource_assignments_resource_id_idx` on `resource_id`
- `resource_assignments_student_id_idx` on `student_id`
- `resource_assignments_class_id_idx` on `class_id`
- `resource_assignments_assigned_by_idx` on `assigned_by`
- partial index on `removed_at` where `removed_at is null`
- unique partial index on `resource_id, student_id` where `student_id is not null and removed_at is null`
- unique partial index on `resource_id, class_id` where `class_id is not null and removed_at is null`

### `hotlist_items`

Purpose:
Tracks teacher intervention planning, support priority, target levels, and Inquiry Credit allocation for students.

Primary key:
- `id` uuid primary key default `gen_random_uuid()`

Suggested fields:
- `student_id` uuid not null
- `class_id` uuid nullable
- `teacher_id` uuid not null
- `status` text not null default `active` check in `active`, `resolved`, `paused`
- `priority` text nullable
- `target_level` text nullable
- `reason` text
- `support_notes` text nullable
- `inquiry_credit_percent` numeric nullable
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()
- `resolved_at` timestamptz nullable

Foreign keys:
- `student_id` references `students(id)` on delete cascade
- `class_id` references `classes(id)` on delete cascade
- `teacher_id` references `profiles(id)` on delete restrict

Basic indexes:
- `hotlist_items_student_id_idx` on `student_id`
- `hotlist_items_class_id_idx` on `class_id`
- `hotlist_items_teacher_id_idx` on `teacher_id`
- `hotlist_items_status_idx` on `status`
- unique partial index on `student_id, class_id, teacher_id` where `status = 'active'`

### `student_notes`

Purpose:
Stores teacher notes and intervention timeline entries for student profiles.

Primary key:
- `id` uuid primary key default `gen_random_uuid()`

Suggested fields:
- `student_id` uuid not null
- `class_id` uuid nullable
- `teacher_id` uuid not null
- `note` text not null
- `intervention_type` text nullable
- `visibility` text not null default `teacher_private` check in `teacher_private`, `team_visible`, `admin_visible`
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()
- `deleted_at` timestamptz nullable

Foreign keys:
- `student_id` references `students(id)` on delete cascade
- `class_id` references `classes(id)` on delete cascade
- `teacher_id` references `profiles(id)` on delete restrict

Basic indexes:
- `student_notes_student_id_idx` on `student_id`
- `student_notes_class_id_idx` on `class_id`
- `student_notes_teacher_id_idx` on `teacher_id`
- `student_notes_visibility_idx` on `visibility`
- partial index on `deleted_at` where `deleted_at is null`

## Row Level Security Plan

Enable RLS on:

- `profiles`
- `students`
- `classes`
- `class_memberships`
- `resources`
- `resource_assignments`
- `hotlist_items`
- `student_notes`

### Teacher Policies

Future policies:

- Teachers can select and update their own `profiles` row.
- Teachers can manage `classes` where `teacher_id = auth.uid()` or where they have a `class_memberships` row with `member_role in ('teacher', 'co_teacher')`.
- Teachers can view students enrolled in their classes.
- Teachers can create resources where `created_by = auth.uid()`.
- Teachers can update/delete resources they created.
- Teachers can assign resources to students/classes they teach.
- Teachers can manage `hotlist_items` and `student_notes` for students in their classes.

### Student Policies

Future policies:

- Students can select their own profile/student record.
- Students can view resources directly assigned to them through `resource_assignments`.
- Students can view resources assigned to one of their classes when resource `visibility in ('class', 'school', 'district', 'public')`.
- Students can view school/district/public resources only when their membership/school context permits it.
- Students cannot create, update, or delete teacher resources.
- Students cannot view teacher-private notes or hotlist planning records.

### Admin Policies

Future policies:

- Admins can manage profiles, students, classes, memberships, and resources scoped to their `school_id`.
- Admins can view school-level shared resources.
- Admins can audit assignment, sharing, hotlist, and student note records.
- District admins can manage district-level shared resources after a `district_id` policy layer exists.

## Next Supabase Steps

1. In the `classroom-ai-assistant` Supabase project, apply the migration files in `supabase/migrations/`.
2. Review the commented starter RLS policy placeholders before enabling live policies.
3. Create or map demo Supabase Auth users before running `supabase/seed_demo.sql`, because `profiles.id` references `auth.users(id)`.
4. Run `supabase/seed_demo.sql` only after auth/profile IDs are ready.
5. Add app config support for `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
6. Create a real Supabase client wrapper.
7. Replace scaffold methods in `SupabaseResourceProvider` with live queries only after local provider parity is confirmed.

## Migration Files

- `supabase/migrations/202606120001_create_profiles.sql`
- `supabase/migrations/202606120002_create_students.sql`
- `supabase/migrations/202606120003_create_classes.sql`
- `supabase/migrations/202606120004_create_class_memberships.sql`
- `supabase/migrations/202606120005_create_resources.sql`
- `supabase/migrations/202606120006_create_resource_assignments.sql`
- `supabase/migrations/202606120007_create_hotlist_items.sql`
- `supabase/migrations/202606120008_create_student_notes.sql`

## Demo Seed

- `supabase/seed_demo.sql`

The seed file mirrors the current local demo as closely as possible, including Ms. Rivera, Period 2 Science, six demo students, sample resources, initial assignments, hotlist items, and student notes.
