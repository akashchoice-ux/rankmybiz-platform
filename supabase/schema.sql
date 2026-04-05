-- ============================================================
-- RankMyBiz — Supabase Schema v2
-- Multi-industry marketplace platform
--
-- Run order: paste entire file into Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Run)
--
-- To reset: drop schema public cascade; create schema public;
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fuzzy search on business names

-- ============================================================
-- ENUMS
-- ============================================================

-- User roles — only two in MVP: business owner and platform admin
create type user_role as enum ('sme', 'admin');

-- Listing lifecycle — six states only
-- draft           : form started, not yet submitted for payment
-- pending_payment : submitted, payment not yet confirmed
-- pending_review  : payment confirmed — in admin review queue
-- live            : admin approved — publicly visible to consumers
-- rejected        : admin rejected with reason — SME edits and resubmits (no repayment)
-- suspended       : taken offline (policy breach, non-renewal, admin action)
create type listing_status as enum (
  'draft',
  'pending_payment',
  'pending_review',
  'live',
  'rejected',
  'suspended'
);

-- Who triggered a status change (for audit trail)
create type status_trigger as enum ('user', 'system', 'admin');

-- Payment methods — expandable
create type payment_method as enum ('stripe', 'bank_transfer');

-- Payment lifecycle
-- unpaid               : payment record created, not yet processed
-- pending_verification : bank transfer proof uploaded, awaiting admin confirmation
-- paid                 : confirmed paid (webhook or admin)
-- failed               : Stripe payment failed or declined
-- refunded             : payment was reversed
create type payment_status as enum (
  'unpaid',
  'pending_verification',
  'paid',
  'failed',
  'refunded'
);

-- Billing options for packages
create type billing_cycle as enum ('monthly', 'yearly', 'one_time');

-- Subscription states (mirrors Stripe subscription statuses)
create type subscription_status as enum (
  'active',
  'past_due',
  'canceled',
  'trialing',
  'incomplete'
);

-- Admin actions on a listing — written to listing_reviews for full audit
create type review_action as enum (
  'approved',
  'rejected',
  'suspended',
  'reinstated',
  'payment_verified',
  'payment_rejected'
);

-- Dynamic attribute field types for industry-specific fields
create type attribute_field_type as enum (
  'text',
  'textarea',
  'number',
  'boolean',
  'select',
  'multiselect',
  'url',
  'phone',
  'email'
);

-- Industry launch phases — controls what appears in the UI
create type launch_phase as enum ('active', 'coming_soon', 'roadmap');

-- Email notification event types
create type email_event as enum (
  'registration_welcome',
  'submission_received',
  'payment_confirmed',
  'bank_proof_submitted',
  'bank_proof_rejected',
  'listing_approved',
  'listing_rejected',
  'listing_suspended',
  'listing_reinstated'
);

-- ============================================================
-- TAXONOMY LAYER
-- Industries, categories, subcategories, attribute definitions
-- Adding a new industry = insert rows here, zero code changes
-- ============================================================

