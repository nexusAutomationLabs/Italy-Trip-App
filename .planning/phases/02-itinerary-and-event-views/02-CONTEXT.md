# Phase 2: Itinerary and Event Views - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Pre-seeded day-by-day itinerary with event detail views and full Tuscany visual design. Users can browse all 10 days (May 7-16), see events per day, and open event details in a slide-out panel. Read-only — no event creation, editing, or RSVP (that's Phase 3).

</domain>

<decisions>
## Implementation Decisions

### Day-by-Day Layout
- **D-01:** Scrolling vertical list of all 10 days — no accordion, no tabs. Full trip visible at a glance.
- **D-02:** Day headers use "Thursday, May 7" format (weekday + date). No day numbering (no "Day 1", "Day 2").
- **D-03:** Arrival (May 7) and departure (May 16) days have subtle accent styling — different background tint or border color on the day card. Same layout as regular days, just visually distinct.
- **D-04:** Each event row on a day card shows: title, time, category tag (colored pill), and attendee count.

### Event Detail Panel
- **D-05:** Clicking an event opens a right-side slide-out panel (~40-50% width on desktop). On mobile, becomes a full-screen bottom sheet.
- **D-06:** No separate event detail page route — panel overlays the itinerary. User stays in context.
- **D-07:** Google Maps location link displayed as clickable text with a map pin icon — opens in new tab.
- **D-08:** Category tags use colored pill badges with category-specific colors from the Tuscan palette (terracotta for dinner, olive for excursion, gold for group activity, etc.).

### Tuscany Visual Design
- **D-09:** Hero section at top only — keep the existing Tuscany countryside golden hour background image from Phase 1.
- **D-10:** Day cards below the hero are clean white cards on the warm cream background. No additional Tuscany imagery in day cards.
- **D-11:** Carries forward Phase 1 design: Playfair Display headings, Montserrat body, warm earth tone palette (terracotta, olive, cream, gold).

### Seed Data
- **D-12:** Five event categories: Dinner, Excursion, Group Activity, Travel, Open Day.
- **D-13:** Seed data delivered via SQL migration file (Supabase migration with INSERT statements). Reproducible and version-controlled.
- **D-14:** Each seeded event includes: title, approximate time, category, and 1-2 sentence description. Location/link fields left blank where unknown — users fill in later via Phase 3.

### Claude's Discretion
- Specific Tuscan palette color assignments for each category tag
- Slide-out panel animation and transition details
- Exact accent styling approach for arrival/departure day cards (tint color, border style)
- Event row spacing and typography within day cards
- Mobile bottom sheet behavior (drag handle, snap points)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/PROJECT.md` — Trip context (dates, villa, group composition, planned events per day)
- `.planning/REQUIREMENTS.md` — ITIN-01 through ITIN-04, EVNT-01, EVNT-05, EVNT-06, DSGN-02 are this phase's requirements
- `.planning/ROADMAP.md` — Phase 2 success criteria and dependencies

### Technology Guidance
- `CLAUDE.md` §Technology Stack — Mandated stack: Next.js 15, Supabase, @supabase/ssr, Tailwind v4, shadcn/ui
- `CLAUDE.md` §What NOT to Use — Avoid deprecated packages, use getUser() not getSession()

### Prior Phase Context
- `.planning/phases/01-foundation-and-auth/01-CONTEXT.md` — Phase 1 decisions: auth flow, Tuscan palette, design patterns established

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/card.tsx` — Card, CardHeader, CardTitle, CardDescription, CardContent — use for day cards
- `src/components/ui/button.tsx` — Button component with variants
- `src/components/layout/Header.tsx` — App header with user menu and admin badge
- `src/app/globals.css` — Full Tuscan OKLCH color palette, font-heading (Playfair) and font-sans (Montserrat) configured

### Established Patterns
- CSS background-image for Unsplash imagery (not next/image) — used in itinerary hero and auth pages
- Dark overlay (`bg-black/50`) for text readability over images
- `force-dynamic` on authenticated layout — prevents ISR caching
- Supabase server client (`src/lib/supabase/server.ts`) for server-side data fetching
- Supabase client (`src/lib/supabase/client.ts`) for client-side operations

### Integration Points
- `src/app/(app)/itinerary/page.tsx` — Current placeholder page to be replaced with real itinerary
- `src/app/(app)/layout.tsx` — Authenticated layout with Header, wraps all app pages
- Supabase database — new tables needed for events, categories, and RSVPs (schema design in this phase)

</code_context>

<specifics>
## Specific Ideas

- Trip events from PROJECT.md to seed: Halifax departure, Florence night + dinner, villa check-in, villa day + dinner, Pienza/Siena/Gladiator trip, food & wine tour, split day (coastal towns / gravel bike tour), open day, hot springs + Mark's birthday dinner, departure day
- Villa VRBO link: https://www.vrbo.com/en-ca/cottage-rental/p1190044vb
- Bike tour link: https://www.bike-tour-tuscany.it/en/bike-tours-tuscany/one-day-bike-tours-in-tuscany/
- App title: "Berwick goes to Tuscany 2026" (established in Phase 1 Header)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-itinerary-and-event-views*
*Context gathered: 2026-04-03*
