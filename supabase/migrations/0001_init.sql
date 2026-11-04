-- Schema from schema.md, with row-level security for Spine 1.
-- users.id is uuid because auth.users.id is uuid. schema.md calls that same id text.
-- Policies on user-owned tables are user_id = auth.uid() (users uses id = auth.uid()).

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table public.companies (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users (id) on delete cascade,
  name text,
  website text,
  description text,
  source text,
  status text,
  created_at timestamptz not null default now(),
  constraint companies_status_check check (
    status is null
    or status in (
      'Researching',
      'Reaching out',
      'Applied',
      'Interviewing',
      'Offer',
      'Closed'
    )
  )
);

create table public.people (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users (id) on delete cascade,
  company_id bigint references public.companies (id) on delete set null,
  name text,
  email text,
  email_verified boolean not null default false,
  title text,
  how_met text,
  tags text,
  follow_up_date date
);

create table public.interactions (
  id bigint generated always as identity primary key,
  person_id bigint not null references public.people (id) on delete cascade,
  date date,
  source text,
  summary text,
  constraint interactions_source_check check (
    source is null or source in ('email', 'linkedin', 'in-person', 'zoom')
  )
);

create table public.reminders (
  id bigint generated always as identity primary key,
  person_id bigint not null references public.people (id) on delete cascade,
  due_date date,
  note text,
  done boolean not null default false
);

create table public.stars (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users (id) on delete cascade,
  company_id bigint not null references public.companies (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, company_id)
);

create index companies_user_id_idx on public.companies (user_id);
create index people_user_id_idx on public.people (user_id);
create index people_company_id_idx on public.people (company_id);
create index interactions_person_id_idx on public.interactions (person_id);
create index reminders_person_id_idx on public.reminders (person_id);

alter table public.users enable row level security;
alter table public.companies enable row level security;
alter table public.people enable row level security;
alter table public.interactions enable row level security;
alter table public.reminders enable row level security;
alter table public.stars enable row level security;

create policy "users_select_own"
  on public.users
  for select
  to authenticated
  using (id = auth.uid());

create policy "users_insert_own"
  on public.users
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "users_update_own"
  on public.users
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "companies_own"
  on public.companies
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "people_own"
  on public.people
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "stars_own"
  on public.stars
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- interactions and reminders have no user_id. Own them through the person.
create policy "interactions_own"
  on public.interactions
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.people
      where people.id = interactions.person_id
        and people.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.people
      where people.id = interactions.person_id
        and people.user_id = auth.uid()
    )
  );

create policy "reminders_own"
  on public.reminders
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.people
      where people.id = reminders.person_id
        and people.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.people
      where people.id = reminders.person_id
        and people.user_id = auth.uid()
    )
  );

grant select, insert, update on public.users to authenticated;
grant select, insert, update, delete on public.companies to authenticated;
grant select, insert, update, delete on public.people to authenticated;
grant select, insert, update, delete on public.interactions to authenticated;
grant select, insert, update, delete on public.reminders to authenticated;
grant select, insert, update, delete on public.stars to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
