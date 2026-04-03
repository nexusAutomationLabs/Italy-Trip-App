# Phase 2: Itinerary and Event Views - Research

**Researched:** 2026-04-03
**Domain:** Next.js App Router data display, shadcn/ui base-nova components, Supabase schema design, date-fns formatting
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Scrolling vertical list of all 10 days — no accordion, no tabs. Full trip visible at a glance.
- **D-02:** Day headers use "Thursday, May 7" format (weekday + date). No day numbering (no "Day 1", "Day 2").
- **D-03:** Arrival (May 7) and departure (May 16) days have subtle accent styling — different background tint or border color on the day card. Same layout as regular days, just visually distinct.
- **D-04:** Each event row on a day card shows: title, time, category tag (colored pill), and attendee count.
- **D-05:** Clicking an event opens a right-side slide-out panel (~40-50% width on desktop). On mobile, becomes a full-screen bottom sheet.
- **D-06:** No separate event detail page route — panel overlays the itinerary. User stays in context.
- **D-07:** Google Maps location link displayed as clickable text with a map pin icon — opens in new tab.
- **D-08:** Category tags use colored pill badges with category-specific colors from the Tuscan palette (terracotta for dinner, olive for excursion, gold for group activity, etc.).
- **D-09:** Hero section at top only — keep the existing Tuscany countryside golden hour background image from Phase 1.
- **D-10:** Day cards below the hero are clean white cards on the warm cream background. No additional Tuscany imagery in day cards.
- **D-11:** Carries forward Phase 1 design: Playfair Display headings, Montserrat body, warm earth tone palette (terracotta, olive, cream, gold).
- **D-12:** Five event categories: Dinner, Excursion, Group Activity, Travel, Open Day.
- **D-13:** Seed data delivered via SQL migration file (Supabase migration with INSERT statements). Reproducible and version-controlled.
- **D-14:** Each seeded event includes: title, approximate time, category, and 1-2 sentence description. Location/link fields left blank where unknown — users fill in later via Phase 3.

### Claude's Discretion

- Specific Tuscan palette color assignments for each category tag
- Slide-out panel animation and transition details
- Exact accent styling approach for arrival/departure day cards (tint color, border style)
- Event row spacing and typography within day cards
- Mobile bottom sheet behavior (drag handle, snap points)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ITIN-01 | User sees a day-by-day itinerary view covering May 7-16, 2026 | Server Component generates 10 day ranges; date-fns formats each header |
| ITIN-02 | Itinerary is pre-seeded with the group's existing planned events | SQL migration with INSERT statements; 10 days of events from PROJECT.md |
| ITIN-03 | Arrival day (May 7) and departure day (May 16) have distinct visual treatment | Conditional className on DayCard; Tailwind bg/border variant |
| ITIN-04 | Each day displays all events with title, time, and attendee count | Events fetched from Supabase with JOIN to rsvps count; displayed in EventRow component |
| EVNT-01 | User can view event details (title, description, date/time, location, external link) | Sheet component (base-nova) for desktop; Drawer for mobile |
| EVNT-05 | Events display a category tag (e.g. dinner, excursion, group activity, open day) | Badge component (base-nova) with custom color per category |
| EVNT-06 | Event location renders as a clickable Google Maps link | Anchor tag with MapPin icon from Lucide; opens in new tab |
| DSGN-02 | Tuscany/Florence-themed visual design with curated Unsplash imagery | Hero already exists in itinerary/page.tsx; cream background, warm cards maintained |

</phase_requirements>

---

## Summary

Phase 2 builds a read-only day-by-day itinerary with event detail panels. The core architecture is a Server Component page that fetches all events grouped by date, then passes that data to a Client Component wrapper that manages which event is selected and whether the Sheet/Drawer panel is open.

The project uses `@base-ui/react` v1.3.0 via the shadcn `base-nova` style — NOT the Radix UI-based shadcn. This was confirmed in the codebase (`components.json` style: "base-nova", `button.tsx` imports from `@base-ui/react/button`). The Sheet and Drawer components need to be added via `npx shadcn@latest add sheet drawer badge` before implementation. The Drawer component is built on `vaul` (available on npm as v1.1.2) while the Sheet uses Base UI Dialog primitives.

