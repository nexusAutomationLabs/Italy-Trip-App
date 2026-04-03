# Phase 3: RSVP and Event Mutations - Research

**Researched:** 2026-04-03
**Domain:** Next.js 15 Server Actions, Supabase RLS write policies, optimistic UI, shadcn/ui forms
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** "I'm in" button — single prominent button at top of event detail panel. Toggles between "I'm in" (outlined) and "Attending ✓" (filled terracotta). One tap to join/leave.
- **D-02:** RSVP button lives in the event detail panel only — not on itinerary day cards. Day cards already show attendee count; keeps the itinerary clean.
- **D-03:** Optimistic updates — button toggles immediately on tap, reverts if server fails.
- **D-04:** Modal/dialog over itinerary — same Sheet/Drawer pattern as event detail panel (Sheet on desktop, full-screen Drawer on mobile). User stays in itinerary context.
- **D-05:** "+ Add Event" button at the bottom of each day card. Pre-fills the date for that day.
- **D-06:** Required fields: title and date only. Optional: time, description, location name, location URL, category. Category defaults to 'open_day' if not selected.
- **D-07:** Attendee list with colored initial circles — vertical list of names with avatar initials (no photo uploads). "4 attending" header with names listed below.
- **D-08:** Comments as flat chronological list (newest last) below attendees in the event detail panel. Name + timestamp + message. Text input at the bottom. No threading, no reactions.
- **D-09:** Users can delete their own comments (small trash icon). Admin can delete any comment. No edit.
- **D-10:** Three-dot "..." menu in the top-right of the event detail panel. Shows "Edit" and "Delete" options. Only visible to the event creator and admin.
- **D-11:** Delete requires confirmation dialog — "Delete this event?" with Cancel / Delete (red/destructive) buttons.
- **D-12:** Edit reuses the same modal as create, pre-filled with existing data. Title changes to "Edit Event".

### Carried Forward (Phase 1 / Phase 2)
- Admin designated by hardcoded email env var (NEXT_PUBLIC_ADMIN_EMAIL) — admin can edit/delete any event and any comment
- Event detail panel is right-side Sheet on desktop, bottom Drawer on mobile
- Server actions + Zod validation pattern established in Phase 1
- `rsvps` table exists with read-only RLS — write policies needed in this phase

### Claude's Discretion
- Exact animation/transition for RSVP button state change
- Comment input styling and empty state messaging
- "+" button styling within day cards (size, color, hover state)
- Modal form layout and field ordering
- Confirmation dialog copy and styling
- Database schema for comments table (columns, RLS policies)
- How to structure server actions (one file vs. split by domain)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RSVP-01 | User can toggle their attendance on any event (attending / not attending) | useOptimistic + useTransition + server action; Supabase INSERT/DELETE on rsvps table with RLS write policies |
| RSVP-02 | Event detail shows the list of attendees by name | Extend EventRow type with attendee name array; Supabase join rsvps → profiles; pass user+rsvp data into EventDetailPanel |
| RSVP-03 | Users can leave comments on events (e.g. "I'll drive", "need vegetarian option") | New `comments` table with RLS; server action for create/delete; flat list render in EventDetailPanel |
| EVNT-02 | User can create a new event with title, description, date, time, location, and link | shadcn Sheet/Drawer form; react-hook-form + Zod; Server Action for INSERT; revalidatePath('/itinerary') |
| EVNT-03 | User can edit their own events | Reuse create form pre-filled; Server Action for UPDATE; auth check (owner OR admin) in action |
| EVNT-04 | User can delete their own events | DropdownMenu "..." with AlertDialog confirmation; Server Action for DELETE; auth check (owner OR admin) |
</phase_requirements>

---

## Summary

Phase 3 is the full interactive write path. It introduces four categories of mutations: RSVP toggle, event create/edit/delete, and comments. All mutations follow the established pattern from Phase 1 — Server Actions with `'use server'`, Zod validation, `revalidatePath('/itinerary')` for cache invalidation, and Supabase as the data layer.

