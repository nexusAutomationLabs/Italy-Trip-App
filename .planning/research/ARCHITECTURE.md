# Architecture Patterns

**Project:** Tuscany Trip App
**Domain:** Private trip coordination web app (Next.js App Router + Supabase)
**Researched:** 2026-04-03
**Confidence:** HIGH — based on official Supabase and Next.js documentation

---

## System Overview

A small private web app for 8-10 authenticated users. Architecture is deliberately simple: one Next.js application on Vercel, one Supabase project (auth + Postgres). No microservices, no message queues, no separate API layer — everything runs through Next.js Server Components and Server Actions talking directly to Supabase.

The key architectural insight for this stack: **Next.js is the application layer, Supabase is the data + auth layer.** There is no separate backend service. Server Components fetch data server-side from Supabase. Server Actions handle writes (create/update/delete). The Supabase client is never instantiated on the client for data mutations — only for auth state when needed in Client Components.

---

## Component Boundaries

### What Talks to What

```
Browser (Client Components)
    |
    | -- auth state, UI interactivity
    |
Next.js App Router (Vercel)
    |-- Server Components  ---> Supabase (reads: events, RSVPs, profiles)
    |-- Server Actions     ---> Supabase (writes: create event, toggle RSVP)
    |-- middleware.ts      ---> Supabase (auth token refresh on every request)
    |
Supabase
    |-- Auth (user sessions, cookie-based)
    |-- Postgres DB (events, RSVPs, profiles)
    |-- Row Level Security (data protection)
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `middleware.ts` | Refreshes Supabase auth token on every request; redirects unauthenticated users to login | Supabase Auth, Next.js routing |
| Server Components (`page.tsx`) | Fetch and render itinerary data server-side; no client JS for read operations | Supabase (via server client) |
| Server Actions (`lib/actions/`) | Handle all data mutations (create event, delete event, upsert RSVP) | Supabase (via server client), `revalidatePath` |
| Client Components | Handle interactive UI (RSVP toggle button, event form modal, dropdown menus) | Server Actions (via form actions / `useTransition`) |
| `lib/supabase/server.ts` | Creates the Supabase server client with cookie access for Server Components and Actions | Next.js `cookies()`, Supabase |
| `lib/supabase/client.ts` | Creates the Supabase browser client for Client Components needing auth state | Browser cookies |
| `lib/queries/` | Typed query functions (fetch events by date, fetch RSVPs for event) | Supabase server client |
| `lib/actions/` | Server Action functions (createEvent, deleteEvent, upsertRsvp) | Supabase server client, `revalidatePath` |
| Supabase Auth | Manages sessions via cookies; validates users | Next.js middleware, server clients |
| Supabase Postgres + RLS | Stores all data; enforces that only authenticated users can read/write | Next.js server layer |

---

## Recommended Project Structure

```
tuscany-trip-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Sign-in form (Client Component)
│   │   └── signup/
│   │       └── page.tsx          # Sign-up form (Client Component)
│   ├── (app)/
│   │   ├── layout.tsx            # Protected layout — wraps all app pages
│   │   ├── page.tsx              # Root redirect to /itinerary
│   │   └── itinerary/
│   │       ├── page.tsx          # Main day-by-day view (Server Component)
│   │       └── _components/      # Route-specific components
│   │           ├── DaySection.tsx
│   │           ├── EventCard.tsx
│   │           ├── RsvpButton.tsx     # "use client"
│   │           └── AddEventModal.tsx  # "use client"
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # Supabase auth callback handler
│   └── layout.tsx                # Root layout
├── components/                   # Shared UI components
│   ├── ui/                       # Generic (Button, Modal, Input)
│   └── layout/                   # Header, Nav
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # Server client (Server Components + Actions)
│   │   └── client.ts             # Browser client (Client Components)
│   ├── queries/
│   │   ├── events.ts             # fetchEventsByDate(), fetchAllEvents()
│   │   └── rsvps.ts              # fetchRsvpsForEvent(), fetchUserRsvps()
│   └── actions/
│       ├── events.ts             # createEvent(), deleteEvent()  — "use server"
│       └── rsvps.ts              # upsertRsvp(), removeRsvp()  — "use server"
├── types/
│   └── database.ts               # Generated Supabase types (supabase gen types)
├── middleware.ts                  # Auth token refresh + route protection
├── .env.local
└── supabase/
    └── migrations/               # DB schema migrations
