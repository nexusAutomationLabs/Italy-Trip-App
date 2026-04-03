# Stack Research

**Domain:** Trip coordination web app (private, small group, Tuscany travel)
**Researched:** 2026-04-03
**Confidence:** HIGH — core stack is fixed by project constraints; supporting libraries verified against current npm versions and official docs.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (latest stable ~15.2.4; v16 exists but is very new) | Full-stack React framework | Mandated by project constraints. App Router gives server components, server actions, and file-based routing. Tight Vercel integration means zero-config deploys. |
| React | 19.x | UI runtime | Included with Next.js 15. Server Components and `useActionState` for form handling are production-stable in this version. |
| TypeScript | 5.x | Type safety | Mandated by Next.js 15 scaffolding. v15.5 added stable typed routes — compile-time validation of all `<Link href>` values. Essential for a codebase where 8 non-technical users depend on correctness. |
| Supabase | Managed (cloud) | Auth + Postgres DB | Mandated by project constraints. Managed Postgres with Row Level Security, auth with magic links or email/password, generous free tier. Zero-ops for a 10-person trip app. |
| `@supabase/supabase-js` | 2.101.x | Supabase JS client | Official isomorphic client. v2.x stable, actively maintained. Dropped Node 18 support in 2.79 — use Node 20+. |
| `@supabase/ssr` | latest | Cookie-based SSR auth | Replaces deprecated `@supabase/auth-helpers-nextjs`. Provides separate client creators for Server Components vs Client Components. Required for correct session handling in App Router. |
| Tailwind CSS | 4.x | Utility-first CSS | Stable since January 2025. CSS-first config (no `tailwind.config.js`). Oxide engine: incremental builds 100x faster than v3. Full App Router + React 19 support. |
| Vercel | — | Hosting | Mandated by project constraints. Native Next.js integration, automatic preview deployments, edge network, environment variable sync with Supabase via marketplace integration. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | Latest (Feb 2025+ build) | Accessible, unstyled-first UI components | Use for all interactive UI: modals, forms, buttons, cards, dropdowns. Components are copy-pasted into the codebase — no runtime dependency, fully customizable. Full Tailwind v4 + React 19 support as of February 2025. |
| Lucide React | 1.7.x | Icon library | Tree-shakable SVG icons. 30M+ downloads/week. Used by shadcn/ui by default. Import only what you use. |
| `react-hook-form` | latest (7.x) | Form state management | Use for event creation form and RSVP form. Handles validation state, dirty tracking, and submission without re-renders. Pair with Zod. |
| `@hookform/resolvers` | latest | Bridge for Zod + react-hook-form | Use alongside `react-hook-form` and `zod`. Single resolver package covers both client and server validation. |
| `zod` | 3.x | Schema validation | Use for all form input validation (event title, date/time, location URL). Shared schema runs on both client (instant feedback) and server (trusted validation in Server Actions). |
| `date-fns` | 4.x | Date formatting and utilities | Use for formatting event dates, computing day-of-trip numbers (Day 1 = May 7), and grouping events by day. v4 has first-class timezone support — relevant for an app where users are in Italy (CEST) but may have seeded data in local time. |
| `next-themes` | 0.4.x | Dark/light mode | Optional. Use only if dark mode is desired. Integrates with shadcn/ui's `ThemeProvider`. No-flash implementation. Not required for MVP. |
| `unsplash-js` | latest | Unsplash API client | Use to fetch Tuscany/Florence hero images dynamically. Rate limit is 50 req/hr on demo apps — acceptable for 8-10 users. Alternative: hard-code 5-10 static Unsplash URLs and avoid the API entirely (simpler). |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Supabase CLI | Local development, migrations, type generation | Run `supabase gen types typescript` to keep DB types in sync with schema. Essential for type-safe queries. |
| ESLint | Linting | Scaffolded by `create-next-app`. Keep the default config — Next.js's ruleset catches App Router anti-patterns. |
| Prettier | Formatting | Add alongside ESLint. Consistent formatting across a short-lived project with no team conventions. |
| Vercel CLI | Preview deployments and env var management | `vercel env pull` copies production env vars to `.env.local` for local development. Avoids manual copying. |
| `@types/node`, `@types/react`, `@types/react-dom` | TypeScript definitions | Always upgrade in lockstep with React/Next.js versions. |

---

## Installation

```bash
# Scaffold project
npx create-next-app@latest tuscany-trip --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Supabase clients
npm install @supabase/supabase-js @supabase/ssr

# UI and icons (shadcn/ui installs its own dependencies)
npx shadcn@latest init
npm install lucide-react

# Forms and validation
npm install react-hook-form @hookform/resolvers zod

# Date utilities
npm install date-fns

# Optional: Unsplash (only if using API; otherwise use static URLs)
npm install unsplash-js

# Dev tools
npm install -D prettier
npm install -D supabase  # Supabase CLI as dev dependency
```

