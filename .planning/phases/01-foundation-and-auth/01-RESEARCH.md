# Phase 1: Foundation and Auth - Research

**Researched:** 2026-04-03
**Domain:** Next.js 15 App Router + Supabase SSR Auth + shadcn/ui + Vercel deployment
**Confidence:** HIGH (core auth patterns), MEDIUM (specific API surface for getClaims vs getUser)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Unlisted URL only — no invite code, no secret password. The /signup route is simply not linked publicly. If someone finds it, they can sign up. Acceptable risk for 8 trusted friends.
- **D-02:** Email + password authentication (no magic links, no OAuth).
- **D-03:** Users provide a display name at sign-up (in addition to email + password). Attendee lists show real names, not emails.
- **D-04:** No email verification required. Users land in the app immediately after sign-up.
- **D-05:** Branded Tuscany landing page — full-width Tuscany background image with a centered auth card. Sets the trip mood immediately.
- **D-06:** Separate /login and /signup pages (distinct routes, not a tab toggle). The /signup URL is the one shared with the group.
- **D-07:** App title: "Berwick, NS does Tuscany 2026" (or close variation) — group-specific, personal.
- **D-08:** Warm earth tone palette — terracotta, olive, warm cream, gold accents. Tuscan countryside feel.
- **D-09:** Top header bar navigation — app name on the left, user menu (name + logout) on the right. Simple horizontal bar.
- **D-10:** Phase 1 placeholder: Welcome message with "X days until Tuscany!" countdown and a Tuscany hero image.
- **D-11:** Mobile-first design — design for phone screens first, scale up to desktop.
- **D-12:** Admin designated by hardcoded email check (Adam's email in env variable or code). No Supabase role metadata needed.
- **D-13:** Subtle "admin" badge next to Adam's name in the header.

### Claude's Discretion

- Font choices and specific spacing/sizing within the warm earth tone palette
- Exact Unsplash image selection for login background and placeholder page
- shadcn/ui component variant choices (default vs secondary, etc.)
- Exact countdown implementation details (days vs days+hours, etc.)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | User can sign up with email and password via unlisted sign-up link | Supabase `signUp()` with `options.data.display_name`; disable email confirmation in Supabase dashboard; /signup route exists but is not linked publicly |
| AUTH-02 | User session persists across browser refresh and revisits | `@supabase/ssr` cookie-based sessions + middleware `updateSession` refreshes tokens on every request |
| AUTH-03 | Unauthenticated visitors are redirected to login page | Next.js middleware checks `supabase.auth.getUser()` and redirects to /login if no user |
| AUTH-04 | Admin user (Adam) can edit or delete any event | Hardcoded email check against `NEXT_PUBLIC_ADMIN_EMAIL` env var; no Supabase role metadata needed |
| DSGN-01 | Modern, responsive layout that works on mobile and desktop | Mobile-first Tailwind v4 layout; shadcn/ui components; App Router layout.tsx shell |
| DSGN-03 | Consistent design system using shadcn/ui components and Tailwind CSS | `npx shadcn@latest init` sets up design system; Tailwind v4 CSS-first config |
</phase_requirements>

---

## Summary

Phase 1 builds a greenfield Next.js 15 App Router project with Supabase email/password auth, deployed to Vercel. The entire auth stack (session cookies, token refresh, route protection) is handled by `@supabase/ssr` and Next.js middleware — this is the current canonical pattern as of 2025 and is well-documented. No hand-rolling of auth primitives is required.

The biggest implementation decision already made (D-04: no email verification) has a direct Supabase dashboard toggle: disable "Confirm email" under Authentication → Settings. When disabled, `signUp()` returns both a user and a session immediately, allowing the user to land in the app without an email roundtrip. Display names are captured during sign-up via `options.data.display_name` and stored in `auth.users.raw_user_meta_data`. A `public.profiles` table (with a DB trigger) is the standard pattern for making this data queryable outside the auth schema.

The critical security note from Supabase docs: **never use `getSession()` for server-side auth checks** — it reads unvalidated cookie data. Use `getUser()` (sends request to Supabase Auth server) or `getClaims()` (validates JWT locally) instead. For the middleware pattern, `getUser()` is the safe default per current Supabase documentation.

**Primary recommendation:** Use the `with-supabase` official template as the structural reference. Scaffold with `create-next-app@latest`, install `@supabase/supabase-js` + `@supabase/ssr`, then wire up three files: `utils/supabase/client.ts`, `utils/supabase/server.ts`, and `middleware.ts`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.5.14 | Full-stack React framework | Mandated. Latest stable 15.x (pinned per CLAUDE.md — avoid v16 until ecosystem matures). |
| react | 19.2.4 | UI runtime | Included with Next.js 15. Server Components and `useActionState` stable. |
| typescript | 5.x | Type safety | Scaffolded by `create-next-app`. Typed routes stable in v15.5. |
| @supabase/supabase-js | 2.101.1 | Supabase JS client | Official isomorphic client. Current stable. |
| @supabase/ssr | 0.10.0 | Cookie-based SSR auth | Replaces deprecated `@supabase/auth-helpers-nextjs`. Required for App Router session handling. |
| tailwindcss | 4.2.2 | Utility-first CSS | Mandated. CSS-first config (no tailwind.config.js). |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | latest (CLI) | Accessible UI components | Use for all auth forms, header, cards. Components are copied into codebase. |
| lucide-react | 1.7.0 | Icon library | Used by shadcn/ui. Import only what you use. |
| react-hook-form | 7.72.1 | Form state management | Use for sign-up and login forms. Handles validation state without re-renders. |
| @hookform/resolvers | 5.2.2 | Zod + react-hook-form bridge | Pair with zod for shared client/server validation. |
| zod | 3.25.x | Schema validation | Validate email, password, display_name on client and in Server Actions. Note: npm registry shows 4.3.6 as latest. Use 3.x if zod v4 peer dep issues arise. |
| date-fns | 4.1.0 | Date utilities | Use for countdown: `differenceInCalendarDays(new Date('2026-05-07'), today)`. |

> **Version verification note:** Versions above were verified against npm registry on 2026-04-03. `next@15` latest stable is 15.5.14 (the `backport` dist-tag). `next@latest` resolves to 16.2.2 — use `next@15` explicitly in `create-next-app`.

### Installation

```bash
# Scaffold (use @15 explicitly to avoid v16)
npx create-next-app@15 tuscany-trip-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Supabase auth
npm install @supabase/supabase-js @supabase/ssr

# Forms and validation
npm install react-hook-form @hookform/resolvers zod

# Date utilities
npm install date-fns

# shadcn/ui (run after scaffold)
npx shadcn@latest init
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — html, body, ThemeProvider
│   ├── (auth)/                 # Route group — no layout shared with app shell
│   │   ├── login/
│   │   │   └── page.tsx        # Full-screen Tuscany background + auth card
│   │   └── signup/
│   │       └── page.tsx        # Same layout as login
│   └── (app)/                  # Route group — authenticated shell
│       ├── layout.tsx          # Header bar + session check
│       └── itinerary/
│           └── page.tsx        # Phase 1 placeholder page
├── components/
│   ├── ui/                     # shadcn/ui components (auto-populated by CLI)
│   ├── auth/
│   │   ├── LoginForm.tsx       # Client component — react-hook-form + zod
│   │   └── SignupForm.tsx      # Client component — react-hook-form + zod
│   └── layout/
│       └── Header.tsx          # Client component — user menu, logout, admin badge
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # createBrowserClient() — for Client Components
│   │   └── server.ts           # createServerClient() — for Server Components/Actions
│   └── auth/
│       └── actions.ts          # Server Actions: signUp, signIn, signOut
├── middleware.ts                # Token refresh + route protection (root level, not src/)
└── .env.local                  # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_ADMIN_EMAIL
```

> Note: `middleware.ts` must live at the project root (same level as `src/`) — not inside `src/`. Next.js resolves it from the root.

### Pattern 1: Supabase Client Utilities

Two separate client factories are required — one for browser (Client Components) and one for server (Server Components, Server Actions, Route Handlers).

**`src/lib/supabase/client.ts`** (Client Components):
```typescript
// Source: https://supabase.com/docs/guides/auth/server-side/creating-a-client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

`createBrowserClient` uses a singleton pattern — safe to call multiple times.

**`src/lib/supabase/server.ts`** (Server Components / Server Actions):
```typescript
// Source: https://supabase.com/docs/guides/auth/server-side/creating-a-client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from Server Component — middleware handles cookie writing
          }
        },
      },
    }
  )
}
```

### Pattern 2: Middleware (Token Refresh + Route Protection)

`middleware.ts` at project root:
```typescript
// Source: https://supabase.com/docs/guides/auth/server-side/nextjs
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add code between createServerClient and getUser()
  // A middleware error will cause the user to be stuck in a logged-out state.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/itinerary'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Critical:** Do not return a different response object after calling `getUser()`. The `supabaseResponse` object carries the refreshed cookie — returning any other `NextResponse` breaks the session chain.

