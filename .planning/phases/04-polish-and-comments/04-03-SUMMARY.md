---
phase: 04-polish-and-comments
plan: "03"
subsystem: itinerary-ui
tags: [ui, itinerary, horizontal-scroll, event-cards, design-system]
dependency_graph:
  requires: ["04-01"]
  provides: [EventCard, AvatarStrip, HorizontalDayRow, DayCard-redesign]
  affects: [itinerary-page, event-display]
tech_stack:
  added: []
  patterns: [horizontal-scroll-snap, lucide-icons, playfair-bold-italic, category-icons]
key_files:
  created:
    - src/app/(app)/itinerary/_components/EventCard.tsx
    - src/app/(app)/itinerary/_components/AvatarStrip.tsx
    - src/app/(app)/itinerary/_components/HorizontalDayRow.tsx
  modified:
    - src/app/(app)/itinerary/_components/DayCard.tsx
    - src/app/(app)/itinerary/_components/ItineraryClient.tsx
    - src/app/(app)/itinerary/page.tsx
    - src/lib/constants/categories.ts
decisions:
  - "Used AvatarGroup pattern from shadcn avatar.tsx (ring-2 ring-background overlap) for AvatarStrip overflow badge"
  - "HorizontalDayRow scroll arrows conditionally rendered via canScrollLeft/canScrollRight state with ResizeObserver"
  - "getCategoryBgColor helper extracts only bg-* classes from CATEGORY_STYLES for the color strip (avoids text-color bleed)"
  - "Scroll arrows hidden on mobile via hidden lg:flex — native swipe only below lg breakpoint"
metrics:
  duration: 10min
  completed_date: "2026-04-05"
  tasks_completed: 2
  files_changed: 7
---

# Phase 4 Plan 03: Horizontal Itinerary Card Layout Summary

**One-liner:** Horizontal scroll-snap event cards per day with Playfair bold-italic titles, category icon mapping, AvatarStrip attendee display, and DAY ONE ordinal day headers.

## What Was Built

The itinerary page was transformed from a vertical stacked list to a horizontal card-per-day layout:

1. **`CATEGORY_ICONS`** — Added icon mapping (Utensils, Camera, Users, MapPin, Sun) to `categories.ts` alongside the existing CATEGORY_STYLES and CATEGORY_LABELS.

2. **`AvatarStrip`** — New component rendering up to 3 overlapping attendee avatar circles (32px, `-ml-1` overlap) with a +N badge for overflow. Uses shadcn Avatar/AvatarImage/AvatarFallback with ring-2 ring-background overlap. Returns null when no attendees.

3. **`EventCard`** — New horizontal card component (min-w-[260px] max-w-[320px]) replacing EventRow. Features:
   - Optional cover photo (80px height, object-cover, rounded-t-lg) or category color strip (8px)
   - Category badge + time on top row (formatTime parses HH:MM:SS directly, no Date object)
   - Playfair Display bold italic title (`font-heading font-bold italic`, 18px, truncate)
   - 2-line clamped description snippet
   - AvatarStrip (bottom-left) + category icon (bottom-right)
   - Hover: shadow-md + 2px primary left border

4. **`HorizontalDayRow`** — Scroll container with scroll-snap-type mandatory, hidden scrollbar across browsers, and desktop-only ChevronLeft/ChevronRight arrows. Arrow visibility controlled by `canScrollLeft`/`canScrollRight` state via scroll event + ResizeObserver.

5. **`DayCard` (rewrite)** — Replaced Card/CardHeader/CardContent with simpler section div:
   - "DAY ONE" ornamental label (12px, font-bold, text-accent, letter-spacing 0.1em)
   - Date in 18px bold Montserrat below
   - Arrival/Departure labels for special days
   - 4px primary left border on arrival/departure days
   - Empty state: "Nothing planned yet" card with "Add something for the group to do on this day." and full-width ghost Add Event button
   - Events: HorizontalDayRow

6. **`ItineraryClient`** — Container widened from `max-w-5xl` to `max-w-7xl mx-auto px-4 lg:px-8 py-8`.

7. **`page.tsx`** — Hero section removed; timezone label added (`text-xs text-muted-foreground italic`); Supabase query updated to `profiles(display_name, avatar_url)`.

## Verification

- `npm run build`: PASS (no errors)
- TypeScript: PASS (no errors)
- All acceptance criteria met for both tasks

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. All components are fully wired: EventCard receives real EventRow data from Supabase query, AvatarStrip receives real rsvps with profiles including avatar_url, HorizontalDayRow renders real EventCard instances.

## Self-Check: PASSED

All created files verified on disk. Both task commits (f10c547, 9887944) verified in git log.