The most nuanced problem is the optimistic RSVP toggle (D-03). The `useOptimistic` hook combined with `useTransition` is the correct React 19 approach: `setOptimistic` fires immediately, the server action runs in the background, and React reverts automatically on failure. There is a known flash-of-stale-content issue when `revalidatePath` is called (GitHub #49619, closed as NOT_PLANNED), but for this app the workaround is to not call `revalidatePath` from the RSVP action and instead rely on local optimistic state — since attendee count on day cards does not need millisecond freshness for 8 users.

The event create/edit form uses the same Sheet/Drawer infrastructure as the event detail panel. Controlled `open` state (`useState(false)`) is passed to `<Sheet open={open}>` so the form can programmatically close after a successful server action. The admin permission check lives in the server action (compare `user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL`), NOT in RLS, which keeps RLS simple and avoids JWT metadata complexity.

**Primary recommendation:** Use `useOptimistic` + `useTransition` for the RSVP toggle; use react-hook-form + Zod + Server Action for all form-based mutations; do admin checks in server actions, not in RLS.

---

## Standard Stack

### Core (all already installed)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| Next.js | 15.x | Server Actions, revalidatePath | Already in project |
| React | 19.x | useOptimistic, useTransition | Already in project |
| @supabase/supabase-js | 2.101.x | Database read/write | Already in project |
| @supabase/ssr | latest | Cookie-based auth in server actions | Already in project |
| react-hook-form | 7.x | Form state for create/edit event | Already in project |
| zod | 3.x | Schema validation (pinned to 3.x) | Already in project |
| @hookform/resolvers | latest | Zod bridge for react-hook-form | Already in project |
| date-fns | 4.x | Date formatting | Already in project |

### shadcn/ui Components Needed (not yet installed)
| Component | Purpose | Install Command |
|-----------|---------|----------------|
| dialog | AlertDialog for delete confirmation | `npx shadcn@latest add dialog` |
| alert-dialog | Destructive delete confirmation | `npx shadcn@latest add alert-dialog` |
| dropdown-menu | Three-dot "..." menu | `npx shadcn@latest add dropdown-menu` |
| textarea | Comment input field | `npx shadcn@latest add textarea` |
| select | Category selector in event form | `npx shadcn@latest add select` |
| separator | Visual divider between sections | `npx shadcn@latest add separator` |
| avatar | Colored initial circles for attendees | `npx shadcn@latest add avatar` |

**Currently installed:** badge, button, card, drawer, input, label, sheet

**Installation (new components only):**
```bash
npx shadcn@latest add dialog alert-dialog dropdown-menu textarea select separator avatar
```

> **Note:** The AlertDialog component is preferred over Dialog for destructive confirmations — it's built on Radix AlertDialog which does not close on outside click, preventing accidental dismissal.

---

## Architecture Patterns

### Data Flow for RSVP Toggle

The RSVP button is the most architecturally interesting piece. It must:
1. Show immediate feedback (optimistic)
2. Revert on server failure
3. Not require a full page refetch for a simple toggle

**Recommended pattern — local optimistic, no revalidatePath:**

```typescript
// In EventDetailPanel (client component)
// Source: https://react.dev/reference/react/useOptimistic

'use client'
import { useOptimistic, useTransition } from 'react'
import { toggleRsvp } from '@/lib/actions/rsvp-actions'

function RsvpButton({ eventId, initialIsAttending }: { eventId: string; initialIsAttending: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [isAttending, setOptimisticAttending] = useOptimistic(initialIsAttending)

  function handleClick() {
    startTransition(async () => {
      setOptimisticAttending(!isAttending)     // 1. Immediate visual flip
      await toggleRsvp(eventId, !isAttending)  // 2. Server mutation
      // React reverts automatically if the action throws
    })
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isAttending ? 'Attending ✓' : "I'm in"}
    </button>
  )
}
```

**Why no `revalidatePath` from the RSVP action:**
- `revalidatePath` causes a server-round-trip re-render that can flash the UI back to stale state before new data arrives (GitHub issue #49619, closed NOT_PLANNED)
- For 8 users, the attendee count on day cards refreshing only on next page visit is acceptable
- The EventDetailPanel attendee list does need to update — this is handled by passing the current user's RSVP state as a prop and updating it optimistically

**Alternative if full freshness is required:** Call `revalidatePath('/itinerary')` from the action and accept the flash. For 8 users on a stable connection this is barely noticeable.

### Data Flow for RSVP — Attendee Name List (RSVP-02)

The attendee name list requires a JOIN between rsvps and profiles. The current EventRow type only has `rsvps: { count: number }[]`. Phase 3 extends this.

**Supabase query change (in itinerary page.tsx):**
```typescript
// Before (Phase 2):
.select('*, rsvps(count)')

// After (Phase 3):
.select('*, rsvps(user_id, profiles(display_name))')
```

**Extended EventRow type:**
```typescript
export type EventRow = Database['public']['Tables']['events']['Row'] & {
  rsvps: { user_id: string; profiles: { display_name: string | null } | null }[]
}
```

The attendee count is then `event.rsvps.length` and the names are `event.rsvps.map(r => r.profiles?.display_name)`.

> **Implication:** EventRow type change propagates to ItineraryPage, ItineraryClient, DayCard, and EventRow components. The `count` aggregate query used in Phase 2 is dropped; length of the array serves as count instead.

### Data Flow for Create/Edit Event Form

**Pattern: Controlled Sheet/Drawer with react-hook-form + Server Action**

The form runs react-hook-form client-side for validation UX, then submits to a Server Action via `handleSubmit`. The Sheet/Drawer is controlled by `useState(false)` so it can close programmatically after success.

```typescript
// EventFormPanel.tsx (client component)
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { eventSchema, EventFormData } from '@/lib/actions/event-schemas'
import { createEvent, updateEvent } from '@/lib/actions/event-actions'

interface EventFormPanelProps {
  open: boolean
  onClose: () => void
  defaultDate?: string        // pre-filled from day card
  event?: EventRow            // if provided, edit mode
}

export function EventFormPanel({ open, onClose, defaultDate, event }: EventFormPanelProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? { ...event } : { event_date: defaultDate, category: 'open_day' },
  })

  function onSubmit(data: EventFormData) {
    startTransition(async () => {
      const result = event
        ? await updateEvent(event.id, data)
        : await createEvent(data)
      if (result.success) {
        form.reset()
        onClose()
      }
    })
  }

  // Sheet on desktop, Drawer on mobile (same as EventDetailPanel)
  ...
}
```

**Key design decisions:**
- Server action returns `{ success: boolean; error?: string }` — NOT a redirect — so the component can close the sheet on success
- `isPending` from `useTransition` disables the submit button during server round-trip
- Form resets on success before closing (clears dirty state)

### Server Actions File Structure

Context.md leaves this to Claude's discretion. Recommendation: split by domain to avoid one massive actions file.

```
src/lib/actions/
├── rsvp-actions.ts      # toggleRsvp
├── event-actions.ts     # createEvent, updateEvent, deleteEvent
├── comment-actions.ts   # createComment, deleteComment
├── event-schemas.ts     # Zod schemas (eventSchema, commentSchema)
```

This mirrors the existing pattern (`src/lib/auth/actions.ts` + `src/lib/auth/schemas.ts`).

### Server Action Return Pattern (form mutations)

Auth actions use `redirect()` to propagate errors, which works for full-page forms. For sheet/modal forms, we need a return value instead:

```typescript
// src/lib/actions/event-actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { eventSchema, EventFormData } from './event-schemas'

export async function createEvent(data: EventFormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const parsed = eventSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const { error } = await supabase.from('events').insert({
    ...parsed.data,
    created_by: user.id,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/itinerary')
  return { success: true }
}
```

### Admin Permission Check (Server Action, not RLS)

For edit/delete, the admin check happens in the server action, not RLS. This avoids complex JWT claims or email-join queries in Postgres policies.

```typescript
export async function deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Fetch event to check ownership
  const { data: event } = await supabase
    .from('events')
    .select('created_by')
    .eq('id', eventId)
    .single()

  if (!event) return { success: false, error: 'Event not found' }
  if (!isAdmin && event.created_by !== user.id) {
    return { success: false, error: 'Not authorized' }
  }

  const { error } = await supabase.from('events').delete().eq('id', eventId)
  if (error) return { success: false, error: error.message }

  revalidatePath('/itinerary')
  return { success: true }
}
```

**RLS consequence:** The `events` table DELETE policy only needs to allow the owner. The server action enforces admin bypass at the application layer. This means the RLS policy is:

```sql
-- Users can delete their own events (admin bypass is in the server action)
create policy "Users can delete own events" on public.events
  for delete to authenticated
  using ((select auth.uid()) = created_by);
```

But wait — if the server action runs as the admin user's Supabase session, and the RLS policy only allows `created_by = auth.uid()`, the admin's delete will be BLOCKED by RLS even though the server action passed the auth check.

**Resolution:** Two options:
1. Use Supabase service role client (bypasses RLS) for the delete operation when admin
2. Add an admin RLS policy: `using ((select auth.uid()) = created_by OR (select auth.email()) = current_setting('app.admin_email', true))`

**Recommended:** Option 1 — use the service role client conditionally for admin deletes. The service role key is already available server-side (never exposed client-side). This is the cleanest separation.

```typescript
// src/lib/supabase/server.ts — add a service client helper
export async function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // never use client-side
    { auth: { persistSession: false } }
  )
}
```

**Alternative (simpler):** Make the RLS DELETE policy permissive for authenticated users and rely entirely on server-action auth checks. Given this is a private 8-person app, "all authenticated users can delete any event" at the RLS level is acceptable if server actions enforce ownership correctly.

### Comments Table Schema (Claude's Discretion)

```sql
-- Migration: 00004_create_comments_table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  content text not null check (char_length(content) <= 500),
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

-- All authenticated users can read comments
create policy "Authenticated users can read comments" on public.comments
  for select to authenticated using (true);

-- Users can insert their own comments
create policy "Users can insert own comments" on public.comments
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- Users can delete their own comments
create policy "Users can delete own comments" on public.comments
  for delete to authenticated
  using ((select auth.uid()) = user_id);
```

**Admin comment delete:** Same pattern as events — check in server action, use service client if needed.

### rsvps Table RLS — Write Policies (Phase 2 deferred)

```sql
-- Users can RSVP to any event
create policy "Users can insert own rsvps" on public.rsvps
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- Users can remove their own RSVP
create policy "Users can delete own rsvps" on public.rsvps
  for delete to authenticated
  using ((select auth.uid()) = user_id);
```

The `unique(event_id, user_id)` constraint already prevents duplicate RSVPs.

### Component Architecture for EventDetailPanel

EventDetailPanel currently receives `EventRow | null` and renders read-only details. Phase 3 significantly extends it. The recommended approach is to keep EventDetailPanel as the container and extract sub-components:

```
EventDetailPanel.tsx          ← container, controls Sheet/Drawer, passes props down
├── EventDetails.tsx          ← existing (date, location, badge) — extract from inline
├── RsvpButton.tsx            ← "I'm in" / "Attending ✓" with useOptimistic
├── AttendeeList.tsx          ← colored initial circles + names
├── CommentList.tsx           ← flat comment thread
├── CommentInput.tsx          ← text input + submit
└── EventActions.tsx          ← "..." DropdownMenu (edit/delete, owner/admin only)
```

EventDetailPanel needs to know: current user (to show RSVP state and hide/show edit menu). Pass `currentUser` and `isAdmin` props down from ItineraryClient, which receives them from ItineraryPage (which fetches from `supabase.auth.getUser()`).

### Zod Schema for Event Form

```typescript
// src/lib/actions/event-schemas.ts
import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  start_time: z.string().nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  location_name: z.string().max(200).nullable().optional(),
  location_url: z.string().url('Invalid URL').nullable().optional().or(z.literal('')),
  category: z.enum(['dinner', 'excursion', 'group_activity', 'travel', 'open_day']).default('open_day'),
})

export type EventFormData = z.infer<typeof eventSchema>
```

**Note:** `location_url` accepts empty string or valid URL — empty string from an optional field must be coerced to null before inserting.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Optimistic RSVP toggle | Manual `useState` boolean + error recovery | `useOptimistic` + `useTransition` | React handles revert on throw automatically; no manual cleanup needed |
| Delete confirmation modal | Custom modal component | shadcn `AlertDialog` | Built on Radix AlertDialog — does NOT close on outside click (critical for destructive actions), keyboard accessible |
| Three-dot menu | Custom positioned div | shadcn `DropdownMenu` | Handles keyboard nav, focus trap, portal rendering, a11y |
| Form validation (client) | Manual `useState` + error objects | `react-hook-form` + Zod + `@hookform/resolvers` | Already installed; handles touched state, re-validation on change, dirty tracking |
| Attendee avatar initials | Custom CSS | shadcn `Avatar` + `AvatarFallback` | Handles sizing, border-radius, fallback text consistently |
| Category select dropdown | Custom `<select>` styled | shadcn `Select` | Consistent with design system; accessible; matches existing shadcn patterns |

**Key insight:** Every interactive pattern in this phase has an existing shadcn/ui or React 19 primitive. The cost of hand-rolling (accessibility, portal positioning, keyboard nav, focus management) is not justified for an 8-person app.

---

## Common Pitfalls

### Pitfall 1: EventRow type breaking existing components
**What goes wrong:** Changing `rsvps: { count: number }[]` to `rsvps: { user_id: string; profiles: {...} }[]` breaks `EventDetails` in EventDetailPanel which currently reads `event.rsvps?.[0]?.count`.
**Why it happens:** TypeScript will catch the compile error, but the fix must be planned — every read of `rsvps` count must switch to `event.rsvps.length`.
**How to avoid:** Make the type change in Wave 1 (database query + type update) and fix all consumers in the same wave before moving to RSVP UI.
**Warning signs:** TypeScript errors on `rsvps?.[0]?.count` after the type change.

### Pitfall 2: Sheet close race condition with server action
**What goes wrong:** Closing the Sheet before the server action completes clears the form, and if the action fails, the user sees no error.
**Why it happens:** The close is called immediately on button click instead of after `await action()` resolves.
**How to avoid:** Always `await` the server action inside `startTransition` before calling `onClose()`. Only close if `result.success === true`.

### Pitfall 3: useOptimistic flash of reverted state
**What goes wrong:** After `revalidatePath`, the page briefly shows the pre-toggle RSVP state before re-rendering with fresh data.
**Why it happens:** `revalidatePath` triggers a re-render from the server; `useOptimistic` reverts when real state updates, and there's a render gap before the fresh server data arrives. (GitHub issue #49619, closed NOT_PLANNED.)
**How to avoid:** Do NOT call `revalidatePath` from the RSVP toggle action. Accept that the attendee count on day cards updates only on next full navigation. The EventDetailPanel attendee list can update locally via the optimistic toggle.

### Pitfall 4: Admin RLS bypass
**What goes wrong:** Server action confirms admin is deleting, but the Supabase client (which uses the user's auth session) hits the RLS `DELETE` policy which only allows `created_by = auth.uid()` — the delete fails with 403.
**Why it happens:** Supabase RLS applies to ALL requests using the user's JWT, regardless of application-layer checks.
**How to avoid:** Either (a) use the service role client for admin deletes, or (b) make the events DELETE policy allow any authenticated user and enforce ownership only in the server action. For 8 users in a private app, option (b) is simpler and acceptable.

### Pitfall 5: location_url empty string vs null
**What goes wrong:** User leaves the URL field blank, Zod validates `""` as not a valid URL, form shows an error even though the field is optional.
**Why it happens:** Zod `.url()` rejects empty string.
**How to avoid:** Use `.or(z.literal(''))` in the schema, then coerce `""` to `null` in the server action before inserting into Supabase.

### Pitfall 6: Comment user_id not set by client
**What goes wrong:** The comment INSERT action receives content from the client, but `user_id` must come from the server's `getUser()` — never from the client payload.
**Why it happens:** Client could forge the user_id if it's passed as a form field.
**How to avoid:** The server action always sets `user_id: user.id` from `supabase.auth.getUser()`. The RLS WITH CHECK `(select auth.uid()) = user_id` is a second layer of enforcement.

### Pitfall 7: ItineraryClient needs currentUser — but it's a client component
**What goes wrong:** ItineraryClient is `'use client'` and cannot call `supabase.auth.getUser()`. The RSVP button and "..." menu need to know the current user ID and isAdmin.
**Why it happens:** Mixing Server Component data fetching into client components.
**How to avoid:** ItineraryPage (server component) fetches `user` and `isAdmin`, passes them as props to ItineraryClient, which threads them down to EventDetailPanel.

---

## Code Examples

### RSVP Toggle Server Action
```typescript
// src/lib/actions/rsvp-actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'

export async function toggleRsvp(
  eventId: string,
  attending: boolean
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  if (attending) {
    const { error } = await supabase
      .from('rsvps')
      .insert({ event_id: eventId, user_id: user.id })
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)
    if (error) throw new Error(error.message)
  }
  // No revalidatePath — see Pitfall 3
}
```

### Supabase Query with Attendee Names
```typescript
// src/app/(app)/itinerary/page.tsx — updated query
const { data: events } = await supabase
  .from('events')
  .select('*, rsvps(user_id, profiles(display_name))')
  .order('event_date', { ascending: true })
  .order('start_time', { ascending: true, nullsFirst: true })
```

### rsvps RLS Write Policies (migration)
```sql
-- Migration: 00004_rsvps_write_policies (or combined with comments)
create policy "Users can insert own rsvps" on public.rsvps
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own rsvps" on public.rsvps
  for delete to authenticated
  using ((select auth.uid()) = user_id);
```

### Attendee Initials Avatar
```typescript
// Derive initials from display_name
function getInitials(name: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Color palette (Tuscan tones, one per attendee slot)
const AVATAR_COLORS = [
  'bg-[oklch(0.65_0.12_50)]',   // terracotta
  'bg-[oklch(0.60_0.10_140)]',  // sage
  'bg-[oklch(0.65_0.08_200)]',  // dusty blue
  'bg-[oklch(0.70_0.09_280)]',  // lavender
  'bg-[oklch(0.62_0.11_30)]',   // burnt sienna
  'bg-[oklch(0.68_0.07_170)]',  // muted green
  'bg-[oklch(0.66_0.10_310)]',  // mauve
  'bg-[oklch(0.64_0.09_60)]',   // ochre
]
// Assign by index: attendees[index % AVATAR_COLORS.length]
```

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies beyond already-installed project stack; all required tools verified present in prior phases)

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Manual optimistic state + `useEffect` cleanup | `useOptimistic` + `useTransition` (React 19) | Available in this project; no library needed |
| `getSession()` for auth checks | `getUser()` on server | Established in Phase 1; mandatory per Supabase security docs |
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | Established in Phase 1 |
| Full page redirect for form errors | Return `{ success, error }` from server action | Needed for sheet/modal UX — redirect would close the sheet |
| `rsvps(count)` aggregate | `rsvps(user_id, profiles(display_name))` | Phase 3 change: names required for attendee list |

---

## Open Questions

1. **Admin delete + RLS conflict**
   - What we know: RLS DELETE policy for events will reject admin deletes since `created_by !== admin.uid`
   - What's unclear: Whether to use service role client or permissive RLS for this private app
   - Recommendation: Use permissive DELETE RLS (`to authenticated using (true)`) and enforce ownership in server actions. Document the tradeoff clearly in the plan. For 8 trusted users, this is acceptable. If stronger guarantees are wanted, the service client approach is the alternative.

2. **RSVP attendee count on day cards after toggle**
   - What we know: Day cards show count derived from `event.rsvps.length` (after type change). With no `revalidatePath` in RSVP action, the count won't update until next navigation.
   - What's unclear: Whether this is acceptable UX — user RSVPs in the detail panel, returns to day card, still sees old count
   - Recommendation: Accept this behavior. The RSVP detail panel itself shows the updated list optimistically. Day card count staleness is minor for 8 users. Document this as a known limitation.

3. **EventDetailPanel state after edit**
   - What we know: ItineraryClient holds `selectedEvent` state. After editing, the local `selectedEvent` prop is stale (has old data).
   - What's unclear: Whether to update `selectedEvent` locally after edit success or rely on revalidatePath to refresh
   - Recommendation: Call `revalidatePath('/itinerary')` from event create/update/delete actions (but NOT from RSVP toggle). After edit, the page re-fetches and ItineraryClient re-renders with fresh events — the panel can be closed on success.

---

## Sources

### Primary (HIGH confidence)
- React official docs (react.dev/reference/react/useOptimistic) — useOptimistic API, toggle pattern, useTransition integration
- Supabase official docs (supabase.com/docs/guides/database/postgres/row-level-security) — RLS INSERT/DELETE policy syntax, `(select auth.uid())` performance pattern
- Existing codebase: `src/lib/auth/actions.ts`, `src/types/database.types.ts`, `src/app/(app)/itinerary/` — direct inspection of Phase 1 and Phase 2 patterns

### Secondary (MEDIUM confidence)
- GitHub vercel/next.js #49619 — useOptimistic + revalidatePath flash confirmed, closed NOT_PLANNED, workarounds documented
- shadcn/ui docs (ui.shadcn.com) — AlertDialog, DropdownMenu, Dialog controlled state patterns
- WebSearch: react-hook-form + server action + startTransition pattern — corroborated by multiple sources (Markus Oberlehner blog, Aurora Scharff blog, GitHub RHF discussion #10757)

### Tertiary (LOW confidence)
- Avatar color palette using OKLCH — extrapolated from Phase 1 OKLCH Tuscan palette decision; specific colors are discretionary

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and proven in prior phases
- RSVP optimistic pattern: HIGH — verified against react.dev official docs and confirmed GitHub issue
- RLS write policies: HIGH — verified against Supabase official RLS docs
- Admin bypass strategy: MEDIUM — service client vs. permissive RLS tradeoff is a design choice, not a technical uncertainty
- Avatar color palette: LOW — discretionary design, unverified against existing palette

**Research date:** 2026-04-03
**Valid until:** 2026-05-01 (stable libraries, no fast-moving parts)
