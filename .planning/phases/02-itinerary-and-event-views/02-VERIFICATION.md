---
phase: 02-itinerary-and-event-views
verified: 2026-04-03T17:41:17Z
status: human_needed
score: 8/8 must-haves verified
human_verification:
  - test: "Run the app and confirm Tuscany hero image renders"
    expected: "Hero section shows Tuscany golden-hour vineyard image (Unsplash photo-1518098268026-4e89f1a2cd8e) behind 'Berwick goes to Tuscany 2026' heading"
    why_human: "Image URL correctness and visual render cannot be confirmed without a browser. The URL is static and unvalidated programmatically."
  - test: "After applying SQL migrations, verify all 10 day cards render with seeded events"
    expected: "10 day cards appear from Thursday, May 7 through Saturday, May 16. Each day shows at least one event row with time, category badge, and '0 attending'."
    why_human: "Migrations must be manually applied to Supabase. Without live data the UI shows 'Nothing scheduled yet' on all days — this is expected pre-migration, not a bug."
  - test: "Click an event row on desktop and verify Sheet slide-out opens"
    expected: "Right-side Sheet panel opens showing event title (in heading), category badge, date/time, description, and location link for events that have one"
    why_human: "Sheet/Drawer interaction and responsive switching cannot be verified without a browser."
  - test: "Verify May 7 (arrival) and May 16 (departure) cards have terracotta left border"
    expected: "Both day cards display a visible left border in the primary/terracotta color. Other day cards have no left border."
    why_human: "Visual styling requires browser render to confirm the Tailwind border-l-4 border-primary class produces the correct terracotta colour."
  - test: "On mobile viewport, click an event and verify bottom Drawer opens"
    expected: "Drawer slides up from bottom of screen (vaul drawer). Can be swiped or closed via X button."
    why_human: "Responsive breakpoint behaviour (Sheet vs Drawer toggle at 768px via useMediaQuery) requires browser testing."
  - test: "Verify location link for a villa or bike-tour event opens in a new tab"
    expected: "Clicking 'VRBO Villa' or 'Bike Tour Tuscany' link opens the URL in a new browser tab."
    why_human: "target='_blank' behaviour and correct URL values require browser confirmation."
---

# Phase 2: Itinerary and Event Views Verification Report

**Phase Goal:** Users can browse a real, pre-seeded day-by-day itinerary with full Tuscany visual design
**Verified:** 2026-04-03T17:41:17Z
**Status:** human_needed — all automated checks passed; 6 items require browser/database confirmation
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User sees all 10 days (May 7-16) as a scrolling vertical list of day cards | ✓ VERIFIED | ItineraryClient.tsx generates all 10 dates (2026-05-07 to 2026-05-16) via loop and renders a DayCard per date |
| 2 | Each day card header shows "Thursday, May 7" format (weekday + date, no day numbering) | ✓ VERIFIED | DayCard.tsx line 18: `format(new Date(\`${date}T12:00:00\`), 'EEEE, MMMM d')` — noon anchor applied, no day numbering |
| 3 | Arrival (May 7) and departure (May 16) day cards have a terracotta left border accent | ✓ VERIFIED | DayCard.tsx lines 13-21: `border-l-4 border-primary` applied when `date === '2026-05-07'` or `date === '2026-05-16'` |
| 4 | Each event row shows title, time, category badge (colored pill), and attendee count | ✓ VERIFIED | EventRow.tsx renders time span, title span, Badge with CATEGORY_STYLES, and `{count} attending` span |
| 5 | Clicking an event opens a slide-out panel on desktop or bottom sheet on mobile | ✓ VERIFIED | EventDetailPanel.tsx uses useMediaQuery('(min-width: 768px)') to render Sheet (desktop) or Drawer (mobile) |
| 6 | Event detail panel shows title, description, date/time, category badge, location link, attendee count | ✓ VERIFIED | EventDetailPanel.tsx EventDetails function renders all 6 fields in order; location link conditional on `event.location_url` |
| 7 | Google Maps location link shows MapPin icon and opens in new tab | ✓ VERIFIED | EventDetailPanel.tsx lines 59-69: `<a target="_blank" rel="noopener noreferrer">` with `<MapPin className="size-4" />` |
| 8 | Hero section with Tuscany golden hour image is preserved at top | ✓ VERIFIED | page.tsx lines 17-33: 40vh hero div with static Unsplash URL `photo-1518098268026-4e89f1a2cd8e`, "Berwick goes to Tuscany 2026" heading |