Key database work: create an `events` table with a Postgres enum for the 5 categories, an `rsvps` table (Phase 3 will add mutation; Phase 2 only reads count), and seed with the 10 days of trip data from PROJECT.md. The attendee count on day cards (ITIN-04) requires a JOIN or a Supabase `count` query — even though RSVP interactions are Phase 3, the count display is Phase 2.

**Primary recommendation:** Build a thin Client Component wrapper (`ItineraryClient`) that receives all event data as props from the Server Component page, manages `selectedEventId` state, and renders both the day list and the Sheet/Drawer overlay. Never put data fetching in the Client Component.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 15.5.14 (installed) | Server Components for data fetching, Client Components for Sheet state | Mandated; already installed |
| `@supabase/ssr` + `@supabase/supabase-js` | 0.10.0 / 2.101.1 (installed) | Server-side data fetching with cookie auth | Mandated; already installed |
| `@base-ui/react` | 1.3.0 (installed) | Headless Dialog/Drawer primitives that power Sheet and Drawer shadcn components | Already installed; base-nova style uses it |
| `date-fns` | 4.1.0 (installed) | Day header formatting, grouping events by date | Already installed |
| Tailwind CSS v4 | installed | All styling, conditional day accent classes | Already installed |
| shadcn/ui `sheet` | to install | Right-side slide-out panel on desktop | base-nova Sheet wraps Base UI Dialog |
| shadcn/ui `drawer` | to install | Bottom sheet on mobile | base-nova Drawer wraps vaul |
| shadcn/ui `badge` | to install | Category pill tags | base-nova Badge component |
| Lucide React | 1.7.0 (installed) | MapPin icon for location link, X close button | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `shadcn/ui separator` | to install | Visual dividers between event rows | Optional; can use border-b Tailwind instead |
| `vaul` | 1.1.2 (npm) | Underlying drawer/bottom-sheet animation | Installed automatically when `npx shadcn add drawer` runs |

### Installation
```bash
# From project root — adds sheet, drawer, and badge to src/components/ui/
npx shadcn@latest add sheet drawer badge
# vaul is added automatically as a dependency of drawer
```

**Version verification:** Sheet, Drawer, and Badge are part of the shadcn registry (base-nova variants confirmed available at `ui.shadcn.com/r/styles/base-nova/sheet.json`). Vaul v1.1.2 confirmed on npm. No manual version pinning needed.

---

## Architecture Patterns

### Data Flow Pattern (Server → Client split)

The itinerary page follows this split:

```
src/app/(app)/itinerary/
├── page.tsx              # Server Component — fetches events from Supabase
└── _components/
    ├── ItineraryClient.tsx   # 'use client' — owns selectedEventId state
    ├── DayCard.tsx           # Pure display — receives day + events as props
    ├── EventRow.tsx          # Clickable row inside a DayCard
    └── EventDetailPanel.tsx  # Sheet + Drawer, receives selectedEvent as prop
```

This pattern keeps data fetching on the server and UI state on the client, which matches the established pattern in this codebase.

### Pattern 1: Server Component fetches, Client Component manages selection state

**What:** `page.tsx` is async and calls Supabase, then renders `<ItineraryClient events={groupedEvents} />`.

**When to use:** Any time a page needs server data AND interactive state (open/close panel).

**Example:**
```typescript
// src/app/(app)/itinerary/page.tsx  (Server Component)
import { createClient } from '@/lib/supabase/server'
import { ItineraryClient } from './_components/ItineraryClient'

export default async function ItineraryPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*, rsvps(count)')
    .order('event_date', { ascending: true })
    .order('start_time', { ascending: true })

  return (
    <>
      {/* Hero carried forward from existing page.tsx */}
      <HeroSection />
      <ItineraryClient events={events ?? []} />
    </>
  )
}
```

