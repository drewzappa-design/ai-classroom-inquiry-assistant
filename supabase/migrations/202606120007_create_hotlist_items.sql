-- classroom-ai-assistant
-- Tracks intervention/hotlist planning.

create table if not exists public.hotlist_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'resolved', 'paused')),
  priority text,
  target_level text,
  reason text,
  support_notes text,
  inquiry_credit_percent numeric check (inquiry_credit_percent is null or (inquiry_credit_percent >= 0 and inquiry_credit_percent <= 100)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists hotlist_items_student_id_idx on public.hotlist_items(student_id);
create index if not exists hotlist_items_class_id_idx on public.hotlist_items(class_id);
create index if not exists hotlist_items_teacher_id_idx on public.hotlist_items(teacher_id);
create index if not exists hotlist_items_status_idx on public.hotlist_items(status);

create unique index if not exists hotlist_items_unique_active_idx
on public.hotlist_items(student_id, class_id, teacher_id)
where status = 'active';

drop trigger if exists set_hotlist_items_updated_at on public.hotlist_items;
create trigger set_hotlist_items_updated_at
before update on public.hotlist_items
for each row
execute function public.set_updated_at();

alter table public.hotlist_items enable row level security;

-- Starter RLS policy placeholders. Review before enabling.
-- Teachers can manage hotlist items for students in classes they teach.
-- Students should not select teacher planning hotlist rows by default.
-- Admins can view/manage hotlist items scoped to their school_id.
