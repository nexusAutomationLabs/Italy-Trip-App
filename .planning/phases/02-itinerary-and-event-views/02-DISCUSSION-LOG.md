# Phase 2: Itinerary and Event Views - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 02-itinerary-and-event-views
**Areas discussed:** Day-by-day layout, Event detail page, Tuscany visual design, Seed data approach

---

## Day-by-Day Layout

### Itinerary structure

| Option | Description | Selected |
|--------|-------------|----------|
| Scrolling list | All 10 days visible as a vertical stack — scroll to see them all | ✓ |
| Accordion / collapsible | Each day is a collapsible section — click to expand | |
| Day tabs / picker | Tab bar at top — select a day to see its events | |

**User's choice:** Scrolling list
**Notes:** Simple, shows full trip at a glance. Works with existing Card component.

### Arrival/departure day treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle accent styling | Different background tint or border color on the day card | ✓ |
| Banner / ribbon label | Small banner on the card saying "Arrival Day" or "Departure Day" | |
| Full-width hero cards | Wider hero-style treatment with Tuscany background image | |
| You decide | Claude picks | |

**User's choice:** Subtle accent styling
**Notes:** Same layout, just visually distinct. Clean approach.

### Event row info

| Option | Description | Selected |
|--------|-------------|----------|
| Title + time + category tag | Event title, time, colored category tag, and attendee count | ✓ |
| Title + time + attendees only | No category tag on day view | |
| Rich preview cards | Mini-cards with description snippet and attendee avatars | |

**User's choice:** Title + time + category tag
**Notes:** Clean and scannable. Attendee count also shown per ITIN-04.

### Day header format

| Option | Description | Selected |
|--------|-------------|----------|
| Date + day number + label | e.g. "May 8 — Day 2: Florence" | |
| Date + weekday only | e.g. "Thursday, May 7" | ✓ |
| You decide | Claude picks | |

**User's choice:** Date + weekday only
**Notes:** Simple and clean, no day numbering.

---

## Event Detail Page

### Navigation to event details

| Option | Description | Selected |
|--------|-------------|----------|
| Click → detail page | Navigates to /itinerary/events/[id] | |
| Click → slide-out panel | Event details in side panel or bottom sheet | ✓ |
| Click → expand inline | Accordion-style within day card | |

**User's choice:** Slide-out panel
**Notes:** Keeps users in context on the itinerary.

### Panel layout style

| Option | Description | Selected |
|--------|-------------|----------|
| Right side panel | Slides in from right, ~40-50% width on desktop, bottom sheet on mobile | ✓ |
| Modal / dialog overlay | Centered modal with dimmed background | |
| Full-screen bottom sheet | Slides up from bottom on all devices | |

**User's choice:** Right side panel
**Notes:** Common pattern (Google Calendar, Notion). Good desktop and mobile experience.

### Google Maps location display

| Option | Description | Selected |
|--------|-------------|----------|
| Clickable text link with map icon | Location name with map pin icon, opens Google Maps in new tab | ✓ |
| Embedded map preview | Small Google Maps embed with "Get Directions" link | |
| You decide | Claude picks | |

**User's choice:** Clickable text link with map icon
**Notes:** Clean and functional, no API complexity.

### Category tag styling

| Option | Description | Selected |
|--------|-------------|----------|
| Colored pill badges | Small rounded pill with category-specific Tuscan palette color | ✓ |
| Icon + text label | Small icon plus category name | |
| You decide | Claude picks | |

**User's choice:** Colored pill badges
**Notes:** Consistent with Tuscan design language.

---

## Tuscany Visual Design

### Imagery placement

| Option | Description | Selected |
|--------|-------------|----------|
| Hero only | Existing hero section at top, clean white cards below | ✓ |
| Hero + day section headers | Hero plus small accent images on day headers | |
| Immersive background | Tuscany-themed background texture behind entire itinerary | |

**User's choice:** Hero only
**Notes:** Imagery doesn't compete with event info. Consistent with Phase 1 pattern.

### Hero image choice

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current image | Existing Tuscany countryside golden hour image stays | ✓ |
| Rotate between images | 3-5 images that rotate on page load | |
| New image for Phase 2 | Replace with different Tuscany image | |

**User's choice:** Keep current image
**Notes:** Consistent experience, no additional curation needed.

---

## Seed Data Approach

### Event categories

| Option | Description | Selected |
|--------|-------------|----------|
| 5 categories | Dinner, Excursion, Group Activity, Travel, Open Day | ✓ |
| 4 categories (simpler) | Dinner, Excursion, Group Activity, Open Day | |
| You decide | Claude picks | |

**User's choice:** 5 categories
**Notes:** "Travel" covers flights/car pickups. "Open Day" for unstructured days.

### Seeding method

| Option | Description | Selected |
|--------|-------------|----------|
| SQL migration seed file | Supabase migration with INSERT statements | ✓ |
| TypeScript seed script | Node script using Supabase client | |
| Manual entry via app | No seed — Adam creates events manually after Phase 3 | |
| You decide | Claude picks | |

**User's choice:** SQL migration seed file
**Notes:** Reproducible and version-controlled.

### Event detail level

| Option | Description | Selected |
|--------|-------------|----------|
| Title + time + category + short description | Include what's known, leave blanks where unknown | ✓ |
| Minimal — title + category only | Times and descriptions added later | |
| Full detail where available | Everything known including links and addresses | |

**User's choice:** Title + time + category + short description
**Notes:** Balanced approach. Location/link left blank where unknown for later fill-in.

---

## Claude's Discretion

- Specific Tuscan palette color assignments for each of the 5 category tags
- Slide-out panel animation and transition details
- Exact accent styling for arrival/departure day cards
- Event row spacing and typography
- Mobile bottom sheet behavior (drag handle, snap points)

## Deferred Ideas

None — discussion stayed within phase scope
