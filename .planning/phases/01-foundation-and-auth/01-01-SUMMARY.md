---
phase: 01-foundation-and-auth
plan: 01
subsystem: infra
tags: [nextjs, tailwind, shadcn, supabase, typescript, postgres, rls]

# Dependency graph
requires: []
provides:
  - Next.js 15 App Router project with TypeScript, Tailwind v4, and ESLint
  - shadcn/ui design system initialized with Button, Card, Input, Label components
  - Tailwind v4 Tuscan earth tone palette (terracotta primary, olive secondary, warm cream bg, gold accent)
  - Supabase browser client factory via createBrowserClient (@supabase/ssr)
  - Supabase server client factory via createServerClient with async cookie handling
  - Placeholder Database type definitions for profiles table
  - Profiles table migration SQL with RLS policies and auto-create trigger
  - Environment variable template (.env.example)
affects: [01-02, 01-03, 02-itinerary, 03-events, 04-polish]

# Tech tracking
tech-stack:
  added:
    - next@15.5.14 (App Router)
    - react@19.2.4
    - typescript@5.x
    - tailwindcss@4.2.2 (CSS-first, no config file)
    - "@supabase/supabase-js@2.101.1"
    - "@supabase/ssr@0.10.0"
    - react-hook-form@7.72.1
    - "@hookform/resolvers@5.2.2"
    - zod@3.25.x (pinned v3 to avoid @hookform/resolvers peer dep conflicts)
    - date-fns@4.1.0
    - shadcn/ui (Button, Card, Input, Label)
    - lucide-react (installed by shadcn)
  patterns:
    - "Supabase browser client: createBrowserClient from @supabase/ssr (singleton pattern)"
    - "Supabase server client: async createClient() using await cookies() for Next.js 15 App Router"
    - "Database types: typed generic passed to createBrowserClient<Database> and createServerClient<Database>"
    - "Tailwind v4 CSS-first: all theme tokens defined in globals.css @theme block and :root, no tailwind.config.js"
    - "shadcn/ui: components copied into src/components/ui/ via CLI, no runtime dependency"

key-files:
  created:
    - src/lib/supabase/client.ts — browser Supabase client factory (createBrowserClient)
    - src/lib/supabase/server.ts — server Supabase client factory (createServerClient, async cookies)
    - src/types/database.types.ts — placeholder Database type with profiles table
    - supabase/migrations/00001_create_profiles_table.sql — profiles DDL, RLS, trigger
    - src/components/ui/button.tsx — shadcn Button
    - src/components/ui/card.tsx — shadcn Card
    - src/components/ui/input.tsx — shadcn Input
    - src/components/ui/label.tsx — shadcn Label
    - .env.example — env var documentation template
  modified:
    - src/app/globals.css — Tuscan earth tone palette replacing default shadcn colors
    - src/app/layout.tsx — metadata title set to "Berwick, NS does Tuscany 2026"
    - .gitignore — added !.env.example exception to allow committing the template

key-decisions:
  - "Used zod@3 (not v4 latest) to avoid @hookform/resolvers peer dep conflicts per RESEARCH.md Pitfall 4"
  - "Used NEXT_PUBLIC_SUPABASE_ANON_KEY env var name (not publishable_key) consistently for simplicity — can update when Supabase project is provisioned"
  - "Database types use typed generics (createBrowserClient<Database>) to provide compile-time safety until Supabase CLI generates official types"
  - "Tailwind v4 OKLCH color space used for Tuscan palette rather than HSL — more perceptually uniform, works natively with Tailwind v4"

patterns-established:
  - "Pattern: Supabase client split — client.ts for browser components, server.ts for server components/actions"
  - "Pattern: Never use getSession() on server — use getUser() for auth-gated operations"
  - "Pattern: Never use @supabase/auth-helpers-nextjs — use @supabase/ssr throughout"
  - "Pattern: Tailwind v4 CSS-first theming — all design tokens in globals.css, no tailwind.config.js"
  - "Pattern: shadcn/ui components installed per-component via CLI into src/components/ui/"

requirements-completed: [DSGN-03]

# Metrics
duration: 4min
completed: 2026-04-03
---

# Phase 01 Plan 01: Foundation Scaffold Summary

