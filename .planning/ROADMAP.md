# Roadmap: Tuscany Trip App

## Overview

Four phases deliver a private trip coordination app for 8 friends visiting a Florence villa in May 2026. Phase 1 establishes the authenticated shell with correct security foundations before any feature work begins. Phase 2 builds the read path — a real, pre-seeded itinerary users can browse. Phase 3 adds the write path — RSVP, event creation, and editing — which is the core reason the app exists. Phase 4 polishes the experience with event comments and any refinements surfaced by early group use.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation and Auth** - Authenticated shell deployed to Vercel with secure Supabase setup
- [ ] **Phase 2: Itinerary and Event Views** - Pre-seeded day-by-day itinerary with full Tuscany visual design
- [x] **Phase 3: RSVP and Event Mutations** - Full interactive app — users can RSVP, create, edit, and delete events (completed 2026-04-03)
- [ ] **Phase 4: Polish and Comments** - Event comments, edit form, and pre-trip refinements

## Phase Details

### Phase 1: Foundation and Auth
**Goal**: Users can securely sign up and access a protected itinerary page on a live Vercel deployment
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, DSGN-01, DSGN-03
**Success Criteria** (what must be TRUE):
  1. A new user can sign up with email and password via the unlisted sign-up link and reach the itinerary page
  2. A returning user stays logged in across browser refreshes and new visits without re-authenticating
  3. An unauthenticated visitor who tries to access any app route is redirected to the login page
  4. The app is deployed to Vercel and accessible at a live URL with Supabase auth working end-to-end
  5. The layout is responsive and renders correctly on both mobile and desktop
**Plans**: 3 plans
Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 15, install deps, shadcn/ui, Tailwind Tuscan theme, Supabase client utilities, profiles migration
- [x] 01-02-PLAN.md — Auth pages (login/signup) with branded Tuscany design, Zod validation, Supabase server actions
- [x] 01-03-PLAN.md — Middleware route protection, authenticated shell with header/admin badge, placeholder itinerary with countdown
**UI hint**: yes

### Phase 2: Itinerary and Event Views
**Goal**: Users can browse a real, pre-seeded day-by-day itinerary with full Tuscany visual design
**Depends on**: Phase 1
**Requirements**: ITIN-01, ITIN-02, ITIN-03, ITIN-04, EVNT-01, EVNT-05, EVNT-06, DSGN-02
**Success Criteria** (what must be TRUE):
  1. The itinerary shows all 10 days (May 7-16) with the group's pre-seeded events visible on first login
  2. Arrival day (May 7) and departure day (May 16) have a visually distinct treatment from regular days
  3. Each day card shows all events with title, time, and attendee count
  4. Opening an event shows full details — description, date/time, location, and a clickable Google Maps link
  5. Each event displays a category tag (dinner, excursion, group activity, open day) and the page uses Tuscany/Florence imagery
**Plans**: 2 plans
Plans:
- [x] 02-01-PLAN.md — Database schema (events + rsvps tables), seed data for all 10 trip days, TypeScript types, shadcn components
- [x] 02-02-PLAN.md — Itinerary UI: day cards, event rows, event detail panel (Sheet/Drawer), page rewrite with Supabase data fetching
**UI hint**: yes

### Phase 3: RSVP and Event Mutations
**Goal**: Users can RSVP to events, see who is attending, and create or delete events
**Depends on**: Phase 2
**Requirements**: RSVP-01, RSVP-02, RSVP-03, EVNT-02, EVNT-03, EVNT-04
**Success Criteria** (what must be TRUE):
  1. A user can toggle their attendance on any event and the change is immediately visible to all other users
  2. An event detail page shows the list of attendees by name
  3. A user can create a new event with title, description, date, time, location, and link — and it appears in the itinerary
  4. A user can edit or delete their own events; admin (Adam) can edit or delete any event
  5. Users can leave a comment on an event (e.g. "I'll drive", "need vegetarian option")
**Plans**: 3 plans
Plans:
- [x] 03-01-PLAN.md — Database migration (RSVP write policies, comments table, events write policies), server actions, type updates, query changes
- [x] 03-02-PLAN.md — RSVP button with optimistic toggle, attendee list, event create/edit form, three-dot menu with delete confirmation
- [x] 03-03-PLAN.md — Comments section (CommentList + CommentInput) in event detail panel, human verification of full Phase 3
**UI hint**: yes

### Phase 4: Polish and Comments
**Goal**: The app is refined and ready for the group to use during the May 2026 trip
**Depends on**: Phase 3
**Requirements**: (none — all v1 requirements covered in phases 1-3; this phase addresses pre-trip polish)
**Success Criteria** (what must be TRUE):
  1. Any usability issues surfaced by the group during pre-trip testing are resolved
  2. The app performs correctly in European timezone context — event times display in Italy time (CEST)
  3. The visual design is consistent and polished across all screens and device sizes
**Plans**: 5 plans
Plans:
- [x] 04-01-PLAN.md — Install dependencies, DB migration (new columns + storage buckets), update types, Google Maps API key
- [ ] 04-02-PLAN.md — Sidebar navigation + mobile tab bar, login page split-screen redesign
- [ ] 04-03-PLAN.md — Itinerary horizontal card layout, day headers with ordinals, timezone label, empty states
- [ ] 04-04-PLAN.md — Avatar uploads, event cover photos, Google Maps embed in detail, profile modal
- [ ] 04-05-PLAN.md — Map view page with event pins, Google Places Autocomplete, final verification
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Auth | 2/3 | In Progress|  |
| 2. Itinerary and Event Views | 1/2 | In Progress|  |
| 3. RSVP and Event Mutations | 3/3 | Complete   | 2026-04-03 |
| 4. Polish and Comments | 1/5 | In Progress | - |
