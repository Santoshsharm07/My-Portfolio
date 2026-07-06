-- ============================================================================
-- Portfolio Platform — initial schema
-- Conventions: uuid PKs, timestamptz created/updated, sort_order, is_published
-- ============================================================================

create extension if not exists "pgcrypto";

-- Auto-update updated_at on row change ---------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─────────────────────────────── media ─────────────────────────────────────
create table if not exists media (
  id            uuid primary key default gen_random_uuid(),
  file_name     text not null,
  storage_path  text not null,
  public_url    text not null,
  mime_type     text not null,
  width         integer,
  height        integer,
  size_bytes    integer not null default 0,
  alt           text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ────────────────────────── site_settings (singleton) ──────────────────────
create table if not exists site_settings (
  id            uuid primary key default gen_random_uuid(),
  brand_name    text not null default 'Your Name',
  tagline       text not null default '',
  email         text,
  location      text not null default '',
  availability  text not null default '',
  socials       jsonb not null default '[]'::jsonb,
  theme         text not null default 'dark-lux',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─────────────────────────────── hero (singleton) ──────────────────────────
create table if not exists hero (
  id                    uuid primary key default gen_random_uuid(),
  headline              text not null default '',
  subheadline           text not null default '',
  roles                 jsonb not null default '[]'::jsonb,
  cta_label             text not null default 'View work',
  cta_href              text not null default '#projects',
  secondary_cta_label   text,
  secondary_cta_href    text,
  background_media_id   uuid references media(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─────────────────────────────── about (singleton) ─────────────────────────
create table if not exists about (
  id                 uuid primary key default gen_random_uuid(),
  heading            text not null default '',
  body               text not null default '',
  portrait_media_id  uuid references media(id) on delete set null,
  stats              jsonb not null default '[]'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ──────────────────────────────── experience ───────────────────────────────
create table if not exists experience (
  id            uuid primary key default gen_random_uuid(),
  company       text not null,
  role          text not null,
  location      text not null default '',
  start_date    text not null,
  end_date      text,
  is_current    boolean not null default false,
  description   text not null default '',
  logo_media_id uuid references media(id) on delete set null,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ──────────────────────────────── projects ─────────────────────────────────
create table if not exists projects (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text not null unique,
  summary        text not null default '',
  cover_media_id uuid references media(id) on delete set null,
  tags           text[] not null default '{}',
  role           text not null default '',
  year           integer,
  live_url       text,
  repo_url       text,
  is_featured    boolean not null default false,
  is_published   boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_projects_published on projects(is_published);
create index if not exists idx_projects_sort on projects(sort_order);

-- ─────────────────────────────── case_studies ──────────────────────────────
create table if not exists case_studies (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  overview    text not null default '',
  problem     text not null default '',
  solution    text not null default '',
  results     text not null default '',
  gallery     jsonb not null default '[]'::jsonb,
  sections    jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (project_id)
);

-- ──────────────────────────────── skills ───────────────────────────────────
do $$ begin
  create type skill_category as enum
    ('frontend','backend','design','devops','mobile','tools','other');
exception when duplicate_object then null; end $$;

create table if not exists skills (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      skill_category not null default 'other',
  proficiency   integer not null default 80 check (proficiency between 0 and 100),
  icon_media_id uuid references media(id) on delete set null,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ────────────────────────────── certifications ─────────────────────────────
create table if not exists certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text not null,
  issue_date     text,
  credential_id  text,
  credential_url text,
  file_media_id  uuid references media(id) on delete set null,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ──────────────────────────────── resume ───────────────────────────────────
create table if not exists resume (
  id            uuid primary key default gen_random_uuid(),
  label         text not null default 'Resume',
  file_media_id uuid references media(id) on delete set null,
  version       text not null default '1',
  is_active     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
-- only one active resume at a time
create unique index if not exists uniq_resume_active
  on resume(is_active) where is_active = true;

-- ────────────────────────────── testimonials ───────────────────────────────
create table if not exists testimonials (
  id               uuid primary key default gen_random_uuid(),
  author_name      text not null,
  author_role      text not null default '',
  author_company   text not null default '',
  avatar_media_id  uuid references media(id) on delete set null,
  quote            text not null,
  rating           integer not null default 5 check (rating between 1 and 5),
  sort_order       integer not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ───────────────────────────── contact_messages ────────────────────────────
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null default '',
  message     text not null,
  is_read     boolean not null default false,
  ip          text,
  user_agent  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_messages_unread on contact_messages(is_read);

-- ──────────────────────────────── seo_meta ─────────────────────────────────
create table if not exists seo_meta (
  id                 uuid primary key default gen_random_uuid(),
  page_key           text not null unique,
  title              text not null default '',
  description        text not null default '',
  keywords           text[] not null default '{}',
  og_image_media_id  uuid references media(id) on delete set null,
  canonical          text,
  json_ld            jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─────────────────────── updated_at triggers (all tables) ───────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'media','site_settings','hero','about','experience','projects',
    'case_studies','skills','certifications','resume','testimonials',
    'contact_messages','seo_meta'
  ]
  loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s;
       create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at();', t);
  end loop;
end $$;
