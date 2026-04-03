---
status: partial
phase: 02-itinerary-and-event-views
source: [02-VERIFICATION.md]
started: 2026-04-03T00:00:00Z
updated: 2026-04-03T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Tuscany hero image visual render
expected: The hero section at top of /itinerary shows a Tuscany landscape photo (photo-1518098268026-4e89f1a2cd8e) with warm tones
result: [pending]

### 2. Itinerary after migrations applied
expected: After applying 00002 + 00003 SQL in Supabase Dashboard, reloading /itinerary shows all 10 days (May 7-16) with 16 pre-seeded events distributed across days
result: [pending]

### 3. Event detail Sheet (desktop)
expected: Clicking an event on desktop (>=768px) opens a Sheet slide-out panel showing full event details — title, description, date/time, location, category badge, attendee count
result: [pending]

### 4. Arrival/departure left border colour
expected: May 7 (Arrival) and May 16 (Departure) day cards have a visible terracotta/primary-colored left border accent (border-l-4 border-primary)
result: [pending]

### 5. Mobile Drawer swipe interaction
expected: At <768px viewport, clicking an event opens a Drawer (bottom sheet) instead of a side Sheet, with swipe-to-dismiss
result: [pending]

### 6. Location links open in new tab
expected: Events with location URLs (VRBO, Bike Tour, etc.) show a clickable Google Maps / location link that opens in a new tab (target="_blank")
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps
