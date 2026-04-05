---
phase: 04-polish-and-comments
plan: 01
subsystem: database, infra, ui
tags: [supabase, shadcn, typescript, google-maps, storage, npm]

# Dependency graph
requires:
  - phase: 03-rsvp-and-event-mutations
    provides: "Events, RSVPs, Comments tables and TypeScript types"
provides:
  - "@next/third-parties and @vis.gl/react-google-maps npm packages installed"
  - "shadcn sidebar, tabs, tooltip, skeleton components in src/components/ui/"
  - "use-mobile hook in src/hooks/"
  - "Supabase migration 00006 with avatar_url, cover_image_url, address, latitude, longitude columns"
  - "Storage bucket RLS policies for avatars and event-covers in migration SQL"
  - "Updated TypeScript types with all new columns"
  - "Updated eventSchema with address, latitude, longitude, cover_image_url fields"
affects: [04-02, 04-03, 04-04, 04-05]

# Tech tracking
tech-stack:
  added:
    - "@next/third-parties — Google Analytics/Maps integration helpers"
    - "@vis.gl/react-google-maps — React wrapper for Google Maps JavaScript API"
    - "shadcn sidebar — collapsible sidebar component"
    - "shadcn tabs — tab navigation component"
    - "shadcn tooltip — hover tooltip component"
    - "shadcn skeleton — loading skeleton component"
  patterns:
    - "Supabase migrations in supabase/migrations/ with sequential numeric prefix"
    - "Storage RLS policies co-located in migration SQL file"

key-files:
  created:
    - "src/components/ui/sidebar.tsx"
    - "src/components/ui/tabs.tsx"
    - "src/components/ui/tooltip.tsx"
    - "src/components/ui/skeleton.tsx"
    - "src/hooks/use-mobile.ts"
    - "supabase/migrations/00006_phase4_schema.sql"
  modified:
    - "src/types/database.types.ts"
    - "src/lib/actions/event-schemas.ts"
    - "package.json"
    - "package-lock.json"

key-decisions:
  - "Supabase CLI not available; migration SQL provided as file in supabase/migrations/ for manual execution via Supabase Dashboard"
  - "Google Maps API key step skipped per user instruction; user will add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY manually"
  - "shadcn skeleton and use-mobile hook added as transitive dependencies of sidebar component (not scroll-area, per plan's anti-pattern guidance)"

patterns-established:
  - "Pattern: shadcn add installs component + peer components automatically; accept them"

requirements-completed: []

# Metrics
duration: 5min
completed: 2026-04-05
---

# Phase 04 Plan 01: Install Phase 4 Dependencies Summary

**@next/third-parties, @vis.gl/react-google-maps, and shadcn sidebar/tabs/tooltip installed; database schema extended with avatar_url, cover_image_url, address, and geo columns; TypeScript types and eventSchema updated to match**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-05T00:17:00Z
- **Completed:** 2026-04-05T00:22:04Z
- **Tasks:** 1 of 2 (Task 2 skipped per user instruction)
- **Files modified:** 10

## Accomplishments
- Installed `@next/third-parties` and `@vis.gl/react-google-maps` npm packages
- Added shadcn `sidebar`, `tabs`, `tooltip`, `skeleton` components and `use-mobile` hook
- Created migration file `00006_phase4_schema.sql` with schema changes and storage bucket RLS policies
- Updated `database.types.ts`: `avatar_url` on profiles, `cover_image_url`/`address`/`latitude`/`longitude` on events, `avatar_url` in `EventRow` and `CommentRow` nested profile types
- Updated `event-schemas.ts`: added `address`, `latitude`, `longitude`, `cover_image_url` to `eventSchema`
- TypeScript `--noEmit` passes with zero errors

## Task Commits

1. **Task 1: Install dependencies, run DB migration, create storage buckets** - `20d7562` (chore)
2. **Task 2: Obtain Google Maps API key** - SKIPPED (user will add key manually)

## Files Created/Modified
- `package.json` — added @next/third-parties and @vis.gl/react-google-maps
- `package-lock.json` — updated lockfile
- `src/types/database.types.ts` — avatar_url on profiles; cover_image_url, address, latitude, longitude on events; avatar_url in EventRow/CommentRow profile types
- `src/lib/actions/event-schemas.ts` — address, latitude, longitude, cover_image_url fields in eventSchema
- `src/components/ui/sidebar.tsx` — new shadcn sidebar component
- `src/components/ui/tabs.tsx` — new shadcn tabs component
- `src/components/ui/tooltip.tsx` — new shadcn tooltip component
- `src/components/ui/skeleton.tsx` — new shadcn skeleton component (transitive dep of sidebar)
- `src/hooks/use-mobile.ts` — new hook (transitive dep of sidebar)
- `supabase/migrations/00006_phase4_schema.sql` — Phase 4 schema migration with storage bucket RLS policies

## Decisions Made
- Supabase CLI not installed in this environment; the migration SQL was written to `supabase/migrations/00006_phase4_schema.sql` for manual execution in the Supabase Dashboard SQL editor.
- Task 2 (Google Maps API key) skipped per explicit user instruction — user will add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env.local` and Vercel manually.
- `shadcn skeleton` and `use-mobile` hook were installed as automatic peer dependencies of the sidebar component. These are useful Phase 4 assets, not unwanted additions.

## Deviations from Plan

None — plan executed as written, with Task 2 explicitly skipped per user instruction.

## Issues Encountered

- Supabase CLI not available in this environment. Handled by creating the migration file in the `supabase/migrations/` directory for manual execution. This is the documented fallback path in the plan.

## User Setup Required

**Database migration must be run manually** in Supabase Dashboard SQL editor.

Copy and run the contents of:
`supabase/migrations/00006_phase4_schema.sql`

This applies:
- `avatar_url TEXT` column to `profiles`
- `cover_image_url TEXT`, `address TEXT`, `latitude DOUBLE PRECISION`, `longitude DOUBLE PRECISION` columns to `events`
- Creates `avatars` and `event-covers` storage buckets (public)
- Creates RLS policies for both buckets

**Google Maps API key** — Add manually when ready:
1. Create API key at https://console.cloud.google.com
2. Enable Maps JavaScript API and Places API (New)
3. Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key` to `.env.local`
4. Add to Vercel environment variables

## Next Phase Readiness
- All Phase 4 npm dependencies and shadcn components are installed and ready
- TypeScript types fully updated — subsequent plans can use `cover_image_url`, `address`, `latitude`, `longitude`, `avatar_url` safely
- Map features (Plans 04-03, 04-04) will need the Google Maps API key before they function
- Database migration needs manual execution before storage upload features work

## Self-Check: PASSED

All files verified present on disk. Commit `20d7562` verified in git log.

---
*Phase: 04-polish-and-comments*
*Completed: 2026-04-05*
