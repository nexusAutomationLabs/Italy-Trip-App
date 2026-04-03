# Project Research Summary

**Project:** Tuscany Trip App
**Domain:** Private group trip coordination web app
**Researched:** 2026-04-03
**Confidence:** HIGH

## Executive Summary

The Tuscany Trip App is a small, private web application for 8 friends coordinating a 10-day villa trip to Italy (May 7-16, 2026). The core problem is visibility and sign-up — not trip planning, decision-making, or communication. The app must answer one question reliably: "What is happening on each day of the trip, and who is going?" This framing is critical because it rules out a large class of features (chat, expense tracking, real-time updates) that other group travel apps include but this context does not need.

Research across comparable tools and the Next.js + Supabase ecosystem converges on a deliberately simple architecture: one Next.js 15 application on Vercel, one Supabase project handling auth and Postgres, and no separate backend service. Server Components handle all data reading; Server Actions handle all writes. The app requires 4 database tables, cookie-based auth sessions, and Row Level Security enforcing that only authenticated users can access data. The entire data footprint is approximately 50 events and 80 RSVPs — scaling is irrelevant. The correct architecture for this scale is the simplest possible one.

The primary risks are security misconfiguration, not product complexity. Three CVE-level issues apply directly to this stack: exposing the Supabase service role key in client-side code (bypasses all Row Level Security), relying on Next.js middleware alone for auth (CVE-2025-29927, CVSS 9.1), and leaving Row Level Security disabled on tables (implicated in a January 2025 mass exposure incident). All three are avoidable if security patterns are established in Phase 1 before any feature work begins. A fourth moderate risk — open sign-up bypassing the "private link" access model — requires designing an invite-only or email-allowlist mechanism before building the sign-up UI.

## Key Findings

### Recommended Stack

The stack is largely fixed by project constraints (Next.js, Supabase, Vercel, TypeScript). The research task was verifying correct current versions and identifying the right supporting libraries. All core technologies are at stable, production-ready versions as of April 2026. One critical version note: use `next@15` (currently 15.2.x), not Next.js 16 — the ecosystem tooling, documentation, and shadcn/ui support is optimized for v15 and v16 is too new to use confidently.

The most important library decision below the core stack is `@supabase/ssr` (not the deprecated `@supabase/auth-helpers-nextjs`) for cookie-based session management in the App Router. This is the officially supported package and must be used from day one — retrofitting it later is painful.

**Core technologies:**
- **Next.js 15.x**: Full-stack framework with App Router, Server Components, Server Actions — mandated by project constraints
- **React 19.x**: Included with Next.js 15; Server Components and `useActionState` are production-stable
- **TypeScript 5.x**: Mandated; typed routes compile-time validation is essential for correctness
- **Supabase (managed cloud)**: Auth (cookie-based sessions) + Postgres with Row Level Security — mandated by project constraints
- **`@supabase/ssr`**: Cookie-based SSR auth for App Router; replaces deprecated auth-helpers package
- **Tailwind CSS 4.x**: CSS-first config, Oxide engine (100x faster incremental builds vs v3), stable since January 2025
- **shadcn/ui**: Copy-paste component library, full Tailwind v4 + React 19 support since February 2025; no runtime dependency
- **`react-hook-form` + Zod**: Form state + shared client/server validation for event creation and RSVP forms
- **`date-fns` v4**: First-class timezone support — essential for an Italian-time app with participants from Nova Scotia
- **Vercel**: Native Next.js hosting with Supabase marketplace env-var sync — mandated by project constraints

**What to avoid:** `@supabase/auth-helpers-nextjs` (deprecated), `getSession()` for server-side auth checks (use `getUser()`), Pages Router, Prisma/Drizzle (unnecessary for 4-table schema), real-time Supabase subscriptions (not needed for an infrequently-changing itinerary), Next.js v16 (too new).

### Expected Features

The feature research found a clear, tight MVP. The app exists to solve one problem — "who is going to what, and when" — for a group that is already coordinating via iMessage. Building anything that duplicates existing group communication tools (chat, notifications, polls) is explicitly out of scope.

