# Domain Pitfalls

**Domain:** Next.js App Router + Supabase trip coordination web app (small private group)
**Researched:** 2026-04-03
**Confidence:** HIGH (multiple official sources + CVE advisories + production post-mortems)

---

## Critical Pitfalls

Mistakes that cause security breaches, rewrites, or total data loss.

---

### Pitfall 1: Service Role Key Exposed in Client-Side Code

**What goes wrong:** Developer prefixes the Supabase service role key with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`) to make it accessible in components. This ships the key into the browser bundle.

**Why it happens:** The App Router boundary between server and client components is non-obvious. Developers add `NEXT_PUBLIC_` to "make things work" without realizing it broadcasts the value to every visitor.

**Consequences:** The service role key bypasses Row Level Security entirely. Anyone with browser DevTools can read the key and execute arbitrary reads, writes, and deletes against your Supabase database with full admin privileges.

**Prevention:**
- `SUPABASE_SERVICE_ROLE_KEY` — no `NEXT_PUBLIC_` prefix, ever
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are the only two keys that belong in client-visible variables
- Use server-only imports or Server Actions for any operation requiring elevated access
- Audit with: `grep -r "NEXT_PUBLIC_" .env` and ensure no service key is present

**Warning signs:** An API call works in a Server Component without any server-client boundary logic; service role operations are being called from a component without `'use server'`

**Phase:** Auth setup (Phase 1) — address this before any database tables exist

---

### Pitfall 2: RLS Disabled or Policies Never Written

**What goes wrong:** Tables are created but `ENABLE ROW LEVEL SECURITY` is never run. Or RLS is enabled but no policies are written, causing every query to silently return empty results with no error.

**Why it happens:** RLS is opt-in per table. Supabase doesn't enforce it by default. In January 2025, 170+ apps built with AI scaffolding tools were found to have fully exposed databases (CVE-2025-48757) because RLS was simply never enabled.

**Consequences:** Any authenticated user (or unauthenticated user if anon access is on) can read or modify all rows in the table directly through the Supabase API — no UI needed.

**Prevention:**
- Enable RLS immediately when creating a table, before writing any app code
- Write at least one SELECT policy before testing any queries
- For this app: all users can read all events and RSVPs (it's a small trusted group), but only the row creator can update/delete their own records
- Test policies through the Supabase client SDK — not the SQL Editor, which bypasses RLS
- Run: `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';` to audit

**Warning signs:** Queries return empty arrays immediately after enabling RLS but before writing policies; app works fine locally but all data disappears after deploying

**Phase:** Database schema setup (Phase 1) — write policies alongside each CREATE TABLE migration

---

### Pitfall 3: Relying on Next.js Middleware Alone for Auth (CVE-2025-29927)

**What goes wrong:** Authentication protection is implemented only in `middleware.ts` via redirect logic. No server-side auth check exists at the data access layer.

**Why it happens:** Middleware feels like "the right place" for auth gates in Next.js. It's easy to write a single redirect rule and consider auth done.

**Consequences:** CVE-2025-29927 (March 2025, CVSS 9.1) demonstrated that attackers could send a crafted `x-middleware-subrequest` header to bypass middleware entirely in Next.js versions before 14.2.25 / 15.2.3. Even with the fix applied, middleware is not a security boundary — it is a UX convenience. RLS in Supabase and server-side session validation are the real gates.

**Prevention:**
- Use `@supabase/ssr` with `createServerClient` in Server Components and Route Handlers to verify session at the data layer
- Middleware handles redirects (UX); RLS handles data access (security) — both must exist
- Keep Next.js version current; this app should target 15.x from the start
- Never trust `req.headers` values passed from the client to prove identity

**Warning signs:** Auth logic only exists in `middleware.ts` and nowhere else; protected API routes have no session check

**Phase:** Auth setup (Phase 1) — establish this pattern at the beginning

---

## Moderate Pitfalls

Mistakes that cause significant rework or subtle bugs.

---

### Pitfall 4: Open Sign-Up Bypasses "Private Link" Access Model

**What goes wrong:** Developer uses standard Supabase email/password sign-up with no restrictions. Anyone who discovers or guesses the sign-up URL can create an account and access trip data.

**Why it happens:** The plan is "share an unlisted link." This is security by obscurity — the link is not a secret once shared with 8 people across group chats, emails, and screenshots.

**Consequences:** Random strangers can register, view the itinerary, or add fake events. More likely: the sign-up page gets indexed or shared accidentally.

**Prevention:**
- Use Supabase's "Before User Created" auth hook to validate emails against a pre-approved allowlist table
- Alternative (simpler): Disable public sign-up in Supabase Auth settings; use the Supabase dashboard to send email invitations to each of the 8 users — this is the correct pattern for a known, fixed group
- Do not rely solely on an unlisted URL as the access gate

**Warning signs:** Sign-up page accepts any email/password without validation; no allowlist or invite mechanism exists

**Phase:** Auth setup (Phase 1) — design access model before building sign-up UI

---

