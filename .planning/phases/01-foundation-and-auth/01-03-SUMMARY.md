---
phase: 01-foundation-and-auth
plan: "03"
subsystem: auth
tags: [nextjs, supabase, middleware, tailwind, shadcn, date-fns, react]

requires:
  - phase: 01-01
    provides: Supabase client utilities (createClient for server/browser)
  - phase: 01-02
    provides: Auth server actions (signOut) and login/signup pages

provides:
  - Next.js middleware for token refresh and route protection
  - Authenticated app shell layout with Header component
  - Admin badge for designated admin user (NEXT_PUBLIC_ADMIN_EMAIL)
  - Itinerary placeholder with countdown to May 7, 2026 and Tuscany hero image
  - Root redirect from / to /itinerary

affects:
  - Phase 02 (itinerary features will replace the placeholder page)
  - All future authenticated pages (share the (app) layout shell)

tech-stack:
  added:
    - date-fns (differenceInCalendarDays for trip countdown)
  patterns:
    - Next.js middleware with @supabase/ssr for token refresh before every request
    - Route group (app)/ for authenticated shell with shared Header
    - force-dynamic on app layout to prevent ISR caching of auth-gated pages
    - Admin check via NEXT_PUBLIC_ADMIN_EMAIL env var (no Supabase role metadata)
    - Redirect from root / through middleware-enforced auth

key-files:
  created:
    - middleware.ts (project root) — token refresh + route protection
    - src/app/(app)/layout.tsx — authenticated shell with Header + force-dynamic
    - src/app/(app)/itinerary/page.tsx — countdown placeholder with Tuscany hero
    - src/components/layout/Header.tsx — app name, user display name, admin badge, sign out
  modified:
    - src/app/page.tsx — replaced Next.js default with redirect to /itinerary

key-decisions:
  - "middleware.ts at project root (not src/) — Next.js resolves middleware from root only"
  - "getUser() used in both middleware and layout (never getSession) — prevents spoofed cookie auth"
  - "force-dynamic on (app)/layout.tsx — explicitly prevents ISR caching of auth-gated pages"
  - "Admin badge uses NEXT_PUBLIC_ADMIN_EMAIL env var — no Supabase role metadata needed for 8-person app"
  - "Unescaped apostrophe ESLint error auto-fixed with &apos; entity in JSX"

patterns-established:
  - "Pattern: Middleware always returns supabaseResponse (never a new NextResponse) to preserve refreshed cookies"
  - "Pattern: Route groups (auth)/ vs (app)/ isolate auth pages from the app shell header"
  - "Pattern: Admin check = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL"
  - "Pattern: Display name = user.user_metadata.display_name ?? user.email"

requirements-completed: [AUTH-03, AUTH-04, DSGN-01]

duration: 5min
completed: 2026-04-03
---

# Phase 01 Plan 03: Route Protection, App Shell, and Itinerary Placeholder Summary

**Next.js middleware with @supabase/ssr token refresh, authenticated shell layout with admin badge, and Tuscany countdown placeholder closing the auth loop end-to-end**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-03T14:35:32Z
- **Completed:** 2026-04-03T14:37:01Z
- **Tasks:** 2 (+ 1 checkpoint auto-approved)
- **Files modified:** 5

## Accomplishments

- Middleware at project root intercepts every non-static request, refreshes Supabase tokens via @supabase/ssr, and enforces route protection (AUTH-03)
- Authenticated (app)/ shell layout with Header showing user display name, admin badge for NEXT_PUBLIC_ADMIN_EMAIL, and sign out button
- Itinerary placeholder page with live countdown (differenceInCalendarDays) to May 7, 2026 and full-width Tuscany hero image from Unsplash
- Root / now redirects to /itinerary — middleware handles the auth gate transparently

## Task Commits

Each task was committed atomically:

1. **Task 1: Create middleware for token refresh and route protection** - `8e18c5e` (feat)
2. **Task 2: Build authenticated app shell with Header, admin badge, and placeholder itinerary page** - `8ab3bee` (feat)

Auto-approved checkpoint: verified via `npm run build` passing with no errors.

## Files Created/Modified

- `middleware.ts` (project root) — createServerClient + getUser() for token refresh and route protection
- `src/app/(app)/layout.tsx` — force-dynamic authenticated shell, getUser() redirect, Header + isAdmin
- `src/app/(app)/itinerary/page.tsx` — countdown to May 7 with Tuscany hero (unsplash), welcome card
- `src/components/layout/Header.tsx` — app title, display name, Admin badge pill, sign out form action
- `src/app/page.tsx` — replaced Next.js scaffold default with redirect('/itinerary')

## Decisions Made

- Used `getUser()` (not `getSession()`) in both middleware and layout — validates against Supabase auth server, cannot be spoofed
- `force-dynamic` on (app)/layout.tsx — explicit guard against ISR caching of auth-gated pages (Pitfall 6 from research)
- Admin badge uses NEXT_PUBLIC_ADMIN_EMAIL env var — no Supabase role metadata needed for a small trusted group
- Static Unsplash URL for hero image (no API) — simpler and avoids 50 req/hr rate limit for 8-10 users

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed unescaped apostrophe in JSX**
- **Found during:** Task 2 (build verification)
- **Issue:** `It's Tuscany day!` caused ESLint react/no-unescaped-entities error, blocking build
- **Fix:** Replaced `'` with `&apos;` HTML entity
- **Files modified:** src/app/(app)/itinerary/page.tsx
- **Verification:** `npm run build` passed with exit code 0
- **Committed in:** 8ab3bee (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Minor JSX entity fix, no scope change.

## Issues Encountered

The middleware.ts was already present (untracked) from a prior session — content matched the plan exactly. Committed it as Task 1.

## User Setup Required

**External configuration required to use the app:**
- Supabase project must be created
- `.env.local` must contain `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_ADMIN_EMAIL`
- Email confirmation must be disabled in Supabase dashboard (Authentication → Settings → disable "Confirm email")

See the checkpoint verification steps in 01-03-PLAN.md for the full manual verification checklist.

## Next Phase Readiness

- Auth loop is complete: sign up → redirect to /itinerary → header with user name → sign out → /login
- Route protection is live — all non-auth routes require a valid Supabase session
- Admin badge wired and ready for Phase 2 event management (edit/delete gated on isAdmin)
- Itinerary placeholder ready to be replaced by Phase 2 day-by-day itinerary view

---
*Phase: 01-foundation-and-auth*
*Completed: 2026-04-03*