**Next.js 15 App Router project with Supabase SSR client utilities, shadcn/ui design system, and Tailwind v4 Tuscan earth tone palette — ready for auth implementation**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-03T14:24:57Z
- **Completed:** 2026-04-03T14:28:55Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Next.js 15 project scaffolded and building cleanly with TypeScript, Tailwind v4, and ESLint
- shadcn/ui initialized with New York style; Button, Card, Input, and Label components added
- Tuscan earth tone palette applied via CSS custom properties (terracotta primary #C45D3E, olive secondary #6B7F3B, warm cream background #FDF8F0, gold accent #C4A35A, dark brown foreground #3D2B1F)
- Supabase browser and server client factories created using @supabase/ssr canonical patterns
- Profiles table migration with RLS policies and auto-create trigger ready to apply in Supabase dashboard
- Placeholder TypeScript database types provide compile-time safety until Supabase CLI generates official types

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 15 with shadcn/ui and Tuscan theme** - `c0de1a6` (feat)
2. **Task 2: Create Supabase client utilities and profiles migration** - `5d48cfc` (feat)

## Files Created/Modified
- `src/app/globals.css` — Tailwind v4 CSS-first theme with full Tuscan earth tone palette (light + dark mode)
- `src/app/layout.tsx` — Metadata title set to "Berwick, NS does Tuscany 2026"
- `src/lib/supabase/client.ts` — Browser Supabase client factory using createBrowserClient from @supabase/ssr
- `src/lib/supabase/server.ts` — Server Supabase client factory using createServerClient with async cookie access
- `src/types/database.types.ts` — Placeholder Database type interface with profiles table Row/Insert/Update shapes
- `supabase/migrations/00001_create_profiles_table.sql` — Full profiles DDL with RLS and handle_new_user() trigger
- `src/components/ui/button.tsx` — shadcn Button component
- `src/components/ui/card.tsx` — shadcn Card component
- `src/components/ui/input.tsx` — shadcn Input component
- `src/components/ui/label.tsx` — shadcn Label component
- `.env.example` — Documents NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_ADMIN_EMAIL
- `.gitignore` — Added !.env.example exception

## Decisions Made
- Pinned zod@3 explicitly (not v4) to avoid @hookform/resolvers peer dependency conflicts
- Used OKLCH color space for Tuscan palette (Tailwind v4 native, more perceptually uniform than HSL)
- Added typed generics to Supabase client factories (`createBrowserClient<Database>`) for compile-time safety
- Used `NEXT_PUBLIC_SUPABASE_ANON_KEY` as the env var name — consistent with plan spec; will update when Supabase project is provisioned if the dashboard issues `publishable_key` format

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] .gitignore blocked .env.example from being committed**
- **Found during:** Task 1 commit
- **Issue:** The scaffolded `.gitignore` contained `.env*` which matched `.env.example`, preventing it from being tracked
- **Fix:** Added `!.env.example` exception line to `.gitignore` so the template is committed but real env files remain ignored
- **Files modified:** `.gitignore`
- **Verification:** `git add .env.example` succeeded after fix
- **Committed in:** `c0de1a6` (part of Task 1 commit)

**2. [Rule 3 - Blocking] create-next-app@15 refused to scaffold in directory with spaces/caps in name**
- **Found during:** Task 1 scaffolding
- **Issue:** `npx create-next-app@15 .` failed because "Italy Trip App" contains uppercase letters and spaces — npm naming restrictions
- **Fix:** Scaffolded into `/tmp/tuscany-trip` then rsync'd files into the project directory (excluding `.git` and `node_modules`). Ran `npm install` in project directory to reinstall
- **Files modified:** All scaffold files (already committed in initial commit)
- **Verification:** Build and TypeScript checks pass
- **Committed in:** Files were part of existing `feat: initial commit` (`7f4751a`)

---

**Total deviations:** 2 auto-fixed (2x Rule 3 - Blocking)
**Impact on plan:** Both fixes were structural scaffolding issues, not scope changes. No feature scope added or removed.

## Issues Encountered
None beyond the two auto-fixed blocking issues documented above.

## User Setup Required

Before Phase 01 Plan 02 (auth pages) can be fully tested, the following external setup is needed:

1. **Create a Supabase project** at https://supabase.com/dashboard
2. **Disable email confirmation**: Authentication → Settings → toggle OFF "Confirm email"
3. **Run profiles migration**: SQL Editor → paste contents of `supabase/migrations/00001_create_profiles_table.sql`
4. **Set environment variables** in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API → anon/public key
   - `NEXT_PUBLIC_ADMIN_EMAIL` — Adam's email address for admin designation

The app builds and runs without these set (placeholder values in `.env.local`), but Supabase auth will not work until the project is provisioned.

## Known Stubs

- `src/types/database.types.ts` — Placeholder types with only the `profiles` table. Future plans that add `events` and `rsvps` tables will need either manual type additions or regeneration via `supabase gen types typescript --linked`. This is intentional — full types require a provisioned Supabase project.

## Next Phase Readiness

Ready for Phase 01 Plan 02 (auth pages: login, signup, middleware, and protected route group). All foundation files are in place:
- Supabase client utilities exist and are typed
- shadcn/ui components available for auth form UI
- Tuscan design system applied and building cleanly

---
*Phase: 01-foundation-and-auth*
*Completed: 2026-04-03*
