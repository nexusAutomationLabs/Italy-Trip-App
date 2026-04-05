---
phase: 04-polish-and-comments
plan: "04"
subsystem: media-uploads
tags: [storage, avatar, cover-photo, google-maps, profile]
dependency_graph:
  requires: ["04-01", "04-02", "04-03"]
  provides: [avatar-upload, event-cover-upload, profile-modal, google-maps-embed]
  affects: [EventDetailPanel, EventFormPanel, AttendeeList, CommentList, AppSidebar]
tech_stack:
  added: ["@next/third-parties (GoogleMapsEmbed)", "Supabase Storage (avatars + event-covers buckets)"]
  patterns: [client-side-upload, browser-supabase-client, server-action-profile-update]
key_files:
  created:
    - src/lib/supabase/storage.ts
    - src/lib/actions/profile-actions.ts
    - src/components/layout/ProfileModal.tsx
  modified:
    - src/components/layout/AppSidebar.tsx
    - src/app/(app)/itinerary/_components/EventFormPanel.tsx
    - src/app/(app)/itinerary/_components/EventDetailPanel.tsx
    - src/app/(app)/itinerary/_components/AttendeeList.tsx
    - src/app/(app)/itinerary/_components/CommentList.tsx
    - src/lib/actions/event-actions.ts
decisions:
  - "Upload done client-side via browser Supabase client to bypass 1 MB server action body limit"
  - "GoogleMapsEmbed renders conditionally when both event.address and NEXT_PUBLIC_GOOGLE_MAPS_API_KEY exist"
  - "Avatar in comments uses 24px (size-6) circle; attendees use 32px (size-8) — matches UI-SPEC"
metrics:
  duration: "~12 min"
  completed_date: "2026-04-05"
  tasks_completed: 2
  files_modified: 10
---

# Phase 04 Plan 04: Avatar Uploads, Cover Photos, and Map Embed Summary

**One-liner:** Client-side Supabase Storage uploads for user avatars and event cover photos, with Google Maps embed and avatar display throughout the app.

## What Was Built

### Task 1: Storage helpers, profile actions, and ProfileModal

- **`src/lib/supabase/storage.ts`** — `uploadAvatar` and `uploadEventCover` helpers using the browser Supabase client directly. Both validate file size (5 MB limit) and type (JPEG/PNG/WebP) before uploading via `upsert: true`.
- **`src/lib/actions/profile-actions.ts`** — `'use server'` action that updates `display_name` and `avatar_url` on the `profiles` table. Uses `getUser()` (not `getSession()`) for auth.
- **`src/components/layout/ProfileModal.tsx`** — Dialog with a 64px avatar preview circle, file upload (hidden input, click-triggered), display name field, and "Save Profile" / "Cancel" buttons. Preview updates immediately via `URL.createObjectURL`.
- **`src/components/layout/AppSidebar.tsx`** — Wired `ProfileModal` with `useState(false)` for open state, "Edit Profile" button in the footer, and the existing `profile?.avatar_url` already being used for `AvatarImage`.

### Task 2: Event cover photos, hero image, map embed, and avatars in lists

- **`src/app/(app)/itinerary/_components/EventFormPanel.tsx`** — Added "Cover Photo" field above the title (file input, 80px preview thumbnail, Change/Upload label) and "Address" field below location_name. Cover upload calls `uploadEventCover` in `onSubmit` before calling `createEvent`/`updateEvent`.
- **`src/lib/actions/event-actions.ts`** — Both `createEvent` and `updateEvent` now include `address` and `cover_image_url` in insert/update data, with empty string to null coercion.
- **`src/app/(app)/itinerary/_components/EventDetailPanel.tsx`** — Hero image (160px, `object-cover`) renders at top when `cover_image_url` is present. Google Maps embed renders when both `event.address` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` are present.
- **`src/app/(app)/itinerary/_components/AttendeeList.tsx`** — Added `AvatarImage` with `avatar_url` src; falls back to colored initial circle.
- **`src/app/(app)/itinerary/_components/CommentList.tsx`** — Added 24px avatar next to commenter name; falls back to initial letter circle.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing @next/third-parties package**
- **Found during:** Task 2 TypeScript compile
- **Issue:** `@next/third-parties` was listed in `package.json` but not installed in `node_modules`. TypeScript could not resolve `@next/third-parties/google` for `GoogleMapsEmbed`.
- **Fix:** Ran `npm install @next/third-parties`
- **Files modified:** `package.json`, `package-lock.json`
- **Commit:** d7b1867

## Known Stubs

- **Google Maps embed:** Renders only when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` env var is set. No env var = only address text shown, no map. The key is not yet configured in `.env.local` or Vercel — map will not appear until that env var is added.
- **Supabase Storage buckets:** `avatars` and `event-covers` buckets must be created in the Supabase dashboard with public read access for upload/display to work. This is infrastructure setup outside the codebase.

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| src/lib/supabase/storage.ts | FOUND |
| src/lib/actions/profile-actions.ts | FOUND |
| src/components/layout/ProfileModal.tsx | FOUND |
| Commit bbd954d (Task 1) | FOUND |
| Commit d7b1867 (Task 2) | FOUND |
