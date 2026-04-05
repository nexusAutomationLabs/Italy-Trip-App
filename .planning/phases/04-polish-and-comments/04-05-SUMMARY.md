---
phase: 04-polish-and-comments
plan: 05
subsystem: ui
tags: [google-maps, react-google-maps, places-autocomplete, map-view, next-config]

# Dependency graph
requires:
  - phase: 04-01
    provides: latitude, longitude, address columns in events table and event schema
  - phase: 04-02
    provides: sidebar and mobile tab bar with Map nav link
  - phase: 04-04
    provides: GoogleMapsEmbed in EventDetailPanel, @vis.gl/react-google-maps installed
provides:
  - /map page with Google Maps and color-coded event location pins
  - AddressAutocomplete component using Google Places API
  - APIProvider wrapped around ItineraryClient for form autocomplete support
  - next.config.ts with supabase.co and unsplash remotePatterns
affects: [future map enhancements, address/geocoding features]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server Component fetches geo-filtered events; Client MapView renders pins — standard RSC split"
    - "APIProvider placed at ItineraryClient level (client boundary) not in page.tsx (server) — required for @vis.gl hooks"
    - "Cast Supabase null-filtered rows with 'as unknown as' for TypeScript correctness"

key-files:
  created:
    - src/app/(app)/map/page.tsx
    - src/app/(app)/map/_components/MapView.tsx
    - src/app/(app)/itinerary/_components/AddressAutocomplete.tsx
  modified:
    - src/app/(app)/itinerary/_components/EventFormPanel.tsx
    - src/app/(app)/itinerary/_components/ItineraryClient.tsx
    - src/app/(app)/itinerary/page.tsx
    - next.config.ts

key-decisions:
  - "MapView gets APIProvider internally (not from page.tsx server component) — client boundary requirement"
  - "ItineraryClient receives googleMapsApiKey prop and wraps content with APIProvider when present — Option B from plan"
  - "Legacy google.maps.places.Autocomplete used for AddressAutocomplete; componentRestrictions: italy for better results"
  - "null-filtered Supabase query rows cast via 'as unknown as MapEvent[]' since TypeScript cannot infer .not() filter"

patterns-established:
  - "APIProvider wraps client subtree, not server page — enables useMapsLibrary in nested client components"
  - "Graceful API key handling: check key before rendering APIProvider, show informative fallback otherwise"

requirements-completed: []

# Metrics
duration: 15min
completed: 2026-04-05
---

# Phase 04 Plan 05: Map View and Places Autocomplete Summary

**Google Maps view with color-coded event pins and Places Autocomplete address field with auto-filled lat/lng coordinates**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-05T00:38:28Z
- **Completed:** 2026-04-05T00:55:00Z
- **Tasks:** 2 complete (Task 3 is checkpoint awaiting human verification)
- **Files modified:** 7

## Accomplishments
- /map page renders Google Maps with color-coded pins per event category (terracotta/olive/gold/muted)
- InfoWindow shows event title and address on marker click
- Graceful fallback when API key missing (informative message) or no events with coordinates
- AddressAutocomplete uses Google Places API with Italy restriction, auto-fills lat/lng on selection
- APIProvider correctly placed at client boundary (ItineraryClient) not server page
- Production build completes cleanly, /map shows as dynamic route

## Task Commits

Each task was committed atomically:

1. **Task 1: Map view page with event pins** - `a132ed5` (feat)
2. **Task 2: Google Places Autocomplete in event form** - `beef608` (feat)

**Plan metadata:** pending (after human verification checkpoint)

## Files Created/Modified
- `src/app/(app)/map/page.tsx` - Server Component fetching geo-filtered events, passing to MapView
- `src/app/(app)/map/_components/MapView.tsx` - Client component with APIProvider, Map, AdvancedMarker, Pin, InfoWindow
- `src/app/(app)/itinerary/_components/AddressAutocomplete.tsx` - Google Places Autocomplete input, degrades gracefully without key
- `src/app/(app)/itinerary/_components/EventFormPanel.tsx` - Replaced plain address Input with AddressAutocomplete
- `src/app/(app)/itinerary/_components/ItineraryClient.tsx` - Added googleMapsApiKey prop, wraps content with APIProvider
- `src/app/(app)/itinerary/page.tsx` - Passes NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to ItineraryClient
- `next.config.ts` - Added remotePatterns for supabase.co storage and images.unsplash.com

## Decisions Made
- APIProvider placed at ItineraryClient (client boundary) rather than itinerary/page.tsx (server component) — @vis.gl hooks require being inside APIProvider context
- Used Option B from plan: ItineraryClient receives `googleMapsApiKey` prop and wraps with APIProvider internally
- Legacy `google.maps.places.Autocomplete` used with `componentRestrictions: { country: 'it' }` for Italy-focused suggestions
- TypeScript null narrowing limitation worked around via `as unknown as MapEvent[]` — the `.not()` Supabase filter guarantees non-null at runtime

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type error on Supabase null-filtered query**
- **Found during:** Task 1 (Map view page)
- **Issue:** `supabase.not('latitude', 'is', null)` filters nulls at runtime but TypeScript still types result as `number | null` — caused type assignment error on MapEvent interface
- **Fix:** Cast with `as unknown as MapEvent[]` after confirming the filter guarantees non-null values at runtime
- **Files modified:** src/app/(app)/map/page.tsx
- **Verification:** TypeScript compiles without errors
- **Committed in:** a132ed5 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 TypeScript type narrowing workaround)
**Impact on plan:** Required for TypeScript correctness. No scope creep.

## Issues Encountered
None beyond the TypeScript type narrowing issue above.

## Known Stubs
None — all map features are either fully wired (server-side event fetch, client map render) or explicitly show a meaningful fallback when the API key is absent.

## Next Phase Readiness
- All Phase 4 features complete; awaiting human verification (Task 3 checkpoint)
- User needs to add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable live map and autocomplete features
- Production build clean, app ready for group use once API key is configured

---
*Phase: 04-polish-and-comments*
*Completed: 2026-04-05*