```typescript
// src/app/(app)/itinerary/_components/ItineraryClient.tsx  ('use client')
'use client'
import { useState } from 'react'

export function ItineraryClient({ events }: { events: EventRow[] }) {
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)

  // group events by event_date...
  return (
    <>
      {groupedDays.map(day => (
        <DayCard key={day.date} day={day} onEventClick={setSelectedEvent} />
      ))}
      <EventDetailPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  )
}
```

### Pattern 2: Responsive Sheet (desktop) + Drawer (mobile)

**What:** Use CSS media query pattern — render both components, show one at a time via Tailwind responsive classes.

**When to use:** When D-05 says "right-side panel on desktop, full-screen bottom sheet on mobile."

**Example:**
```typescript
// src/app/(app)/itinerary/_components/EventDetailPanel.tsx
'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'

export function EventDetailPanel({ event, onClose }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Sheet open={!!event} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-[45%] max-w-xl">
          <SheetHeader>
            <SheetTitle>{event?.title}</SheetTitle>
          </SheetHeader>
          {/* event details */}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{event?.title}</DrawerTitle>
        </DrawerHeader>
        {/* same event details */}
      </DrawerContent>
    </Drawer>
  )
}
```

Note: A `useMediaQuery` hook does not currently exist in the codebase — it must be created in `src/hooks/use-media-query.ts`. This is a simple hook wrapping `window.matchMedia`.

### Pattern 3: Day header formatting with timezone safety

**What:** Use noon time anchor when constructing Date objects from ISO date strings to avoid off-by-one errors from UTC midnight conversion.

**Why:** `new Date('2026-05-07')` parses as midnight UTC, which is 8pm or 9pm local time the day before depending on timezone. Adding `T12:00:00` (noon) prevents the date from being interpreted as the previous day.

**Example:**
```typescript
// Correct — noon anchor prevents timezone shift
import { format } from 'date-fns'
const heading = format(new Date('2026-05-07T12:00:00'), 'EEEE, MMMM d')
// → "Thursday, May 7"

// Wrong — midnight UTC can shift to May 6 in North American timezones
format(new Date('2026-05-07'), 'EEEE, MMMM d') // → may show "Wednesday, May 6"
```

### Pattern 4: Attendee count via Supabase JOIN

**What:** ITIN-04 requires attendee count display. Even though RSVP mutation is Phase 3, the count display is Phase 2. The `rsvps` table must exist and the query must include it.

**Example:**
```typescript
// Count syntax with Supabase JS v2
const { data } = await supabase
  .from('events')
  .select('*, rsvps(count)')
  .order('event_date', { ascending: true })

// rsvps will be: [{ count: 3 }] — access as event.rsvps[0]?.count ?? 0
```

### Recommended Project Structure
```
src/
├── app/(app)/itinerary/
│   ├── page.tsx                    # Server Component, fetches events
│   └── _components/
│       ├── ItineraryClient.tsx     # 'use client', manages selectedEvent state
│       ├── DayCard.tsx             # Day header + event list, receives day prop
│       ├── EventRow.tsx            # Single event row with badge + time
│       └── EventDetailPanel.tsx   # Sheet/Drawer overlay
├── components/ui/
│   ├── sheet.tsx                   # to add via shadcn CLI
│   ├── drawer.tsx                  # to add via shadcn CLI
│   └── badge.tsx                   # to add via shadcn CLI
├── hooks/
│   └── use-media-query.ts          # to create (simple matchMedia wrapper)
├── types/
│   └── database.types.ts           # to update after migration + type gen
└── supabase/migrations/
    ├── 00001_create_profiles_table.sql  # existing
    ├── 00002_create_events_table.sql    # new — schema + enum
    └── 00003_seed_trip_events.sql       # new — INSERT statements
```

