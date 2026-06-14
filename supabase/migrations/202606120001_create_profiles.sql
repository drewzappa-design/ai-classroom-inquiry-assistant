-- classroom-ai-assistant
-- Creates app profiles tied to Supabase Auth users.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('teacher', 'student', 'admin', 'guardian')),
  school_id uuid,
  district_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_school_id_idx on public.profiles(school_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Starter RLS policy placeholders. Review before enabling.
-- create policy "profiles_select_own"
-- on public.profiles for select
-- using (id = auth.uid());
--
-- create policy "profiles_update_own"
-- on public.profiles for update
-- using (id = auth.uid())
-- with check (id = auth.uid());
