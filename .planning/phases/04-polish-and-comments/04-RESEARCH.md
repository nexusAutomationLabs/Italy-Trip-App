# Phase 4: Polish and Comments - Research

**Researched:** 2026-04-04
**Domain:** UI redesign, Google Maps integration, Supabase Storage, shadcn sidebar, horizontal card layout
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Timezone Display**
- D-01: All times stored and displayed as Italy time (Europe/Rome, CEST). No UTC conversion — everyone is in Italy together.
- D-02: 12-hour time format (e.g. "2:30 PM"). Familiar to the Nova Scotia group.
- D-03: Single subtle "All times in Italy time (CEST)" label at the top of the itinerary. No per-event timezone indicators.

**Itinerary Layout Redesign**
- D-04: Horizontal scrolling event cards per day — cards arranged left-to-right in a scrollable row. Replaces the current vertical stacked row layout.
- D-05: Day headers use "DAY ONE / Thursday, May 7" format — adds day numbering above the date.
- D-06: Each event card shows: category badge, time, bold italic title (Playfair Display), description snippet, attendee avatar circles, and a category icon (bottom-right).
- D-07: Category icons on cards using Lucide icons (utensils for dining, camera for excursion, etc.).
- D-08: Optional event cover photo on cards. Cards without photos show text-only layout.
- D-09: No "Export Day" links.

**Login Page Redesign**
- D-10: Split layout — left half is full-bleed Tuscany vineyard photo with "Berwick goes to Tuscany 2026" in white script. Right half is login form on cream background.
- D-11: Keep "Berwick, NS does Tuscany 2026" or similar group-specific title, not "Tuscan Curator" branding.
- D-12: No Google/Apple social login buttons — keep email + password only.
- D-13: Mobile: photo stacks on top as shorter banner, form below.

**Sidebar Navigation**
- D-14: Fixed left sidebar on desktop — always visible. Shows trip name + dates, "Itinerary" link, and "Map" link.
- D-15: Mobile: bottom tab bar with Itinerary and Map tabs.

**Map View**
- D-16: New Map page/view — embedded Google Map showing pins for all event locations.

**Event Detail Redesign**
- D-17: Google Maps embed with address displayed below event description.
- D-18: Address field in event form uses Google Places autocomplete. Requires Google Maps API key.
- D-19: Attendee list with photo avatars on right side. Falls back to initial circles.
- D-20: Large hero image at top of event detail (uses event cover photo if uploaded).

**User Avatar Uploads**
- D-21: Users upload profile photo from header user menu → "Edit Profile" modal.
- D-22: Avatars appear on event cards, attendee lists, and comments.
- D-23: Photos stored in Supabase Storage. Falls back to colored initial circles.

**Empty States**
- D-24: Days with no events show prompt: "Nothing planned yet — add something!" with Add Event button.

### Claude's Discretion
- Scroll arrow styling and horizontal scroll interaction details on desktop
- Exact category icon assignments (which Lucide icon per category)
- Map zoom level and default center point
- Sidebar width and styling details
- Photo upload size limits and compression
- Google Maps embed styling and size
- Event detail panel layout proportions (description vs attendee list)
- Loading states and transitions for the new layout
- Mobile bottom tab bar icon choices

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Phase 4 is a major UI overhaul and feature expansion built on top of a complete Phase 1-3 foundation. The codebase already has shadcn/ui, Tailwind v4, Supabase Auth + Postgres, and all v1 features working. This phase adds: a horizontal card-per-day itinerary layout, a split-screen login page, a fixed sidebar/mobile tab bar layout shell, a Google Maps view, Places Autocomplete in the event form, user avatar uploads and event cover photo uploads via Supabase Storage, and timezone-display labeling.

