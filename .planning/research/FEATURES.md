# Feature Landscape

**Domain:** Private group trip coordination web app
**Project:** Tuscany Trip App (8 friends, 10-day villa trip, May 2026)
**Researched:** 2026-04-03
**Confidence:** HIGH for table stakes (well-established category); MEDIUM for differentiators (project-specific judgment)

---

## Table Stakes

Features users expect from any shared trip coordination tool. Missing these causes the app to fail its core purpose.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Day-by-day itinerary view | Trip has fixed dates; people need to see what's happening each day at a glance | Low | Linear list view (not calendar grid) fits a 10-day trip perfectly |
| Pre-seeded event data | The group already has plans; app must reflect reality on first load | Low | Static seed data, not a "create from scratch" flow |
| Event detail view | Each activity needs title, date/time, location/map link, description | Low | Location links (Google Maps, VRBO, restaurant URLs) are highly useful |
| User authentication | Private trip; content should not be publicly accessible | Medium | Supabase Auth handles this; sign-up via unlisted link only |
| Individual RSVP per event | Core value — "who's going to what" is why this app exists | Medium | Attend/not-attend state per (user, event) pair |
| Attendee list display | Users need to see who else is coming to each event | Low | Dependent on RSVP; display names of confirmed attendees |
| Add new events | Each couple has planned separate excursions; they need to add them | Medium | Anyone authenticated can create; title, date, time, location, description |
| Edit/delete own events | Mistakes happen; organizers need to fix details | Low-Medium | Author or admin can edit; soft delete preferred |
| Mobile-responsive layout | Users will check the app on their phones during the trip | Low | Responsive CSS, not a native app; table stakes for any web app in 2026 |
| Persistent login session | Users shouldn't re-authenticate every visit | Low | Supabase handles session management natively |

---

## Differentiators

Features beyond baseline that meaningfully improve this specific trip's experience. Not universally expected, but well-matched to the group's context.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Tuscany-specific visual design | Creates emotional resonance; feels like "our trip" not generic software | Low | Unsplash imagery of Florence/Tuscany, warm palette; high impact, low cost |
| Event category/type tagging | Lets users quickly scan "group dinners" vs "excursions" vs "open days" | Low | Could be as simple as a color dot or label; reduces scan time |
| RSVP summary count on itinerary list | "4 attending" visible without clicking into event; faster scanning | Low | Single aggregated number on the card |
| "Who's going" on event detail | Full name list makes carpooling/logistics self-organizing | Low | Depends on RSVP feature; essentially free once RSVP exists |
| Location map link integration | Direct link to Google Maps for each venue; eliminates copy-paste | Low | Store as a URL field; render as linked button |
| Event notes/comments | Allow attendees to leave logistical notes ("I'll drive," "need a vegetarian option") | Medium | Lightweight; not threaded chat; one-level comments per event |
| Admin event management | One organizer (e.g. Adam) can edit/delete any event, not just their own | Low | Role flag in DB; important for maintaining schedule integrity |
| Arrival/departure day markers | May 7 (leave Halifax) and May 16 (fly home) deserve visual treatment as trip bookends | Low | Static or special event type; helps orient users to the trip arc |

---

## Anti-Features

Features to explicitly NOT build. Each one risks adding complexity without matching value for 8 people on a 10-day trip.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real-time group chat / messaging | Already exists (iMessage, WhatsApp); building it duplicates existing tools the group already uses | Keep "Out of Scope"; direct coordination to existing group chat |
| Expense tracking / bill splitting | Splitwise and Venmo solve this; building it increases scope dramatically for marginal gain | Keep "Out of Scope"; direct to Splitwise |
| Polling / voting on activities | The trip is already largely planned; the problem is visibility and sign-up, not decision-making | Events are created by anyone; group decides in chat |
| Notifications / push alerts | 8 people, a 10-day trip, single organizer — email/SMS infrastructure is high complexity for low need | Users check the app when they want to; no push required |
| Native mobile app (iOS/Android) | Responsive web covers all devices; native adds months of work and app store overhead | Responsive web is the app |
| Carpool seat tracking | Too granular; people coordinate carpooling in conversation | "Who's attending" list is sufficient signal |
| Accommodation room assignment | AvoSquado-style bedroom assignment; not relevant — one villa, couples already know their rooms | Not needed |
| AI-generated itinerary suggestions | Trip is already planned; AI suggestions solve the wrong problem | Users create events manually |
| Activity booking / payment | SquadTrip-style payment collection; not relevant for friends who trust each other | Keep finances in Splitwise/Venmo |
| Packing lists | Individual concern, not group coordination | Not in scope |
| Calendar export (iCal/Google Cal) | Nice-to-have but adds complexity; the app IS the source of truth for this trip | Defer indefinitely; the 10-day window is short enough that the app itself is the calendar |
| Social discovery / public profiles | This is a private trip for a trusted group, not a social network | Private unlisted link is the access control |