### Pitfall 5: Session State Split Across SSR and Client Causes "Phantom Logout"

**What goes wrong:** Auth state on the server diverges from auth state on the client during navigation or page refresh. User appears logged out on a hard refresh even though their session is valid.

**Why it happens:** Supabase sessions are stored in cookies when using `@supabase/ssr`, but client-side code may also check `localStorage` or use the browser-only Supabase client. Two competing sources of truth create mismatch.

**Consequences:** Users in Italy on mobile networks or wifi that drops briefly get logged out unexpectedly and lose their RSVP context mid-interaction.

**Prevention:**
- Use the official `@supabase/ssr` package for Next.js App Router (not the generic `@supabase/supabase-js` client directly in components)
- Follow the Supabase SSR docs exactly: server client for Server Components, browser client for Client Components, middleware client for cookie refresh
- Never mix `localStorage`-based auth with cookie-based auth in the same app
- Test by: hard refreshing while logged in, opening in a new tab, and letting the session expire

**Warning signs:** Auth works on first load but breaks on refresh; `useUser()` returns null but network requests succeed with valid session cookie

**Phase:** Auth setup (Phase 1) — use official SSR patterns from the start rather than patching later

---

### Pitfall 6: Vercel Preview Deployments Pointed at Production Database

**What goes wrong:** The Supabase Vercel integration automatically injects production database connection strings into preview deployments. Test data created in previews lands in the production database.

**Why it happens:** This is the documented default behavior of the integration — it does not modify environment variables for preview builds.

**Consequences:** Manual testing in Vercel previews creates, modifies, or deletes real event and RSVP data. For a 10-day trip app with pre-seeded data, corrupting that seed data before the trip is a real risk.

**Prevention:**
- For a simple app with 8 users, the cleanest fix is: only merge to main after manual local testing; treat preview builds as visual-only, never do data operations in them
- More robust: create a separate Supabase project for development, use different env var sets per Vercel environment (Preview vs Production)
- Add a visible banner in non-production environments so it's obvious which database you are touching

**Warning signs:** Data inserted during a Vercel preview deploy appears in the production Supabase dashboard

**Phase:** Infrastructure setup (Phase 1) — configure environment targeting before any data seeding

---

### Pitfall 7: Over-Using "use client" Pollutes the Server Component Tree

**What goes wrong:** Components that fetch Supabase data are marked `'use client'` because they "need to do something interactive." This pulls all their data fetching into the browser, creates waterfalls, and sends more data than necessary.

**Why it happens:** App Router's server/client boundary is unfamiliar. Adding `'use client'` silences errors quickly. Tutorials often mark components client-side for simplicity.

**Consequences:** Itinerary data loads with a visible waterfall (blank screen, then content). RSVP state has to be fetched client-side rather than rendered into the HTML. The app feels slow on mobile connections from Italy.

**Prevention:**
- Default to Server Components for all data fetching (itinerary list, event details, RSVP counts)
- Only use `'use client'` at the leaf level for interactive elements: RSVP button, add event form, modal
- Pattern: Server Component fetches data and passes it as props to a Client Component that handles the interactive state
- Never put `'use client'` at layout or page level unless absolutely necessary

**Warning signs:** `page.tsx` or `layout.tsx` files have `'use client'` at the top; Supabase queries are running in `useEffect`

**Phase:** Feature build phases (Phases 2-3) — establish this pattern on the first component and follow it consistently

---

## Minor Pitfalls

Mistakes that cause polish issues or one-time debugging sessions.

---

### Pitfall 8: Unsplash API Rate Limit Hits in Development

**What goes wrong:** Developer calls the Unsplash API on every page load or hot reload during development. With a 50 requests/hour free tier limit, the daily rate is exhausted quickly and images stop loading.

**Why it happens:** Images are fetched dynamically on every render rather than being curated and stored as static URLs.

**Prevention:**
- Curate 3-5 specific Unsplash photo URLs at build time and hardcode them (this is a small private app, not a dynamic gallery)
- The Unsplash `source.unsplash.com` URL trick (e.g., `https://source.unsplash.com/featured/?tuscany`) does not count against the API rate limit but is slower and less reliable
- Configure `images.unsplash.com` as an allowed domain in `next.config.js` for the `<Image>` component
- Always provide explicit `width` and `height` props to `<Image>` for Unsplash URLs to prevent layout shift

**Warning signs:** Background images work on first load then break; 403 errors appear in the network tab for image requests

**Phase:** Design/UI phase (Phase 2) — settle on specific image URLs upfront rather than building a dynamic fetch

---

### Pitfall 9: Database Schema Has No Timestamps or Soft Deletes

**What goes wrong:** Events table has no `created_at`, `updated_at`, or `deleted_at` columns. When a user accidentally deletes an event, there is no recovery path and no audit trail.

**Why it happens:** Minimalist schema design skips "nice to have" metadata columns.