### Pattern 3: Server Action Auth (Sign-up and Login)

```typescript
// src/lib/auth/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        display_name: formData.get('display_name') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)
  if (error) redirect('/signup?error=' + encodeURIComponent(error.message))

  revalidatePath('/', 'layout')
  redirect('/itinerary')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) redirect('/login?error=' + encodeURIComponent(error.message))

  revalidatePath('/', 'layout')
  redirect('/itinerary')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### Pattern 4: Display Name Storage (user_metadata + profiles trigger)

**Option A — user_metadata only (simpler for Phase 1):**
Pass `options.data.display_name` in `signUp()`. Read it back via `user.user_metadata.display_name`. No DB migration required.

**Option B — profiles table with trigger (recommended for Phase 2+ querying):**
```sql
-- Migration: create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  updated_at timestamp with time zone
);

alter table public.profiles enable row level security;

create policy "Users can view all profiles" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger: auto-create profile on sign-up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**Phase 1 recommendation:** Use Option A (user_metadata) for the header display name. Create the profiles table and trigger in Phase 1 DB setup so Phase 2 (attendee lists) can query it without a new migration.

### Pattern 5: Admin Email Check

```typescript
// In Header.tsx or server component reading user
const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
```

Note: `NEXT_PUBLIC_ADMIN_EMAIL` exposes the admin email in the browser bundle. This is acceptable for a private 8-person app. If preferred, move the check server-side using a non-prefixed env var and pass `isAdmin: boolean` as a prop.