**Must have (table stakes):**
- Auth with invite-only or email-allowlist sign-up — private trip, access must be controlled
- Pre-seeded day-by-day itinerary (May 7-16) — the group already has plans; app must reflect reality on first load
- Event detail view with title, date/time, description, and location link (Google Maps/VRBO URLs)
- Individual RSVP per event (attend / not attend) with attendee list display — this is why the app exists
- Add new event form — each couple has separate excursions to add
- Mobile-responsive layout — users will check on phones during the trip
- Persistent login session — users should not re-authenticate every visit

**Should have (differentiators):**
- Tuscany-specific visual design (warm palette, Unsplash imagery) — high emotional impact, low build cost
- RSVP count summary on itinerary card — "4 attending" visible without clicking into each event
- Event category/type tagging — quickly scan group dinners vs excursions vs open days
- Admin event management role — organizer (Adam) can edit/delete any event to maintain schedule integrity
- Edit/delete own events — mistakes happen; author-scoped editing with soft delete preferred

**Defer to v1.1 (after initial launch, before trip):**
- Event comments/notes — logistical notes per event ("I'll drive," "need vegetarian option")
- Calendar export (iCal) — trip is short enough that the app is the calendar

**Defer indefinitely (anti-features):**
- Real-time group chat — group already uses iMessage/WhatsApp
- Expense tracking — Splitwise exists
- Push notifications — 8 people, unnecessary infrastructure
- Native mobile app — responsive web is the app
- AI itinerary suggestions — trip is already planned
- Activity booking/payment — friends trust each other

**Critical path:** Auth → RSVP → attendee visibility. Everything else is additive to this core flow.

### Architecture Approach

The architecture is a two-tier system with no separate backend service. Next.js is the application layer; Supabase is the data and auth layer. Server Components fetch all itinerary data server-side (zero client-side fetching for reads). Server Actions handle all writes (create event, toggle RSVP, delete event) and call `revalidatePath()` after mutations to bust Vercel's cache and trigger a fresh server render. Client Components are used only at the leaf level for interactive elements (RSVP button, add event modal). This pattern produces fast initial loads, no loading spinners on the read path, and minimal client-side JavaScript.

**Major components:**
1. **`middleware.ts`** — Refreshes Supabase auth token on every request and redirects unauthenticated users to login (UX gate only, not a security boundary)
2. **Server Components (`app/(app)/itinerary/page.tsx`)** — Fetch and render day-by-day event data server-side; depend on `lib/queries/` for typed Supabase calls
3. **Server Actions (`lib/actions/`)** — Handle all mutations: `createEvent()`, `deleteEvent()`, `upsertRsvp()`, `removeRsvp()`; include `revalidatePath()` calls
4. **Client Components** — `RsvpButton.tsx`, `AddEventModal.tsx`; receive data as props from Server Components, call Server Actions for writes
5. **`lib/supabase/server.ts` and `lib/supabase/client.ts`** — Single factory functions for Supabase client creation per context (server vs browser); never instantiate inline
6. **Supabase Postgres + RLS** — 4 tables (`profiles`, `events`, `rsvps`); RLS policies enforce authenticated-only access with per-row ownership for deletes

**Database schema (4 tables):** `profiles` (extends Supabase `auth.users`), `events` (title, description, event_date, start_time, location, created_by), `rsvps` (event_id + user_id with UNIQUE constraint). All tables use `TIMESTAMPTZ` for timestamps; events should use soft delete via `deleted_at`.

**Key patterns to follow:**
- Server Components by default; add `"use client"` only at interactive leaf components
- Server Actions for all writes; no API routes for CRUD
- `revalidatePath()` after every mutation
- One Supabase client factory per context — never create inline

### Critical Pitfalls

1. **Service role key exposed in client-side code** — Never prefix with `NEXT_PUBLIC_`; audit `.env` before any deployment. The service role key bypasses all Row Level Security — if exposed in the browser bundle, the entire database is readable and writable by any visitor.

2. **RLS disabled or policies never written** — Enable RLS immediately on every table in the migration, before writing any app code. Write at least one SELECT policy before testing queries. This was the root cause of a January 2025 mass exposure incident (CVE-2025-48757) affecting 170+ apps. Test policies through the Supabase client SDK, not the SQL Editor (which bypasses RLS).

