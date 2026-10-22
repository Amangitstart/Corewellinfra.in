-- Review and apply in a staging project first. This migration is not applied automatically.
alter table if exists public.leads enable row level security;

revoke select, update, delete, insert on table public.leads from anon, authenticated;

grant insert on table public.leads to service_role;

do $$
begin
  if to_regclass('public.lead_rate_limits') is null then
    create table public.lead_rate_limits (
      key_hash text primary key check (length(key_hash) = 64),
      window_start timestamptz not null,
      attempts integer not null check (attempts >= 0)
    );
    alter table public.lead_rate_limits enable row level security;
  end if;
end $$;

revoke all on table public.lead_rate_limits from anon, authenticated;

create or replace function public.consume_lead_rate_limit(
  p_key_hash text,
  p_limit integer default 5,
  p_window_seconds integer default 3600
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.lead_rate_limits%rowtype;
begin
  select * into current_row from public.lead_rate_limits where key_hash = p_key_hash for update;
  if not found then
    insert into public.lead_rate_limits(key_hash, window_start, attempts) values (p_key_hash, now(), 1);
    return true;
  end if;
  if current_row.window_start + make_interval(secs => p_window_seconds) <= now() then
    update public.lead_rate_limits set window_start = now(), attempts = 1 where key_hash = p_key_hash;
    return true;
  end if;
  if current_row.attempts >= p_limit then return false; end if;
  update public.lead_rate_limits set attempts = attempts + 1 where key_hash = p_key_hash;
  return true;
end;
$$;

revoke all on function public.consume_lead_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_lead_rate_limit(text, integer, integer) to service_role;

-- Apply the matching constraint set for the actual name column after confirming the schema.
-- alter table public.leads
--   add constraint leads_full_name_len check (char_length(full_name) between 2 and 80),
--   add constraint leads_phone_len check (char_length(phone) between 8 and 16),
--   add constraint leads_location_len check (char_length(location) between 2 and 100);
