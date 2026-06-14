-- classroom-ai-assistant
-- Stores student profile notes and intervention timeline entries.

create table if not exists public.student_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  note text not null,
  intervention_type text,
  visibility text not null default 'teacher_private' check (visibility in ('teacher_private', 'team_visible', 'admin_visible')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists student_notes_student_id_idx on public.student_notes(student_id);
create index if not exists student_notes_class_id_idx on public.student_notes(class_id);
create index if not exists student_notes_teacher_id_idx on public.student_notes(teacher_id);
create index if not exists student_notes_visibility_idx on public.student_notes(visibility);
create index if not exists student_notes_not_deleted_idx on public.student_notes(id) where deleted_at is null;

drop trigger if exists set_student_notes_updated_at on public.student_notes;
create trigger set_student_notes_updated_at
before update on public.student_notes
for each row
execute function public.set_updated_at();

alter table public.student_notes enable row level security;

-- Starter RLS policy placeholders. Review before enabling.
-- Teachers can manage notes for students in classes they teach.
-- Co-teachers/support staff can view team_visible notes when membership permits.
-- Students should not select teacher_private notes.
-- Admins can view admin_visible notes scoped to their school_id.
