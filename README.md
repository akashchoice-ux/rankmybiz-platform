# RankMyBiz

**Business listing platform for Malaysian SMEs.**
Get more customers automatically from Google & AI search.

**Live:** [rankmybiz.ai](https://rankmybiz.ai)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel
- **Analytics:** Google Analytics 4

Future integrations (not required for launch):
- Supabase (Auth, Database, Storage)
- Stripe (Payments)
- Resend (Email)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required for Launch | Description |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | Yes | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_APP_URL` | No | App URL (defaults to rankmybiz.ai) |
| `NEXT_PUBLIC_SUPABASE_URL` | Phase 3 | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Phase 3 | Supabase anonymous key |
| `STRIPE_SECRET_KEY` | Phase 3 | Stripe secret key |

## Deployment

Deployed on Vercel. Push to `main` triggers automatic deployment.

```bash
git push origin main
```

## Project Structure

```
app/                  # Next.js App Router pages
  components/         # Shared UI components
  listings/           # Public listing directory + detail pages
  [category]/[city]/  # SEO category × city pages
  dashboard/          # SME portal
  admin/              # Admin panel
  api/                # API routes
lib/                  # Utilities, constants, seed data, analytics
types/                # TypeScript type definitions
public/               # Static assets, robots.txt
supabase/             # Database schema (Phase 3)
```

## Adding Verified Listings

Edit `lib/seed-data.ts`:
1. Add listing to `VERIFIED_LISTINGS` array with `is_demo: false`
2. Set `status: "live"` and fill in all real business details
3. Deploy — listing appears automatically on all public pages and sitemap
