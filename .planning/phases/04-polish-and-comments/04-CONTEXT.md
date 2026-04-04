# Phase 4: Polish and Comments - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Major visual redesign and feature additions to make the app polished and group-ready before the May 2026 trip. Includes: horizontal card layout for itinerary, login page redesign, sidebar navigation with map view, Google Maps embed with Places autocomplete in event detail, user avatar uploads, event cover photos, and timezone correctness. All v1 requirements were completed in phases 1-3 (including comments) — this phase elevates the visual design and adds the features needed for a premium trip coordination experience.

</domain>

<decisions>
## Implementation Decisions

### Timezone Display
- **D-01:** All times stored and displayed as Italy time (Europe/Rome, CEST). No UTC conversion — everyone is in Italy together.
- **D-02:** 12-hour time format (e.g. "2:30 PM"). Familiar to the Nova Scotia group.
- **D-03:** Single subtle "All times in Italy time (CEST)" label at the top of the itinerary. No per-event timezone indicators.

### Itinerary Layout Redesign
- **D-04:** Horizontal scrolling event cards per day — cards arranged left-to-right in a scrollable row. Natural swipe on mobile, scroll arrows or drag on desktop. Replaces the current vertical stacked row layout.
- **D-05:** Day headers use "DAY ONE / Thursday, May 7" format — add day numbering above the date (updates Phase 2 D-02 which had no day numbers).
- **D-06:** Each event card shows: category badge (colored pill), time, bold italic title (Playfair Display), description snippet, attendee avatar circles, and a category icon (bottom-right).
- **D-07:** Category icons on cards using Lucide icons (utensils for dining, camera for excursion, map-pin for travel, etc.).
- **D-08:** Optional event cover photo on cards — event creators can upload a photo that appears on the card. Cards without photos show text-only layout.
- **D-09:** No "Export Day" links — not needed for this group size.

### Login Page Redesign
- **D-10:** Split layout — left half is a full-bleed Tuscany vineyard/countryside photo with "Berwick goes to Tuscany 2026" in white script overlay. Right half is the login form on cream background.
- **D-11:** Ignore Tuscan Curator branding from reference — keep "Berwick, NS does Tuscany 2026" or similar group-specific title.
- **D-12:** No Google/Apple social login buttons — keep email + password only (Phase 1 D-02).
- **D-13:** Mobile: photo stacks on top as a shorter banner, form below. Similar to current Phase 1 mobile layout but with the new split design aesthetic.

### Sidebar Navigation
- **D-14:** Fixed left sidebar on desktop — always visible. Shows trip name + dates at top, "Itinerary" link, and "Map" link. Content area takes remaining width.
- **D-15:** Mobile: bottom tab bar with Itinerary and Map tabs. Standard mobile navigation pattern — thumb-friendly.

### Map View
- **D-16:** New Map page/view accessible from sidebar — embedded Google Map showing pins for all event locations. Gives spatial context for the trip.

### Event Detail Redesign
- **D-17:** Google Maps embed with address displayed below the event description. Shows the event location on an embedded map.
- **D-18:** Address field in event form uses Google Places autocomplete — type an address, get suggestions, auto-fills coordinates for the map embed. Requires Google Maps API key.
- **D-19:** Attendee list with photo avatars (from avatar uploads) on the right side of the event detail panel. Falls back to initial circles for users without photos.
- **D-20:** Large hero image area at top of event detail (uses event cover photo if uploaded).

### User Avatar Uploads
- **D-21:** Users upload a profile photo from the header user menu — click name → "Edit Profile" modal with photo upload and display name editing.
- **D-22:** Avatars appear on event cards (attendee circles), attendee lists in event detail, and comments.
- **D-23:** Photos stored in Supabase Storage. Falls back to colored initial circles (current behavior) when no photo uploaded.

### Empty States & Day Display
- **D-24:** Days with no events show the day header with a friendly prompt: "Nothing planned yet — add something!" and an Add Event button.