```

**Key conventions:**
- `(auth)` and `(app)` are route groups — parentheses means they don't appear in the URL
- `_components/` inside a route folder = components scoped to that route only
- `components/` at root = shared across all routes
- `lib/queries/` = read-only Supabase calls used in Server Components
- `lib/actions/` = write operations implemented as Server Actions (`"use server"` files)

---

## Data Flow

### Reading Data (itinerary page load)

```
User visits /itinerary
    --> middleware.ts runs: refreshes auth token, confirms user is logged in
    --> app/(app)/itinerary/page.tsx (Server Component) executes on server
    --> calls lib/queries/events.ts → fetchAllEvents()
    --> createClient() from lib/supabase/server.ts (has cookie access)
    --> Supabase Postgres: SELECT * FROM events ORDER BY date ASC
    --> RLS policy confirms: user is authenticated → allow
    --> events array returned to page.tsx
    --> page.tsx renders DaySection components with event data
    --> HTML streamed to browser (zero client-side fetching)
```

### Writing Data (create event, RSVP toggle)

```
User submits "Add Event" form
    --> AddEventModal.tsx (Client Component) submits form action
    --> lib/actions/events.ts → createEvent(formData) ["use server"]
    --> createClient() from lib/supabase/server.ts
    --> Supabase Postgres: INSERT INTO events (...)
    --> RLS policy confirms: user is authenticated → allow
    --> revalidatePath('/itinerary') — clears Next.js cache
    --> page re-renders server-side with new data
    --> browser receives updated HTML

User clicks RSVP button
    --> RsvpButton.tsx (Client Component) calls upsertRsvp(eventId)
    --> lib/actions/rsvps.ts → upsertRsvp() ["use server"]
    --> Supabase: UPSERT INTO rsvps (event_id, user_id)
    --> revalidatePath('/itinerary')
    --> page re-renders with updated RSVP count
```

### Auth Flow

```
User visits app for first time
    --> middleware.ts: no valid session cookie → redirect to /login
    --> User enters email/password on /login
    --> Supabase Auth: validates credentials, sets session cookie
    --> auth/callback/route.ts: exchanges auth code for session
    --> redirect to /itinerary
    --> middleware.ts: valid session → allow through on all future requests
```

---

## Database Schema

Postgres (via Supabase). Four tables.

### `profiles`
Extends Supabase's built-in `auth.users` table. Created automatically via trigger when a user signs up.

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `events`
Core itinerary data. One row per planned activity.

```sql
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  event_date  DATE NOT NULL,          -- one of May 7-16, 2026
  start_time  TIME,                   -- nullable, some events are all-day
  location    TEXT,                   -- free text or URL
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `rsvps`
Join table: which user is attending which event.

```sql
CREATE TABLE rsvps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, user_id)          -- one RSVP per user per event
);
```

### RLS Policies (all tables)

The app's access model is simple: if you're logged in, you can do anything. All 8 users are trusted.

