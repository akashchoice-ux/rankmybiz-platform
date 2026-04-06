-- ============================================================
-- RankMyBiz — Launch Schema (MVP)
--
-- Run this in Supabase SQL Editor:
--   Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Listings table — stores all business submissions
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),

  -- Business identity
  name text not null,
  ssm_number text not null,
  slug text unique,

  -- Classification
  industry text not null default 'fnb',
  category text not null,
  category_slug text not null,
  subcategory text,

  -- Business details
  description text not null,
  phone text not null,
  email text not null,
  whatsapp text,
  website text,
  google_business_url text,
  logo_url text,
  keywords text,                      -- comma-separated search keywords
  custom_attributes jsonb default '{}',

  -- Location
  address text not null,
  city text not null,
  state text not null,
  postcode text not null,
  service_areas text[] default '{}',

  -- Package & status
  package_id text not null default 'pkg_free',
  package_name text not null default 'Free',
  status text not null default 'pending_review',  -- pending_review, live, rejected, suspended
  rejection_reason text,

  -- Timestamps
  submitted_at timestamptz default now(),
  live_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads table — stores enquiry form submissions
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id),
  name text not null,
  phone text not null,
  email text,
  message text,
  source text default 'listing_page',
  created_at timestamptz default now()
);

-- Payment proofs table — for Premium/Ultra bank transfers
create table if not exists payment_proofs (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id),
  file_url text,
  file_name text,
  amount numeric,
  reference_code text,
  status text default 'pending',  -- pending, verified, rejected
  verified_at timestamptz,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table listings enable row level security;
alter table leads enable row level security;
alter table payment_proofs enable row level security;

-- Public read for live listings (anyone can view)
create policy "Public can view live listings" on listings
  for select using (status = 'live');

-- Allow inserts from anon (submission form)
create policy "Anyone can submit a listing" on listings
  for insert with check (true);

-- Allow all operations for authenticated service role (admin)
create policy "Service role full access to listings" on listings
  for all using (true) with check (true);

-- Leads — anyone can submit, admin can read
create policy "Anyone can submit leads" on leads
  for insert with check (true);

create policy "Public can read leads" on leads
  for select using (true);

-- Payment proofs — anyone can submit
create policy "Anyone can submit payment proofs" on payment_proofs
  for insert with check (true);

create policy "Public can read payment proofs" on payment_proofs
  for select using (true);

-- Index for fast lookups
create index if not exists idx_listings_status on listings(status);
create index if not exists idx_listings_slug on listings(slug);
create index if not exists idx_listings_category_city on listings(category_slug, city);
create index if not exists idx_leads_listing_id on leads(listing_id);