-- Top-level industries (F&B, Healthcare, etc.)
create table public.industries (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  description   text,
  icon          text,                       -- emoji or icon key for UI
  launch_phase  launch_phase not null default 'coming_soon',
  sort_order    integer not null default 0, -- controls display order
  is_active     boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Business categories within an industry
create table public.categories (
  id           uuid primary key default uuid_generate_v4(),
  industry_id  uuid not null references public.industries(id) on delete cascade,
  name         text not null,
  slug         text not null unique,
  description  text,
  icon         text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Optional subcategories within a category (e.g. "Malay Cuisine" under "Restaurant")
create table public.subcategories (
  id           uuid primary key default uuid_generate_v4(),
  category_id  uuid not null references public.categories(id) on delete cascade,
  name         text not null,
  slug         text not null unique,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Dynamic field definitions per industry or category
-- These drive the extra fields shown in the submission form
-- Example: halal_certified (boolean) for all F&B, min_pax (number) for Catering only
create table public.attribute_definitions (
  id              uuid primary key default uuid_generate_v4(),
  industry_id     uuid references public.industries(id) on delete cascade,  -- null = all industries
  category_id     uuid references public.categories(id) on delete cascade,  -- null = whole industry
  key             text not null,                -- machine key: "halal_certified"
  label           text not null,               -- display label: "Halal Certified?"
  field_type      attribute_field_type not null,
  options         jsonb,                        -- for select/multiselect: [{"value":"yes","label":"Yes"},...]
  placeholder     text,
  hint            text,
  is_required     boolean not null default false,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now(),
  -- Each key is unique per industry+category scope
  unique (industry_id, category_id, key)
);

-- ============================================================
-- USER LAYER
-- ============================================================

-- Extends Supabase auth.users — one row per auth user
create table public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null unique,
  full_name           text not null default '',
  phone               text,
  role                user_role not null default 'sme',
  email_verified_at   timestamptz,             -- set when Supabase confirms email
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-create users row on Supabase auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- MONETISATION LAYER
-- ============================================================

-- Subscription packages / pricing tiers
create table public.packages (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  slug             text not null unique,
  price            numeric(10, 2) not null,     -- in MYR
  billing_cycle    billing_cycle not null default 'monthly',
  description      text,
  features         jsonb not null default '[]', -- ["Feature one", "Feature two"]
  is_popular       boolean not null default false,
  is_active        boolean not null default true,
  sort_order       integer not null default 0,
  stripe_price_id  text,                        -- set when Stripe is configured
  created_at       timestamptz not null default now()
);

-- Seed packages (industry-agnostic — work for any vertical)
insert into public.packages
  (name, slug, price, billing_cycle, description, features, is_popular, sort_order)
values
(
  'Starter', 'starter', 99.00, 'monthly',
  'For local businesses taking their first step online.',
  '["1 verified business listing","Google Maps profile optimisation","Automated review requests (50/month)","Basic performance dashboard","Email support"]',
  false, 1
),
(
  'Growth', 'growth', 199.00, 'monthly',
  'For businesses serious about dominating local search.',
  '["1 verified business listing","Full local SEO optimisation","Automated review requests (unlimited)","Advanced analytics + competitor tracking","WhatsApp integration","Priority search placement","Priority email + chat support"]',
  true, 2
),
(
  'Pro', 'pro', 399.00, 'monthly',
  'Full-service for operators managing multiple locations.',
  '["Up to 3 verified business listings","Full local SEO optimisation","Automated review requests (unlimited)","Dedicated SEO landing pages per listing","Lead capture forms","Monthly performance reports","Dedicated account manager","Phone + WhatsApp support"]',
  false, 3
);

-- ============================================================
-- BUSINESS LAYER
-- ============================================================

-- The core business entity — industry-agnostic
-- custom_attributes holds dynamic fields driven by attribute_definitions
create table public.business_profiles (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.users(id) on delete cascade,
  industry_id          uuid not null references public.industries(id),
  category_id          uuid not null references public.categories(id),
  subcategory_id       uuid references public.subcategories(id),    -- optional
  name                 text not null,
  slug                 text not null unique,
  description          text not null,
  logo_url             text,
  phone                text not null,
  email                text not null,
  whatsapp             text,
  website              text,
  google_business_url  text,
  address              text not null,
  city                 text not null,
  state                text not null,
  postcode             text not null,
  -- Dynamic attributes specific to this industry/category
  -- e.g. { "halal_certified": true, "min_pax": 50, "cuisine_types": ["Malay", "Western"] }
  custom_attributes    jsonb not null default '{}',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Geographic service coverage (a business can serve multiple states/cities)
create table public.service_areas (
  id           uuid primary key default uuid_generate_v4(),
  listing_id   uuid not null,  -- FK added after listings table creation
  state        text not null,
  city         text,           -- null = whole state
  is_national  boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- LISTING LAYER
-- ============================================================

-- A listing is a published instance of a business_profile with a package
-- One business_profile can have one active listing at a time (MVP)
create table public.listings (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.users(id) on delete cascade,
  business_profile_id  uuid not null references public.business_profiles(id) on delete cascade,
  package_id           uuid not null references public.packages(id),
  status               listing_status not null default 'draft',
  seo_slug             text unique,           -- used in public URLs: /catering/kl/[seo_slug]
  submitted_at         timestamptz,           -- when SME clicked Submit
  live_at              timestamptz,           -- when listing went live
  rejection_reason     text,                  -- set on rejection, cleared on resubmission
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Add FK from service_areas to listings now that listings exists
alter table public.service_areas
  add constraint service_areas_listing_id_fkey
  foreign key (listing_id) references public.listings(id) on delete cascade;

-- Every status change is recorded here — the full audit trail
-- triggered_by: 'user' (SME action), 'system' (webhook/auto), 'admin' (admin action)
-- actor_id: who caused it (user_id or admin_id or null for system)
create table public.listing_status_history (
  id            uuid primary key default uuid_generate_v4(),
  listing_id    uuid not null references public.listings(id) on delete cascade,
  from_status   listing_status,              -- null on initial creation
  to_status     listing_status not null,
  triggered_by  status_trigger not null default 'system',
  actor_id      uuid references public.users(id), -- null for automated transitions
  reason        text,                         -- rejection reason, suspension reason, etc.
  metadata      jsonb,                        -- extra context (stripe_session_id, etc.)
  created_at    timestamptz not null default now()
);

-- ============================================================
-- PAYMENT LAYER
-- ============================================================

-- One payment record per listing activation
-- Stripe: status auto-updates via webhook
-- Bank transfer: status manually updated by admin
create table public.payments (
  id                       uuid primary key default uuid_generate_v4(),
  listing_id               uuid not null references public.listings(id) on delete cascade,
  user_id                  uuid not null references public.users(id),
  package_id               uuid not null references public.packages(id),
  method                   payment_method not null,
  status                   payment_status not null default 'pending',
  amount                   numeric(10, 2) not null,   -- always from packages.price, never client-provided
  currency                 char(3) not null default 'MYR',
  -- Stripe fields (null for bank transfer)
  stripe_session_id        text unique,
  stripe_payment_intent_id text unique,
  -- Bank transfer fields (null for Stripe)
  reference_code           text unique,              -- e.g. RMB-202604-A3BX9K
  -- Timestamps
  paid_at                  timestamptz,
  created_at               timestamptz not null default now()
);

-- Bank transfer evidence — uploaded screenshot/PDF
-- Listing stays at pending_payment until proof is admin-verified
create table public.payment_proofs (
  id                uuid primary key default uuid_generate_v4(),
  payment_id        uuid not null references public.payments(id) on delete cascade,
  file_url          text not null,          -- Supabase Storage path
  file_name         text,
  file_size_bytes   integer,
  uploaded_at       timestamptz not null default now(),
  -- Admin verification
  verified_at       timestamptz,
  verified_by       uuid references public.users(id),
  is_rejected       boolean not null default false,
  rejection_reason  text
);

-- Subscription tracking — one per active listing
-- For Stripe recurring: stripe_subscription_id is set
-- For bank transfer (treated as one-time): only period dates are set
create table public.subscriptions (
  id                       uuid primary key default uuid_generate_v4(),
  listing_id               uuid not null references public.listings(id) on delete cascade,
  user_id                  uuid not null references public.users(id),
  package_id               uuid not null references public.packages(id),
  payment_id               uuid references public.payments(id),
  status                   subscription_status not null default 'active',
  stripe_subscription_id   text unique,
  stripe_customer_id       text,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean not null default false,
  canceled_at              timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ============================================================
-- ADMIN LAYER
-- ============================================================

-- Admin decisions on listings — every approve/reject/suspend is logged
create table public.listing_reviews (
  id           uuid primary key default uuid_generate_v4(),
  listing_id   uuid not null references public.listings(id) on delete cascade,
  reviewer_id  uuid not null references public.users(id),
  action       review_action not null,
  notes        text,
  created_at   timestamptz not null default now()
);

-- Internal admin notes — not visible to SME
create table public.admin_notes (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  admin_id    uuid not null references public.users(id),
  note        text not null,
  created_at  timestamptz not null default now()
);

-- All system emails sent — for audit and retry logic
create table public.email_logs (
  id           uuid primary key default uuid_generate_v4(),
  to_email     text not null,
  to_name      text,
  event        email_event not null,
  listing_id   uuid references public.listings(id) on delete set null,
  resend_id    text,                         -- Resend message ID for tracking
  status       text not null default 'sent', -- 'sent' | 'failed'
  error        text,
  sent_at      timestamptz not null default now()
);

-- ============================================================
-- SEO LAYER
-- ============================================================

-- Per-listing SEO configuration (auto-generated on listing approval)
create table public.seo_pages (
  id               uuid primary key default uuid_generate_v4(),
  listing_id       uuid not null references public.listings(id) on delete cascade unique,
  title            text not null,
  meta_description text,
  og_image_url     text,
  keywords         text[],
  structured_data  jsonb,   -- full schema.org JSON-LD object
  canonical_url    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Tracks every category × city combination that has at least 1 live listing
-- Used for sitemap generation and ISR revalidation triggers
create table public.seo_location_pages (
  id               uuid primary key default uuid_generate_v4(),
  industry_id      uuid not null references public.industries(id),
  category_id      uuid not null references public.categories(id),
  city             text not null,
  state            text not null,
  slug             text not null unique,   -- e.g. "catering-kuala-lumpur"
  page_title       text not null,
  meta_description text,
  listing_count    integer not null default 0,
  last_updated     timestamptz not null default now(),
  unique (category_id, city)
);

-- ============================================================
-- FUTURE REVENUE LAYER
-- Tables are schema-ready but not used in MVP code
-- ============================================================

-- Paid placement at top of category/city pages (V2)
create table public.featured_placements (
  id              uuid primary key default uuid_generate_v4(),
  listing_id      uuid not null references public.listings(id) on delete cascade,
  placement_type  text not null,   -- 'category_top' | 'city_top' | 'homepage'
  category_id     uuid references public.categories(id),
  city            text,
  start_date      date not null,
  end_date        date not null,
  amount_paid     numeric(10, 2),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Consumer contact form submissions per listing (V2)
create table public.leads (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  name        text not null,
  phone       text,
  email       text,
  message     text,
  source      text,   -- 'listing_page' | 'category_page' | 'direct'
  created_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Listings — most common query patterns
create index idx_listings_status           on public.listings(status);
create index idx_listings_user_id          on public.listings(user_id);
create index idx_listings_business_profile on public.listings(business_profile_id);
create index idx_listings_live             on public.listings(status, live_at desc)
  where status = 'live';

-- Business profiles
create index idx_profiles_user_id          on public.business_profiles(user_id);
create index idx_profiles_industry_id      on public.business_profiles(industry_id);
create index idx_profiles_category_id      on public.business_profiles(category_id);
create index idx_profiles_city_state       on public.business_profiles(city, state);
-- Trigram index for fuzzy business name search
create index idx_profiles_name_trgm        on public.business_profiles
  using gin (name gin_trgm_ops);

-- Payments
create index idx_payments_listing_id       on public.payments(listing_id);
create index idx_payments_status           on public.payments(status);
create index idx_payments_reference_code   on public.payments(reference_code)
  where reference_code is not null;

-- Status history
create index idx_status_history_listing_id on public.listing_status_history(listing_id);
create index idx_status_history_created_at on public.listing_status_history(created_at desc);

-- Taxonomy
create index idx_categories_industry_id     on public.categories(industry_id);
create index idx_subcategories_category_id  on public.subcategories(category_id);
create index idx_attr_defs_industry_id      on public.attribute_definitions(industry_id);
create index idx_attr_defs_category_id      on public.attribute_definitions(category_id);

-- SEO
create index idx_seo_location_category_city on public.seo_location_pages(category_id, city);
create index idx_seo_pages_listing_id        on public.seo_pages(listing_id);

-- Subscriptions
create index idx_subscriptions_listing_id   on public.subscriptions(listing_id);
create index idx_subscriptions_period_end   on public.subscriptions(current_period_end)
  where status = 'active';

-- ============================================================
-- TRIGGERS
-- ============================================================

-- updated_at auto-maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_updated_at_listings
  before update on public.listings
  for each row execute procedure public.set_updated_at();

create trigger trg_updated_at_business_profiles
  before update on public.business_profiles
  for each row execute procedure public.set_updated_at();

create trigger trg_updated_at_subscriptions
  before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

create trigger trg_updated_at_seo_pages
  before update on public.seo_pages
  for each row execute procedure public.set_updated_at();

-- Auto-log every listing status transition to listing_status_history
-- Note: actor_id and reason must be set by the calling function via session variables
--       or updated post-insert when context is known. For MVP, 'system' is the fallback.
create or replace function public.log_listing_status_change()
returns trigger
language plpgsql
security definer
as $$
begin
  if old.status is distinct from new.status then
    insert into public.listing_status_history (
      listing_id,
      from_status,
      to_status,
      triggered_by
    ) values (
      new.id,
      old.status,
      new.status,
      'system'   -- API routes update this row afterwards with the real actor
    );
  end if;
  return new;
end;
$$;

create trigger trg_log_listing_status
  after update on public.listings
  for each row
  when (old.status is distinct from new.status)
  execute procedure public.log_listing_status_change();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.industries             enable row level security;
alter table public.categories             enable row level security;
alter table public.subcategories          enable row level security;
alter table public.attribute_definitions  enable row level security;
alter table public.users                  enable row level security;
alter table public.packages               enable row level security;
alter table public.business_profiles      enable row level security;
alter table public.service_areas          enable row level security;
alter table public.listings               enable row level security;
alter table public.listing_status_history enable row level security;
alter table public.payments               enable row level security;
alter table public.payment_proofs         enable row level security;
alter table public.subscriptions          enable row level security;
alter table public.listing_reviews        enable row level security;
alter table public.admin_notes            enable row level security;
alter table public.email_logs             enable row level security;
alter table public.seo_pages              enable row level security;
alter table public.seo_location_pages     enable row level security;
alter table public.featured_placements    enable row level security;
alter table public.leads                  enable row level security;

-- Helper: check if current user is admin (avoids repeated subquery)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── Taxonomy — public read, admin write ──────────────────────────────────────

create policy "industries_public_read"    on public.industries for select using (true);
create policy "categories_public_read"    on public.categories for select using (true);
create policy "subcategories_public_read" on public.subcategories for select using (true);
create policy "attr_defs_public_read"     on public.attribute_definitions for select using (true);

create policy "industries_admin_all"    on public.industries    for all using (public.is_admin());
create policy "categories_admin_all"    on public.categories    for all using (public.is_admin());
create policy "subcategories_admin_all" on public.subcategories for all using (public.is_admin());
create policy "attr_defs_admin_all"     on public.attribute_definitions for all using (public.is_admin());

-- ── Users — own row, admin sees all ──────────────────────────────────────────

create policy "users_own_read_update"   on public.users
  for all using (auth.uid() = id);
create policy "users_admin_all"         on public.users
  for all using (public.is_admin());

-- ── Packages — public read ────────────────────────────────────────────────────

create policy "packages_public_read"    on public.packages for select using (is_active = true);
create policy "packages_admin_all"      on public.packages for all using (public.is_admin());

-- ── Business profiles — owner and admin ──────────────────────────────────────

create policy "profiles_owner_all"      on public.business_profiles
  for all using (auth.uid() = user_id);
create policy "profiles_admin_all"      on public.business_profiles
  for all using (public.is_admin());
-- Public can see profiles of live listings (for listing page queries)
create policy "profiles_public_live"    on public.business_profiles
  for select using (
    exists (
      select 1 from public.listings l
      where l.business_profile_id = id and l.status = 'live'
    )
  );

-- ── Listings — owner, admin, and public (live only) ──────────────────────────

create policy "listings_owner_all"      on public.listings
  for all using (auth.uid() = user_id);
create policy "listings_admin_all"      on public.listings
  for all using (public.is_admin());
create policy "listings_public_live"    on public.listings
  for select using (status = 'live');

-- ── Status history — owner read, admin all ───────────────────────────────────

create policy "status_history_owner_read" on public.listing_status_history
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );
create policy "status_history_admin_all"  on public.listing_status_history
  for all using (public.is_admin());

-- ── Service areas — same as listings ─────────────────────────────────────────

create policy "service_areas_owner_all" on public.service_areas
  for all using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );
create policy "service_areas_admin_all" on public.service_areas
  for all using (public.is_admin());
create policy "service_areas_public_live" on public.service_areas
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'live'
    )
  );

-- ── Payments — owner, admin ───────────────────────────────────────────────────

create policy "payments_owner_all"      on public.payments
  for all using (auth.uid() = user_id);
create policy "payments_admin_all"      on public.payments
  for all using (public.is_admin());

-- ── Payment proofs — owner, admin ────────────────────────────────────────────

create policy "proofs_owner_all"        on public.payment_proofs
  for all using (
    exists (
      select 1 from public.payments p
      where p.id = payment_id and p.user_id = auth.uid()
    )
  );
create policy "proofs_admin_all"        on public.payment_proofs
  for all using (public.is_admin());

-- ── Subscriptions — owner read, admin all ────────────────────────────────────

create policy "subs_owner_read"         on public.subscriptions
  for select using (auth.uid() = user_id);
create policy "subs_admin_all"          on public.subscriptions
  for all using (public.is_admin());

-- ── Admin-only tables ─────────────────────────────────────────────────────────

create policy "listing_reviews_admin_all" on public.listing_reviews
  for all using (public.is_admin());
create policy "admin_notes_admin_all"     on public.admin_notes
  for all using (public.is_admin());
create policy "email_logs_admin_all"      on public.email_logs
  for all using (public.is_admin());

-- Owner can read their own listing review outcomes (e.g. rejection reason display)
create policy "listing_reviews_owner_read" on public.listing_reviews
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );

-- ── SEO — public read, admin write ───────────────────────────────────────────

create policy "seo_pages_public_read"           on public.seo_pages
  for select using (true);
create policy "seo_pages_admin_all"             on public.seo_pages
  for all using (public.is_admin());
create policy "seo_location_pages_public_read"  on public.seo_location_pages
  for select using (true);
create policy "seo_location_pages_admin_all"    on public.seo_location_pages
  for all using (public.is_admin());

-- ── Future tables ─────────────────────────────────────────────────────────────

create policy "featured_placements_public_read" on public.featured_placements
  for select using (is_active = true);
create policy "featured_placements_admin_all"   on public.featured_placements
  for all using (public.is_admin());

create policy "leads_owner_read"                on public.leads
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );
create policy "leads_admin_all"                 on public.leads
  for all using (public.is_admin());

-- ============================================================
-- SEED DATA — F&B Launch Vertical
-- ============================================================

-- F&B Industry
insert into public.industries (name, slug, description, icon, launch_phase, is_active, sort_order)
values (
  'Food & Beverage', 'fnb',
  'Restaurants, cafés, catering, bakeries, and all food businesses',
  '🍽️', 'active', true, 1
);

-- F&B Categories
with fnb as (select id from public.industries where slug = 'fnb')
insert into public.categories (industry_id, name, slug, description, icon, sort_order)
select
  fnb.id, cat.name, cat.slug, cat.description, cat.icon, cat.sort_order
from fnb,
(values
  ('Restaurant',    'restaurant',    'Full-service dining establishments',              '🍴', 1),
  ('Café',          'cafe',          'Coffee shops and casual dining',                  '☕', 2),
  ('Catering',      'catering',      'Event and corporate catering services',           '🎪', 3),
  ('Bakery',        'bakery',        'Artisan breads, pastries, and baked goods',       '🥐', 4),
  ('Food Truck',    'food-truck',    'Mobile food vendors and trucks',                  '🚚', 5),
  ('Hawker / Stall','hawker',        'Hawker centres, night markets, and food stalls',  '🏪', 6),
  ('Cloud Kitchen', 'cloud-kitchen', 'Delivery-only virtual restaurants',              '📦', 7)
) as cat(name, slug, description, icon, sort_order);

-- Subcategories for Restaurant
with rest as (select id from public.categories where slug = 'restaurant')
insert into public.subcategories (category_id, name, slug, sort_order)
select rest.id, sub.name, sub.slug, sub.sort_order
from rest,
(values
  ('Malay Cuisine',     'malay-cuisine',    1),
  ('Chinese Cuisine',   'chinese-cuisine',  2),
  ('Indian Cuisine',    'indian-cuisine',   3),
  ('Western',           'western',          4),
  ('Japanese',          'japanese',         5),
  ('Korean',            'korean',           6),
  ('Middle Eastern',    'middle-eastern',   7),
  ('Fusion',            'fusion',           8),
  ('Vegetarian / Vegan','vegetarian-vegan', 9)
) as sub(name, slug, sort_order);

-- Subcategories for Catering
with cat as (select id from public.categories where slug = 'catering')
insert into public.subcategories (category_id, name, slug, sort_order)
select cat.id, sub.name, sub.slug, sub.sort_order
from cat,
(values
  ('Corporate Events',  'corporate-events',  1),
  ('Weddings',          'weddings',          2),
  ('Private Parties',   'private-parties',   3),
  ('School / Institution','school-institution',4),
  ('Buffet Setup',      'buffet-setup',      5)
) as sub(name, slug, sort_order);

-- Attribute Definitions — F&B wide (halal applies to all F&B categories)
with fnb as (select id from public.industries where slug = 'fnb')
insert into public.attribute_definitions
  (industry_id, category_id, key, label, field_type, options, is_required, display_order)
select
  fnb.id, null, attr.key, attr.label, attr.field_type::attribute_field_type,
  attr.options::jsonb, attr.is_required, attr.display_order
from fnb,
(values
  ('halal_certified',    'Halal Certified?',          'boolean',    null,                                                                            true,  1),
  ('delivery_available', 'Delivery Available?',        'boolean',    null,                                                                            false, 2),
  ('dine_in_available',  'Dine-in Available?',         'boolean',    null,                                                                            false, 3),
  ('price_range',        'Price Range',                'select',     '[{"value":"$","label":"$ — Budget"},{"value":"$$","label":"$$ — Mid-range"},{"value":"$$$","label":"$$$ — Premium"}]', false, 4),
  ('grab_food_url',      'GrabFood / Foodpanda URL',   'url',        null,                                                                            false, 5)
) as attr(key, label, field_type, options, is_required, display_order);

-- Attribute Definitions — Catering specific (min/max pax)
with catering_cat as (select id from public.categories where slug = 'catering')
insert into public.attribute_definitions
  (industry_id, category_id, key, label, field_type, options, is_required, display_order)
select
  null, catering_cat.id, attr.key, attr.label, attr.field_type::attribute_field_type,
  attr.options::jsonb, attr.is_required, attr.display_order
from catering_cat,
(values
  ('min_pax',         'Minimum Pax',          'number', null, false, 10),
  ('max_pax',         'Maximum Pax',          'number', null, false, 11),
  ('event_types',     'Event Types Served',   'multiselect',
   '[{"value":"corporate","label":"Corporate"},{"value":"wedding","label":"Wedding"},{"value":"birthday","label":"Birthday"},{"value":"school","label":"School / Institution"},{"value":"buffet","label":"Buffet Setup"}]',
   false, 12)
) as attr(key, label, field_type, options, is_required, display_order);

-- Placeholder industries for future phases (visible as "Coming Soon")
insert into public.industries (name, slug, description, icon, launch_phase, is_active, sort_order)
values
  ('Healthcare',            'healthcare', 'Clinics, specialists, dental, pharmacy', '🏥', 'coming_soon', false, 2),
  ('Beauty & Wellness',     'beauty',     'Salons, spas, barbershops',              '💇', 'coming_soon', false, 3),
  ('Professional Services', 'professional','Legal, accounting, consulting',         '💼', 'roadmap',     false, 4),
  ('Retail',                'retail',     'Shops, boutiques, stores',               '🛍️', 'roadmap',     false, 5);