### Pattern 6: Route Groups for Auth vs App Shell

```
app/
├── (auth)/
│   ├── login/page.tsx     → /login   — no header, full-screen Tuscany bg
│   └── signup/page.tsx    → /signup  — no header, full-screen Tuscany bg
└── (app)/
    ├── layout.tsx          → shared header for all authenticated pages
    └── itinerary/page.tsx  → /itinerary
```

Route groups (parentheses) are ignored in the URL path. Each group can have its own `layout.tsx`, enabling the auth pages to have no header while authenticated pages share the header shell.

### Anti-Patterns to Avoid

- **Using `getSession()` in server code:** Returns unvalidated cookie data that can be spoofed. Use `getUser()` for server-side auth checks.
- **Using deprecated `@supabase/auth-helpers-nextjs`:** Doesn't handle App Router cookies correctly. Use `@supabase/ssr`.
- **Returning a new `NextResponse` after getUser() in middleware:** Drops the refreshed session cookie. Always return `supabaseResponse`.
- **Enabling ISR on auth-gated pages:** Causes users to see cached pages belonging to other sessions. Use `export const dynamic = 'force-dynamic'` on protected pages, or rely on Server Components (which are dynamic by default when they read cookies).
- **Using `localStorage` for auth tokens:** Browser-only, breaks SSR. `@supabase/ssr` handles cookie-based storage correctly.
- **Using Pages Router:** Project uses App Router exclusively. Mixing causes routing confusion and breaks Server Component assumptions.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session cookie management | Custom JWT cookie handling | `@supabase/ssr` createServerClient | Handles cookie serialization, PKCE flow, token refresh, and the Next.js request/response cookie dance correctly |
| Token refresh | Manual refresh logic | Middleware pattern above | Token expiry edge cases are subtle; missing a refresh leaves users in broken auth state |
| Form validation | Custom validation functions | `zod` + `@hookform/resolvers` | Schema is shared between client (instant feedback) and Server Action (trusted validation) |
| Email/password auth | Custom auth system | `supabase.auth.signUp()` / `signInWithPassword()` | Password hashing, rate limiting, session management are all handled |
| Route protection | Manual cookie checks in every page | Next.js middleware | Single place to enforce auth, runs before page renders, applies uniformly |
| Countdown timer | Custom date arithmetic | `date-fns` `differenceInCalendarDays` | Handles DST transitions and timezone edge cases |

