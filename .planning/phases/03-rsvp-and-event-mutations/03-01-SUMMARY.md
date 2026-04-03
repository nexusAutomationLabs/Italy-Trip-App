---
phase: 03-rsvp-and-event-mutations
plan: 01
subsystem: database
tags: [supabase, rls, server-actions, zod, typescript, shadcn]

requires:
  - phase: 02-itinerary-and-event-views
    provides: EventRow type, itinerary page, rsvps table with read-only RLS

provides:
  - RSVP write RLS policies (INSERT + DELETE for authenticated users)
  - Events write RLS policies (INSERT/UPDATE/DELETE for authenticated users)
  - Comments table with full RLS (read/insert/delete)
  - toggleRsvp, createEvent, updateEvent, deleteEvent, createComment, deleteComment server actions
  - Zod schemas for event and comment forms (eventSchema, commentSchema)
  - Updated EventRow type with attendee names instead of count aggregate
  - CommentRow type
  - createServiceClient() for admin bypass operations
  - shadcn dialog, alert-dialog, dropdown-menu, textarea, select, separator, avatar components

affects:
  - 03-02 (RSVP and event mutation UI)
  - 03-03 (comments UI)

tech-stack:
  added: []
  patterns:
    - "Server actions return { success: boolean; error?: string } for form-based mutations"
    - "toggleRsvp throws on error (not return pattern) since it uses optimistic UI — no revalidatePath"
    - "Admin check uses user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL pattern (established in Phase 1)"
    - "Ownership enforced in server action for UPDATE/DELETE despite permissive RLS using(true)"
    - "Database types require Relationships arrays for Supabase v2.101 generic type resolution"
    - "as unknown as EventRow[] cast needed when Supabase type parser can't resolve manual relationship types"

key-files:
  created:
    - supabase/migrations/00004_rsvps_write_and_comments.sql
    - src/lib/actions/event-schemas.ts
    - src/lib/actions/rsvp-actions.ts
    - src/lib/actions/event-actions.ts
    - src/lib/actions/comment-actions.ts
    - src/components/ui/dialog.tsx
    - src/components/ui/alert-dialog.tsx
    - src/components/ui/dropdown-menu.tsx
    - src/components/ui/textarea.tsx
    - src/components/ui/select.tsx
    - src/components/ui/separator.tsx
    - src/components/ui/avatar.tsx
  modified:
    - src/types/database.types.ts
    - src/lib/supabase/server.ts
    - src/app/(app)/itinerary/page.tsx
    - src/app/(app)/itinerary/_components/ItineraryClient.tsx
    - src/app/(app)/itinerary/_components/EventRow.tsx
    - src/app/(app)/itinerary/_components/EventDetailPanel.tsx
    - src/app/(app)/itinerary/_components/DayCard.tsx

key-decisions:
  - "Supabase v2.101 GenericTable requires Relationships arrays — handwritten Database types must include these for type resolution to work"
  - "Events UPDATE/DELETE RLS uses permissive using(true); ownership enforced in server actions (per D-10 research recommendation for private 8-person app)"
  - "toggleRsvp throws on error rather than returning { success, error } — optimistic UI needs to catch errors, not redirect"
  - "No revalidatePath in toggleRsvp — optimistic UI handles local state; server revalidation on nav is sufficient for an infrequently-changing itinerary"
  - "as unknown as EventRow[] cast in page.tsx because Supabase SelectQueryParser can't fully resolve manually-typed FK relationships at compile time"

patterns-established:
  - "Server action pattern: 'use server', createClient(), getUser(), safeParse(), operate, revalidatePath(), return { success, error }"
  - "Admin check: user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL"
  - "Ownership check before mutation: fetch created_by, compare to user.id, allow if isAdmin"

requirements-completed: [RSVP-01, RSVP-02, RSVP-03, EVNT-02, EVNT-03, EVNT-04]

duration: 5min
completed: 2026-04-03
---

# Phase 03 Plan 01: Database Foundation Summary

**RSVP write policies, comments table with RLS, and six server actions (toggleRsvp, createEvent, updateEvent, deleteEvent, createComment, deleteComment) with Zod validation — Wave 2 UI plans can now focus purely on components**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-03T23:12:50Z
- **Completed:** 2026-04-03T23:18:05Z
- **Tasks:** 2
- **Files modified:** 19

## Accomplishments

- Migration `00004_rsvps_write_and_comments.sql` adds RSVP write policies, events write policies, and full comments table with RLS
- All six server actions created under `src/lib/actions/` with auth checks, Zod validation, and admin/ownership authorization
- EventRow type updated from `rsvps: { count: number }[]` to `rsvps: { user_id: string; profiles: { display_name: string | null } | null }[]` — all consuming components updated to use `rsvps.length`
- `currentUserId` and `isAdmin` props threaded through ItineraryClient, DayCard, and EventDetailPanel for Wave 2 UI hooks
- `createServiceClient()` added to `server.ts` for admin bypass operations
- 7 shadcn components installed: dialog, alert-dialog, dropdown-menu, textarea, select, separator, avatar

## Task Commits

1. **Task 1: Database migration, shadcn components, types, and service client** - `fec7fd3` (feat)
2. **Task 2: Server actions, Zod schemas, and query/component updates** - `8219e99` (feat)

## Files Created/Modified