**Score:** 8/8 truths verified

---

### Required Artifacts

#### Plan 01 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `supabase/migrations/00002_create_events_table.sql` | ✓ VERIFIED | Contains `create type event_category`, `create table public.events`, `create table public.rsvps`, two `enable row level security` statements, and all 5 enum values |
| `supabase/migrations/00003_seed_trip_events.sql` | ✓ VERIFIED | 16 INSERT rows covering all 10 dates (May 7-16). Confirmed per-day: 07:1, 08:2, 09:2, 10:2, 11:1, 12:1, 13:2, 14:1, 15:2, 16:2 |
| `src/types/database.types.ts` | ✓ VERIFIED | Contains `EventCategory`, `events:` with Row/Insert/Update, `rsvps:` with Row/Insert/Update, `EventRow` convenience type, `Enums: { event_category }`, profiles preserved |
| `src/components/ui/sheet.tsx` | ✓ VERIFIED | Uses `@base-ui/react/dialog` — no `@radix-ui` |
| `src/components/ui/drawer.tsx` | ✓ VERIFIED | Uses `vaul` — no `@radix-ui` |
| `src/components/ui/badge.tsx` | ✓ VERIFIED | Uses `@base-ui/react/merge-props` and `@base-ui/react/use-render` — no `@radix-ui` |

#### Plan 02 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/lib/constants/categories.ts` | ✓ VERIFIED | Exports `CATEGORY_STYLES` and `CATEGORY_LABELS`, both typed as `Record<EventCategory, string>` with all 5 categories |
| `src/hooks/use-media-query.ts` | ✓ VERIFIED | `'use client'` directive, `window.matchMedia`, exports `useMediaQuery`, SSR-safe `false` default |
| `src/app/(app)/itinerary/_components/EventRow.tsx` | ✓ VERIFIED | `<button>` element, imports `Badge` and `CATEGORY_STYLES`/`CATEGORY_LABELS`, renders `attending` text |
| `src/app/(app)/itinerary/_components/DayCard.tsx` | ✓ VERIFIED | Contains `T12:00:00` noon anchor, `border-l-4 border-primary`, `2026-05-07`/`2026-05-16` date checks, `Arrival Day`/`Departure Day` labels, `Nothing scheduled yet` empty state |
| `src/app/(app)/itinerary/_components/EventDetailPanel.tsx` | ✓ VERIFIED | `'use client'`, imports sheet + drawer + useMediaQuery + MapPin, `target="_blank"`, `aria-label`, conditional `location_url` check |
| `src/app/(app)/itinerary/_components/ItineraryClient.tsx` | ✓ VERIFIED | `'use client'`, `useState<EventRow | null>`, generates 2026-05-07 through 2026-05-16, renders `<DayCard` and `<EventDetailPanel` |
| `src/app/(app)/itinerary/page.tsx` | ✓ VERIFIED | Async Server Component, `from('events')`, `select('*, rsvps(count)')`, passes to `<ItineraryClient`, no `getUser`, no `differenceInCalendarDays`, hero title correct |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `page.tsx` | Supabase events table | `from('events').select('*, rsvps(count)')` | ✓ WIRED | page.tsx line 9-12 — query present, result bound to `events`, passed as props |
| `page.tsx` | `ItineraryClient.tsx` | `<ItineraryClient events={...} />` | ✓ WIRED | page.tsx line 36 — events cast to EventRow[] and passed |
| `ItineraryClient.tsx` | `EventDetailPanel.tsx` | passes `selectedEvent` and `onClose` | ✓ WIRED | ItineraryClient.tsx lines 45-48 — `event={selectedEvent}`, `onClose={() => setSelectedEvent(null)}` |
| `EventRow.tsx` | `categories.ts` | imports CATEGORY_STYLES and CATEGORY_LABELS | ✓ WIRED | EventRow.tsx line 2, used at lines 36-38 |
| `EventDetailPanel.tsx` | `categories.ts` | imports CATEGORY_STYLES and CATEGORY_LABELS | ✓ WIRED | EventDetailPanel.tsx line 21, used at line 51 |
| `DayCard.tsx` | `EventRow.tsx` | maps events to `<EventRow>` components | ✓ WIRED | DayCard.tsx line 37 — `<EventRow key={event.id} event={event} onClick={onEventClick} />` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `page.tsx` | `events` | `supabase.from('events').select('*, rsvps(count)')` | Yes — DB query with rsvps count join | ✓ FLOWING |
| `ItineraryClient.tsx` | `events` prop | Passed from page.tsx server fetch | Yes — flows from verified DB query | ✓ FLOWING |
| `EventRow.tsx` | `event` prop + `count` | Derived from events array + `event.rsvps?.[0]?.count` | Yes — flows through; count is 0 until RSVPs seeded (correct) | ✓ FLOWING |
| `EventDetailPanel.tsx` | `event` prop | `selectedEvent` state set by DayCard click | Yes — reactive from DB-sourced events | ✓ FLOWING |