**Key insight:** The Supabase + Next.js auth integration has well-established patterns with official starter templates. Every custom solution in this domain re-discovers the same cookie/token edge cases that the `@supabase/ssr` package already handles.

---

## Common Pitfalls

### Pitfall 1: Email Confirmation Default is ON
**What goes wrong:** By default, Supabase requires email confirmation. With D-04 (no verification), sign-up returns `{ user, session: null }` instead of a live session. The user signs up but is immediately signed out.
**Why it happens:** Supabase enables email confirmation by default for security.
**How to avoid:** In Supabase dashboard → Authentication → Settings → disable "Confirm email". When disabled, `signUp()` returns both `user` and `session` immediately.
**Warning signs:** After sign-up, user is redirected to login instead of itinerary.

### Pitfall 2: Returning Wrong Response from Middleware
**What goes wrong:** Adding a `return NextResponse.redirect(...)` after the `getUser()` call but using a freshly-constructed response object. The refreshed session cookie in `supabaseResponse` is lost.
**Why it happens:** Token refresh writes new cookie values into `supabaseResponse`. Returning a different response object drops them.
**How to avoid:** Only redirect by cloning the URL and returning `NextResponse.redirect(url)` — which is fine since the browser will re-enter middleware on the next request. Don't return a response that should also carry the refreshed cookie except `supabaseResponse`.

### Pitfall 3: Using `next@latest` instead of `next@15`
**What goes wrong:** `npm view next dist-tags` shows `latest: 16.2.2`. Running `npx create-next-app@latest` scaffolds Next.js 16.
**Why it happens:** npm `latest` tag is now on v16.
**How to avoid:** Use `npx create-next-app@15` explicitly. CLAUDE.md mandates `next@15`.

### Pitfall 4: Zod v4 Peer Dependency Conflicts
**What goes wrong:** npm registry shows `zod` at 4.3.6 as `latest`. Some zod-dependent packages (including older `@hookform/resolvers`) have peer deps against `zod@^3`. Installing `zod@4` may produce peer dep errors.
**Why it happens:** `@hookform/resolvers@5.2.2` appears to support zod v4, but if any installed version pins zod v3, conflicts arise.
**How to avoid:** Install `zod@3` explicitly (`npm install zod@3`) for safer compatibility. Check `@hookform/resolvers` changelog if peer dep warnings appear.