### Anti-Patterns to Avoid
- **Putting data fetching in ItineraryClient:** Client components cannot be async in Next.js 15. Keep all Supabase queries in `page.tsx`.
- **Using `new Date('2026-05-07')` without noon anchor:** Will produce wrong day in North American timezones. Always use `T12:00:00`.
- **Separate route for event detail (e.g. `/itinerary/events/[id]`):** D-06 explicitly forbids this. Use the Sheet overlay.
- **Using `getSession()` for auth checks:** Project CLAUDE.md forbids this. The layout already uses `getUser()` — the itinerary page inherits the auth guard from `(app)/layout.tsx` and does not need to re-check auth.
- **Hardcoding Tuscan category colors in Tailwind arbitrary values:** Use CSS custom properties or a lookup map for category → color class, so all five categories are defined in one place.

---

## Database Schema

### Events table
```sql
-- supabase/migrations/00002_create_events_table.sql

-- Category enum
create type event_category as enum (
  'dinner',
  'excursion',
  'group_activity',
  'travel',
  'open_day'
);

-- Events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date date not null,               -- e.g. 2026-05-07
  start_time time,                        -- e.g. 19:00:00 (nullable for open/all-day)
  end_time time,                          -- nullable
  category event_category not null,
  location_name text,                     -- human-readable place name (filled in Phase 3)
  location_url text,                      -- Google Maps link (filled in Phase 3)
  created_by uuid references auth.users,  -- null for seeded events
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.events enable row level security;

-- All authenticated users can read all events
create policy "Authenticated users can read events" on public.events
  for select
  to authenticated
  using (true);
```

### RSVPs table (Phase 2 creates it for count display; Phase 3 adds mutation)
```sql
create table public.rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

alter table public.rsvps enable row level security;

-- Authenticated users can read all RSVPs (for attendee count display)
create policy "Authenticated users can read rsvps" on public.rsvps
  for select
  to authenticated
  using (true);
```

### TypeScript types update
After running migrations, regenerate types:
```bash
supabase gen types typescript --linked > src/types/database.types.ts
```
If Supabase CLI is not linked locally, manually extend `database.types.ts` with the new tables. The existing placeholder file at `src/types/database.types.ts` only has `profiles` — it must be extended or regenerated.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slide-out panel | Custom CSS animation + z-index management | `shadcn sheet` (base-nova) | Handles focus trap, keyboard dismiss, backdrop, ARIA roles |
| Mobile bottom sheet | Custom touch drag implementation | `shadcn drawer` (built on vaul) | Vaul handles swipe-to-dismiss, snap points, drag handle |
| Category pill badges | `<span className="...">` with hardcoded styles | `shadcn badge` with className override | Consistent sizing, focus handling, accessible |
| Media query in JS | Manual resize event listener | `useMediaQuery` hook with `window.matchMedia` | matchMedia is the standard Web API; wrapping in a hook prevents SSR hydration issues |
| Date grouping by day | Custom date comparison logic | `date-fns` `isSameDay` or group by `event_date` string | String grouping by `event_date` (ISO date column) is simpler and more reliable than Date object comparison |

**Key insight:** In a date-grouped list, the simplest approach is to group by the `event_date` string directly (e.g. `"2026-05-07"`) since it is already an ISO date — no Date objects needed for grouping, only for formatting the display header.

---

## Category Color Map

Claude's discretion area. Recommended Tuscan palette assignments using existing CSS variables from `globals.css`:

| Category | Color Name | Rationale | Tailwind Implementation |
|----------|-----------|-----------|------------------------|
| `dinner` | Terracotta (`--primary`) | Warm, food-associated | `bg-primary/15 text-primary` |
| `excursion` | Olive (`--secondary`) | Earthy, adventure | `bg-secondary/15 text-secondary` |
| `group_activity` | Gold (`--accent`) | Celebratory, communal | `bg-accent/20 text-accent-foreground` |
| `travel` | Muted gray (`--muted-foreground`) | Neutral, transitional | `bg-muted text-muted-foreground` |
| `open_day` | Warm border (`--border`) | Light, unscheduled | `bg-muted/50 text-muted-foreground border border-border` |

All colors use existing OKLCH variables — no new colors introduced.

### Arrival/Departure Day Accent (Claude's discretion)

Recommended: `border-l-4 border-primary` (terracotta left border) on the day card. Simple, visible, and uses the established palette without a background tint that might clash with card content.

---