The biggest technical risks are: (1) Google Places Autocomplete — Google deprecated the legacy `Autocomplete` widget as of March 1, 2025; all new implementations must use the new `PlaceAutocompleteElement` (alpha/beta channel only) or an intermediate library, and this requires a `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` env var to be obtained and configured; (2) file uploads — Next.js server actions have a 1 MB body limit by default, so photo uploads must go through the Supabase Storage client directly from the browser (client-side upload pattern), not through a server action; (3) the shadcn `sidebar` component uses a `SidebarProvider` that must wrap the `(app)` layout, which means the current `layout.tsx` (which already does `force-dynamic` and auth checks) needs restructuring.

**Primary recommendation:** Treat Google Maps API key procurement as a hard prerequisite (planner must include a Wave 0 task). Client-side Supabase Storage upload is the correct pattern — avoid routing file data through server actions.

---

## Project Constraints (from CLAUDE.md)

| Directive | Type |
|-----------|------|
| Next.js App Router exclusively — no Pages Router | Required |
| `@supabase/ssr` for all auth — no `@supabase/auth-helpers-nextjs` | Required |
| `getUser()` (not `getSession()`) for server-side auth checks | Required |
| Tailwind CSS v4 — CSS-first config, no tailwind.config.js | Required |
| shadcn/ui for all UI components — copy-paste, not runtime dep | Required |
| `date-fns` v4 for all date/time formatting | Required |
| No real-time Supabase subscriptions | Forbidden |
| No Next.js v16 — use v15.x | Required |
| No Prisma/Drizzle — use Supabase generated types | Required |
| No `localStorage` for auth tokens | Forbidden |
| zod@3 pinned (peer dep conflict with @hookform/resolvers) | Required |
| Supabase client via `createClient` from `@/lib/supabase/server` (server) and client equivalents | Required |

---

## Standard Stack

### Core (no additions needed — already installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Next.js | 15.5.14 | App Router framework | Already installed |
| React | 19.1.0 | UI runtime | Already installed |
| TypeScript | ^5 | Type safety | Already installed |
| `@supabase/supabase-js` | ^2.101.1 | DB + Storage client | Already installed |
| `@supabase/ssr` | ^0.10.0 | Cookie-based auth | Already installed |
| Tailwind CSS | ^4 | Utility CSS | Already installed |
| shadcn/ui | base-nova | UI components | Already installed |
| lucide-react | ^1.7.0 | Icons | Already installed |
| date-fns | ^4.1.0 | Date formatting | Already installed |
| zod | ^3.25.76 | Validation | Already installed |
| react-hook-form | ^7.72.1 | Form state | Already installed |

### New Dependencies Required
| Library | Version | Purpose | Why Needed |
|---------|---------|---------|------------|
| `@next/third-parties` | latest | `GoogleMapsEmbed` component | Lazy-loads Google Maps iframe with optimal performance; official Next.js package |
| `@vis.gl/react-google-maps` | latest | Google Maps interactive map + Places Autocomplete | Best-maintained Google Maps React library; used in official Google developer examples |

### shadcn Components to Add (not yet installed)
| Component | Install Command | Purpose |
|-----------|----------------|---------|
| sidebar | `npx shadcn add sidebar` | Fixed left sidebar shell (desktop) |
| tabs | `npx shadcn add tabs` | Bottom tab bar on mobile |
| scroll-area | `npx shadcn add scroll-area` | Horizontal scrolling event card row |
| tooltip | `npx shadcn add tooltip` | Scroll arrow hints on desktop |

**Installation:**
```bash
npm install @next/third-parties @vis.gl/react-google-maps
npx shadcn add sidebar tabs scroll-area tooltip
```

