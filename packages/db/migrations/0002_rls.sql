-- ============================================================================
-- Row Level Security
-- Public (anon) may READ published content only. All writes go through the
-- API using the service-role key, which bypasses RLS.
-- ============================================================================

alter table media            enable row level security;
alter table site_settings    enable row level security;
alter table hero             enable row level security;
alter table about            enable row level security;
alter table experience       enable row level security;
alter table projects         enable row level security;
alter table case_studies     enable row level security;
alter table skills           enable row level security;
alter table certifications   enable row level security;
alter table resume           enable row level security;
alter table testimonials     enable row level security;
alter table contact_messages enable row level security;
alter table seo_meta         enable row level security;

-- Helper to (re)create a simple anon SELECT policy -----------------------------
-- Always-readable reference/content tables
do $$
declare t text;
begin
  foreach t in array array[
    'media','site_settings','hero','about','experience','skills',
    'certifications','resume','seo_meta'
  ]
  loop
    execute format('drop policy if exists "anon_read_%1$s" on %1$s;', t);
    execute format(
      'create policy "anon_read_%1$s" on %1$s
         for select to anon using (true);', t);
  end loop;
end $$;

-- Published-only content
drop policy if exists "anon_read_projects" on projects;
create policy "anon_read_projects" on projects
  for select to anon using (is_published = true);

drop policy if exists "anon_read_case_studies" on case_studies;
create policy "anon_read_case_studies" on case_studies
  for select to anon using (
    exists (select 1 from projects p
            where p.id = case_studies.project_id and p.is_published)
  );

drop policy if exists "anon_read_testimonials" on testimonials;
create policy "anon_read_testimonials" on testimonials
  for select to anon using (is_published = true);

-- Public may INSERT contact messages, never read them.
drop policy if exists "anon_insert_messages" on contact_messages;
create policy "anon_insert_messages" on contact_messages
  for insert to anon with check (true);
