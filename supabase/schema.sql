-- Draft PostgreSQL/Supabase schema for the bug tracker.
-- Run only after reviewing project requirements and enabling RLS in a Supabase project.

create type public.app_role as enum ('admin', 'engineer', 'pm');
create type public.ticket_status as enum ('Open', 'In Progress', 'Review', 'Resolved');
create type public.ticket_priority as enum ('Critical', 'High', 'Medium', 'Low');

create sequence public.ticket_number_seq start 1043;
create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.app_role not null default 'engineer',
  created_at timestamptz not null default now()
);

create table public.tickets (
  id text primary key default ('BUG-' || nextval('public.ticket_number_seq')),
  title text not null,
  description text not null,
  status public.ticket_status not null default 'Open',
  priority public.ticket_priority not null default 'Medium',
  project text not null default 'Core App',
  reporter_id uuid references public.profiles(id),
  reporter_name text not null,
  assignee_id uuid references public.profiles(id),
  assignee_name text,
  due_date date,
  activity text not null default 'Created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    'engineer'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.tickets enable row level security;

create policy "profiles can read authenticated profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can read tickets"
  on public.tickets for select
  to authenticated
  using (true);

create policy "admins and PMs can create tickets"
  on public.tickets for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'pm')
    )
  );

create policy "admins and PMs can update tickets"
  on public.tickets for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'pm')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'pm')
    )
  );

create policy "assigned engineers can update their tickets"
  on public.tickets for update
  to authenticated
  using (assignee_id = auth.uid())
  with check (assignee_id = auth.uid());

create policy "admins can delete tickets"
  on public.tickets for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