**Version verification (run before planning):**
```bash
npm view @next/third-parties version
npm view @vis.gl/react-google-maps version
```

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@vis.gl/react-google-maps` | `react-google-autocomplete` | `react-google-autocomplete` is simpler but uses the deprecated legacy `Autocomplete` widget. As of March 1, 2025, Google's legacy autocomplete is not available to new customers — must use new API. |
| Client-side Supabase Storage upload | Server Action + FormData | Server actions hit the 1 MB default body limit. Client-side upload bypasses this entirely. Standard pattern for Supabase + Next.js. |
| `@next/third-parties` GoogleMapsEmbed | Plain `<iframe>` | GoogleMapsEmbed is lazy-loaded by default and handles the API key correctly. Plain iframe works too but less optimized. |

---

## Architecture Patterns

### Current Structure (Phase 1-3)
```
src/
├── app/
│   ├── (auth)/login/       # Login page — being redesigned
│   ├── (app)/
│   │   ├── layout.tsx      # App layout with Header — needs sidebar added
│   │   └── itinerary/
│   │       ├── page.tsx    # Server Component, data fetching
│   │       └── _components/
│   │           ├── ItineraryClient.tsx  # Client orchestrator
│   │           ├── DayCard.tsx          # Being redesigned
│   │           ├── EventRow.tsx         # Being replaced with EventCard
│   │           ├── EventDetailPanel.tsx # Being enhanced
│   │           ├── EventFormPanel.tsx   # Being enhanced
│   │           └── AttendeeList.tsx     # Being enhanced
│   └── globals.css         # Tuscan OKLCH palette, sidebar CSS vars already present
├── components/
│   ├── layout/Header.tsx   # Being replaced by sidebar pattern
│   └── ui/                 # shadcn components
├── lib/
│   ├── actions/            # Server Actions with Zod
│   ├── constants/          # categories.ts
│   └── supabase/           # server + client utilities
├── types/
│   └── database.types.ts   # Needs new columns for avatars, cover photos, address
└── middleware.ts            # Route protection (add /map)
```

### Target Structure (Phase 4 additions)
```
src/
├── app/
│   ├── (auth)/login/       # Split-screen redesign
│   ├── (app)/
│   │   ├── layout.tsx      # SidebarProvider + AppSidebar + main content
│   │   ├── itinerary/      # Existing, component redesign only
│   │   └── map/
│   │       └── page.tsx    # New map view
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx  # New — fixed sidebar + mobile tab bar
│   │   └── Header.tsx      # Retired or repurposed as mobile header
│   └── ui/                 # New: sidebar.tsx, tabs.tsx, scroll-area.tsx, tooltip.tsx
└── lib/
    ├── actions/
    │   └── profile-actions.ts  # New — update display_name + avatar_url
    └── supabase/
        └── storage.ts          # New — Storage client helpers
```

### Pattern 1: shadcn Sidebar in App Layout

The sidebar component requires `SidebarProvider` to wrap the layout. The current `(app)/layout.tsx` does auth checks and renders `<Header>`. This must be restructured.

```typescript
// src/app/(app)/layout.tsx
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'

export default async function AppLayout({ children }) {
  // auth check ...
  return (
    <SidebarProvider>
      <AppSidebar user={user} isAdmin={isAdmin} />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </SidebarProvider>
  )
}
```

The sidebar CSS variables (`--sidebar`, `--sidebar-primary`, etc.) are ALREADY defined in `globals.css` from Phase 1. No color setup needed.

### Pattern 2: Horizontal Card Row with Scroll Snap

```tsx
// HorizontalDayRow — client component
// Container: overflow-x-auto, flex, snap-x mandatory
// Cards: snap-start, min-w-[260px] max-w-[320px], flex-shrink-0

<div
  ref={containerRef}
  className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 px-1"
  style={{ scrollPaddingLeft: '16px' }}
>
  {events.map(event => (
    <EventCard
      key={event.id}
      event={event}
      className="snap-start flex-shrink-0 w-[280px]"
    />
  ))}
</div>
```

Scroll arrow detection uses a `ResizeObserver` or `scroll` event listener to check `scrollWidth > clientWidth`. Show arrows only when overflow exists.

### Pattern 3: Supabase Storage Client-Side Upload

**Critical:** Do NOT pass file bytes through a server action — the 1 MB default body limit will block 5 MB images. Use the browser Supabase client to upload directly, then save the URL to the database via a server action.

```typescript
// In ProfileModal (client component):
import { createClient } from '@/lib/supabase/client'

