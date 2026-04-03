-- Migration: 00005_fix_profile_foreign_keys
-- Fixes the foreign keys on rsvps.user_id and comments.user_id to reference
-- public.profiles instead of auth.users.
--
-- Why: PostgREST resolves nested joins by following FK relationships within the
-- public schema. When rsvps.user_id and comments.user_id point to auth.users
-- (outside public), PostgREST cannot navigate to public.profiles, so the query
-- `.select('*, rsvps(user_id, profiles(display_name)), comments(..., profiles(display_name)))`
-- returns an ambiguous relationship error — silently swallowed, data becomes null.
--
-- Since public.profiles.id is a 1:1 mirror of auth.users.id (auto-created via
-- trigger on sign-up), redirecting the FK to public.profiles is safe for all
-- existing data and gives PostgREST a resolvable path.

-- Fix rsvps: drop auth.users FK, add public.profiles FK
alter table public.rsvps
  drop constraint rsvps_user_id_fkey,
  add constraint rsvps_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

-- Fix comments: drop auth.users FK, add public.profiles FK
alter table public.comments
  drop constraint comments_user_id_fkey,
  add constraint comments_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;
