---
phase: 02-itinerary-and-event-views
plan: 01
subsystem: database
tags: [supabase, postgres, rls, shadcn, typescript, migrations, seed-data]

# Dependency graph
requires:
  - phase: 01-foundation-and-auth
    provides: profiles table, Supabase client setup, TypeScript database types placeholder
provides:
  - events table with event_category enum (dinner, excursion, group_activity, travel, open_day)
  - rsvps table with RLS read policies
  - 16 seed events covering all 10 trip days (May 7-16 2026)
  - Extended database.types.ts with EventCategory, EventRow, events/rsvps table types
  - Sheet, Drawer, Badge shadcn components (base-nova style)
affects:
  - 02-itinerary-and-event-views (Plan 02 itinerary UI reads events table)
  - 03-rsvp-and-event-creation (RSVP write policies, event creation)

# Tech tracking
tech-stack:
  added: [vaul (drawer dependency, auto-installed by shadcn)]
  patterns:
    - Supabase RLS read policies: "to authenticated using (true)" pattern for public event/RSVP visibility
    - SQL seed data: apostrophes escaped with double single-quotes in SQL strings

key-files:
  created:
    - supabase/migrations/00002_create_events_table.sql
    - supabase/migrations/00003_seed_trip_events.sql
    - src/components/ui/sheet.tsx
    - src/components/ui/drawer.tsx
    - src/components/ui/badge.tsx
  modified:
    - src/types/database.types.ts

key-decisions:
  - "EventRow convenience type merges events Row with rsvps count array — needed by itinerary UI without joins"
  - "rsvps table has only read RLS policy in Phase 2 — write policies deferred to Phase 3 (RSVP feature)"
  - "Seed data includes partial location info where known (VRBO, bike tour) and NULL elsewhere"

patterns-established:
  - "SQL migrations: comment header, then enum, then table, then RLS, then policies — matches 00001 pattern"
  - "TypeScript DB types: manual placeholder style with Row/Insert/Update per table until CLI generation"

requirements-completed: [ITIN-02, EVNT-05]

# Metrics
duration: 3min
completed: 2026-04-03
---

# Phase 2 Plan 01: Database Foundation Summary

**event_category enum, events and rsvps tables with RLS, 16 seed events for all 10 trip days, Sheet/Drawer/Badge shadcn components, and extended TypeScript database types**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-03T17:29:19Z
- **Completed:** 2026-04-03T17:31:44Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Two SQL migration files: 00002 creates events table (event_category enum, 5 categories, RLS read policy) and rsvps table (cascade delete, unique constraint, RLS read policy)
- 00003 seeds 16 events spanning all 10 trip days (May 7-16) with titles, times, categories, descriptions, and known location URLs (VRBO villa x3, bike tour x1)
- database.types.ts extended with EventCategory type union, events/rsvps table Row/Insert/Update shapes, Enums section, and EventRow convenience type with rsvps count
- Sheet, Drawer, and Badge components installed via shadcn (base-nova style, base-ui backed — no Radix UI)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create events and rsvps migrations with seed data** - `fb64e7b` (feat)
2. **Task 2: Install shadcn components and extend TypeScript types** - `96edf27` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `supabase/migrations/00002_create_events_table.sql` - event_category enum, events and rsvps tables with RLS read policies
- `supabase/migrations/00003_seed_trip_events.sql` - 16 seed events for May 7-16 2026
- `src/types/database.types.ts` - extended with EventCategory, events table, rsvps table, EventRow type
- `src/components/ui/sheet.tsx` - Sheet component (base-nova style) for desktop slide-out panel
- `src/components/ui/drawer.tsx` - Drawer component (vaul-backed) for mobile panel
- `src/components/ui/badge.tsx` - Badge component for category pills

## Decisions Made

- `EventRow` convenience type adds `rsvps: { count: number }[]` to events Row — allows itinerary UI to display attendee counts from a Supabase count query without redefining shape
- RSVP write policies deferred to Phase 3 — Phase 2 only needs read access for attendee display
- Seed data NULL for location fields where venue not yet confirmed (most dinners, some excursions)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

The SQL migrations must be applied manually in the Supabase Dashboard SQL Editor (in order):
1. `supabase/migrations/00002_create_events_table.sql`
2. `supabase/migrations/00003_seed_trip_events.sql`

No new environment variables required.

## Next Phase Readiness

- Database schema ready for Phase 2 Plan 02 (itinerary UI): events table queryable, TypeScript types match schema
- Sheet and Drawer components available for event detail panel
- Badge component available for category pills
- Phase 3 (RSVP and event creation) will need to add INSERT/UPDATE/DELETE RLS policies on events and rsvps tables

---
*Phase: 02-itinerary-and-event-views*
*Completed: 2026-04-03*
