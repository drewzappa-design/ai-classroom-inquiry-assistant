-- classroom-ai-assistant
-- Assigns resources to students and/or classes.

create table if not exists public.resource_assignments (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  assigned_at timestamptz not null default now(),
  removed_at timestamptz,
  check (student_id is not null or class_id is not null)
);

create index if not exists resource_assignments_resource_id_idx on public.resource_assignments(resource_id);
create index if not exists resource_assignments_student_id_idx on public.resource_assignments(student_id);
create index if not exists resource_assignments_class_id_idx on public.resource_assignments(class_id);
create index if not exists resource_assignments_assigned_by_idx on public.resource_assignments(assigned_by);
create index if not exists resource_assignments_active_idx on public.resource_assignments(id) where removed_at is null;

create unique index if not exists resource_assignments_unique_student_active_idx
on public.resource_assignments(resource_id, student_id)
where student_id is not null and removed_at is null;

create unique index if not exists resource_assignments_unique_class_active_idx
on public.resource_assignments(resource_id, class_id)
where class_id is not null and removed_at is null;

alter table public.resource_assignments enable row level security;

-- Starter RLS policy placeholders. Review before enabling.
-- Teachers can manage assignments for resources they own and classes they teach.
-- Students can select assignments where student_id maps to their profile or class membership.
-- Admins can manage assignments scoped to their school_id.