3. **Middleware-only auth (CVE-2025-29927)** — Middleware is a UX convenience, not a security boundary. CVE-2025-29927 (CVSS 9.1, March 2025) demonstrated that attackers could bypass Next.js middleware via a crafted header. Always verify sessions at the data layer using `createServerClient` from `@supabase/ssr` in Server Components.

4. **Open sign-up bypasses private access model** — "Share an unlisted link" is security by obscurity. The correct pattern for a known fixed group is to disable public sign-up in Supabase Auth settings and use dashboard-sent invitations — or implement a `Before User Created` auth hook that validates against an email allowlist.

5. **Timezone confusion for Italian events** — Store all datetimes as `TIMESTAMPTZ` (never `TIMESTAMP WITHOUT TIME ZONE`). Display times in `Europe/Rome` locale using `date-fns-tz`. Nova Scotia participants (ADT, UTC-3) creating events are 5 hours off from Italy (CEST, UTC+2) — this must be handled at the schema and form level from the first event created.

## Implications for Roadmap

Based on the combined research, a 4-phase structure maps directly to the architectural build order identified in ARCHITECTURE.md, the feature dependencies in FEATURES.md, and the phase-to-pitfall mapping in PITFALLS.md.

### Phase 1: Foundation and Auth

**Rationale:** Every other feature depends on a working database schema and authenticated session. Security pitfalls 1-4 (service role key, RLS, middleware-only auth, open sign-up) must all be addressed here — before any feature work begins. Retrofitting security is expensive; establishing it first is essentially free.

**Delivers:** A deployable, authenticated shell — users can sign in, reach a protected route, and see a placeholder itinerary page. No real data yet. Vercel preview environment pointed at a separate Supabase project (not production).

**Addresses from FEATURES.md:** Auth with invite-only sign-up, persistent login session, mobile-responsive layout foundation.

**Avoids from PITFALLS.md:** Service role key exposure (Pitfall 1), RLS misconfiguration (Pitfall 2), middleware-only auth (Pitfall 3), open sign-up (Pitfall 4), session mismatch (Pitfall 5), preview env hitting production DB (Pitfall 6), schema missing timestamps (Pitfall 9).

**Specific deliverables:**
- Supabase project setup with `profiles`, `events`, `rsvps` tables, RLS policies, and `TIMESTAMPTZ` columns
- `lib/supabase/server.ts` and `lib/supabase/client.ts` factory functions
- `middleware.ts` with auth token refresh (not sole auth gate)
- `/login` and `/signup` pages with invite-only access control
- `auth/callback/route.ts` for Supabase auth code exchange
- Route groups `(auth)` and `(app)` with protected layout
- Vercel environment variable configuration (dev vs production Supabase projects)

### Phase 2: Itinerary View and Event Data

**Rationale:** Once auth exists, build the read path. Pre-seeding the database with the real 10-day itinerary is the app's highest-value action — it immediately delivers value to the group even before RSVP works. The Server Component + query layer pattern established here is the template all subsequent phases follow.

**Delivers:** A working, authenticated itinerary showing the real May 7-16 events grouped by day. Users can view event details and location links. No writes yet.

**Addresses from FEATURES.md:** Pre-seeded day-by-day itinerary, event detail view with location links, arrival/departure day markers, event category tagging, Tuscany visual design.

**Avoids from PITFALLS.md:** Over-using `"use client"` (Pitfall 7 — establish Server Component pattern here), Unsplash rate limits (Pitfall 8 — hardcode curated image URLs), timezone confusion (Pitfall 10 — store and display `TIMESTAMPTZ` in `Europe/Rome` from the first seed event).

**Specific deliverables:**
- `lib/queries/events.ts` with `fetchAllEvents()` and `fetchEventsByDate()`
- `/itinerary/page.tsx` (Server Component) rendering `DaySection` and `EventCard` components
- Seed script populating the 10-day schedule
- Tuscany imagery via hardcoded Unsplash URLs with `next/image` and `remotePatterns`
- Tailwind v4 styling and responsive mobile layout

