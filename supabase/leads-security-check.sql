-- Corewell Infra Developers: leads table security check and setup.
-- Run in Supabase > SQL Editor. Safe to run more than once.
-- The Edge Function adds rows with its server-only service_role key.
-- Anonymous visitors must never be able to read, add, change or delete rows directly.

-- 1. LOOK FIRST: columns, security, policies and permissions for the public role.
select
  (select json_agg(column_name || ' (' || data_type || ')' order by ordinal_position)
     from information_schema.columns where table_schema = 'public' and table_name = 'leads') as columns,
  (select relrowsecurity from pg_class where oid = 'public.leads'::regclass) as rls_enabled,
  (select json_agg(policyname || ' | ' || cmd || ' | ' || roles::text)
     from pg_policies where schemaname = 'public' and tablename = 'leads') as policies,
  (select json_agg(grantee || ': ' || privilege_type)
     from information_schema.role_table_grants
     where table_schema = 'public' and table_name = 'leads' and grantee in ('anon', 'authenticated')) as grants;
-- A healthy result:
--   columns : id, created_at, name (or full_name), phone, location
--   rls_enabled : true
--   policies : no anon/authenticated policies. NO select / update / delete policy.
--   grants : service_role: INSERT (and nothing for anon/authenticated)

-- 2. FIX the usual cause of "permission denied for table leads".
--    Since 30 May 2026 new Supabase projects do not open new tables to the browser automatically.
alter table public.leads enable row level security;
revoke insert, select, update, delete on public.leads from anon, authenticated;
grant insert on public.leads to service_role;

-- 3. Remove any old direct-browser insert policy. Review the policy name first:
-- drop policy if exists "allow_public_lead_submission" on public.leads;

-- 4. OPTIONAL hardening: the database rejects junk even if someone calls the API directly.
--    Adjust "name" to "full_name" if that is your column. Run once; it fails harmlessly if already added.
-- alter table public.leads
--   add constraint leads_name_len check (char_length(name) between 2 and 80),
--   add constraint leads_phone_fmt check (phone ~ '^(\+[0-9]{8,15}|[2-9][0-9]{9})$'),
--   add constraint leads_location_len check (char_length(location) between 2 and 100);

-- 5. If your column is called full_name and you prefer "name" (or the other way round):
-- alter table public.leads rename column full_name to name;
