# Collections App — Audit Findings & Implementation Checklist

Scanned: 2026-06-18 | Stack: Next.js 14, tRPC, Prisma, NextAuth v4, Zustand, Tailwind

---

## Scope & Limitations

### What the app currently does
- Auth: register, sign in (credentials + Google OAuth), email OTP verification, password reset via OTP
- Category management: CRUD with icons, slugs, pinning
- Link management: CRUD per category, keyword search, pagination, bulk delete, YouTube/Facebook playback
- Admin layout: sidebar navigation, theme toggle, 2-step onboarding tour

### What is schema-complete but not yet built
The Prisma schema has models for Tags, LinkTags, Favorites, and Collaborators — none have router procedures or UI.

### Infrastructure gaps
- No rate limiting (no Redis, no Upstash, no edge middleware)
- No error boundaries (added `app/error.tsx` + `app/admin/error.tsx` — auth subtree still missing)
- No security headers beyond what was added in the fix commit (no CSP)
- No SEO metadata anywhere
- Test coverage ~3% (~3 test files for ~99 source files)
- No link click/view tracking

---

## Security

- [x] **CRITICAL** — Link `update` mutation had no ownership check; any user could mutate another user's link (`linkRouter.ts`)
- [x] **CRITICAL** — Link `create` accepted `categoryId` without verifying it belongs to the caller (`linkRouter.ts`)
- [x] **CRITICAL** — `userRouter.me` returned the bcrypt password hash in the API response
- [x] **CRITICAL** — OTP password reset was brute-forceable: no rate limit, no attempt tracking, no lockout (`auth.ts`)
- [x] **HIGH** — Category `update` where-clause missing `userId`; existence check and actual update were inconsistent (`categoryRouter.ts`)
- [x] **HIGH** — `console.log(session?.user?.email)` fired unconditionally in production — PII in server logs (`trpc/route.ts`)
- [x] **HIGH** — Email send failure was silently swallowed; client received success even when no OTP was delivered (`auth.ts`)
- [x] **MEDIUM** — Dead `generateSecureToken` / `verifySecureToken` functions used substring comparison (non-constant-time) and fell back to `'demo-secret-key'` (`lib/auth.ts`)
- [x] **MEDIUM** — Password minimum was 6 chars — too short to satisfy the complexity rules also enforced (`user-validation.ts`, `auth.ts`)
- [x] **MEDIUM** — No cascade deletes on any foreign key; deleting a user left orphaned rows in Links, Categories, etc. (`schema.prisma` + migration)
- [x] **LOW** — Missing security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` (`middleware.ts`)
- [x] **LOW** — No Content-Security-Policy header — added via `next.config.js` headers for all routes
- [x] **LOW** — `useSecureCookies` not explicitly set in NextAuth config — now explicit in `lib/auth-config.ts`
- [x] **MEDIUM** — No rate limiting on registration endpoint — added IP-based in-process limiter (5/hr per IP); note: resets on cold start, use Upstash for cross-instance persistence
- [ ] **ACTION REQUIRED (manual)** — Rotate all credentials that lived in `.env`: Neon DB password, `NEXTAUTH_SECRET`, Google OAuth client secret, Gmail app password

---

## Bugs

- [x] Filter form validation message said "URL is required" for the keyword field (`filter-validation.ts`)
- [x] Category name `max(40)` had error message "must be less than 50 characters" (`category-validation.ts`)
- [x] Unique constraint on link URL was caught via fragile string match that never fired; now uses Prisma error code `P2002` (`linkRouter.ts`)
- [x] Mobile table showed completely blank — visibility logic referenced a `"mobile"` column that doesn't exist (`data-table.tsx`, `table-compact.tsx`)
- [x] `ThemeProvider storageKey="pokemon-explorer-theme"` — leftover from a project template (`layout.tsx`)
- [x] `profileCountRouter` in `dashboard.ts` was dead code — never wired into `appRouter`, duplicated `userRouter.me`
- [x] YouTube embed spinner never stopped on broken/private videos — no `onError` handler (`youtube-embed.tsx`)
- [x] No error boundaries at any level — uncaught render errors produced a blank page (`app/error.tsx`, `app/admin/error.tsx` added)
- [ ] Facebook reel embed has the same infinite-spinner bug as YouTube did — no `onError` handler (`facebook-reel.tsx`)
- [ ] Missing `app/auth/error.tsx` error boundary for the auth subtree
- [ ] `parseInt(ctx.user.id)` is used across all routers without a null guard — `parseInt(undefined)` = `NaN`, silently breaks queries
- [ ] Async category name uniqueness check `catch` returns `true` (valid) on any DB error, allowing invalid data through (`category-validation.ts`)

---

## Performance

- [ ] N+1 query in `links.count` procedure: groups links by category then fetches each category in a separate query (`linkRouter.ts`)
- [ ] Missing DB indexes on frequently queried columns: `Links.categoryId`, `Links.userId`, `Categories.slug` (`schema.prisma`)
- [ ] `perPage` pagination default has three inconsistent sources of truth: schema (optional/no default), routers (`|| 10`), store (`PAGE_LIMIT`)
- [ ] Zustand store (categories, filters, pagination) is never reset on logout — a second user logging in on the same session briefly sees stale data (`app.store.ts`)

---

## Accessibility

- [ ] Clickable `<div>` elements with `onClick` but no `role="button"`, `tabIndex`, or keyboard handlers in multiple admin components (`navigation.tsx`, `page-header.tsx`, `card-template.tsx`)
- [ ] Facebook reel `<iframe>` missing `aria-label` (`facebook-reel.tsx`) — YouTube was fixed
- [ ] Card keyboard handler calls `preventDefault()` on Enter but not Space — pressing Space scrolls page while activating the card (`card-template.tsx`)

---

## Code Quality

- [ ] `.pokemon-card` and `.logo` CSS classes in `globals.css` — dead code leftover from a template
- [ ] Inline hex color strings (`#f0f0f0`, `#3b82f6`) in embed components instead of Tailwind tokens (`youtube-embed.tsx`, `facebook-reel.tsx`)
- [x] Auth env vars (`NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GMAIL_USER`, etc.) added to `src/env.js` validation schema