Note on RSVPs: `0 attending` on all events is correct expected behaviour for Phase 2. No RSVPs are seeded in migrations — this is a read-only display phase. Phase 3 adds RSVP write policies and the ability to join events.

Note on migrations: The SQL migrations must be manually applied in Supabase Dashboard SQL Editor before live data appears. Until then, the UI correctly shows "Nothing scheduled yet" on all 10 day cards. The code path is fully wired — the data absence is an operational prerequisite, not a code gap.

---

### Behavioral Spot-Checks

| Behavior | Check | Result | Status |
|----------|-------|--------|--------|
| Build produces no errors | `npm run build` | Exit 0, `/itinerary` route at 56.8 kB | ✓ PASS |
| All 10 trip days have seed data | grep per date in 00003_seed_trip_events.sql | 16 events across all 10 dates | ✓ PASS |
| events table schema has correct enum | grep in 00002_create_events_table.sql | All 5 categories present | ✓ PASS |
| CATEGORY_STYLES used in both display components | grep -rn in src/ | Used in EventRow.tsx and EventDetailPanel.tsx | ✓ PASS |
| Sheet uses base-ui (not Radix) | grep in sheet.tsx | `@base-ui/react/dialog` | ✓ PASS |
| Badge uses base-ui (not Radix) | grep in badge.tsx | `@base-ui/react/merge-props` | ✓ PASS |
| Drawer uses vaul | grep in drawer.tsx | `vaul` | ✓ PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| ITIN-01 | 02-02 | User sees day-by-day itinerary covering May 7-16, 2026 | ✓ SATISFIED | ItineraryClient generates all 10 dates; DayCard rendered per date |
| ITIN-02 | 02-01 | Itinerary pre-seeded with group's planned events | ✓ SATISFIED | 00003_seed_trip_events.sql inserts 16 events across all 10 days |
| ITIN-03 | 02-02 | Arrival day (May 7) and departure day (May 16) have distinct visual treatment | ✓ SATISFIED | `border-l-4 border-primary` + "Arrival Day"/"Departure Day" labels in DayCard.tsx |
| ITIN-04 | 02-02 | Each day displays events with title, time, and attendee count | ✓ SATISFIED | EventRow renders title, formatted time, and `{count} attending` |
| EVNT-01 | 02-02 | User can view event details (title, description, date/time, location, external link) | ✓ SATISFIED | EventDetailPanel EventDetails function renders all 6 fields |
| EVNT-05 | 02-01, 02-02 | Events display a category tag | ✓ SATISFIED | Badge with CATEGORY_STYLES/CATEGORY_LABELS in both EventRow and EventDetailPanel |
| EVNT-06 | 02-02 | Event location renders as a clickable link | ✓ SATISFIED | `<a href={event.location_url} target="_blank">` with MapPin icon in EventDetailPanel |
| DSGN-02 | 02-02 | Tuscany/Florence-themed visual design with curated Unsplash imagery | ✓ SATISFIED | Static Unsplash URL `photo-1518098268026-4e89f1a2cd8e` in page.tsx hero |

