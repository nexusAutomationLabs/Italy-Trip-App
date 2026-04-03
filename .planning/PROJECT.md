# Tuscany Trip App

## What This Is

A private trip coordination website for a group of 8 friends from Nova Scotia travelling to a villa outside Florence, Italy (May 7-16, 2026). The app consolidates excursions, day trips, and dinners into a shared day-by-day itinerary so people can collaborate, RSVP, and carpool.

## Core Value

Everyone in the group can see what's planned each day, add new activities, and sign up for events — replacing scattered group chats with one clear source of truth.

## Requirements

### Validated

- [x] Day-by-day itinerary view for May 7-16, 2026 — Validated in Phase 2: Itinerary and Event Views
- [x] Pre-seeded schedule with the existing planned events — Validated in Phase 2: Itinerary and Event Views
- [x] Modern design with Unsplash Florence/Tuscany imagery — Validated in Phase 2: Itinerary and Event Views
- [x] Anyone can create new events (title, description, date/time, location/link) — Validated in Phase 3: RSVP and Event Mutations
- [x] Individual RSVP — users add their name to any event — Validated in Phase 3: RSVP and Event Mutations

### Active

- [ ] Supabase-powered authentication with self-service sign-up (private/unlisted link)
- [ ] Hosted on Vercel

### Out of Scope

- Real-time chat or messaging — group chat apps already handle this
- Expense tracking or bill splitting — separate tools exist for this
- Mobile native app — responsive web is sufficient for a 10-day trip
- Carpool seat counting — keep it simple, people can coordinate in person

## Context

**The group:** 8 friends (4 couples) from Nova Scotia. Individual tracking (not couples).

**The trip:**
- May 7 (Thu): Leave Halifax
- May 8 (Fri): Night in Florence, group dinner
- May 9 (Sat): Pick up rental car, check into villa
- May 10 (Sun): Hang out at villa, dinner at villa
- May 11 (Mon): Group trip to Pienza, Siena, and Gladiator filming site
- May 12 (Tue): Group food and wine tour
- May 13 (Wed): Split day — Adam & Gina drive to coastal towns; Brian & Mark gravel bike tour
- May 14 (Thu): Open / TBD
- May 15 (Fri): Hot springs, dinner for Mark's birthday
- May 16 (Sat): Drop off rental car, some fly home from Florence

**The villa:** VRBO listing outside Florence — https://www.vrbo.com/en-ca/cottage-rental/p1190044vb

**Bike tour link:** https://www.bike-tour-tuscany.it/en/bike-tours-tuscany/one-day-bike-tours-in-tuscany/

**The problem:** Each couple has been planning excursions separately. Need one place to see everything and opt in.

## Constraints

- **Stack**: Next.js (App Router) on Vercel, Supabase for auth and database
- **Access**: Private — sign-up via unlisted link only, no public discovery
- **Timeline**: Trip is May 7, 2026 — app needs to be ready before then
- **Users**: ~8-10 people max, no need for scale
- **Design**: Modern aesthetic, Unsplash imagery of Tuscany/Florence

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js + Vercel | Best DX, native Vercel integration | -- Pending |
| Supabase for auth + DB | Managed auth, Postgres DB, generous free tier | -- Pending |
| Individual accounts (not couples) | People RSVP individually, simpler model | -- Pending |
| Day-by-day list view (not calendar) | Simpler, matches the linear nature of a 10-day trip | -- Pending |
| Private unlisted sign-up link | Simplest access control for a small trusted group | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 after Phase 3 completion*
