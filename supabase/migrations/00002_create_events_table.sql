-- Migration: 00002_create_events_table
-- Creates the events table with event_category enum and rsvps table with RLS policies.
-- This is applied in the Supabase Dashboard -> SQL Editor.

-- Event category enum
create type event_category as enum ('dinner', 'excursion', 'group_activity', 'travel', 'open_day');

-- Events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  category event_category not null,
  location_name text,
  location_url text,
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

-- Enable Row Level Security on events
alter table public.events enable row level security;

-- All authenticated users can read events
create policy "Authenticated users can read events" on public.events
  for select to authenticated using (true);

-- RSVPs table (Phase 3 adds write policies)
create table public.rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

-- Enable Row Level Security on rsvps
alter table public.rsvps enable row level security;

-- All authenticated users can read rsvps
create policy "Authenticated users can read rsvps" on public.rsvps
  for select to authenticated using (true);
