# Phase 1: Foundation and Auth - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Authenticated app shell deployed to Vercel with secure Supabase setup. Users can sign up (email + password) via an unlisted link, log in, and reach a protected placeholder page. Responsive layout with shadcn/ui. Admin role for Adam. No itinerary content yet — that's Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Sign-up Access Control
- **D-01:** Unlisted URL only — no invite code, no secret password. The /signup route is simply not linked publicly. If someone finds it, they can sign up. Acceptable risk for 8 trusted friends.
- **D-02:** Email + password authentication (no magic links, no OAuth).
- **D-03:** Users provide a display name at sign-up (in addition to email + password). Attendee lists show real names, not emails.
- **D-04:** No email verification required. Users land in the app immediately after sign-up.

### Login & Sign-up Page Feel
- **D-05:** Branded Tuscany landing page — full-width Tuscany background image with a centered auth card. Sets the trip mood immediately.
- **D-06:** Separate /login and /signup pages (distinct routes, not a tab toggle). The /signup URL is the one shared with the group.
- **D-07:** App title: "Berwick, NS does Tuscany 2026" (or close variation) — group-specific, personal.
- **D-08:** Warm earth tone palette — terracotta, olive, warm cream, gold accents. Tuscan countryside feel.

### Authenticated Shell Layout
- **D-09:** Top header bar navigation — app name on the left, user menu (name + logout) on the right. Simple horizontal bar.
- **D-10:** Phase 1 placeholder: Welcome message with "X days until Tuscany!" countdown and a Tuscany hero image. Gives the app personality before the itinerary exists.
- **D-11:** Mobile-first design — design for phone screens first, scale up to desktop. Most users will check on phones during the trip.

### Admin Role
- **D-12:** Admin designated by hardcoded email check (Adam's email in env variable or code). No Supabase role metadata needed.
- **D-13:** Subtle "admin" badge next to Adam's name in the header. Visible but not prominent — helps explain why Adam can edit others' events.

### Claude's Discretion
- Font choices and specific spacing/sizing within the warm earth tone palette
- Exact Unsplash image selection for login background and placeholder page
- shadcn/ui component variant choices (default vs secondary, etc.)
- Exact countdown implementation details (days vs days+hours, etc.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/PROJECT.md` — Project vision, constraints, trip context (dates, villa, group composition)
- `.planning/REQUIREMENTS.md` — AUTH-01 through AUTH-04, DSGN-01, DSGN-03 are this phase's requirements
- `.planning/ROADMAP.md` — Phase 1 success criteria and dependencies
- `CLAUDE.md` — Technology stack decisions, what NOT to use, installation commands

### Technology Guidance
- `CLAUDE.md` §Technology Stack — Mandated stack: Next.js 15, Supabase, @supabase/ssr (NOT auth-helpers), Tailwind v4, shadcn/ui
- `CLAUDE.md` §What NOT to Use — Avoid deprecated @supabase/auth-helpers-nextjs, avoid getSession() for auth checks (use getUser()), avoid Pages Router

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. No existing code.

### Established Patterns
- None — patterns will be established in this phase. This is the foundation.

### Integration Points
- Vercel deployment pipeline (to be set up)
- Supabase project (to be provisioned)

</code_context>

<specifics>
## Specific Ideas

- App title: "Berwick, NS does Tuscany 2026" — user provided this specific branding
- The group is 4 couples (8 people) from Nova Scotia — the app name reflects this origin
- Trip dates: May 7-16, 2026 — countdown should target May 7

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-and-auth*
*Context gathered: 2026-04-03*