async function uploadAvatar(file: File, userId: string): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

// Then call a server action to write avatar_url to profiles table:
await updateProfile({ avatar_url: publicUrl })
```

Same pattern for event cover photos — upload from browser, then pass the resulting URL to `createEvent` / `updateEvent` server actions.

### Pattern 4: Google Places Autocomplete (New API)

The legacy `google.maps.places.Autocomplete` is deprecated as of March 1, 2025 and unavailable to new customers. Use `PlaceAutocompleteElement` (requires `libraries: ['places']` with beta channel, or use `@vis.gl/react-google-maps` wrapper).

```tsx
// AddressAutocomplete — using @vis.gl/react-google-maps
import { APIProvider } from '@vis.gl/react-google-maps'
import { PlaceAutocompleteClassic } from '@vis.gl/react-google-maps' // or manual PlaceAutocompleteElement

// In EventFormPanel or parent:
<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
  <AddressAutocomplete
    onPlaceSelect={(place) => {
      setValue('address', place.formattedAddress)
      setValue('latitude', place.location?.lat())
      setValue('longitude', place.location?.lng())
    }}
  />
</APIProvider>
```

**Important:** The `APIProvider` should be placed at a high level (app layout or page) to avoid re-initializing the Maps API on every render.

### Pattern 5: Google Maps Embed for Event Detail

Two valid approaches. For static display (event detail panel), `@next/third-parties` `GoogleMapsEmbed` is the recommended Next.js-native approach:

```tsx
import { GoogleMapsEmbed } from '@next/third-parties/google'

<GoogleMapsEmbed
  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
  height={240}
  width="100%"
  mode="place"
  q={encodeURIComponent(event.address ?? event.location_name ?? '')}
/>
```

For the dedicated Map view page (D-16) showing all event pins, use `@vis.gl/react-google-maps` with `Map` + `AdvancedMarker` components (requires JavaScript Maps API, not Embed API).

### Pattern 6: Database Schema Changes

The following columns must be added via Supabase migration:

```sql
-- profiles: add avatar_url
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;

-- events: add cover_image_url, address, latitude, longitude
ALTER TABLE events ADD COLUMN cover_image_url TEXT;
ALTER TABLE events ADD COLUMN address TEXT;
ALTER TABLE events ADD COLUMN latitude DOUBLE PRECISION;
ALTER TABLE events ADD COLUMN longitude DOUBLE PRECISION;
```

After migration, regenerate types:
```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

### Anti-Patterns to Avoid
- **Passing file bytes through server actions:** Body limit is 1 MB by default. Upload directly from browser to Supabase Storage.
- **Using legacy `google.maps.places.Autocomplete`:** Deprecated for new Google Cloud customers since March 2025. Use `PlaceAutocompleteElement` (new API) via `@vis.gl/react-google-maps`.
- **Putting `SidebarProvider` in root layout:** It belongs in `(app)/layout.tsx` only — the login page should not inherit sidebar state.
- **Wrapping `APIProvider` inside the event form:** Initializes the Maps JS API on every form open/close. Place at the itinerary page or app layout level.
- **Using `getSession()` for any new auth checks:** Continue using `getUser()` per existing project pattern (CLAUDE.md).
- **Adding the `scroll-area` shadcn component as the horizontal scroll container:** ScrollArea uses Radix UI internals that may interfere with scroll-snap. Use a native `<div>` with `overflow-x-auto` and CSS scroll-snap instead — scroll-area is better suited for vertical constrained areas.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Map embed in event detail | Custom iframe construction | `GoogleMapsEmbed` from `@next/third-parties` | Handles lazy loading, API key injection, proper iframe sandbox attributes |
| Map with pins for all events | Custom iframe | `@vis.gl/react-google-maps` Map + AdvancedMarker | Interactive map with proper marker management, clustering, click events |
| Places search with suggestions | Custom debounced fetch | `@vis.gl/react-google-maps` PlaceAutocomplete | Handles debounce, caching, keyboard navigation, ARIA. API compliance with March 2025 deprecation |
| Sidebar shell with mobile sheet | Custom drawer/nav | shadcn `sidebar` component | Keyboard shortcuts, cookie-persisted state, responsive sheet on mobile, built-in ARIA |
| Avatar overlap strip with +N | Custom CSS stacking | Custom `AvatarStrip` using shadcn `Avatar` | Avatar fallback + image already handled by shadcn Avatar component |
| File type/size validation | Custom validation logic | Client-side `File.size` + `File.type` checks + Zod | Simple, synchronous, no library needed — but must happen before upload, not in server action |

