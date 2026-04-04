# Phase 4: Polish and Comments - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-04
**Phase:** 04-polish-and-comments
**Areas discussed:** Timezone display, Visual polish / Design changes, UX refinements

---

## Timezone Display

### Time storage strategy

| Option | Description | Selected |
|--------|-------------|----------|
| All times are Italy time | Store and display as Europe/Rome (CEST). Everyone in Italy together. | ✓ |
| UTC storage, Italy display | Store UTC, convert to Europe/Rome for display. More "correct" but complex. | |
| No timezone logic | Keep times as plain strings. No awareness. | |

**User's choice:** All times are Italy time (Recommended)
**Notes:** Simplest approach — no conversion needed, everyone co-located.

### Time format

| Option | Description | Selected |
|--------|-------------|----------|
| 12-hour (2:30 PM) | Familiar North American convention. | ✓ |
| 24-hour (14:30) | European convention. | |
| You decide | Claude picks. | |

**User's choice:** 12-hour (2:30 PM)

### Timezone indicator

| Option | Description | Selected |
|--------|-------------|----------|
| No indicator | Just show times, no label. | |
| Subtle label once | "All times in Italy time (CEST)" at top of itinerary. | ✓ |
| Per-event suffix | "2:30 PM CEST" on each event. | |

**User's choice:** Subtle label once

---

## Visual Polish / Design Changes

User provided 3 reference mockup images showing their vision for the redesign.

### Scope check — new features in polish phase

| Option | Description | Selected |
|--------|-------------|----------|
| Include everything | Avatar uploads, Map view, and full visual redesign all in Phase 4. | ✓ |
| Visual redesign only | Skip avatar uploads and Map page. | |
| Let me pick individually | User chooses per-feature. | |

**User's choice:** Include everything
**Notes:** Last phase before the trip — include all desired features.

### Horizontal card overflow

| Option | Description | Selected |
|--------|-------------|----------|
| Horizontal scroll | Cards scroll left/right. Swipe on mobile, arrows on desktop. | ✓ |
| Wrap to next row | Cards wrap below if they don't fit. | |
| You decide | Claude picks. | |

**User's choice:** Horizontal scroll (Recommended)

### Event card photos

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, optional event photos | Creators upload a cover photo for the card. | ✓ |
| No event photos | Text-only cards. | |
| You decide | Claude picks. | |

**User's choice:** Yes, optional event photos

### Login mobile adaptation

| Option | Description | Selected |
|--------|-------------|----------|
| Photo on top, form below | Stacked layout on mobile. | ✓ |
| Form only, photo as background | Blurred photo behind form. | |
| You decide | Claude picks. | |

**User's choice:** Photo on top, form below

### Export Day feature

| Option | Description | Selected |
|--------|-------------|----------|
| Skip it | No export functionality. | ✓ |
| Include it | Export day's events as iCal or link. | |

**User's choice:** Skip it

### Avatar upload location

| Option | Description | Selected |
|--------|-------------|----------|
| User menu dropdown | Header menu → Edit Profile modal. | ✓ |
| During sign-up | Avatar step in sign-up flow. | |
| You decide | Claude picks. | |

**User's choice:** User menu dropdown

### Address input method

| Option | Description | Selected |
|--------|-------------|----------|
| Google Places autocomplete | Type address, get suggestions, auto-fills coords. Requires API key. | ✓ |
| Plain text + manual coordinates | User types address, geocoded lookup. | |
| Plain text, no map embed | Address as text with link only. | |

**User's choice:** Google Places autocomplete (Recommended)

### Sidebar visibility (desktop)

| Option | Description | Selected |
|--------|-------------|----------|
| Always visible on desktop | Fixed sidebar, content takes remaining width. | ✓ |
| Collapsible / hamburger | Toggleable sidebar. | |
| You decide | Claude picks. | |

**User's choice:** Always visible on desktop

### Mobile navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Bottom tab bar | Itinerary and Map as bottom tabs. | ✓ |
| Hamburger menu | Sidebar slides in from left. | |
| You decide | Claude picks. | |

**User's choice:** Bottom tab bar

---

## UX Refinements

### Empty day handling

| Option | Description | Selected |
|--------|-------------|----------|
| Show day with prompt | Friendly message + Add Event button. | ✓ |
| Show day, no message | Blank space with Add Event button. | |
| You decide | Claude picks. | |

**User's choice:** Show the day with a prompt

### Day numbering

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, add day numbers | "DAY ONE" above the date. Updates Phase 2 D-02. | ✓ |
| Keep current format | Just "Thursday, May 7" without numbering. | |
| You decide | Claude picks. | |

**User's choice:** Yes, add day numbers

### Category icons on cards

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, category icons | Lucide icons per category in bottom-right of card. | ✓ |
| Badge is enough | Category badge pill only. | |
| You decide | Claude picks. | |

**User's choice:** Yes, category icons

### Specific UX issues

| Option | Description | Selected |
|--------|-------------|----------|
| Loading feels slow/blank | Need loading skeletons. | |
| Navigation is confusing | Hard to get around. | |
| Nothing specific | Redesign covers everything. | ✓ |
| I'll describe something | Custom issue. | |

**User's choice:** Nothing specific

---

## Claude's Discretion

- Scroll arrow styling and horizontal scroll interaction details
- Exact category icon assignments per category
- Map zoom level and default center point
- Sidebar width and styling
- Photo upload size limits and compression
- Google Maps embed styling and size
- Event detail panel layout proportions
- Loading states and transitions
- Mobile bottom tab bar icons

## Deferred Ideas

None — discussion stayed within phase scope
