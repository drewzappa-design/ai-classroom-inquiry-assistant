-- classroom-ai-assistant
-- Stores local, link, text, and future Google Drive resource metadata.

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null,
  source text not null check (source in ('local', 'google_drive', 'website', 'youtube', 'text')),
  drive_file_id text,
  web_view_link text,
  download_url text,
  text_content text,
  visibility text not null default 'private' check (visibility in ('private', 'class', 'school', 'district', 'public')),
  license_status text,
  subject text,
  grade_level text,
  tags text[] not null default '{}',
  created_by uuid not null references public.profiles(id) on delete restrict,
  school_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists resources_created_by_idx on public.resources(created_by);
create index if not exists resources_school_id_idx on public.resources(school_id);
create index if not exists resources_visibility_idx on public.resources(visibility);
create index if not exists resources_source_idx on public.resources(source);
create index if not exists resources_drive_file_id_idx on public.resources(drive_file_id);
create index if not exists resources_tags_idx on public.resources using gin(tags);
create index if not exists resources_not_deleted_idx on public.resources(id) where deleted_at is null;

drop trigger if exists set_resources_updated_at on public.resources;
create trigger set_resources_updated_at
before update on public.resources
for each row
execute function public.set_updated_at();

alter table public.resources enable row level security;

-- Starter RLS policy placeholders. Review before enabling.
-- Teachers can create/select/update/delete resources where created_by = auth.uid().
-- Students can select assigned resources through resource_assignments.
-- Students can select class/school/district/public resources only when membership permits.
-- Admins can manage resources scoped to their school_id.
