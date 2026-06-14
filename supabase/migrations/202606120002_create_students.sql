-- classroom-ai-assistant
-- Creates student profile records for classroom support workflows.

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  student_number text,
  first_name text,
  last_name text,
  display_name text not null,
  grade_level text,
  language text not null default 'English',
  reading_level text,
  math_level text,
  support_tags text[] not null default '{}',
  status text not null default 'active',
  notes_summary text,
  school_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists students_profile_id_idx on public.students(profile_id);
create index if not exists students_school_id_idx on public.students(school_id);
create index if not exists students_grade_level_idx on public.students(grade_level);
create index if not exists students_status_idx on public.students(status);
create index if not exists students_display_name_idx on public.students(display_name);
create index if not exists students_support_tags_idx on public.students using gin(support_tags);

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
before update on public.students
for each row
execute function public.set_updated_at();

alter table public.students enable row level security;

-- Starter RLS policy placeholders. Review before enabling.
-- Teachers should select students in classes they teach.
-- Students should select only their own linked student row.
-- Admins should select/manage students scoped to their school_id.
