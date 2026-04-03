---
phase: 03-rsvp-and-event-mutations
plan: 03
subsystem: ui
tags: [react, supabase, next.js, comments, date-fns]

# Dependency graph
requires:
  - phase: 03-rsvp-and-event-mutations
    provides: comment-actions server actions (createComment, deleteComment), CommentRow type, EventDetailPanel with RSVP/attendees

provides:
  - CommentList component — flat chronological comment thread with owner/admin delete
  - CommentInput component — textarea + send button, Enter to submit
  - EventRow type extended with comments array
  - Comments data fetched in page.tsx via nested Supabase select with chronological ordering
  - Full Phase 3 interactive write path: RSVP, event CRUD, and comments

affects:
  - phase-04-polish-and-deployment

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Comments fetched via nested Supabase select alongside events — avoids separate client fetch"
    - "useTransition for async server action calls in client components"
    - "group-hover Tailwind pattern for contextual delete buttons"

key-files:
  created:
    - src/app/(app)/itinerary/_components/CommentList.tsx
    - src/app/(app)/itinerary/_components/CommentInput.tsx
  modified:
    - src/app/(app)/itinerary/_components/EventDetailPanel.tsx
    - src/app/(app)/itinerary/page.tsx
    - src/types/database.types.ts

key-decisions:
  - "Comments fetched as nested Supabase select on events query (not separate client fetch) — simpler for 8 users with few comments"
  - "CommentRow already defined in Plan 01; EventRow extended with comments: CommentRow[] field"
  - "Delete button uses group-hover pattern — visible on hover only, keeps UI clean"

patterns-established:
  - "Nested Supabase select: .select('*, relation(fields, nested_relation(fields))') with .order() for reference table"
  - "useTransition pattern for server action calls — isPending for optimistic disabled state"

requirements-completed: [RSVP-03]

# Metrics
duration: 3min
completed: 2026-04-03
---

# Phase 03 Plan 03: Comments Section Summary

**CommentList and CommentInput components wired into EventDetailPanel, with comments fetched via nested Supabase select — completing the full Phase 3 interactive write path**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-03T23:28:33Z
- **Completed:** 2026-04-03T23:31:00Z
- **Tasks:** 1 auto + 1 auto-approved checkpoint
- **Files modified:** 5

## Accomplishments

- Created CommentList component with flat chronological thread, hover-visible delete button for own comments, admin can delete any
- Created CommentInput component with Textarea, Send button, and Enter-to-submit keyboard shortcut
- Extended EventRow type to include `comments: CommentRow[]` field
- Updated itinerary page query to fetch comments with profiles via nested Supabase select with ascending created_at order
- Wired both components into EventDetailPanel below the AttendeeList section with Separator

## Task Commits

1. **Task 1: CommentList, CommentInput, data fetching, and wiring** - `6523958` (feat)
2. **Task 2: Verify Phase 3 features** - auto-approved (checkpoint:human-verify, auto-advance mode)

**Plan metadata:** (pending final commit)

## Files Created/Modified

- `src/app/(app)/itinerary/_components/CommentList.tsx` - Flat chronological comment list, owner/admin delete via trash icon
- `src/app/(app)/itinerary/_components/CommentInput.tsx` - Textarea + Send button, Enter to submit, 500 char max
- `src/app/(app)/itinerary/_components/EventDetailPanel.tsx` - Added CommentList and CommentInput below AttendeeList with Separator
- `src/app/(app)/itinerary/page.tsx` - Extended query with nested comments select and chronological ordering
- `src/types/database.types.ts` - Added `comments: CommentRow[]` to EventRow type

## Decisions Made

- Comments fetched as nested Supabase select alongside events rather than a separate client-side fetch. This avoids loading state complexity and is well within performance bounds for 8 users.
- Delete button uses Tailwind `group-hover:opacity-100` pattern — button is present in DOM but invisible until hover, keeping the UI clean while preserving accessibility.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Full Phase 3 interactive write path complete: RSVP toggle, attendee list, event CRUD, and comments
- All six Phase 3 requirements covered: RSVP-01, RSVP-02, RSVP-03, EVNT-02, EVNT-03, EVNT-04
- Ready for Phase 4: polish and deployment

---
*Phase: 03-rsvp-and-event-mutations*
*Completed: 2026-04-03*