## Common Pitfalls

### Pitfall 1: Sheet/Drawer state in the wrong component
**What goes wrong:** Developer puts `selectedEvent` state inside `DayCard` or `EventRow`, creating multiple Sheet instances — one per event — all mounted simultaneously.
**Why it happens:** Seems natural to put the handler close to the trigger.
**How to avoid:** Own the single `selectedEvent` state at the `ItineraryClient` level. Pass `onEventClick` as a prop down to `EventRow`.
**Warning signs:** Multiple `<SheetContent>` elements in the DOM; console warnings about multiple dialogs.

### Pitfall 2: Timezone date shift on headers
**What goes wrong:** May 7 header shows "Wednesday, May 6" for users in UTC-4 or UTC-5.
**Why it happens:** `new Date('2026-05-07')` parses as `2026-05-07T00:00:00Z` which is `2026-05-06T20:00:00-04:00`.
**How to avoid:** Use noon anchor: `new Date('2026-05-07T12:00:00')` when constructing Date objects for display formatting. The `event_date` column stores only the date string; append `T12:00:00` before formatting.
**Warning signs:** Day header is one day behind what the database stores.

### Pitfall 3: Calling `supabase.auth.getUser()` inside itinerary page
**What goes wrong:** Redundant server round-trip; potential session inconsistency.
**Why it happens:** Developer copies auth pattern from layout.
**How to avoid:** The `(app)/layout.tsx` already guards all routes. The `itinerary/page.tsx` does NOT need to call `getUser()` — it can call the Supabase client directly for data fetching. The user is already verified by the layout.
**Warning signs:** Double auth calls in server logs.

### Pitfall 4: `shadcn add` fails because of base-nova style mismatch
**What goes wrong:** Running `npx shadcn@latest add sheet` installs the Radix-based sheet instead of the Base UI version.
**Why it happens:** Some shadcn versions default to radix if the registry style is ambiguous.
**How to avoid:** The `components.json` has `"style": "base-nova"` — the CLI should auto-detect. Verify installed files import from `@base-ui/react` not `@radix-ui/react-dialog`. If wrong, delete the file and re-run.
**Warning signs:** Installed `sheet.tsx` imports `@radix-ui/react-dialog`.

### Pitfall 5: Attendee count missing because rsvps table doesn't exist yet
**What goes wrong:** Query `.select('*, rsvps(count)')` fails or returns null.
**Why it happens:** Developer skips creating the rsvps table assuming it's Phase 3's job.
**How to avoid:** Create the rsvps table in Phase 2 migrations (read-only policies only). Phase 3 adds the write policies and mutation logic.
**Warning signs:** Supabase query error referencing unknown table.

---

## Seed Data Reference

From `PROJECT.md` and `CONTEXT.md` specifics — all 10 days:

| Date | Day | Events to Seed | Category |
|------|-----|---------------|----------|
| May 7 (Thu) | Arrival | Leave Halifax → fly to Florence | travel |
| May 8 (Fri) | Florence | Night in Florence, group dinner | dinner |
| May 9 (Sat) | Villa arrival | Pick up rental car, check into villa | travel |
| May 10 (Sun) | Villa day | Hang out at villa, dinner at villa | group_activity + dinner |
| May 11 (Mon) | Excursion | Pienza, Siena, and Gladiator filming site | excursion |
| May 12 (Tue) | Food tour | Group food and wine tour | excursion |
| May 13 (Wed) | Split day | Adam & Gina: coastal towns; Brian & Mark: gravel bike tour | excursion |
| May 14 (Thu) | Open | Open / TBD day | open_day |
| May 15 (Fri) | Special | Hot springs + Mark's birthday dinner | excursion + dinner |
| May 16 (Sat) | Departure | Drop off rental car, fly home | travel |

Known links to embed in seed data:
- Villa: `https://www.vrbo.com/en-ca/cottage-rental/p1190044vb`
- Bike tour: `https://www.bike-tour-tuscany.it/en/bike-tours-tuscany/one-day-bike-tours-in-tuscany/`

---

## Code Examples