### Pitfall 5: Middleware Matching Too Broadly
**What goes wrong:** Middleware runs on `_next/static`, image optimization routes, and favicon — causing unnecessary session checks and potential errors.
**Why it happens:** Default `matcher: ['/(.*)',]` matches everything.
**How to avoid:** Use the matcher pattern in the code example above which excludes static assets and images.

### Pitfall 6: ISR Caching Auth-Gated Pages
**What goes wrong:** If any protected page accidentally enables Incremental Static Regeneration, Next.js may cache and serve a page generated for user A to user B.
**Why it happens:** Server Component pages in Next.js can be statically optimized if no dynamic data is read. However, reading cookies (which `@supabase/ssr` does) should force dynamic mode automatically.
**How to avoid:** Add `export const dynamic = 'force-dynamic'` to the protected layout to be explicit. The `(app)/layout.tsx` is the right place since it covers all authenticated routes.

### Pitfall 7: `NEXT_PUBLIC_SUPABASE_ANON_KEY` vs `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
**What goes wrong:** The Vercel Supabase marketplace integration injects `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (new key format). Many older guides still reference `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Using the wrong name means the client has no key at runtime.
**Why it happens:** Supabase is transitioning from `anon_key` to `publishable_key` format.
**How to avoid:** Accept whichever key name Supabase provides (both work with `@supabase/supabase-js` 2.x). Use a single env var name consistently across all client utilities. Check the Supabase dashboard for the exact key provided.

---

## Code Examples

### Auth Check in a Server Component

```typescript
// src/app/(app)/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  return (
    <div>
      <Header user={user} isAdmin={isAdmin} />
      <main>{children}</main>
    </div>
  )
}
```

### Countdown Calculation

```typescript
// days until May 7, 2026
import { differenceInCalendarDays } from 'date-fns'

const daysUntil = differenceInCalendarDays(
  new Date('2026-05-07'),
  new Date()
)
// daysUntil will be 34 as of 2026-04-03
```

### Display Name from user_metadata

```typescript
const displayName = user?.user_metadata?.display_name ?? user?.email
```

### Supabase Migrations (run via CLI)

```bash
# Initialize Supabase locally
supabase init

# Create a migration for the profiles table
supabase migration new create_profiles_table

# Generate TypeScript types from your schema
supabase gen types typescript --linked > src/types/database.types.ts
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2023-2024 | Auth helpers is officially deprecated; SSR package handles App Router cookies correctly |
| `getSession()` for server auth | `getUser()` or `getClaims()` | Ongoing Supabase security guidance | `getSession()` returns unvalidated cookie data; `getUser()` validates against Supabase auth server |
| `tailwind.config.js` | CSS-first `@theme` in `globals.css` | Tailwind v4 (Jan 2025) | No config file needed; Oxide engine is 100x faster on incremental builds |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase new key format (2025) | Dashboard now issues `sb_publishable_*` format keys; anon key format still works during transition |
| shadcn/ui + Tailwind v3 | shadcn/ui + Tailwind v4 | February 2025 shadcn changelog | shadcn now defaults to Tailwind v4; use `shadcn@latest` (not `shadcn@2.3.0` which is the v3 version) |

---

## Open Questions

1. **`getClaims()` vs `getUser()` in middleware**
   - What we know: Supabase documentation has been in flux. Older guides use `getUser()` (makes a network call to Supabase Auth server). Newer docs for the publishable key flow reference `getClaims()` (validates JWT locally, no network call — faster but does not detect server-side session revocation).
   - What's unclear: Whether `@supabase/ssr@0.10.0` exposes `getClaims()` on the auth client. A GitHub issue (Oct 2025) noted that some docs still reference `getUser()` even when publishable keys are in use.
   - Recommendation: Use `getUser()` in middleware as the safe default. If performance is a concern after launch, evaluate `getClaims()`. For an 8-person app, the network overhead of `getUser()` is negligible.

2. **Supabase key format at project creation time**
   - What we know: Supabase is transitioning from `anon key` to `publishable key` format. The env var name may be `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` depending on when the project was created.
   - Recommendation: When provisioning the Supabase project, use whichever key is provided. Use a consistent env var name across all files. The Vercel Supabase integration auto-injects `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Next.js runtime | Yes | v25.8.1 | — |
