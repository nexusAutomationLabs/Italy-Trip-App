# Phase 3: RSVP and Event Mutations - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 03-rsvp-and-event-mutations
**Areas discussed:** RSVP interaction, Event creation flow, Attendee & comment display, Edit & delete permissions

---

## RSVP Interaction

### RSVP Toggle Style

| Option | Description | Selected |
|--------|-------------|----------|
| "I'm in" button | Single prominent button at top of event detail. Toggles between "I'm in" (outlined) and "Attending ✓" (filled terracotta). | ✓ |
| Checkbox with label | Checkbox next to "Count me in" text. More form-like, less prominent. | |
| Floating action button | Sticky button at bottom of the event detail panel. Always visible even when scrolling. | |

**User's choice:** "I'm in" button
**Notes:** None

### RSVP Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Detail panel only | RSVP button only in the slide-out panel. Keeps day cards clean. | ✓ |
| Both day cards and panel | Small RSVP icon/button on each event row in the itinerary too. | |

**User's choice:** Detail panel only
**Notes:** None

### RSVP Feedback

| Option | Description | Selected |
|--------|-------------|----------|
| Optimistic update | Button toggles immediately, reverts if server fails. Feels snappy. | ✓ |
| Wait for server | Brief loading spinner on button, then updates. Slower but guaranteed accurate. | |
| You decide | Claude picks the best approach. | |

**User's choice:** Optimistic update
**Notes:** STATE.md flagged this area as needing investigation during research/planning.

---

## Event Creation Flow

### Form Location

| Option | Description | Selected |
|--------|-------------|----------|
| Separate page (/events/new) | Full page with form fields. User navigates away from itinerary. | |
| Modal over itinerary | Dialog/modal overlays the itinerary. Same Sheet/Drawer pattern as event detail. | ✓ |
| Inside the slide-out panel | Reuse the existing event detail panel for creation. | |

**User's choice:** Modal over itinerary
**Notes:** None

### Create Trigger

| Option | Description | Selected |
|--------|-------------|----------|
| "+ Add Event" button per day | Small button at the bottom of each day card. Pre-fills the date. | ✓ |
| Single floating "+" button | One floating action button on the itinerary page. User picks date in form. | |
| "+ Add Event" in header | Button in the top nav bar. Always accessible but not tied to a day. | |

**User's choice:** "+ Add Event" button per day
**Notes:** None

### Required Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Title + date required, rest optional | Category defaults to 'open_day'. Low friction. | ✓ |
| Title + date + category required | Also require picking a category. Ensures consistent tagging. | |
| Title + date + time required | Require time for proper sorting within a day. | |

**User's choice:** Title + date required, rest optional
**Notes:** None

---

## Attendee & Comment Display

### Attendee List Style

| Option | Description | Selected |
|--------|-------------|----------|
| Name list with avatars | Vertical list with colored initial circles. "4 attending" header. | ✓ |
| Avatar row only | Horizontal row of initial circles. Names on hover/tap. | |
| Simple comma-separated names | Plain text list. Minimalist. | |

**User's choice:** Name list with avatars
**Notes:** None

### Comment Style

| Option | Description | Selected |
|--------|-------------|----------|
| Flat list, newest last | Chronological list below attendees. Name + timestamp + message. Input at bottom. | ✓ |
| Flat list, newest first | Most recent on top. Reversed reading order. | |
| You decide | Claude picks the best layout. | |

**User's choice:** Flat list, newest last
**Notes:** None

### Comment Deletion

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, delete own comments | Small trash icon on own comments. Admin can delete any. No edit. | ✓ |
| No deletion | Comments are permanent once posted. | |
| You decide | Claude picks the right level. | |

**User's choice:** Yes, delete own comments
**Notes:** None

---

## Edit & Delete Permissions

### Edit/Delete Controls

| Option | Description | Selected |
|--------|-------------|----------|
| "..." menu in event detail panel | Three-dot menu top-right. "Edit" and "Delete" options. Only visible to owner/admin. | ✓ |
| Inline buttons below event details | Explicit buttons at bottom of panel. More discoverable but cluttered. | |
| You decide | Claude picks the best pattern. | |

**User's choice:** "..." menu in event detail panel
**Notes:** None

### Delete Confirmation

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, confirmation dialog | "Delete this event?" with Cancel / Delete buttons. Prevents accidents. | ✓ |
| No confirmation | Instant delete on tap. Faster but risky. | |
| You decide | Claude picks based on UX practice. | |

**User's choice:** Yes, confirmation dialog
**Notes:** None

### Edit Form

| Option | Description | Selected |
|--------|-------------|----------|
| Same modal pre-filled | Reuse create event modal with fields pre-populated. Title becomes "Edit Event". | ✓ |
| Inline editing in detail panel | Fields become editable in-place. More fluid but more complex. | |
| You decide | Claude picks the best approach. | |

**User's choice:** Same modal pre-filled
**Notes:** None

---

## Claude's Discretion

- RSVP button animation/transition details
- Comment input styling and empty state
- "+ Add Event" button styling within day cards
- Modal form layout and field ordering
- Confirmation dialog copy and styling
- Comments table schema and RLS policies
- Server action file organization

## Deferred Ideas

None — discussion stayed within phase scope
