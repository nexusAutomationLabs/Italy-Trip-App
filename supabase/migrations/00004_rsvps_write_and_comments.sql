-- Migration: 00004_rsvps_write_and_comments
-- Adds RSVP write policies, events write policies, and the comments table.

-- RSVP write policies (table exists from Phase 2 with read-only RLS)
create policy "Users can insert own rsvps" on public.rsvps
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own rsvps" on public.rsvps
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Events: allow authenticated users to insert
create policy "Users can insert events" on public.events
  for insert to authenticated
  with check ((select auth.uid()) = created_by);

-- Events: allow authenticated users to update (ownership enforced in server action)
create policy "Users can update events" on public.events
  for update to authenticated
  using (true);

-- Events: allow authenticated users to delete (ownership enforced in server action)
create policy "Users can delete events" on public.events
  for delete to authenticated
  using (true);

-- Comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  content text not null check (char_length(content) between 1 and 500),
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Authenticated users can read comments" on public.comments
  for select to authenticated using (true);

create policy "Users can insert own comments" on public.comments
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own comments" on public.comments
  for delete to authenticated
  using ((select auth.uid()) = user_id);