### Phase 3: RSVP and Event Mutations

**Rationale:** RSVP is the primary reason the app exists. It must be built on top of a working itinerary view (Phase 2 data layer) and authenticated sessions (Phase 1). Event creation and deletion are also write operations and belong in this phase — they share the Server Action pattern.

**Delivers:** Full interactive app — users can RSVP to events, see attendee lists, add new events, and delete their own events. Admin event management for the organizer.

**Addresses from FEATURES.md:** Individual RSVP with attendee list, RSVP count on itinerary card, add new event form, edit/delete own events, admin event management role.

**Avoids from PITFALLS.md:** Reinforces correct `"use client"` boundary (RSVP button and add event modal are leaf-level Client Components only); confirms `revalidatePath()` is called after every mutation.

**Specific deliverables:**
- `lib/actions/rsvps.ts` with `upsertRsvp()` and `removeRsvp()` Server Actions
- `lib/actions/events.ts` with `createEvent()` and `deleteEvent()` Server Actions
- `RsvpButton.tsx` (Client Component) with optimistic UI state
- `AddEventModal.tsx` (Client Component) with react-hook-form + Zod validation
- Admin role flag in `profiles` table; RLS policy update for admin delete on any event
- RSVP attendee list display on event detail page

### Phase 4: Polish and v1.1 Features

**Rationale:** Non-critical enhancements added after the core app is working. This phase is lower priority and can be partially deferred if the trip date is approaching. Event comments are the only meaningful new feature; the rest is refinement.

**Delivers:** A polished experience with event notes, improved visual design details, and any pre-trip usability fixes surfaced by early user testing with the group.

**Addresses from FEATURES.md:** Event comments/notes, edit event details (not just delete), any visual polish identified post-launch.

**Specific deliverables:**
- `comments` table (or `notes` field on events) with RLS
- Comment display on event detail page
- Edit event form (author or admin)
- Any design refinements from group feedback

### Phase Ordering Rationale

- **Security before features:** All critical and high-severity pitfalls are Phase 1 concerns. Building features first and adding security later is the pattern that caused the January 2025 mass exposure incident.
- **Read path before write path:** You cannot build a meaningful RSVP feature without a working itinerary to RSVP against. The data layer (Phase 2) must precede mutations (Phase 3).
- **Seed data is a feature:** Pre-seeding the 10-day itinerary is the app's first user-visible value. It should land in Phase 2, not deferred to Phase 3 or 4.
- **Polish last:** Visual design should be applied to working components, not built separately and integrated later. Adding Tuscany imagery in Phase 2 (on the itinerary components) and refining in Phase 4 is the correct order.

### Research Flags

Phases with standard, well-documented patterns (skip research-phase during planning):
- **Phase 1:** Foundation patterns for Next.js App Router + Supabase SSR are comprehensively documented in official Supabase docs. RLS policies for this app's simple access model are included verbatim in ARCHITECTURE.md.
- **Phase 2:** Server Component data fetching patterns are standard. Seed scripts for Supabase are straightforward SQL or TypeScript using the service role key server-side.
- **Phase 3:** Server Actions for CRUD with Supabase are well-documented. react-hook-form + Zod is a standard pairing with abundant examples.

Phases that may benefit from targeted research during planning:
- **Phase 1 (invite-only auth):** The exact implementation of Supabase's "Before User Created" auth hook for email allowlist validation is documented but nuanced. May need a focused research spike on the hook's payload and error response format before building the sign-up flow.
- **Phase 3 (optimistic RSVP UI):** Combining Next.js `useOptimistic` with Server Actions and `revalidatePath()` has some edge cases around revert-on-error behavior. Worth a targeted read of the Next.js optimistic UI docs before building `RsvpButton`.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack mandated by constraints; supporting library versions verified against official npm registry and changelogs. One caveat: Tailwind v4 support in shadcn/ui was verified via official changelog but is relatively recent (February 2025). |
| Features | HIGH for table stakes, MEDIUM for differentiators | Table stakes verified against multiple group travel app analyses. Differentiator prioritization is judgment-based for this specific group context. |
| Architecture | HIGH | Based directly on official Supabase and Next.js App Router documentation. Project structure and data flow patterns match the official Vercel + Supabase starter template. |
| Pitfalls | HIGH | Multiple official sources including CVE advisories (CVE-2025-29927, CVE-2025-48757), Supabase security docs, and Next.js official guidance. Pitfall severity ratings are well-grounded. |

