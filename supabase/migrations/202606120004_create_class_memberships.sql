-- classroom-ai-assistant
-- Connects users and students to classes.

create table if not exists public.class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  member_role text not null check (member_role in ('teacher', 'co_teacher', 'student', 'support_staff')),
  created_at timestamptz not null default now(),
  check (student_id is not null or profile_id is not null)
);

create index if not exists class_memberships_class_id_idx on public.class_memberships(class_id);
create index if not exists class_memberships_student_id_idx on public.class_memberships(student_id);
create index if not exists class_memberships_profile_id_idx on public.class_memberships(profile_id);
create index if not exists class_memberships_member_role_idx on public.class_memberships(member_role);

create unique index if not exists class_memberships_unique_student_idx
on public.class_memberships(class_id, student_id)
where student_id is not null;

create unique index if not exists class_memberships_unique_profile_role_idx
on public.class_memberships(class_id, profile_id, member_role)
where profile_id is not null;

alter table public.class_memberships enable row level security;

-- Starter RLS policy placeholders. Review before enabling.
-- Teachers can manage memberships for classes they own.
-- Students can view their own class memberships.
-- Admins can manage memberships scoped to their school_id.
