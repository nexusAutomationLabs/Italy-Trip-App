# Phase 1: Foundation and Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 01-foundation-and-auth
**Areas discussed:** Sign-up access control, Login & sign-up page feel, Authenticated shell layout, Admin role

---

## Sign-up Access Control

### Q1: How should the unlisted sign-up link prevent unwanted sign-ups?

| Option | Description | Selected |
|--------|-------------|----------|
| Hidden URL only | Just an unlisted /signup route — no code or password. Simplest approach for 8 trusted friends. | ✓ |
| Invite code in URL | URL contains a secret code. Server validates before allowing registration. | |
| Invite code on form | Extra "invite code" field on sign-up page. More visible friction. | |

**User's choice:** Hidden URL only
**Notes:** None

### Q2: How should users authenticate?

| Option | Description | Selected |
|--------|-------------|----------|
| Email + password | Standard email/password. Simplest for Supabase. | ✓ |
| Magic link (email) | Login link sent via email. No password to remember. | |
| Both options | Email+password primary with magic link fallback. | |

**User's choice:** Email + password
**Notes:** None

### Q3: What info should users provide at sign-up besides email and password?

| Option | Description | Selected |
|--------|-------------|----------|
| Display name only | Just a name field so attendee lists show real names. | ✓ |
| Nothing extra | Just email and password. Use email prefix as display name. | |
| Name + profile photo | Name and optional avatar upload. | |

**User's choice:** Display name only
**Notes:** None

### Q4: Should sign-up require email verification before access?

| Option | Description | Selected |
|--------|-------------|----------|
| No verification | Users sign up and land in the app immediately. | ✓ |
| Verify email first | Must click confirmation link before access. | |

**User's choice:** No verification
**Notes:** None

---

## Login & Sign-up Page Feel

### Q1: What vibe should the login/sign-up page have?

| Option | Description | Selected |
|--------|-------------|----------|
| Branded landing | Full-width Tuscany background image with centered auth card. | ✓ |
| Clean minimal | Simple centered card on neutral background. | |
| Split layout | Left: hero image. Right: auth form. Modern SaaS feel. | |

**User's choice:** Branded landing
**Notes:** None

### Q2: How should users switch between login and sign-up?

| Option | Description | Selected |
|--------|-------------|----------|
| Separate pages | Distinct /login and /signup routes. | ✓ |
| Tab toggle on one page | Single /login page with Login/Sign Up tab toggle. | |
| You decide | Claude picks. | |

**User's choice:** Separate pages
**Notes:** None

### Q3: What should the app title/heading say on the login page?

| Option | Description | Selected |
|--------|-------------|----------|
| Trip-themed name | Something like "Tuscany 2026" or "Florence Trip". | |
| Group-specific name | Something with the friend group's identity. | ✓ |
| You decide | Claude picks a clean, trip-themed title. | |

**User's choice:** Group-specific name
**Notes:** User specified: "Something like Berwick, NS does Tuscany 2026"

### Q4: What color palette direction for the app?

| Option | Description | Selected |
|--------|-------------|----------|
| Warm earth tones | Terracotta, olive, warm cream, gold accents — Tuscan countryside palette. | ✓ |
| Cool Mediterranean | Soft blues, whites, stone gray — Italian coastal vibe. | |
| You decide | Claude picks a palette that complements Tuscany imagery. | |

**User's choice:** Warm earth tones
**Notes:** None

---

## Authenticated Shell Layout

### Q1: What navigation style for the authenticated app?

| Option | Description | Selected |
|--------|-------------|----------|
| Top header bar | App name left, user menu right. Simple horizontal bar. | ✓ |
| Sidebar navigation | Left sidebar with nav links. | |
| Bottom tab bar | Mobile-style tab bar at bottom. | |

**User's choice:** Top header bar
**Notes:** None

### Q2: What should the main page show after login in Phase 1?

| Option | Description | Selected |
|--------|-------------|----------|
| Welcome + countdown | Welcome message with "X days until Tuscany!" countdown and hero image. | ✓ |
| Empty itinerary shell | Itinerary page structure (day headers for May 7-16) with no events yet. | |
| You decide | Claude picks whatever makes the most sense. | |

**User's choice:** Welcome + countdown
**Notes:** None

### Q3: How important is mobile-first design vs desktop-first?

| Option | Description | Selected |
|--------|-------------|----------|
| Mobile-first | Design for phone screens first, scale up to desktop. | ✓ |
| Desktop-first | Design for desktop first, make responsive for mobile. | |
| Equal priority | Both breakpoints get equal attention. | |

**User's choice:** Mobile-first
**Notes:** None

---

## Admin Role

### Q1: How should Adam be designated as admin?

| Option | Description | Selected |
|--------|-------------|----------|
| Hardcoded email | Check against Adam's email in code or env variable. | ✓ |
| Supabase role/metadata | Set a role field in Supabase user metadata. | |
| You decide | Claude picks the simplest approach. | |

**User's choice:** Hardcoded email
**Notes:** None

### Q2: Should admin status be visible anywhere in the UI in Phase 1?

| Option | Description | Selected |
|--------|-------------|----------|
| No indicator | Admin powers exist but no visible badge or label. | |
| Subtle badge | Small "admin" tag next to Adam's name in the header. | ✓ |

**User's choice:** Subtle badge
**Notes:** None

---

## Claude's Discretion

- Font choices and specific spacing/sizing
- Exact Unsplash image selection
- shadcn/ui component variant choices
- Countdown implementation details

## Deferred Ideas

None — discussion stayed within phase scope