---

## Missing Features (schema is ready, nothing built)

- [ ] **Tags on links** — `Tags` + `LinkTags` models exist; zero router procedures or UI
- [ ] **Favorites** — `Favorites` model exists; zero router procedures or UI
- [ ] **Collaborators / category sharing** — `Collaborators` model + `Categories.shareId` field exist; no router, no UI
- [ ] **Public share links** — `shareId` field on `Categories` exists; no API endpoint to generate or resolve public share URLs
- [ ] **Category icon update** — `icon` field exists on `Categories`; no procedure to update it, no UI
- [ ] **User profile update** — `profile` + `cover` fields exist on `Users`; admin profile page shows "coming soon"
- [ ] **Vimeo / TikTok / Twitch embed** — `platformMap` in `helpers.ts` lists these platforms; `react-player` is installed but unused; playback dialog only handles YouTube and Facebook

---

## Nice-to-Haves

### UX
- [ ] Empty state message in link table when no results ("No links yet. Add one above.")
- [ ] Skeleton loaders in link table instead of generic spinner
- [ ] Link URL auto-preview (fetch title/description) when adding a new link
- [ ] "Open in new tab" fallback in playback dialog for unsupported platforms (Vimeo, TikTok, etc.)
- [ ] Inline "Please verify your email" message for unverified users instead of silently redirecting to dashboard

### Features
- [ ] Bulk actions beyond delete: move links to a different category, add tag, export selection
- [ ] CSV / JSON export — and import from browser bookmark files
- [ ] Advanced filters: by date range, platform (YouTube vs Facebook), tag
- [ ] Link click / view tracking — "most visited" or "recently opened" view
- [ ] Favorites quick-access panel (once the Favorites feature is built)

### Onboarding
- [ ] Expand tour from 2 steps to cover: create category, add link, filters, bulk actions (`tour-steps.tsx`)

### SEO
- [ ] Add `<title>`, `<meta name="description">`, and Open Graph tags — root layout and all admin pages have none

### Tests
- [ ] Test coverage is ~3% (~3 test files for ~99 source files)
- [ ] Zero tests for: auth flows (sign-in, sign-up, forgot password), tRPC routers, hooks (`useNavigationLists`, `useApiUtils`, `useConfirmDialog`), admin page components
