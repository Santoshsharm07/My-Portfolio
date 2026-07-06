-- ============================================================================
-- Projects: personal vs. real-work classification  +  Freelancing services
-- ============================================================================

-- ── projects.kind ──────────────────────────────────────────────────────────
-- 'personal' = side / passion projects, 'work' = real client / company work.
alter table projects
  add column if not exists kind text not null default 'personal';

alter table projects
  drop constraint if exists projects_kind_check;
alter table projects
  add constraint projects_kind_check check (kind in ('personal', 'work'));

-- Optional richer "about" body shown on the project detail page.
alter table projects
  add column if not exists about text not null default '';

create index if not exists idx_projects_kind on projects(kind);

-- ── freelance_services ─────────────────────────────────────────────────────
-- Offerings shown in the public "Freelancing" section (replaces Kind Words).
create table if not exists freelance_services (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null default '',
  price        text not null default '',
  timeline     text not null default '',
  features     text[] not null default '{}',
  icon         text not null default '',
  cta_label    text not null default 'Start this project',
  contact_url  text,
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_freelance_published on freelance_services(is_published);
create index if not exists idx_freelance_sort on freelance_services(sort_order);

drop trigger if exists trg_freelance_services_updated on freelance_services;
create trigger trg_freelance_services_updated
  before update on freelance_services
  for each row execute function set_updated_at();

-- RLS: anon may read published offerings; writes go through the service role.
alter table freelance_services enable row level security;
drop policy if exists "anon_read_freelance_services" on freelance_services;
create policy "anon_read_freelance_services" on freelance_services
  for select to anon using (is_published = true);