**Key insight:** Google Maps and Supabase Storage are the two hardest parts. For Maps, the library handles API loading, SSR safety, and the Places API deprecation migration. For Storage, the pattern is "upload from browser, save URL on server" — never route file bytes through Next.js server actions.

---

## Common Pitfalls

### Pitfall 1: Google Maps API Key Not Available at Build Time
**What goes wrong:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is undefined — the map fails silently or throws on page load.
**Why it happens:** The env var hasn't been added to Vercel or the local `.env.local`. The `NEXT_PUBLIC_` prefix is required for client-side access.
**How to avoid:** Wave 0 task must include creating the Google Cloud project, enabling "Maps JavaScript API" and "Places API (New)", and adding the key to `.env.local` and Vercel environment variables.
**Warning signs:** `APIProvider` logs a warning about missing/invalid API key.

### Pitfall 2: Server Action Body Limit Blocks Photo Uploads
**What goes wrong:** User uploads a 2 MB event cover photo. The form submission silently fails with a 413 or body size error.
**Why it happens:** Next.js server actions default to 1 MB body limit. The file is included in the FormData serialization.
**How to avoid:** Never pass `File` objects through server actions. Upload to Supabase Storage from the browser first, then pass the resulting URL string to the server action.
**Warning signs:** Upload works locally (small test files) but fails in production with real photos.

### Pitfall 3: SidebarProvider Breaks Login Page Layout
**What goes wrong:** Login page renders with a sidebar-shaped void or cookie state from sidebar affecting the auth layout.
**Why it happens:** If `SidebarProvider` is added to root layout instead of `(app)/layout.tsx`, it applies to all routes including login.
**How to avoid:** Add `SidebarProvider` only inside `(app)/layout.tsx`. The `(auth)` route group layout remains independent.

### Pitfall 4: scroll-snap Conflict with ScrollArea Component
**What goes wrong:** Horizontal scroll works but scroll-snap doesn't trigger correctly — cards don't snap.
**Why it happens:** shadcn `scroll-area` wraps content in a Radix-managed viewport, which can interrupt native scroll-snap behavior.
**How to avoid:** Use a plain `<div className="overflow-x-auto">` with `scroll-snap-type: x mandatory` on the container. Reserve `scroll-area` for vertical constrained lists (like the event detail panel body).

### Pitfall 5: day-fns Format Applied to Italy Times
**What goes wrong:** Times like "14:30" display as the wrong hour because `format()` is called on a JavaScript `Date` object with local timezone applied.
**Why it happens:** The existing `formatTime()` helpers (in EventRow, EventDetailPanel) parse the `HH:MM:SS` time string directly — they do NOT construct a `Date` object. This is the correct pattern and must be preserved in new components.
**How to avoid:** Do not refactor time display to use `new Date()`. Keep parsing the `HH:MM:SS` string directly as the existing code does. The D-01/D-02 decision (Italy time, 12-hour) is already correctly implemented in the string-parsing approach.

