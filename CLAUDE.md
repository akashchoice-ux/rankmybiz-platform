@AGENTS.md

# RankMyBiz — Project Intelligence

## Product Overview
RankMyBiz is a SaaS platform that helps F&B and catering businesses in Malaysia get more customers automatically through optimised online presence, automated review collection, and local SEO.

**Core positioning:** Get more customers. Automatically.
**Primary MVP niche:** F&B / catering businesses in Malaysia.
**Business model:** Monthly/yearly subscriptions with online + bank transfer payment support.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (no tailwind.config.js — config via globals.css `@theme`) |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL with RLS) |
| Storage | Supabase Storage (logos, payment proofs) |
| Payment | Stripe (cards + FPX Malaysia) + manual bank transfer |
| Email | Resend |
| Deployment | Vercel |

**Critical Next.js 16 breaking changes to always follow:**
- `params` and `searchParams` in `page.tsx` / `layout.tsx` are async Promises — always `await props.params`
- `cookies()`, `headers()`, `draftMode()` are async — always await them
- Use `PageProps<'/path/[param]'>` type helper for typed params
- Turbopack is default for dev and build — no webpack config

---

## Brand System

### Logo
Wordmark: `Rank` (indigo, bold) + `My` (slate-500, medium) + `Biz` (indigo, bold) + spark SVG icon prefix.
Implemented as a React component: `app/components/brand/Logo.tsx`

### Color Palette (Tailwind v4 tokens — defined in globals.css)
```
--color-brand:          #4F46E5  (indigo-600)  — primary actions, trust
--color-brand-dark:     #3730A3  (indigo-800)  — hover states, depth
--color-accent:         #F59E0B  (amber-500)   — highlights, F&B warmth
--color-success:        #10B981  (emerald-500) — live, approved
--color-warning:        #F97316  (orange-500)  — pending, needs action
--color-danger:         #EF4444  (red-500)     — rejected, error
```

### Typography
- Font: Geist Sans (all weights) — already installed via next/font/google
- Headings: font-bold, tracking-tight
- UI labels: font-semibold (600)
- Body: font-normal (400), leading-relaxed

---

## Listing Lifecycle (Status Machine)

```
draft
  → (form submitted, payment method chosen) → pending_payment

pending_payment
  → (Stripe Checkout: success via webhook) → pending_review
  → (bank transfer selected + proof uploaded) → pending_bank_verification
  → (Stripe: payment failed) → pending_payment (stays, show error)

pending_bank_verification
  → (admin confirms payment manually) → pending_review
  → (admin rejects proof) → pending_payment

pending_review
  → (admin approves) → live
  → (admin rejects with reason) → rejected

rejected
  → (user edits and resubmits) → draft

live
  → (admin suspends for policy) → suspended
  → (subscription expires) → suspended

suspended
  → (admin reinstates) → live
```

**Never skip states.** Listings must not become `live` without going through `pending_review` → admin approval.

---

## Route Structure

```
/                         → Public homepage
/pricing                  → Packages and pricing
/listings                 → Public listings directory
/listings/[slug]          → Public listing detail page

/auth/login               → SME login
/auth/register            → SME registration
/auth/forgot-password     → Password reset

/dashboard                → SME portal home
/dashboard/submit         → Multi-step listing submission (steps 1-5)
/dashboard/submit/payment → Payment method selection + completion
/dashboard/listings       → My submitted listings
/dashboard/listings/[id]  → My listing detail + status

/admin                    → Admin overview dashboard
/admin/listings           → All listing submissions (filter by status)
/admin/listings/[id]      → Listing review: approve / reject / notes
/admin/payments           → Payment verification (bank transfers)
/admin/users              → User management

/api/webhooks/stripe      → Stripe webhook handler (payment status automation)
/api/listings/[id]        → Listing API routes
/api/payments/create-session → Stripe session creation
```

---

## Database Entities (Supabase / PostgreSQL)

See `supabase/schema.sql` for full schema with RLS policies.

**Core tables:** users, packages, business_profiles, listings, payments, payment_proofs,
listing_reviews, service_areas, admin_notes, leads, seo_pages

---

## Payment Architecture

### Online (Stripe + FPX)
1. User selects "Pay Online" on payment page
2. Frontend calls `/api/payments/create-session` with `listingId`
3. Server creates Stripe Checkout session (FPX + card methods enabled)
4. User redirected to Stripe hosted checkout
5. On success: Stripe webhook fires to `/api/webhooks/stripe`
6. Webhook handler: `payments.status = paid` + `listings.status = pending_review`
7. Email sent to SME: "Payment received, listing under review"

### Bank Transfer (Manual)
1. User selects "Bank Transfer"
2. System shows: Maybank/CIMB account details + unique reference code (listing ID prefix)
3. User uploads proof → Supabase Storage
4. `listings.status` → `pending_bank_verification`
5. Admin sees "Pending bank verification" tab in dashboard
6. Admin reviews proof → confirms → `listings.status` → `pending_review`
7. Email sent to SME: "Payment confirmed, listing under review"

---

## Admin Workflow

Admin is the only user with `role = 'admin'` in the `users` table.

Admin can:
- View all listing submissions grouped by status
- Review business profile details
- Add admin notes
- Approve listing → status becomes `live`
- Reject listing with reason → status becomes `rejected`, SME notified
- Verify bank transfer proofs
- Suspend or reinstate live listings

Admin cannot:
- Edit SME business profile content directly
- Delete listings permanently (soft-delete only with audit log)

---

## UI/UX Principles

1. **Non-technical SME first** — every form, label, and CTA understandable by a restaurant owner
2. **Progressive disclosure** — guide through steps, don't overwhelm
3. **Clear feedback** — every status has a human-readable label, color-coded badge, explanation
4. **Mobile-first** — layouts and forms must work on a phone
5. **Premium minimal** — generous whitespace, clear hierarchy, no visual clutter
6. **Trust signals** — payment security, clear pricing, no hidden fees messaging

---

## Code Rules

- Components modular — one responsibility per file
- No over-engineering — build exactly what the MVP needs
- All TypeScript types defined in `types/index.ts`
- All constants (enums, package data) in `lib/constants.ts`
- Supabase client in `lib/supabase.ts` (browser) and `lib/supabase-server.ts` (server/RSC)
- Never access `params` synchronously in Next.js 16 — always `await props.params`
- Protected routes use middleware or layout-level auth checks
- Admin routes must verify `role === 'admin'` server-side
- No `console.log` in production — use structured error handling
- Multi-step form state lives in client component with `useState`
