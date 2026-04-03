-- Migration: 00001_create_profiles_table
-- Creates the profiles table synced from auth.users on sign-up.
-- This is applied in the Supabase Dashboard -> SQL Editor.

-- Create profiles table (synced from auth.users on sign-up)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  updated_at timestamp with time zone
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- All authenticated users can view all profiles (needed for attendee lists)
create policy "Users can view all profiles" on public.profiles
  for select using (true);

-- Users can only update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger function: auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

-- Attach trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