| npm | Package management | Yes | 11.11.0 | — |
| Vercel CLI | Preview deploys, env pull | No | — | Manual env var setup; deploy via Vercel dashboard |
| Supabase CLI | DB migrations, type gen | Not checked | — | Can install: `npm install -g supabase` |
| Git | Version control | Assumed (git repo exists) | — | — |

**Missing dependencies with no fallback:**
- None that block core implementation.

**Missing dependencies with fallback:**
- **Vercel CLI** — not installed. For Phase 1, env vars can be set manually in Vercel dashboard or via `vercel link` + `vercel env pull` after installing: `npm install -g vercel`. The app can be deployed without the CLI (push to GitHub → Vercel auto-deploys).
- **Supabase CLI** — availability not confirmed. Install with `brew install supabase/tap/supabase` or `npm install -g supabase`. Required for running migrations and generating TypeScript types. If skipped, migrations can be run via Supabase SQL editor in the dashboard (less ideal).

---

## Sources

### Primary (HIGH confidence)
- [supabase.com/docs/guides/auth/server-side/nextjs](https://supabase.com/docs/guides/auth/server-side/nextjs) — middleware pattern, `getUser()` vs `getSession()` guidance
- [supabase.com/docs/guides/auth/server-side/creating-a-client](https://supabase.com/docs/guides/auth/server-side/creating-a-client) — `createBrowserClient` / `createServerClient` setup
- [supabase.com/docs/guides/auth/managing-user-data](https://supabase.com/docs/guides/auth/managing-user-data) — profiles table trigger pattern, `raw_user_meta_data` usage
- [supabase.com/docs/guides/auth/passwords](https://supabase.com/docs/guides/auth/passwords) — `signInWithPassword()`, PKCE vs implicit flow for SSR
- [ui.shadcn.com/docs/installation/next](https://ui.shadcn.com/docs/installation/next) — `npx shadcn@latest init -t next` command
- [ui.shadcn.com/docs/tailwind-v4](https://ui.shadcn.com/docs/tailwind-v4) — Tailwind v4 compatibility confirmation
- npm registry (verified 2026-04-03): `@supabase/supabase-js@2.101.1`, `@supabase/ssr@0.10.0`, `next@15.5.14`, `react@19.2.4`, `tailwindcss@4.2.2`, `lucide-react@1.7.0`, `react-hook-form@7.72.1`, `@hookform/resolvers@5.2.2`, `date-fns@4.1.0`, `next-themes@0.4.6`

### Secondary (MEDIUM confidence)
- [supabase.com/docs/guides/auth/general-configuration](https://supabase.com/docs/guides/auth/general-configuration) — email confirmation toggle location
- [nextjs.org/docs/app/getting-started/project-structure](https://nextjs.org/docs/app/getting-started/project-structure) — route groups pattern `(auth)`, `(app)`
- Multiple corroborated sources confirm `getUser()` is the safe choice for middleware in 2025

### Tertiary (LOW confidence — flag for validation)
- `getClaims()` method availability in `@supabase/ssr@0.10.0` — referenced in recent docs but not confirmed in the installed version. Use `getUser()` unless confirmed.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified from npm registry on 2026-04-03
- Supabase auth patterns: HIGH — verified against official Supabase documentation
- Next.js App Router patterns: HIGH — verified against official Next.js docs and current community patterns
- `getClaims()` API surface: LOW — documentation in flux, use `getUser()` as safe fallback
- Pitfalls: HIGH — most are sourced from official Supabase security guidance and known Next.js gotchas

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (30 days — stack is stable, but Supabase key format transition is ongoing)
