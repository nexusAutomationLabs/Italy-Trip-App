# Phase 3: RSVP and Event Mutations - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Full interactive write path — users can RSVP to events, see who's attending, create/edit/delete events, and leave comments on events. This is the core reason the app exists: replacing scattered group chats with one place to sign up and coordinate.

</domain>

<decisions>
## Implementation Decisions

### RSVP Interaction
- **D-01:** "I'm in" button — single prominent button at top of event detail panel. Toggles between "I'm in" (outlined) and "Attending ✓" (filled terracotta). One tap to join/leave.
- **D-02:** RSVP button lives in the event detail panel only — not on itinerary day cards. Day cards already show attendee count; keeps the itinerary clean.
- **D-03:** Optimistic updates — button toggles immediately on tap, reverts if server fails. (Note: STATE.md flagged optimistic RSVP with useOptimistic + Server Actions as needing investigation — researcher should resolve the best pattern.)

### Event Creation Flow
- **D-04:** Modal/dialog over itinerary — same Sheet/Drawer pattern as event detail panel (Sheet on desktop, full-screen Drawer on mobile). User stays in itinerary context.
- **D-05:** "+ Add Event" button at the bottom of each day card. Pre-fills the date for that day. Contextual — "I want to add something to Wednesday."
- **D-06:** Required fields: title and date only. Optional: time, description, location name, location URL, category. Category defaults to 'open_day' if not selected. Low friction for quick entries.

### Attendee & Comment Display
- **D-07:** Attendee list with colored initial circles — vertical list of names with avatar initials (no photo uploads). "4 attending" header with names listed below. Shows who's in at a glance.
- **D-08:** Comments as flat chronological list (newest last) below attendees in the event detail panel. Name + timestamp + message. Text input at the bottom. Like a mini chat — good for "I'll drive" or "need veggie option". No threading, no reactions.
- **D-09:** Users can delete their own comments (small trash icon). Admin can delete any comment. No edit — just delete and re-post.

### Edit & Delete Controls
- **D-10:** Three-dot "..." menu in the top-right of the event detail panel. Shows "Edit" and "Delete" options. Only visible to the event creator and admin — hidden for non-owners.
- **D-11:** Delete requires confirmation dialog — "Delete this event?" with Cancel / Delete (red/destructive) buttons.
- **D-12:** Edit reuses the same modal as create, pre-filled with existing data. Title changes to "Edit Event". Consistent UX, less code.

### Carried Forward
- Admin designated by hardcoded email env var (Phase 1 D-12) — admin can edit/delete any event and any comment
- Event detail panel is right-side Sheet on desktop, bottom Drawer on mobile (Phase 2 D-05/D-06)
- Server actions + Zod validation pattern established in Phase 1 (`src/lib/auth/actions.ts`)
- `rsvps` table exists with read-only RLS — write policies needed in this phase

### Claude's Discretion
- Exact animation/transition for RSVP button state change
- Comment input styling and empty state messaging
- "+" button styling within day cards (size, color, hover state)
- Modal form layout and field ordering
- Confirmation dialog copy and styling
- Database schema for comments table (columns, RLS policies)
- How to structure server actions (one file vs. split by domain)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/PROJECT.md` — Trip context, group composition, admin role (Adam), constraint: ~8-10 users
- `.planning/REQUIREMENTS.md` — RSVP-01, RSVP-02, RSVP-03, EVNT-02, EVNT-03, EVNT-04 are this phase's requirements
- `.planning/ROADMAP.md` — Phase 3 success criteria and dependencies

### Technology Guidance
- `CLAUDE.md` §Technology Stack — Mandated stack: Next.js 15, Supabase, @supabase/ssr, Tailwind v4, shadcn/ui, react-hook-form + Zod
- `CLAUDE.md` §What NOT to Use — Avoid deprecated packages, use getUser() not getSession(), no real-time subscriptions

### Prior Phase Context
- `.planning/phases/01-foundation-and-auth/01-CONTEXT.md` — Auth flow, admin by env var, server actions + Zod pattern, Tuscan palette
- `.planning/phases/02-itinerary-and-event-views/02-CONTEXT.md` — Day card layout, event detail panel (Sheet/Drawer), EventRow type, category system, seed data approach

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/sheet.tsx` + `src/components/ui/drawer.tsx` — Event detail panel pattern (reuse for create/edit modal)
- `src/components/ui/badge.tsx` — Category tags with Tuscan palette colors
- `src/components/ui/button.tsx` — Button variants for RSVP toggle and form actions
- `src/components/ui/card.tsx` — Day cards (add "+ Add Event" button here)
- `src/components/ui/input.tsx` + `src/components/ui/label.tsx` — Form field components
- `src/hooks/use-media-query.ts` — Desktop/mobile detection (Sheet vs Drawer switching)
- `src/lib/auth/actions.ts` + `src/lib/auth/schemas.ts` — Server action + Zod validation pattern to follow
- `src/lib/constants/categories.ts` — CATEGORY_STYLES and CATEGORY_LABELS for event category selection
- `src/lib/supabase/server.ts` + `src/lib/supabase/client.ts` — Supabase client utilities

### Established Patterns
- Server actions with Zod validation (`'use server'` + schema.safeParse)
- Error flow via URL redirect (`?error=` param)
- Sheet on desktop / Drawer on mobile via useMediaQuery hook
- CSS background-image for Unsplash imagery (not next/image)
- `force-dynamic` on authenticated layout
- EventRow convenience type (events Row + rsvps count array)

### Integration Points
- `src/app/(app)/itinerary/page.tsx` — Main itinerary page, add "+ Add Event" buttons to day cards
- `src/app/(app)/itinerary/_components/EventDetailPanel.tsx` — Add RSVP button, attendee list, comments section
- `src/app/(app)/itinerary/_components/EventRow.tsx` — May need minor updates for attendee count refresh
- `src/types/database.types.ts` — Add comments table types, extend EventRow for attendee names
- Supabase RLS — rsvps table needs INSERT/DELETE policies; new comments table needs full RLS

</code_context>

<specifics>
## Specific Ideas

- RSVP button uses terracotta fill color when attending (matches Tuscan palette from Phase 1)
- "+ Add Event" per day card pre-fills the date — reduces friction for the most common use case
- Comments are lightweight coordination messages ("I'll drive", "need veggie option") — not a full chat system
- 8-person group means attendee lists are always short — no pagination or "show more" needed
- Colored initial circles for attendees (no photo system) — consistent with small trusted group

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-rsvp-and-event-mutations*
*Context gathered: 2026-04-03*