**Overall confidence:** HIGH

### Gaps to Address

- **Invite-only auth implementation detail:** Research confirmed the approach (Supabase `Before User Created` hook or dashboard invitations) but did not produce a working code example. Validate the exact hook payload format during Phase 1 planning.
- **Optimistic RSVP UX pattern:** `useOptimistic` + Server Actions + `revalidatePath()` interaction on error paths needs a targeted code review during Phase 3 planning. Behavior on network failure mid-RSVP is not fully resolved by the research.
- **Unsplash URL longevity:** Hard-coding specific Unsplash photo URLs is the recommended approach, but Unsplash URLs can change if photos are removed by creators. Curate URLs during Phase 2 and have backup options ready.
- **Timezone in event creation form UX:** Research confirmed storage (`TIMESTAMPTZ`) and display (`Europe/Rome`) patterns, but the UX for the event creation form — whether to show a timezone label, a selector, or enforce Italian time — is a design decision not resolved by research alone. Decide during Phase 3 planning.

## Sources

### Primary (HIGH confidence)
- [Supabase SSR for Next.js App Router](https://supabase.com/docs/guides/auth/server-side/nextjs) — auth patterns, client setup, middleware
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — RLS policy patterns and security guidance
- [Supabase `getUser()` vs `getSession()` security](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv) — server-side auth verification
- [Tailwind CSS v4.0 stable release](https://tailwindcss.com/blog/tailwindcss-v4) — version and feature confirmation
- [shadcn/ui Tailwind v4 + February 2025 changelog](https://ui.shadcn.com/docs/changelog/2025-02-tailwind-v4) — compatibility confirmation
- [CVE-2025-29927 (Next.js middleware bypass)](https://nvd.nist.gov/vuln/detail/CVE-2025-29927) — CVSS 9.1 auth bypass via middleware
- [Vercel + Supabase starter template](https://vercel.com/templates/next.js/supabase) — architecture validation
- [@supabase/ssr on npm](https://www.npmjs.com/package/@supabase/ssr) — package version and status
- [@supabase/supabase-js 2.101.x on npm](https://www.npmjs.com/package/@supabase/supabase-js) — package version
- [Supabase Before User Created hook](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook) — invite-only auth pattern
- [lucide-react 1.7.x on npm](https://www.npmjs.com/package/lucide-react) — version confirmation

### Secondary (MEDIUM confidence)
- [Next.js 15.2.4 current version (March 2026)](https://www.abhs.in/blog/nextjs-current-version-march-2026-stable-release-whats-new) — third-party post corroborating GitHub releases page
- [Next.js App Router project structure (makerkit.dev)](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure) — folder conventions
- [CRUD with Server Actions and Supabase (makerkit.dev)](https://makerkit.dev/courses/nextjs-app-router/managing-posts) — Server Action patterns
- [Best Group Travel Planning Apps 2026 (SquadTrip)](https://www.squadtrip.com/guides/the-ultimate-group-travel-planning-app) — feature landscape reference
- [6 Common Supabase Auth Mistakes (Startupik)](https://startupik.com/6-common-supabase-auth-mistakes-and-fixes/) — pitfall patterns
- [date-fns 4.1.0 with timezone support](https://date-fns.org/) — version and feature confirmation
- [Vercel Supabase preview env behavior](https://github.com/orgs/supabase/discussions/32596) — preview deployment pitfall

### Tertiary (LOW confidence / validate during implementation)
- [Unsplash remotePatterns config for Next.js](https://github.com/vercel/next.js/blob/canary/examples/with-unsplash/README.md) — official example but date unknown
- [next-themes 0.4.6](https://www.npmjs.com/package/next-themes) — single npm source; only relevant if dark mode is desired

---
*Research completed: 2026-04-03*
*Ready for roadmap: yes*