- `supabase/migrations/00004_rsvps_write_and_comments.sql` - RSVP write policies, events write policies, comments table
- `src/types/database.types.ts` - Added comments table, updated EventRow, added CommentRow, added Relationships arrays
- `src/lib/supabase/server.ts` - Added createServiceClient() for admin bypass
- `src/lib/actions/event-schemas.ts` - eventSchema, commentSchema, EventFormData, CommentFormData
- `src/lib/actions/rsvp-actions.ts` - toggleRsvp (no revalidatePath, optimistic UI pattern)
- `src/lib/actions/event-actions.ts` - createEvent, updateEvent, deleteEvent with admin check
- `src/lib/actions/comment-actions.ts` - createComment, deleteComment with admin check
- `src/app/(app)/itinerary/page.tsx` - Updated query + getUser() + currentUserId/isAdmin props
- `src/app/(app)/itinerary/_components/ItineraryClient.tsx` - Added currentUserId, isAdmin props
- `src/app/(app)/itinerary/_components/EventRow.tsx` - rsvps.length instead of rsvps[0].count
- `src/app/(app)/itinerary/_components/EventDetailPanel.tsx` - rsvps.length, currentUserId, isAdmin
- `src/app/(app)/itinerary/_components/DayCard.tsx` - Added currentUserId, isAdmin props (for Plan 02)
- 7 shadcn components in `src/components/ui/`

## Decisions Made

- Supabase v2.101 `GenericTable` requires a `Relationships` array on every table definition. Our handwritten types were missing these, causing `.insert()` and `.from()` calls to resolve to `never`. Added `Relationships: []` (or with FK entries) to all tables.
- Events UPDATE/DELETE RLS uses permissive `using (true)` — ownership enforced in server actions. Appropriate for a private 8-person app (per research decision D-10).
- `toggleRsvp` does not call `revalidatePath` — the optimistic UI in Wave 2 manages local state. Server-side revalidation happens on next page load.
- The Supabase type parser emits `SelectQueryError` for `rsvps(user_id, profiles(display_name))` even with correct `Relationships` because CLI-generated types encode relationships differently. Used `as unknown as EventRow[]` cast to bypass the compile-time limitation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added Relationships arrays to database.types.ts**
- **Found during:** Task 2 (server actions)
- **Issue:** Supabase v2.101 `GenericTable` requires a `Relationships` field on each table definition. Without it, `.from('comments').insert(...)` and `.from('events').insert(...)` resolve to `never`, causing TypeScript errors on all insert/update/delete operations.
- **Fix:** Added `Relationships: []` to all existing tables and `Relationships` with FK entries to `rsvps` and `comments` tables
- **Files modified:** `src/types/database.types.ts`
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** `8219e99` (Task 2 commit)

**2. [Rule 2 - Missing Critical] Added currentUserId/isAdmin to DayCard props**
- **Found during:** Task 2 (ItineraryClient update)
- **Issue:** Plan specified passing currentUserId/isAdmin to DayCard from ItineraryClient (for Plan 02's Add Event button) but DayCard's interface wasn't included in the plan's file list. Passing props to DayCard without updating its interface would cause a TypeScript error.
- **Fix:** Added currentUserId and isAdmin to DayCard's interface; used `void` to suppress unused variable warnings until Plan 02 wires them up.
- **Files modified:** `src/app/(app)/itinerary/_components/DayCard.tsx`
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** `8219e99` (Task 2 commit)

**3. [Rule 1 - Bug] Changed itinerary page cast to `as unknown as EventRow[]`**
- **Found during:** Task 2 (itinerary page query update)
- **Issue:** The Supabase `SelectQueryParser` emits `SelectQueryError` for the `rsvps(user_id, profiles(display_name))` sub-select when using manually typed (non-CLI-generated) database types. The simple `as EventRow[]` cast failed with a type overlap error.
- **Fix:** Changed to `as unknown as EventRow[]` — functionally identical at runtime; the cast only affects compile-time checking.
- **Files modified:** `src/app/(app)/itinerary/page.tsx`
- **Verification:** `npx tsc --noEmit` exits 0, runtime behavior unchanged
- **Committed in:** `8219e99` (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 bug, 1 missing critical, 1 bug)
**Impact on plan:** All auto-fixes required for TypeScript correctness. No scope creep.

## Issues Encountered

- Supabase v2.101 has stricter TypeScript generics than the version used when the original `database.types.ts` was scaffolded. Handwritten types now need `Relationships` arrays matching the `GenericTable` interface contract.

## Known Stubs

- `DayCard` accepts `currentUserId` and `isAdmin` but uses `void` to suppress unused warnings — these will be wired to the Add Event button in Plan 02.
- `EventDetails` (inside EventDetailPanel) accepts `currentUserId` and `isAdmin` but uses `void` — RSVP button and Edit/Delete actions will be wired in Plan 02.
- Both stubs are intentional scaffolding for Wave 2 plans. No UI-visible stub content exists.

## Next Phase Readiness

- All data layer changes complete — Wave 2 plans (03-02, 03-03) can focus purely on UI components
- `currentUserId` and `isAdmin` are available at every component level that will need them
- Migration file is ready to be applied to Supabase dashboard (00004 in sequence)
- shadcn components for all Phase 3 dialogs and dropdowns are installed

---
*Phase: 03-rsvp-and-event-mutations*
*Completed: 2026-04-03*