### Grouping events by date (string-based, no Date objects)
```typescript
// Source: date-fns docs + standard JS Map grouping
type EventsByDate = Map<string, Event[]>  // key: "2026-05-07"

function groupEventsByDate(events: Event[]): EventsByDate {
  return events.reduce((acc, event) => {
    const key = event.event_date  // already "2026-05-07" from Supabase date column
    if (!acc.has(key)) acc.set(key, [])
    acc.get(key)!.push(event)
    return acc
  }, new Map<string, Event[]>())
}
```

### Day header formatting (timezone-safe)
```typescript
// Source: date-fns v4 docs — format tokens: EEEE (full weekday), MMMM (full month), d (day)
import { format } from 'date-fns'

function formatDayHeader(isoDate: string): string {
  // Noon anchor prevents UTC midnight → previous day shift
  return format(new Date(`${isoDate}T12:00:00`), 'EEEE, MMMM d')
}
// formatDayHeader('2026-05-07') → "Thursday, May 7"
```

### Category badge color lookup
```typescript
// Source: project convention — all colors from globals.css variables
const CATEGORY_STYLES: Record<string, string> = {
  dinner:         'bg-primary/15 text-primary',
  excursion:      'bg-secondary/15 text-secondary-foreground',
  group_activity: 'bg-accent/20 text-accent-foreground',
  travel:         'bg-muted text-muted-foreground',
  open_day:       'bg-muted/50 text-muted-foreground border border-border',
}

const CATEGORY_LABELS: Record<string, string> = {
  dinner:         'Dinner',
  excursion:      'Excursion',
  group_activity: 'Group Activity',
  travel:         'Travel',
  open_day:       'Open Day',
}
```

### Google Maps location link
```typescript
// Source: D-07 decision + Lucide MapPin icon
import { MapPin } from 'lucide-react'

function LocationLink({ name, url }: { name: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-primary hover:underline"
    >
      <MapPin className="size-4" />
      {name}
    </a>
  )
}
```

### useMediaQuery hook (to create)
```typescript
// src/hooks/use-media-query.ts
'use client'
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
```

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build / dev server | ✓ | (project running) | — |
| `@base-ui/react` | Sheet + Drawer primitives | ✓ | 1.3.0 (installed) | — |
| `date-fns` | Day header formatting | ✓ | 4.1.0 (installed) | — |
| `lucide-react` | MapPin icon | ✓ | 1.7.0 (installed) | — |
| `vaul` | shadcn Drawer component | ✗ (npm v1.1.2) | — | Installed automatically via `npx shadcn add drawer` |
| shadcn `sheet` component | Desktop slide-out panel | ✗ | — | Must install via CLI |
| shadcn `drawer` component | Mobile bottom sheet | ✗ | — | Must install via CLI |
| shadcn `badge` component | Category tags | ✗ | — | Must install via CLI |
| Supabase CLI | Migration + type gen | Likely ✓ (project uses it) | — | Manually write types if not linked |

**Missing dependencies with no fallback:**
- None — all missing items install cleanly via `npx shadcn@latest add sheet drawer badge`.

**Missing dependencies with fallback:**
- Supabase CLI local link: If not linked, type generation requires manual type file update. Fallback: manually extend `database.types.ts` with new tables.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Radix UI-based shadcn components | `@base-ui/react` via `base-nova` style | Dec 2025 (Base UI v1.0) / Jan 2026 (shadcn docs) | Component imports differ; `asChild` → `render` prop pattern; Sheet uses Base UI Dialog not Radix |
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | Mid-2024 | Already migrated in Phase 1 |
| Next.js Pages Router | App Router | Next.js 13+ | Already using App Router |

**Deprecated/outdated:**
- Radix-based Sheet (`@radix-ui/react-dialog`): Not used in this project. `base-nova` style uses `@base-ui/react` Dialog.
- `getSession()` for server-side auth: Replaced by `getUser()` per Supabase security docs. Phase 1 already established this.

---

## Open Questions