### Pitfall 6: `@vis.gl/react-google-maps` APIProvider Initialization
**What goes wrong:** Google Maps JS API is loaded multiple times, or "You have included the Google Maps JavaScript API multiple times" console error appears.
**Why it happens:** `APIProvider` is placed inside a component that re-mounts frequently (like inside a Sheet or Drawer).
**How to avoid:** Place `APIProvider` at the itinerary page level or the `(app)` layout level. The map components inside can be conditionally rendered; only the APIProvider needs to be persistent.

### Pitfall 7: TypeScript Errors After Database Type Regeneration
**What goes wrong:** After adding `avatar_url`, `cover_image_url`, `address`, `latitude`, `longitude` columns, the generated types differ from the hand-written `database.types.ts` — existing code breaks.
**Why it happens:** The hand-written types are a placeholder (`// Placeholder database types for the Tuscany Trip App`). Regenerating from Supabase CLI overwrites the entire file in a different schema format.
**How to avoid:** The Wave 0 task that updates the DB schema must also update `database.types.ts` (either by regenerating with the CLI or manually adding the new columns). The `EventRow` and `CommentRow` convenience types at the bottom of the file must be preserved or re-added after generation.

### Pitfall 8: Supabase Storage RLS Blocks Uploads
**What goes wrong:** Profile photo upload returns a "permission denied" error from Supabase Storage.
**Why it happens:** By default all storage buckets are private and require explicit RLS policies. Even public buckets need INSERT policies for uploads.
**How to avoid:** Create two buckets with proper RLS policies (see Code Examples). The buckets must be created before the code that uploads to them runs.

---

## Code Examples

Verified patterns from official sources and the existing codebase:

### Horizontal Scroll Row with Scroll Snap (Tailwind v4)
```tsx
// Source: MDN scroll-snap spec + Tailwind v4 docs
// Use native overflow div — NOT ScrollArea for this case
<div
  ref={containerRef}
  className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
  style={{
    scrollSnapType: 'x mandatory',
    scrollPaddingLeft: '16px',
  }}
>
  {events.map((event) => (
    <div
      key={event.id}
      style={{ scrollSnapAlign: 'start' }}
      className="flex-shrink-0 w-[280px]"
    >
      <EventCard event={event} onClick={onEventClick} />
    </div>
  ))}
</div>
```

### Scroll Arrow Detection
```tsx
// Source: established pattern — useRef + scroll event
const [canScrollLeft, setCanScrollLeft] = useState(false)
const [canScrollRight, setCanScrollRight] = useState(false)

function checkScroll() {
  if (!ref.current) return
  setCanScrollLeft(ref.current.scrollLeft > 0)
  setCanScrollRight(
    ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth - 1
  )
}

useEffect(() => {
  checkScroll()
  ref.current?.addEventListener('scroll', checkScroll)
  window.addEventListener('resize', checkScroll)
  return () => {
    ref.current?.removeEventListener('scroll', checkScroll)
    window.removeEventListener('resize', checkScroll)
  }
}, [events])
```

### Supabase Storage Upload (Browser Client)
```typescript
// Source: Supabase JS docs - storage upload pattern
// Must use browser client, NOT server client
import { createClient } from '@/lib/supabase/client'

export async function uploadAvatarFromBrowser(
  file: File,
  userId: string
): Promise<string> {
  const supabase = createClient()
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
```

### Supabase Storage RLS Policies (SQL migrations)
```sql
-- Source: Supabase Storage docs - access control
-- Bucket: avatars (public bucket)
CREATE POLICY "Authenticated users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Bucket: event-covers (public bucket)
CREATE POLICY "Authenticated users can upload event covers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'event-covers');

CREATE POLICY "Event covers are publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'event-covers');
```

### Google Maps Embed in Event Detail
```tsx
// Source: Next.js docs - @next/third-parties
import { GoogleMapsEmbed } from '@next/third-parties/google'

// Inside EventDetailPanel, when address is present:
{event.address && (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{event.address}</p>
    <GoogleMapsEmbed
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      height={240}
      width="100%"
      mode="place"
      q={encodeURIComponent(event.address)}
    />
  </div>
)}
```