```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read everything
CREATE POLICY "authenticated read" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated read" ON rsvps   FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated read" ON profiles FOR SELECT TO authenticated USING (true);

-- Authenticated users can insert events
CREATE POLICY "authenticated insert" ON events FOR INSERT TO authenticated WITH CHECK (true);

-- Users can only delete their own events
CREATE POLICY "own delete" ON events FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Users manage their own RSVPs
CREATE POLICY "own rsvp insert" ON rsvps FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own rsvp delete" ON rsvps FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

---

## Integration Points

### Next.js ↔ Supabase Auth

- `@supabase/ssr` package handles cookie-based sessions for the App Router
- Two clients needed: `lib/supabase/server.ts` (uses Next.js `cookies()`) and `lib/supabase/client.ts` (uses `createBrowserClient`)
- `middleware.ts` at root calls `supabase.auth.getUser()` on every request to refresh the token and protect routes
- Never use `getSession()` for auth checks — it reads from the cookie and can be spoofed. Always use `getUser()` which hits the Supabase API to verify

### Next.js ↔ Vercel

- Deploy directly from GitHub — Vercel auto-detects Next.js
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel environment variables
- `revalidatePath()` in Server Actions invalidates Vercel's cache for affected routes

### Supabase Type Generation

Generate TypeScript types from the live database schema to get type-safe queries:

```bash
npx supabase gen types typescript --project-id [project-id] > types/database.ts
```

---

## Suggested Build Order

Dependencies between components determine the order.

**Phase 1: Foundation**
Build these first — everything else depends on them.
- Supabase project setup (database schema + RLS policies + seed data)
- `lib/supabase/server.ts` and `lib/supabase/client.ts`
- `middleware.ts` with auth protection
- Auth pages (`/login`, `/signup`, auth callback route)
- Root layout and route groups `(auth)` / `(app)`

**Phase 2: Read Path**
Once auth exists, build the data-reading layer.
- `lib/queries/events.ts` and `lib/queries/rsvps.ts`
- `/itinerary/page.tsx` — Server Component rendering the day-by-day view
- `DaySection.tsx`, `EventCard.tsx` — display components
- Pre-seed the database with the 10-day schedule

**Phase 3: Write Path**
Add mutations on top of the working read layer.
- `lib/actions/events.ts` — createEvent, deleteEvent
- `lib/actions/rsvps.ts` — upsertRsvp, removeRsvp
- `AddEventModal.tsx` — Client Component with form
- `RsvpButton.tsx` — Client Component with optimistic state

**Phase 4: UI Polish**
Add design layer last, when functionality is solid.
- Unsplash imagery integration
- Tailwind styling throughout
- Responsive layout for mobile use

---

## Patterns to Follow

### Server Components by Default
Fetch data in Server Components — no `useEffect`, no loading spinners, no client-side fetching for the read path. Only add `"use client"` when you need interactivity (button clicks, form state).

### Server Actions for All Writes
All database mutations go through Server Actions (files with `"use server"`). This means no API routes needed. Server Actions give you type-safe function calls from Client Components with automatic CSRF protection.

### `revalidatePath` After Mutations
After every Server Action that changes data, call `revalidatePath('/itinerary')` to bust the cache and trigger a fresh server render. This gives the effect of real-time updates without websockets.

### One Supabase Client Factory Per Context
Never create the Supabase client inline in components. Always import from `lib/supabase/server.ts` or `lib/supabase/client.ts`. This keeps cookie handling and auth consistent.

---

## Anti-Patterns to Avoid

### Using `getSession()` for Auth Checks
**Why bad:** Reads from cookie only, can be spoofed by malicious users. Use `getUser()` in middleware and Server Components to verify with the Supabase API.

### Fetching Data in Client Components with `useEffect`
**Why bad:** Exposes database queries to the client, causes loading flicker, requires managing loading/error state. Use Server Components for data fetching instead.

### API Routes for CRUD
**Why bad:** Unnecessary indirection. Server Actions accomplish the same thing with better type safety and less boilerplate. API routes (`app/api/`) are only needed for webhooks or third-party integrations.

### Disabling RLS "for simplicity"
**Why bad:** Any bug or misconfiguration in the application layer could expose all data. RLS is the last line of defense. The "authenticated users can read everything" policy is simple enough for this app while keeping the protection in place.

---

## Scalability Considerations

This app has 8-10 users and a fixed 10-day timespan. Scaling is irrelevant — the simple architecture is the correct architecture. No caching layers, no connection pooling configuration, no read replicas needed.

| Concern | For This App |
|---------|--------------|
| Concurrent users | 8-10 max, Supabase free tier handles this trivially |
| Database size | ~50 events + ~80 RSVPs total, negligible |
| Auth sessions | Supabase manages, no action needed |
| Vercel functions | Auto-scaled, no configuration needed |

---

## Sources

- [Supabase: Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) — HIGH confidence
- [Supabase: Creating a Supabase client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client) — HIGH confidence
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — HIGH confidence
- [Next.js App Router Project Structure (makerkit.dev)](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure) — MEDIUM confidence
- [CRUD Operations with Server Actions and Supabase (makerkit.dev)](https://makerkit.dev/courses/nextjs-app-router/managing-posts) — MEDIUM confidence
- [Vercel: Next.js + Supabase Starter Template](https://vercel.com/templates/next.js/supabase) — HIGH confidence
