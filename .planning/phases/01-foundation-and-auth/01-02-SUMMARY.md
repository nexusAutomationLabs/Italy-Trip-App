---
phase: 01-foundation-and-auth
plan: 02
subsystem: auth
tags: [auth, forms, react-hook-form, zod, supabase, tailwind, shadcn, tuscany]

# Dependency graph
requires:
  - 01-01 (Next.js scaffold, shadcn/ui components, Supabase client utilities)
provides:
  - Zod schemas for login and signup form validation (loginSchema, signupSchema)
  - LoginFormData and SignupFormData TypeScript types
  - signUp, signIn, signOut server actions wired to Supabase auth
  - Branded /login page with full-viewport Tuscany background and shadcn Card
  - Branded /signup page with display_name field — the unlisted group share URL
  - (auth) route group with separate login/signup routes (no shared layout)
affects: [01-03, 02-itinerary, 03-events, 04-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Auth forms: react-hook-form + zodResolver for client-side validation, server action called with FormData on valid submit"
    - "Server error display: read ?error= search param from URL, render inline above form fields"
    - "Suspense boundary wraps form components that call useSearchParams() — required by Next.js 15 App Router"
    - "Auth pages: CSS background-image (not next/image) for Tuscany bg — no remotePatterns config needed"
    - "Route group (auth): no layout.tsx — auth pages inherit root layout only, no header"

key-files:
  created:
    - src/lib/auth/schemas.ts — loginSchema, signupSchema, LoginFormData, SignupFormData
    - src/lib/auth/actions.ts — signUp, signIn, signOut server actions
    - src/components/auth/LoginForm.tsx — client form component with react-hook-form + zod
    - src/components/auth/SignupForm.tsx — client form component with display_name field
    - src/app/(auth)/login/page.tsx — branded login page with Tuscany background
    - src/app/(auth)/signup/page.tsx — branded signup page (unlisted group share URL)
  modified: []

key-decisions:
  - "Used CSS background-image (not next/image) for Tuscany background — avoids remotePatterns config, simpler for static Unsplash URLs"
  - "Wrapped LoginForm and SignupForm in Suspense boundaries — required by Next.js 15 when useSearchParams() is used in a client component inside a Server Component page"
  - "Server errors passed via URL ?error= query param (redirect from server action) — keeps auth actions stateless and works with Next.js redirect() semantics"
  - "display_name stored in Supabase user_metadata via options.data at signUp — matches Plan 01 profiles trigger which reads raw_user_meta_data ->> 'display_name'"

patterns-established:
  - "Pattern: Auth server action flow — Zod safeParse on server side (trusted validation), redirect on failure, Supabase call on success"
  - "Pattern: Client form submission — react-hook-form handles UX validation, on valid submit creates FormData and calls server action"
  - "Pattern: Error display — URL ?error= for server errors (destructive paragraph above form), inline text for Zod field errors"

requirements-completed: [AUTH-01, AUTH-02, DSGN-01]

# Metrics
duration: 2min
completed: 2026-04-03
---

# Phase 01 Plan 02: Auth Pages Summary

**Branded login and signup pages with full-viewport Tuscany background, shadcn Card overlay, react-hook-form + Zod client validation, and Supabase server actions for email/password auth with display name capture**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-03T14:31:05Z
- **Completed:** 2026-04-03T14:33:35Z
- **Tasks:** 2
- **Files created:** 6

## Accomplishments

- Zod validation schemas created for login (email + password) and signup (display_name + email + password)
- Server actions `signUp`, `signIn`, `signOut` wired to Supabase auth using `@/lib/supabase/server` createClient
- display_name captured at signup via `options.data.display_name` per D-03 (attendee lists show real names)
- signInWithPassword used for login per D-02 (email + password only, no magic links or OAuth)
- No `getSession()` usage anywhere — all server-side auth operations use write methods per security guidance
- LoginForm and SignupForm built as client components with react-hook-form + zodResolver for inline validation
- Server errors surfaced via ?error= URL param, displayed in a destructive-colored paragraph above each form
- /login and /signup pages feature full-viewport Tuscany countryside background with black/40 overlay for readability
- Both pages center a shadcn Card with app title "Berwick, NS does Tuscany 2026" per D-07
- Forms are mobile-first with `mx-4 w-full max-w-md` (full-width on mobile, capped at md on desktop) per D-11
- npm run build passes cleanly — 7 static pages generated including /login and /signup

## Task Commits

Each task was committed atomically:

1. **Task 1: Zod schemas and Server Actions** - `5ff74b3` (feat)
2. **Task 2: Branded login and sign-up pages** - `860b6af` (feat)

## Files Created

- `src/lib/auth/schemas.ts` — loginSchema, signupSchema with validation messages; LoginFormData, SignupFormData types
- `src/lib/auth/actions.ts` — signUp (with display_name in options.data), signIn (signInWithPassword), signOut server actions
- `src/components/auth/LoginForm.tsx` — 'use client', react-hook-form, zodResolver(loginSchema), inline errors, server error from searchParams
- `src/components/auth/SignupForm.tsx` — 'use client', react-hook-form, zodResolver(signupSchema), display_name field, same error handling
- `src/app/(auth)/login/page.tsx` — full-viewport Tuscany bg, black/40 overlay, Card with "Berwick, NS does Tuscany 2026", LoginForm in Suspense
- `src/app/(auth)/signup/page.tsx` — same branded layout, "Join the trip" subtitle, SignupForm in Suspense

## Decisions Made

- Used CSS `background-image` style (not `next/image`) for Tuscany background — avoids `remotePatterns` config in `next.config.ts`, simpler for a static Unsplash URL
- Wrapped form components in `<Suspense>` — Next.js 15 requires Suspense boundaries around components that call `useSearchParams()` inside a Server Component page
- Server errors flow via `?error=` URL redirect from server actions — consistent with Next.js `redirect()` semantics and keeps server actions stateless
- `display_name` stored in `user_metadata` via `options.data` at sign-up — matches the profiles table trigger from Plan 01 that reads `raw_user_meta_data ->> 'display_name'`

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all form fields, validation, and server action wiring are fully implemented. The Tuscany background uses a static Unsplash URL which requires an internet connection but is production-ready for a 10-person app.

## Self-Check: PASSED

- `src/lib/auth/schemas.ts` — FOUND
- `src/lib/auth/actions.ts` — FOUND
- `src/components/auth/LoginForm.tsx` — FOUND
- `src/components/auth/SignupForm.tsx` — FOUND
- `src/app/(auth)/login/page.tsx` — FOUND
- `src/app/(auth)/signup/page.tsx` — FOUND
- Commit `5ff74b3` — FOUND
- Commit `860b6af` — FOUND

---

*Phase: 01-foundation-and-auth*
*Completed: 2026-04-03*
