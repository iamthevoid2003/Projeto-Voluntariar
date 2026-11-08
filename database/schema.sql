-- Voluntariar schema for Supabase. PostgreSQL provides gen_random_uuid()
-- natively on supported Supabase versions; no uuid-ossp extension is needed.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (length(trim(full_name)) > 0),
  username text not null unique
    check (username ~ '^[A-Za-z0-9_.-]{3,30}$'),
  cpf text unique
    check (cpf is null or cpf ~ '^[0-9]{11}$'),
  city text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Private volunteer profile data linked to the Supabase Auth user.';

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users (id) on delete restrict,
  cnpj text unique
    check (cnpj is null or cnpj ~ '^[0-9]{14}$'),
  name text not null check (length(trim(name)) > 0),
  city text not null,
  cause text not null,
  description text not null,
  website text,
  icon text,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organizations is
  'Public organization listing and owner metadata.';

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  constraint organization_members_user_organization_unique
    unique (user_id, organization_id)
);

comment on table public.organization_members is
  'A volunteer membership or administrative relationship with an organization.';

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text not null,
  cause text not null,
  city text not null,
  slots integer not null default 1 check (slots > 0),
  schedule text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.projects is
  'Volunteer opportunities published by an organization.';

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  status text not null default 'pendente'
    check (status in ('pendente', 'aprovado', 'recusado', 'em_andamento', 'concluido')),
  applied_at timestamptz not null default now(),
  message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint volunteer_applications_user_project_unique
    unique (user_id, project_id),
  constraint volunteer_applications_message_length
    check (length(message) <= 2000)
);

comment on table public.volunteer_applications is
  'Volunteer applications and their review/status lifecycle.';

create index if not exists organizations_city_cause_idx
  on public.organizations (city, cause);
create index if not exists organization_members_organization_idx
  on public.organization_members (organization_id);
create index if not exists projects_active_cause_city_idx
  on public.projects (cause, city)
  where is_active;
create index if not exists projects_organization_created_idx
  on public.projects (organization_id, created_at desc);
create index if not exists volunteer_applications_user_date_idx
  on public.volunteer_applications (user_id, applied_at desc);
create index if not exists volunteer_applications_project_status_idx
  on public.volunteer_applications (project_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
create trigger volunteer_applications_set_updated_at
  before update on public.volunteer_applications
  for each row execute function public.set_updated_at();

-- SECURITY DEFINER avoids recursive RLS evaluation when policies check membership.
create or replace function public.is_organization_admin(organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members as membership
    where membership.organization_id = $1
      and membership.user_id = (select auth.uid())
      and membership.is_admin
  );
$$;

revoke all on function public.is_organization_admin(uuid) from public;
grant execute on function public.is_organization_admin(uuid) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.projects enable row level security;
alter table public.volunteer_applications enable row level security;

create policy "Profiles are visible to their owner"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "Users create their own profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Organizations are publicly readable"
  on public.organizations for select to anon, authenticated
  using (true);
create policy "Users create organizations they own"
  on public.organizations for insert to authenticated
  with check (created_by = (select auth.uid()));
create policy "Organization admins update their organization"
  on public.organizations for update to authenticated
  using (public.is_organization_admin(id))
  with check (public.is_organization_admin(id));
create policy "Organization admins delete their organization"
  on public.organizations for delete to authenticated
  using (public.is_organization_admin(id));

create policy "Members and organization admins can view memberships"
  on public.organization_members for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_organization_admin(organization_id)
  );
create policy "Users join organizations or owners add the first admin"
  on public.organization_members for insert to authenticated
  with check (
    (
      user_id = (select auth.uid())
      and (
        not is_admin
        or exists (
          select 1
          from public.organizations as organization
          where organization.id = organization_id
            and organization.created_by = (select auth.uid())
        )
      )
    )
    or public.is_organization_admin(organization_id)
  );
create policy "Members leave or admins remove memberships"
  on public.organization_members for delete to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_organization_admin(organization_id)
  );

create policy "Active projects are publicly readable"
  on public.projects for select to anon, authenticated
  using (is_active or public.is_organization_admin(organization_id));
create policy "Organization admins create projects"
  on public.projects for insert to authenticated
  with check (public.is_organization_admin(organization_id));
create policy "Organization admins update projects"
  on public.projects for update to authenticated
  using (public.is_organization_admin(organization_id))
  with check (public.is_organization_admin(organization_id));
create policy "Organization admins delete projects"
  on public.projects for delete to authenticated
  using (public.is_organization_admin(organization_id));

create policy "Applicants and organization admins can view applications"
  on public.volunteer_applications for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1
      from public.projects as project
      where project.id = project_id
        and public.is_organization_admin(project.organization_id)
    )
  );
create policy "Users apply to active projects as themselves"
  on public.volunteer_applications for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pendente'
    and exists (
      select 1
      from public.projects as project
      where project.id = project_id
        and project.is_active
    )
  );
create policy "Organization admins update applications"
  on public.volunteer_applications for update to authenticated
  using (
    exists (
      select 1
      from public.projects as project
      where project.id = project_id
        and public.is_organization_admin(project.organization_id)
    )
  )
  with check (
    exists (
      select 1
      from public.projects as project
      where project.id = project_id
        and public.is_organization_admin(project.organization_id)
    )
  );
create policy "Applicants delete their pending applications"
  on public.volunteer_applications for delete to authenticated
  using (user_id = (select auth.uid()) and status = 'pendente');

grant select on public.organizations, public.projects to anon, authenticated;
grant select, insert, update, delete
  on public.profiles, public.organization_members, public.volunteer_applications to authenticated;
grant insert, update, delete on public.organizations, public.projects to authenticated;