---

## Feature Dependencies

```
Authentication (Supabase Auth)
  └─> User session
        ├─> RSVP (requires known user identity)
        │     └─> Attendee list display
        │     └─> RSVP count on itinerary card
        ├─> Add new event (requires authenticated creator)
        │     └─> Edit/delete own event (author = creator)
        │     └─> Event comments/notes (requires authenticated commenter)
        └─> Admin role flag
              └─> Admin edit/delete any event

Pre-seeded itinerary data (seed script)
  └─> Day-by-day itinerary view (needs events to display)
        └─> Event detail view
              └─> Location map link
              └─> Attendee list display
              └─> Event comments/notes
```

**Critical path:** Auth → RSVP → attendee visibility. Everything else is additive.

---

## MVP Recommendation

The MVP is a private, authenticated itinerary with RSVP. It must be ready before May 7, 2026.

**Prioritize (ship first):**
1. Supabase auth with unlisted sign-up link
2. Seeded day-by-day itinerary for May 7-16 with existing events
3. Event detail view (title, description, date/time, location link)
4. Individual RSVP (attend / not attend) with attendee list
5. Add new event form (any authenticated user)
6. Tuscany imagery and modern visual design

**Defer to v1.1 (post-launch, before trip):**
- Event comments/notes
- Edit/delete events (can be done manually in Supabase dashboard if urgent)
- Admin event management role

**Defer indefinitely:**
- Everything in Anti-Features above

**Why this order:**
The trip has a fixed end date (May 16). The group needs the itinerary seeded and RSVP working before people start coordinating logistics. Visual design matters because the app represents the trip — it should feel special, not like a CRUD demo. Event creation comes after viewing because the seed data covers the planned events; new events are additive.

---

## Feature Prioritization Matrix

| Feature | User Value | Build Effort | Ship Order |
|---------|-----------|-------------|------------|
| Auth + private sign-up | Critical | Medium | 1 |
| Seeded itinerary (day view) | Critical | Low | 1 |
| Event detail view | Critical | Low | 1 |
| RSVP + attendee list | Critical | Medium | 2 |
| Tuscany visual design | High | Low | 2 |
| Add new event | High | Medium | 2 |
| Admin event management | Medium | Low | 3 |
| Edit/delete own event | Medium | Medium | 3 |
| Event comments/notes | Medium | Medium | 4 |
| Event category/type tags | Low-Medium | Low | 4 |
| Calendar export | Low | Medium | Skip |
| Chat/messaging | None (duplicate) | High | Skip |
| Expense tracking | None (duplicate) | High | Skip |

---

## Sources

- [Best Group Travel Planning Apps 2026 - SquadTrip](https://www.squadtrip.com/guides/the-ultimate-group-travel-planning-app)
- [5 Best Tools for Group Trip Planning 2026 - SquadTrip](https://squadtrip.com/guides/best-tools-for-group-trip-planning/)
- [Let's Jetty - Group Travel Itinerary Planner](https://www.letsjetty.com/)
- [13 Best Group Trip Planning Apps - IdealCharter](https://idealcharter.com/blog/group-trip-planning-app)
- [Best Group Travel Planning Apps in 2025 - AvoSquado](https://www.avosquado.app/blog/best-group-travel-planning-apps-in-2025-complete-comparison)
- [5 Best Group Travel Planning Apps - TripIt Blog](https://www.tripit.com/web/blog/travel-tips/best-group-travel-planning-app)
- [Best Group Travel Apps 2026 - JoinMyTrip](https://www.joinmytrip.com/blog/en/group-travel-apps/)
- [11 Travel App UI/UX Anti-Patterns - Purrweb](https://www.purrweb.com/blog/11-ui-ux-practices-for-a-travel-app-design/)