**Prevention:**
- Add `created_at TIMESTAMPTZ DEFAULT NOW()` and `updated_at TIMESTAMPTZ DEFAULT NOW()` to every table
- For events: consider soft delete via `deleted_at TIMESTAMPTZ` rather than hard delete
- Supabase sets `created_at` automatically when using the table editor — verify this is in place for SQL migrations too

**Warning signs:** Events table has no timestamp columns; DELETE SQL is used directly instead of UPDATE with a deleted_at flag

**Phase:** Database schema setup (Phase 1) — cheaper to add timestamps at creation than migrate later

---

### Pitfall 10: Timezone Confusion for Italian Events

**What goes wrong:** Event times are stored as naive timestamps or as UTC, but displayed without timezone conversion. Events for May 7-16 in Italy (CEST, UTC+2) show times offset from what was intended.

**Why it happens:** Developers store what the form sends without thinking about timezone. Users in Nova Scotia (ADT, UTC-3) submitting event times will be 5 hours off from Italian local time.

**Prevention:**
- Store all datetimes as `TIMESTAMPTZ` (with timezone) in Postgres — never `TIMESTAMP WITHOUT TIME ZONE`
- On the frontend, always display times in `Europe/Rome` locale using `Intl.DateTimeFormat` or a library like `date-fns-tz`
- The event creation form should either: (a) state clearly "enter times in Italy local time (CEST)", or (b) include a timezone selector that converts to UTC before storing

**Warning signs:** Dinner reservations showing as "9 PM" when they are actually "3 PM"; times that shift by hours depending on viewer's browser locale

**Phase:** Event CRUD feature (Phase 2) — handle timezone at the schema and form level from the first event created

---

## Security Mistakes Summary

| Mistake | Severity | Caught by |
|---------|----------|-----------|
| Service role key in `NEXT_PUBLIC_` var | Critical | Code review, `.env` audit |
| RLS disabled on a table | Critical | Supabase dashboard audit |
| Auth only in middleware | High | Security review, CVE-2025-29927 |
| Open sign-up (no allowlist) | High | Access model design |
| Session mismatch (SSR vs client) | Medium | Integration testing |
| Preview env hitting production DB | Medium | Environment configuration |

---

## Phase-to-Pitfall Mapping

| Phase | Pitfall to Address | Mitigation |
|-------|--------------------|------------|
| Phase 1: Foundation & Auth | Service role key exposure | Never use `NEXT_PUBLIC_` for service key; audit `.env` |
| Phase 1: Foundation & Auth | RLS not enabled | Write `ENABLE ROW LEVEL SECURITY` in every migration |
| Phase 1: Foundation & Auth | Middleware-only auth | Use `createServerClient` from `@supabase/ssr` in server components |
| Phase 1: Foundation & Auth | Open sign-up | Use invite-only flow or email allowlist from day one |
| Phase 1: Foundation & Auth | Session mismatch | Follow `@supabase/ssr` patterns exactly; test hard refresh |
| Phase 1: Foundation & Auth | Schema missing timestamps | Add `created_at`, `updated_at` to all tables in initial migration |
| Phase 1: Infrastructure | Preview env → production DB | Separate dev/prod Supabase projects or restrict preview testing |
| Phase 2: Itinerary & Events | Over-using `'use client'` | Server Components for data fetch, Client Components for RSVP button only |
| Phase 2: Itinerary & Events | Timezone confusion | Store `TIMESTAMPTZ`, display in `Europe/Rome` |
| Phase 2: Itinerary & Events | Unsplash rate limits | Hardcode curated image URLs, configure `next.config.js` domains |

---

## Sources

- [6 Common Supabase Auth Mistakes (and Fixes) — Startupik](https://startupik.com/6-common-supabase-auth-mistakes-and-fixes/)
- [Supabase Row Level Security — Official Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [CVE-2025-29927: Next.js Middleware Authorization Bypass — Datadog Security Labs](https://securitylabs.datadoghq.com/articles/nextjs-middleware-auth-bypass/)
- [CVE-2025-29927 Detail — NVD](https://nvd.nist.gov/vuln/detail/CVE-2025-29927)
- [Supabase Auth Troubleshooting for Next.js — Official Docs](https://supabase.com/docs/guides/troubleshooting/how-do-you-troubleshoot-nextjs---supabase-auth-issues-riMCZV)
- [Creating a Supabase Client for SSR — Official Docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Before User Created Hook (invite-only pattern) — Supabase Docs](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook)
- [Supabase Connection Pooling in Next.js — NeedThisDone Blog](https://needthisdone.com/blog/supabase-connection-pooling-production-nextjs)
- [Next.js App Router Common Mistakes — Upsun Blog](https://upsun.com/blog/avoid-common-mistakes-with-next-js-app-router/)
- [React Server Components Performance Mistakes — LogRocket](https://blog.logrocket.com/react-server-components-performance-mistakes)
- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Vercel Integration Discussion — Supabase GitHub](https://github.com/orgs/supabase/discussions/32596)
- [Mastering Supabase RLS as a Beginner — DEV Community](https://dev.to/asheeshh/mastering-supabase-rls-row-level-security-as-a-beginner-5175)