> Note: Tailwind v4 is included by `create-next-app` with the `--tailwind` flag as of 2025. Verify the installed version with `npm list tailwindcss` — if it scaffolds v3, upgrade: `npm install tailwindcss@latest`.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| CSS framework | Tailwind CSS v4 | Tailwind CSS v3 | v3 is superseded; v4 is the current stable and has a fast upgrade path. shadcn/ui now defaults to v4. |
| Component library | shadcn/ui | Mantine, MUI, Chakra | shadcn/ui components live in your codebase — zero runtime overhead, full Tailwind integration, and the "new-york" style matches a modern travel aesthetic. Third-party libs add bundle weight and theming friction. |
| Auth approach | Supabase Auth (email/password) | NextAuth.js | Supabase Auth is already in the stack. Adding NextAuth would be redundant. Supabase covers magic links, email/password, and session management natively. |
| Database ORM | Direct Supabase client (type-gen) | Prisma, Drizzle | For 4 tables and 10 users, the generated Supabase client types are sufficient. Prisma/Drizzle add migration overhead without meaningful benefit at this scale. |
| Date handling | date-fns v4 | Day.js, Luxon | date-fns v4 added first-class timezone support. Tree-shakable. No prototype pollution (unlike Moment.js). Luxury isn't needed at this scale, but the timezone-safe default is correct for an international trip app. |
| Image sourcing | Static Unsplash URLs | Unsplash API | For a 10-person app, hard-coding 5-10 curated Tuscany URLs is more reliable than an API with 50 req/hr rate limits. Use `next/image` with `remotePatterns` set to `images.unsplash.com`. The API is optional and only adds value if you want random/rotating images. |
| Deployment | Vercel | Netlify, Fly.io | Vercel is the native platform for Next.js. The Supabase marketplace integration auto-syncs env vars. No justification to use an alternative. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@supabase/auth-helpers-nextjs` | Officially deprecated. Does not support App Router correctly — session cookies expire unpredictably. | `@supabase/ssr` |
| `getSession()` for authorization checks | Returns unverified data from cookies; can be spoofed. Official Supabase docs flag this as a security issue. | `getUser()` on the server for any auth-gated operation |
| Pages Router | Next.js project uses App Router. Mixing the two creates routing confusion and breaks Server Component assumptions. | App Router exclusively |
| Prisma or Drizzle | Unnecessary abstraction on top of Supabase's generated types for a 4-table schema with 10 users. Adds migration ceremony with no payoff. | `@supabase/supabase-js` with CLI-generated types |
| Moment.js | Unmaintained since 2020. Mutable, large bundle. | `date-fns` v4 |
| `localStorage` for auth tokens | Browser-only, breaks SSR, insecure compared to HTTP-only cookies. Supabase SSR package handles cookies correctly by default. | `@supabase/ssr` cookie-based sessions |
| Real-time Supabase subscriptions | The project explicitly excludes real-time chat. Polling on page load is sufficient for an itinerary that changes infrequently. Real-time subscriptions add complexity with no user value here. | Standard `fetch` on page load / Server Component data fetching |
| Next.js `v16` right now | Version 16 is very new (as of April 2026). Ecosystem tooling (shadcn/ui, docs, StackOverflow answers) is optimized for v15. Use `next@15` until v16 matures. | `next@15` (pin to ~15.2.x or latest 15.x) |

---

## Sources

- [Next.js 15 stable release](https://nextjs.org/blog/next-15) — MEDIUM confidence (official blog)
- [Next.js 15.2.4 as of March 2026](https://www.abhs.in/blog/nextjs-current-version-march-2026-stable-release-whats-new) — MEDIUM confidence (third-party post, corroborated by GitHub releases page)
- [@supabase/ssr on npm](https://www.npmjs.com/package/@supabase/ssr) — HIGH confidence (official npm registry)
- [@supabase/supabase-js 2.101.x](https://www.npmjs.com/package/@supabase/supabase-js) — HIGH confidence (official npm registry)
- [Supabase SSR migration guide (auth-helpers → @supabase/ssr)](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) — HIGH confidence (official Supabase docs)
- [Tailwind CSS v4.0 stable release (January 22, 2025)](https://tailwindcss.com/blog/tailwindcss-v4) — HIGH confidence (official Tailwind blog)
- [shadcn/ui Tailwind v4 compatibility](https://ui.shadcn.com/docs/tailwind-v4) — HIGH confidence (official shadcn/ui docs)
- [shadcn/ui February 2025 changelog](https://ui.shadcn.com/docs/changelog/2025-02-tailwind-v4) — HIGH confidence (official shadcn/ui changelog)
- [lucide-react 1.7.x on npm](https://www.npmjs.com/package/lucide-react) — HIGH confidence (official npm registry)
- [date-fns 4.1.0 with timezone support](https://date-fns.org/) — MEDIUM confidence (official site + npm)
- [next-themes 0.4.6](https://www.npmjs.com/package/next-themes) — MEDIUM confidence (npm registry, single source)
- [Supabase RLS security guidance (getUser vs getSession)](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv) — HIGH confidence (official Supabase docs)
- [Vercel Supabase marketplace integration](https://vercel.com/marketplace/supabase) — HIGH confidence (official Vercel marketplace)
- [Supabase + Vercel env variable sync](https://supabase.com/blog/using-supabase-with-vercel) — HIGH confidence (official Supabase blog)
- [Unsplash remotePatterns config for Next.js](https://github.com/vercel/next.js/blob/canary/examples/with-unsplash/README.md) — MEDIUM confidence (official Next.js example, but date unknown)
