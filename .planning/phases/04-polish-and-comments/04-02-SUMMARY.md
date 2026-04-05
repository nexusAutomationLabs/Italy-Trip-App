---
phase: 04-polish-and-comments
plan: 02
subsystem: ui
tags: [sidebar, navigation, layout, login, tailwind, shadcn, next.js]

# Dependency graph
requires:
  - phase: 04-01
    provides: shadcn sidebar, tooltip, scroll-area components installed
provides:
  - Fixed 240px sidebar on desktop with trip title, nav links, user footer
  - Bottom tab bar on mobile with Itinerary and Map tabs
  - Split-screen login/signup pages with Tuscany photo and form
  - Restructured (app) layout using SidebarProvider replacing top Header
affects: [04-03, 04-04, 04-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - AppSidebar built on shadcn Sidebar primitives with custom active link detection
    - usePathname for active nav state in client components
    - SidebarProvider wraps the app layout shell; AppSidebar is hidden on mobile via Tailwind
    - MobileTabBar fixed at bottom-0 for mobile; hidden lg:hidden for desktop
    - CSS background-image for Tuscany auth pages (consistent with Phase 1 decision)

key-files:
  created:
    - src/components/layout/AppSidebar.tsx
    - src/components/layout/MobileTabBar.tsx
  modified:
    - src/app/(app)/layout.tsx
    - src/app/(auth)/login/page.tsx
    - src/app/(auth)/signup/page.tsx
    - src/app/globals.css

key-decisions:
  - "AppSidebar uses className hidden lg:flex directly rather than shadcn responsive variant — simpler for fixed desktop-only sidebar"
  - "MobileTabBar wraps in lg:hidden div — no JS media query needed, pure CSS"
  - "Login/signup pages share same Tuscany vineyard Unsplash URL for visual consistency"
  - "Cross-navigation links (Don't have an account?) left in form components, not duplicated at page level"

patterns-established:
  - "Active nav state: border-l-[3px] border-primary + text-primary + bg-primary/10 + font-bold"
  - "Mobile safe area: style={{ paddingBottom: env(safe-area-inset-bottom) }} for iOS tab bar"
  - "Auth page layout: flex flex-col lg:grid lg:grid-cols-2 for responsive split-screen"

requirements-completed: []

# Metrics
duration: 8min
completed: 2026-04-05
---

# Phase 04 Plan 02: Navigation Layout and Login Redesign Summary

**Fixed 240px desktop sidebar with terracotta active state, mobile bottom tab bar, and split-screen Tuscany photo login page replacing the top header**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-05T00:22:00Z
- **Completed:** 2026-04-05T00:30:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Created AppSidebar with shadcn Sidebar primitives — trip title in Playfair Display italic, Itinerary/Map nav links with terracotta active indicator, user avatar and sign-out footer
- Created MobileTabBar fixed at bottom of viewport with iOS safe area padding, hidden on desktop via lg:hidden
- Restructured (app)/layout.tsx to use SidebarProvider replacing the top Header; fetches profile from Supabase profiles table
- Redesigned login and signup pages with split-screen layout: Tuscany vineyard photo on left/top, form on right/bottom; Playfair Display 28px italic title overlay; "Welcome back" / "Join the trip" headings

## Task Commits

Each task was committed atomically:

1. **Task 1: Sidebar layout shell and mobile tab bar** - `7786bf2` (feat)
2. **Task 2: Login page split-screen redesign** - `c4a20c9` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

- `src/components/layout/AppSidebar.tsx` - Desktop sidebar with shadcn primitives, nav links, user section
- `src/components/layout/MobileTabBar.tsx` - Fixed bottom tab bar for mobile with active state
- `src/app/(app)/layout.tsx` - Restructured with SidebarProvider, profile fetch, no Header
- `src/app/(auth)/login/page.tsx` - Split-screen Tuscany photo + form layout
- `src/app/(auth)/signup/page.tsx` - Same split-screen treatment as login
- `src/app/globals.css` - Added --sidebar-width: 240px CSS variable

## Decisions Made

- AppSidebar uses `hidden lg:flex` directly instead of shadcn's collapsible variant — the design calls for a fixed always-visible sidebar on desktop only, with no toggle. Shadcn's collapsible adds unnecessary state complexity.
- MobileTabBar is a separate component (not a shadcn Tabs instance) — bottom tab bars on mobile have fixed positioning and safe area behavior that doesn't map cleanly to the shadcn Tabs component.
- Login and signup pages share the same Tuscany vineyard Unsplash URL for visual consistency across auth flows.
- Cross-navigation links left in LoginForm/SignupForm components rather than duplicated at page level — forms are self-contained and already handle this.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Navigation shell is complete and ready for Plans 03-05 to build features within it
- AppSidebar user section shows initial avatar; Plan 04 will add profile modal for photo upload
- Header.tsx is no longer imported but the file remains; can be deleted in a cleanup pass

---
*Phase: 04-polish-and-comments*
*Completed: 2026-04-05*
