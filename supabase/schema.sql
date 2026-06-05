create table if not exists public.shared_lists (
  list_id text primary key,
  entries jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_shared_lists_updated_at on public.shared_lists;
create trigger trg_shared_lists_updated_at
before update on public.shared_lists
for each row
execute function public.set_updated_at();

alter table public.shared_lists enable row level security;

drop policy if exists "shared_lists_read" on public.shared_lists;
create policy "shared_lists_read"
on public.shared_lists
for select
using (true);

drop policy if exists "shared_lists_write" on public.shared_lists;
create policy "shared_lists_write"
on public.shared_lists
for insert
with check (true);

drop policy if exists "shared_lists_update" on public.shared_lists;
create policy "shared_lists_update"
on public.shared_lists
for update
using (true)
with check (true);
