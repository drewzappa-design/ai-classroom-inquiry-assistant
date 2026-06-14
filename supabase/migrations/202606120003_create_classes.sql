-- classroom-ai-assistant
-- Creates classroom/course sections.

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text,
  grade_level text,
  period text,
  school_id uuid,
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists classes_teacher_id_idx on public.classes(teacher_id);
create index if not exists classes_school_id_idx on public.classes(school_id);
create index if not exists classes_grade_level_idx on public.classes(grade_level);

drop trigger if exists set_classes_updated_at on public.classes;
create trigger set_classes_updated_at
before update on public.classes
for each row
execute function public.set_updated_at();

alter table public.classes enable row level security;

-- Starter RLS policy placeholders. Review before enabling.
-- Teachers can manage classes where teacher_id = auth.uid().
-- Co-teachers/support staff can view classes through class_memberships.
-- Admins can manage classes scoped to their school_id.