1. **Supabase project link status for migrations**
   - What we know: Migrations exist in `supabase/migrations/`. CLI is likely installed.
   - What's unclear: Whether the local Supabase CLI is linked to the Vercel/Supabase project for `supabase db push`.
   - Recommendation: Plan includes a step to apply migrations via Supabase Dashboard SQL Editor as fallback (same pattern as migration 00001).

2. **Attendee count with zero rsvps**
   - What we know: `.select('*, rsvps(count)')` returns `[{ count: 0 }]` for zero RSVPs.
   - What's unclear: Exact shape — may be `rsvps: []` (empty array) or `rsvps: [{ count: 0 }]`.
   - Recommendation: Use `event.rsvps?.[0]?.count ?? 0` as safe accessor; verify in implementation.

---

## Project Constraints (from CLAUDE.md)

These are directives from `CLAUDE.md` that the planner must verify compliance with:

- **Stack locked**: Next.js (App Router), Supabase, Vercel only
- **Supabase auth**: Use `@supabase/ssr`, never `@supabase/auth-helpers-nextjs`
- **Auth check**: Use `getUser()` not `getSession()` for any server-side auth-gated operation
- **No Pages Router**: App Router exclusively
- **No Prisma/Drizzle**: Use Supabase JS client + CLI-generated types
- **No Moment.js**: Use `date-fns` v4 (already installed)
- **No `localStorage` for auth**: Already handled by `@supabase/ssr` cookie sessions
- **CSS background-image pattern**: Use `style={{ backgroundImage: '...' }}` for Unsplash images, NOT `next/image` with remotePatterns. Established in Phase 1.
- **Tailwind v4**: CSS-first config in `globals.css`, no `tailwind.config.js`
- **GSD workflow**: All file changes must go through GSD phase execution (`/gsd:execute-phase`)

---

## Sources

### Primary (HIGH confidence)
- `components.json` (project file) — confirms `"style": "base-nova"`, `@base-ui/react` in use
- `package.json` (project file) — confirms installed versions of all dependencies
- `src/components/ui/button.tsx` (project file) — confirms Base UI import pattern
- `src/app/globals.css` (project file) — confirms OKLCH color variables and font setup
- `src/app/(app)/itinerary/page.tsx` (project file) — confirms Hero pattern, existing Card usage
- [shadcn/ui base-nova sheet registry](https://ui.shadcn.com/r/styles/base-nova/sheet.json) — Sheet component available, side prop confirmed
- [shadcn/ui base-nova drawer registry](https://ui.shadcn.com/r/styles/base-nova/drawer.json) — Drawer component available, direction prop confirmed
- [shadcn/ui badge component docs](https://ui.shadcn.com/docs/components/base/badge) — variants confirmed
- [Supabase RLS official docs](https://supabase.com/docs/guides/database/postgres/row-level-security) — `to authenticated using (true)` policy syntax
- [Supabase Postgres enums docs](https://supabase.com/docs/guides/database/postgres/enums) — `create type ... as enum` syntax
- [date-fns format docs](https://date-fns.org/docs/format) — EEEE, MMMM, d tokens confirmed

### Secondary (MEDIUM confidence)
- [shadcn/ui changelog](https://ui.shadcn.com/docs/changelog) — Base UI v1.0 Dec 2025, shadcn base styles Jan 2026
- WebSearch result: Base UI shipped v1.0 December 2025, shadcn Base UI docs January 2026, all blocks February 2026 — multiple sources agree

### Tertiary (LOW confidence)
- None — all key claims verified against primary sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in `package.json` and npm
- Architecture (Server/Client split): HIGH — established Next.js App Router pattern, confirmed by existing codebase
- Base UI / base-nova component system: HIGH — confirmed in `components.json` and `button.tsx` source
- Database schema: HIGH — standard Postgres/Supabase patterns from official docs
- Pitfalls: HIGH — timezone pitfall confirmed via local `node` test; others from direct code inspection
- Seed data content: HIGH — directly from `PROJECT.md` which is authoritative for trip details

**Research date:** 2026-04-03
**Valid until:** 2026-05-01 (stable libraries; shadcn registry could change but low risk)