### Google Places Autocomplete (New API via @vis.gl/react-google-maps)
```tsx
// Source: @vis.gl/react-google-maps docs + Google Maps JS API (new)
// APIProvider placed at page level; AddressAutocomplete placed in form
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'

function AddressAutocomplete({ onSelect }: { onSelect: (address: string, lat: number, lng: number) => void }) {
  const places = useMapsLibrary('places')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!places || !inputRef.current) return
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry'],
    })
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      onSelect(
        place.formatted_address ?? '',
        place.geometry?.location?.lat() ?? 0,
        place.geometry?.location?.lng() ?? 0
      )
    })
  }, [places])

  return <Input ref={inputRef} placeholder="Search for a place or address" />
}
```

Note: For new Google Cloud accounts created after March 2025, `google.maps.places.Autocomplete` may not be available. In that case, use `PlaceAutocompleteElement` instead (requires `libraries: ['places']` loaded via beta channel). The `@vis.gl/react-google-maps` library provides a `PlaceAutocompleteClassic` wrapper that abstracts the difference. Confirm availability with a brief test after API key creation.

### Day Header Format ("DAY ONE / Thursday, May 7")
```typescript
// Source: established codebase pattern + date-fns v4
import { format } from 'date-fns'

const DAY_ORDINALS = [
  'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE',
  'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
]

function getDayNumber(date: string): string {
  const tripStart = new Date('2026-05-07T12:00:00')
  const current = new Date(`${date}T12:00:00`)
  const diff = Math.round((current.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24))
  return DAY_ORDINALS[diff] ?? `${diff + 1}`
}

// Usage:
// "DAY ONE" — 12px, weight 700, letter-spacing 0.1em, accent color
// "Thursday, May 7" — 18px, weight 700 (from format(new Date(`${date}T12:00:00`), 'EEEE, MMMM d'))
```