No orphaned requirements — all 8 IDs from PLAN frontmatter accounted for and satisfied.

---

### Anti-Patterns Found

No anti-patterns detected in modified files. Specific checks run:

- TODO/FIXME/placeholder comments: none found
- Empty return values (return null, return []): none in render paths
- Hardcoded empty data passed as props: `events ?? []` fallback in page.tsx is correct null-safety, not a stub — it's a safety guard on a live query
- Console.log-only handlers: none found
- Stub implementations: none — all components render real data from props

---

### Human Verification Required

#### 1. Tuscany Hero Image Visual Render

**Test:** Visit `/itinerary` in a browser after logging in.
**Expected:** Hero section renders with a Tuscany/vineyard landscape photo behind "Berwick goes to Tuscany 2026" heading and "May 7 – 16, 2026" subtext. Image fills the full width at 40vh height.
**Why human:** The Unsplash image ID `photo-1518098268026-4e89f1a2cd8e` is a static URL embedded in a CSS `backgroundImage` style — correctness of the image subject cannot be confirmed without rendering.

#### 2. Itinerary Renders After Migrations Applied

**Test:** Apply `00002_create_events_table.sql` then `00003_seed_trip_events.sql` in Supabase SQL Editor. Reload `/itinerary`.
**Expected:** All 10 day cards show their events. Day cards show event rows with time, title, category badge (colored pill), and "0 attending". Before migration, all 10 cards show "Nothing scheduled yet" — this is correct.
**Why human:** SQL migrations are applied manually outside the codebase. Live database state cannot be verified programmatically.

#### 3. Event Detail Panel (Desktop — Sheet)

**Test:** On a desktop viewport (≥768px), click any event row.
**Expected:** A Sheet slides in from the right showing: event title in heading, category badge, date + time (e.g., "Monday, May 11 at 9:00 AM"), description paragraph, location link with MapPin icon for events with a URL (Check Into Villa, Gravel Bike Tour), and "0 attending".
**Why human:** Sheet open/close interaction and rendered content requires browser testing.

#### 4. Arrival/Departure Day Visual Accent

**Test:** Scroll to May 7 and May 16 day cards.
**Expected:** Both have a visible terracotta/primary-coloured left border (4px solid). All other day cards (May 8-15) have no left border.
**Why human:** Colour correctness of `border-primary` depends on the CSS variable defined in globals.css — requires visual confirmation.

#### 5. Mobile Drawer Interaction

**Test:** On a mobile viewport (<768px) or DevTools mobile emulation, click an event row.
**Expected:** A Drawer slides up from the bottom of the screen showing the same event details. Can be dismissed by swiping down or tapping outside.
**Why human:** Responsive behaviour (Sheet vs Drawer toggle at 768px via `useMediaQuery`) and vaul Drawer swipe-to-dismiss require browser testing.

#### 6. Location Links Open in New Tab

**Test:** Click the location link on the "Check Into Villa" or "Gravel Bike Tour" event detail panel.
**Expected:** VRBO or Bike Tour Tuscany URL opens in a new browser tab. URL is correct.
**Why human:** `target="_blank"` behaviour and URL correctness require browser confirmation.

---

### Gaps Summary

No gaps found. All 8 must-have truths are verified at all four levels (exists, substantive, wired, data-flowing). The phase goal is structurally achieved.

The 6 human verification items are operational confirmations (migrations applied, browser visual rendering) rather than code gaps. The architecture and implementation are complete and correct.

---

_Verified: 2026-04-03T17:41:17Z_
_Verifier: Claude (gsd-verifier)_