### Claude's Discretion
- Scroll arrow styling and horizontal scroll interaction details on desktop
- Exact category icon assignments (which Lucide icon per category)
- Map zoom level and default center point
- Sidebar width and styling details
- Photo upload size limits and compression
- Google Maps embed styling and size
- Event detail panel layout proportions (description vs attendee list)
- Loading states and transitions for the new layout
- Mobile bottom tab bar icon choices

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/PROJECT.md` — Trip context, villa location, group composition, trip dates (May 7-16)
- `.planning/REQUIREMENTS.md` — All v1 requirements complete; this phase is pre-trip polish + new features
- `.planning/ROADMAP.md` — Phase 4 success criteria

### Prior Phase Context
- `.planning/phases/01-foundation-and-auth/01-CONTEXT.md` — Auth decisions (email+password, no magic links), admin by env var, app title
- `.planning/phases/02-itinerary-and-event-views/02-CONTEXT.md` — Current itinerary layout (being redesigned), event detail panel pattern, Tuscan palette
- `.planning/phases/03-rsvp-and-event-mutations/03-CONTEXT.md` — RSVP button, event CRUD, comments, attendee display (being enhanced with avatars)

### Technology Guidance
- `CLAUDE.md` §Technology Stack — Mandated stack, date-fns v4 for timezone support
- `CLAUDE.md` §What NOT to Use — Avoid deprecated packages

### Reference Images
- User provided 3 reference mockups (captured in discussion, not files) showing:
  1. Horizontal card layout with attendee avatars, category icons, and event photos
  2. Split login page with vineyard photo and form
  3. Left sidebar nav (Itinerary + Map), event detail with Google Maps embed and attendee photos

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/(app)/itinerary/_components/DayCard.tsx` — Current day card component (needs redesign to horizontal card layout)
- `src/app/(app)/itinerary/_components/EventRow.tsx` — Current event row (replace with horizontal EventCard)
- `src/app/(app)/itinerary/_components/EventDetailPanel.tsx` — Event detail panel (enhance with map embed, hero image, avatar list)
- `src/app/(app)/itinerary/_components/EventFormPanel.tsx` — Event form (add address autocomplete, photo upload)
- `src/app/(app)/itinerary/_components/AttendeeList.tsx` — Attendee list (enhance with photo avatars)
- `src/app/(app)/itinerary/_components/RsvpButton.tsx` — RSVP button (keep, may restyle)
- `src/app/(app)/itinerary/_components/CommentList.tsx` + `CommentInput.tsx` — Comments (keep as-is)
- `src/components/layout/Header.tsx` — Header (add profile/avatar menu option)
- `src/components/ui/` — Full shadcn/ui component library (avatar, badge, button, card, dialog, drawer, sheet, etc.)

### Established Patterns
- Server Components for data fetching, Client Components for interactivity
- Server Actions in `src/lib/actions/` with Zod validation
- Supabase client via `@supabase/ssr` cookie-based sessions
- Sheet (desktop) / Drawer (mobile) pattern for panels
- Tailwind v4 with OKLCH Tuscan palette

### Integration Points
- `src/app/(app)/layout.tsx` — Needs sidebar added to layout
- `src/app/(app)/itinerary/page.tsx` — Server Component, main data fetching
- `src/lib/supabase/` — Supabase client utilities (need Storage setup for photo uploads)
- `middleware.ts` — Route protection (new /map route needs protection)
- Database: `profiles` table needs `avatar_url` column; `events` table needs `cover_image_url`, `address`, `latitude`, `longitude` columns

</code_context>

<specifics>
## Specific Ideas

- User provided 3 reference mockup images showing the exact visual direction — horizontal cards with attendee avatars and category icons, split-screen login, sidebar with map view, and event detail with embedded Google Map
- The reference shows a premium travel app aesthetic — serif italic titles, muted earth tones, generous whitespace
- Event cards in the reference have a slight cream/beige card background with subtle borders
- The "CONFIRM ATTENDANCE" button in the reference uses the terracotta color — matches existing RSVP button palette
- Attendee avatars on cards show 2-3 photos with a "+N" overflow indicator

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-polish-and-comments*
*Context gathered: 2026-04-04*