### shadcn Sidebar Integration in App Layout
```tsx
// Source: shadcn/ui sidebar docs
// src/app/(app)/layout.tsx
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'

export default async function AppLayout({ children }) {
  // ... auth check
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 min-w-0 overflow-hidden">
        {children}
      </main>
    </SidebarProvider>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `google.maps.places.Autocomplete` | `PlaceAutocompleteElement` (new) | March 1, 2025 | Legacy widget unavailable to new GCP customers. Use new API or `@vis.gl/react-google-maps` wrapper. |
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2024 | Already migrated in Phase 1. No action. |
| Tailwind v3 `tailwind.config.js` | Tailwind v4 CSS-first config | January 2025 | Already using v4. No action. |
| shadcn style "default"/"new-york" | shadcn style "base-nova" | 2025 | Already using base-nova (per components.json). No action. |

**Deprecated/outdated:**
- `google.maps.places.Autocomplete`: Unavailable to new Google Cloud customers since March 1, 2025. Existing users retain access but should migrate.

---

## Open Questions

1. **Google Maps API Key**
   - What we know: Requires a Google Cloud account, enabling "Maps JavaScript API" + "Places API (New)", creating an API key with HTTP referrer restrictions.
   - What's unclear: Whether the project already has a Google Cloud project or if one needs to be created from scratch. Key must be in `.env.local` and Vercel env vars before any map/autocomplete code runs.
   - Recommendation: Planner should include a Wave 0 task: "Create Google Cloud project, enable required APIs, obtain key, add to .env.local and Vercel." This is a human task, not code.

2. **Places Autocomplete API Channel**
   - What we know: `google.maps.places.Autocomplete` (legacy) may not be available for new GCP customers after March 2025. `PlaceAutocompleteElement` requires alpha/beta loading channel.
   - What's unclear: Exact account creation date and whether the legacy widget is available. The `@vis.gl/react-google-maps` library provides an abstraction that handles both.
   - Recommendation: Use `@vis.gl/react-google-maps` which abstracts the new vs legacy API difference. Test autocomplete during Wave 0 after API key is obtained.

3. **Supabase Storage Bucket Creation**
   - What we know: Two buckets needed: `avatars` and `event-covers`, both public. RLS policies needed.
   - What's unclear: Whether to create via Supabase Dashboard (manual, one-time) or via SQL migration file.
   - Recommendation: Create via a SQL migration file that includes `INSERT INTO storage.buckets` + RLS policies. This is repeatable and documented.

4. **Map View — Coordinates for Pre-Seeded Events**
   - What we know: The Map view (D-16) shows pins for all event locations. Events need `latitude` and `longitude` columns.
   - What's unclear: Pre-seeded events from Phase 2 don't have coordinates yet. The Map view only shows events with coordinates.
   - Recommendation: Address geocoding of pre-seeded events is optional post-launch work. Map view should gracefully handle events with null coordinates (exclude from pins). Add a note in the empty map state copy.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build toolchain | Yes | v25.8.1 | — |
| npm / npx | Package install | Yes | via Node 25 | — |
| Supabase CLI | DB migration, type gen | Not checked | — | Run migrations via Supabase Dashboard SQL editor |
| Google Maps API Key | D-16, D-17, D-18 | Not available (needs procurement) | — | No fallback — required for map features |
| Vercel CLI | Env var sync | Not checked | — | Set env vars via Vercel Dashboard |

**Missing dependencies with no fallback:**
- Google Maps API Key: Must be obtained before implementing D-16, D-17, D-18. This is a human task. Planner must include a Wave 0 task for API key procurement.

**Missing dependencies with fallback:**
- Supabase CLI: If not installed locally, all migrations can be run via Supabase Dashboard SQL editor as a one-time manual step.
- Vercel CLI: Env vars can be set via Vercel Dashboard instead.

---

## Sources

### Primary (HIGH confidence)
- Existing codebase: `package.json`, `src/`, `globals.css` — confirmed installed versions and established patterns
- `04-CONTEXT.md` — locked decisions from user discussion
- `04-UI-SPEC.md` — visual contract, component inventory, interaction specs
- `CLAUDE.md` — project constraints and mandated stack

### Secondary (MEDIUM confidence)
- [Google Maps Place Autocomplete (New)](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new) — confirmed PlaceAutocompleteElement is the new standard
- [shadcn/ui Sidebar docs](https://ui.shadcn.com/docs/components/sidebar) — confirmed SidebarProvider layout pattern
- [Next.js @next/third-parties](https://nextjs.org/docs/app/guides/third-party-libraries) — confirmed GoogleMapsEmbed component
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control) — confirmed RLS policy patterns
- [Supabase getPublicUrl reference](https://supabase.com/docs/reference/javascript/storage-from-getpublicurl) — confirmed public URL retrieval

### Tertiary (LOW confidence — needs validation)
- GitHub issue: `google.maps.places.Autocomplete` unavailable to new customers after March 2025 — sourced from `visgl/react-google-maps` issues, not official Google deprecation notice. **Validate by testing after API key creation.**
- Next.js server action 1 MB body limit behavior in production — multiple community reports but some production environment inconsistencies reported. The client-side upload pattern is the safer choice regardless.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — existing packages confirmed from `package.json`; new packages from official npm/docs
- Architecture patterns: HIGH — based on existing codebase structure + official component docs
- Google Maps integration: MEDIUM — Places API deprecation timeline sourced from community issue + official docs; exact behavior for new accounts needs test validation
- Supabase Storage: HIGH — official docs pattern, straightforward SDK usage
- Pitfalls: HIGH — body size limit and scroll-snap conflicts are well-documented; deprecation issue MEDIUM

**Research date:** 2026-04-04
**Valid until:** 2026-05-01 (stable libraries; Google Maps API changes are the most volatile element)
