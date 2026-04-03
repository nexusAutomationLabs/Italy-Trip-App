---
phase: 03-rsvp-and-event-mutations
plan: 02
subsystem: ui
tags: [react, optimistic-ui, react-hook-form, zod, shadcn-ui, vaul, base-ui]

# Dependency graph
requires:
  - phase: 03-rsvp-and-event-mutations plan 01
    provides: toggleRsvp, createEvent, updateEvent, deleteEvent server actions, EventRow type with rsvps array

provides:
  - RsvpButton: optimistic RSVP toggle with useOptimistic + useTransition
  - AttendeeList: colored initial circles (Tuscan OKLCH palette) with names
  - EventActions: three-dot dropdown with AlertDialog delete confirmation
  - EventFormPanel: responsive Sheet/Drawer create + edit form (react-hook-form + zod)
  - EventDetailPanel: fully wired with RSVP, attendees, and edit/delete actions
  - DayCard: Add Event button pre-filling date
  - ItineraryClient: create form state and handleAddEvent handler

affects: [phase-04, itinerary-ui, any component consuming EventRow]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useOptimistic + useTransition for server action optimistic UI without revalidatePath
    - zodResolver with z.input type for forms with default values in Zod schema
    - base-ui DropdownMenuTrigger renders directly (no asChild) — different from Radix pattern
    - EventActions onEdit callback closes detail panel and opens form panel in parent

key-files:
  created:
    - src/app/(app)/itinerary/_components/RsvpButton.tsx
    - src/app/(app)/itinerary/_components/AttendeeList.tsx
    - src/app/(app)/itinerary/_components/EventActions.tsx
    - src/app/(app)/itinerary/_components/EventFormPanel.tsx
  modified:
    - src/app/(app)/itinerary/_components/EventDetailPanel.tsx
    - src/app/(app)/itinerary/_components/DayCard.tsx
    - src/app/(app)/itinerary/_components/ItineraryClient.tsx

key-decisions:
  - "z.input<typeof eventSchema> for form type instead of EventFormData (z.output) — resolves resolver type mismatch when Zod schema has .default() fields"
  - "base-ui DropdownMenuTrigger does not support asChild — render trigger props directly on the element"
  - "EventActions onEdit triggers onClose() on EventDetailPanel before opening EventFormPanel — avoids stacking panels"

patterns-established:
  - "z.input for useForm generics when schema has .default() fields"
  - "Direct DropdownMenuTrigger className styling instead of asChild wrapping for base-ui menus"

requirements-completed: [RSVP-01, RSVP-02, EVNT-02, EVNT-03, EVNT-04]

# Metrics
duration: 4min
completed: 2026-04-03
---

# Phase 03 Plan 02: RSVP and Event Mutation UI Summary

**Full interactive write path: optimistic RSVP toggle, colored attendee list, create/edit/delete event forms in Sheet/Drawer, and three-dot action menu wired into itinerary**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-03T23:21:28Z
- **Completed:** 2026-04-03T23:25:35Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- RsvpButton toggles optimistically (useOptimistic + useTransition) without page reload — matches D-01 and D-03
- AttendeeList displays colored initial circles using Tuscan OKLCH palette with name labels
- EventActions three-dot menu with Edit/Delete; delete requires AlertDialog confirmation (D-10, D-11)
- EventFormPanel is Sheet on desktop, Drawer on mobile; handles both create and edit with same component
- DayCard gains "+ Add Event" button that pre-fills the form date
- EventDetailPanel fully wired: RSVP button, attendee count + list, edit/delete actions for owner/admin

## Task Commits

Each task was committed atomically:

1. **Task 1: RsvpButton, AttendeeList, EventActions** - `bf296f4` (feat)
2. **Task 2: EventFormPanel and wiring** - `320ce97` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `src/app/(app)/itinerary/_components/RsvpButton.tsx` - Optimistic RSVP toggle button
- `src/app/(app)/itinerary/_components/AttendeeList.tsx` - Colored initial circles attendee list
- `src/app/(app)/itinerary/_components/EventActions.tsx` - Three-dot dropdown with delete confirmation
- `src/app/(app)/itinerary/_components/EventFormPanel.tsx` - Create/edit event Sheet/Drawer form
- `src/app/(app)/itinerary/_components/EventDetailPanel.tsx` - Wired RSVP, attendees, edit/delete
- `src/app/(app)/itinerary/_components/DayCard.tsx` - Added onAddEvent + Add Event button
- `src/app/(app)/itinerary/_components/ItineraryClient.tsx` - Added create form state and handler

## Decisions Made
- Used `z.input<typeof eventSchema>` for `useForm` generics instead of `EventFormData` (z.output). The Zod schema has `.default('open_day')` on category, which makes the output type require category while the input type allows it to be undefined. The `zodResolver` expects input types, creating a mismatch. Casting resolver as `never` and onSubmit data as `EventFormData` resolves it cleanly.
- `DropdownMenuTrigger` from `@base-ui/react/menu` does not accept `asChild` prop (unlike Radix). The trigger renders directly with className styling on the element itself.
- Edit flow: `EventActions.onEdit` calls parent's `handleEdit` which closes the detail panel and sets `editingEvent` state, then `EventFormPanel` opens. Avoids two panels stacking on screen.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed DropdownMenuTrigger asChild incompatibility**
- **Found during:** Task 1 (EventActions component)
- **Issue:** Plan used `asChild` on `DropdownMenuTrigger` but this project's shadcn/ui uses `@base-ui/react/menu` which does not have an `asChild` prop — TypeScript error TS2322
- **Fix:** Removed `<Button>` wrapper, applied button styles directly as className on `DropdownMenuTrigger`
- **Files modified:** src/app/(app)/itinerary/_components/EventActions.tsx
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** bf296f4 (Task 1 commit)

**2. [Rule 1 - Bug] Fixed useForm resolver type mismatch for Zod schema with .default()**
- **Found during:** Task 2 (EventFormPanel component)
- **Issue:** `zodResolver(eventSchema)` infers input types (category optional) but `useForm<EventFormData>` uses output type (category required) — TS2322 type incompatibility
- **Fix:** Changed form generic to `z.input<typeof eventSchema>`, cast resolver as `never`, cast onSubmit data to `EventFormData` for action calls
- **Files modified:** src/app/(app)/itinerary/_components/EventFormPanel.tsx
- **Verification:** `npx tsc --noEmit` exits 0, `npm run build` succeeds
- **Committed in:** 320ce97 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - bugs in plan code)
**Impact on plan:** Both fixes necessary for TypeScript compilation. No scope creep. All plan goals achieved.

## Issues Encountered
- Zod `.default()` + react-hook-form resolver type inference is a known rough edge — the `z.input` / `z.output` distinction resolves it consistently

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Full RSVP and event mutation UI is complete and wired to server actions from Plan 01
- Plan 03 (comments) can build on EventDetailPanel — AttendeeList/RsvpButton wiring pattern is established
- All RSVP and event mutation requirements (RSVP-01, RSVP-02, EVNT-02, EVNT-03, EVNT-04) are satisfied

---
*Phase: 03-rsvp-and-event-mutations*
*Completed: 2026-04-03*
