-- Fresh Start Academy / Diment & Associates
-- Desk Pet Requests Table Schema
--
-- Run this in your Supabase SQL Editor to create the desk_pet_requests table.
-- This supports the free desk pet widget on the firm site and the admin queue.

-- ── Table ─────────────────────────────────────────────────────────────
create table if not exists public.desk_pet_requests (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  mailing_address text not null,
  status          text not null default 'pending' check (status in ('pending', 'fulfilled', 'canceled')),
  notes           text,
  created_at      timestamptz not null default now(),
  fulfilled_at    timestamptz
);

-- ── Indexes ───────────────────────────────────────────────────────────
create index if not exists idx_desk_pet_requests_status
  on public.desk_pet_requests (status);

create index if not exists idx_desk_pet_requests_created_at
  on public.desk_pet_requests (created_at desc);

-- ── Row Level Security ────────────────────────────────────────────────
alter table public.desk_pet_requests enable row level security;

-- The API route uses the service role key, so it bypasses RLS for inserts.
-- For the admin page using the anon key, we need a policy allowing reads/updates.
-- For now, we allow anon reads/updates because the admin page uses a passphrase
-- gate on the frontend. When you add proper auth, tighten this to authenticated
-- admin users only.

drop policy if exists "Anon can read desk pet requests" on public.desk_pet_requests;
create policy "Anon can read desk pet requests"
  on public.desk_pet_requests
  for select
  using (true);

drop policy if exists "Anon can update desk pet requests" on public.desk_pet_requests;
create policy "Anon can update desk pet requests"
  on public.desk_pet_requests
  for update
  using (true);

-- Note: Inserts are done via the API route using the service_role key,
-- so no insert policy is needed for the anon role.

-- ── Recommended: Add proper auth later ────────────────────────────────
-- When you're ready, replace the "using (true)" policies above with:
--   using (auth.role() = 'authenticated' and auth.jwt() ->> 'email' in (
--     select email from public.firm_admins
--   ))
-- and create a firm_admins table with the authorized admin emails.
