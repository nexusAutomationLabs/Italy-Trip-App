# Requirements: Tuscany Trip App

**Defined:** 2026-04-03
**Core Value:** Everyone in the group can see what's planned each day, add new activities, and sign up for events — replacing scattered group chats with one clear source of truth.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password via unlisted sign-up link
- [ ] **AUTH-02**: User session persists across browser refresh and revisits
- [ ] **AUTH-03**: Unauthenticated visitors are redirected to login page
- [ ] **AUTH-04**: Admin user (Adam) can edit or delete any event

### Itinerary

- [ ] **ITIN-01**: User sees a day-by-day itinerary view covering May 7-16, 2026
- [ ] **ITIN-02**: Itinerary is pre-seeded with the group's existing planned events
- [ ] **ITIN-03**: Arrival day (May 7) and departure day (May 16) have distinct visual treatment
- [ ] **ITIN-04**: Each day displays all events with title, time, and attendee count

### Events

- [ ] **EVNT-01**: User can view event details (title, description, date/time, location, external link)
- [ ] **EVNT-02**: User can create a new event with title, description, date, time, location, and link
- [ ] **EVNT-03**: User can edit their own events
- [ ] **EVNT-04**: User can delete their own events
- [ ] **EVNT-05**: Events display a category tag (e.g. dinner, excursion, group activity, open day)
- [ ] **EVNT-06**: Event location renders as a clickable Google Maps link

### RSVP

- [ ] **RSVP-01**: User can toggle their attendance on any event (attending / not attending)
- [ ] **RSVP-02**: Event detail shows the list of attendees by name
- [ ] **RSVP-03**: Users can leave comments on events (e.g. "I'll drive", "need vegetarian option")

### Design

- [ ] **DSGN-01**: Modern, responsive layout that works on mobile and desktop
- [ ] **DSGN-02**: Tuscany/Florence-themed visual design with curated Unsplash imagery
- [x] **DSGN-03**: Consistent design system using shadcn/ui components and Tailwind CSS

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhancements

- **ENH-01**: RSVP count displayed on itinerary day cards ("4 attending")
- **ENH-02**: Calendar export (iCal) for individual events
- **ENH-03**: Dark mode toggle
- **ENH-04**: Event photo upload

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time chat / messaging | Group already uses iMessage/WhatsApp |
| Expense tracking / bill splitting | Splitwise handles this |
| Polling / voting on activities | Trip is already planned; app is for visibility and sign-up |
| Push notifications | 8 people, 10-day trip — users check the app when they want to |
| Native mobile app | Responsive web is sufficient |
| Carpool seat tracking | "Who's attending" list is enough signal for coordination |
| AI-generated suggestions | Trip is already planned by the group |
| Packing lists | Individual concern, not group coordination |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| ITIN-01 | Phase 2 | Pending |
| ITIN-02 | Phase 2 | Pending |
| ITIN-03 | Phase 2 | Pending |
| ITIN-04 | Phase 2 | Pending |
| EVNT-01 | Phase 2 | Pending |
| EVNT-02 | Phase 3 | Pending |
| EVNT-03 | Phase 3 | Pending |
| EVNT-04 | Phase 3 | Pending |
| EVNT-05 | Phase 2 | Pending |
| EVNT-06 | Phase 2 | Pending |
| RSVP-01 | Phase 3 | Pending |
| RSVP-02 | Phase 3 | Pending |
| RSVP-03 | Phase 3 | Pending |
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 2 | Pending |
| DSGN-03 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after roadmap creation*
