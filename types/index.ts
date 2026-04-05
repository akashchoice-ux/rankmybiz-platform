// ============================================================
// RankMyBiz — Core TypeScript Types
// These mirror the Supabase schema exactly.
// All enums match the Postgres enum values.
// ============================================================

// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = "sme" | "admin";

/**
 * Listing lifecycle states.
 *
 * State machine:
 *   draft → pending_payment             (form submitted)
 *   pending_payment → pending_review    (payment confirmed — Stripe webhook OR admin confirms bank transfer)
 *   pending_review → live               (admin approves)
 *   pending_review → rejected           (admin rejects with reason)
 *   rejected → pending_review           (SME edits and resubmits — no new payment required)
 *   live → suspended                    (admin suspends)
 *   suspended → live                    (admin reinstates)
 */
export type ListingStatus =
  | "draft"
  | "pending_payment"
  | "pending_review"
  | "live"
  | "rejected"
  | "suspended";

export type StatusTrigger = "user" | "system" | "admin";

export type PaymentMethod = "stripe" | "bank_transfer";

/**
 * Payment lifecycle.
 *
 * unpaid               : record created, not yet paid
 * pending_verification : bank transfer proof uploaded, admin must confirm
 * paid                 : confirmed (Stripe webhook or admin manual confirm)
 * failed               : Stripe payment failed / proof rejected
 * refunded             : payment reversed
 */
export type PaymentStatus =
  | "unpaid"
  | "pending_verification"
  | "paid"
  | "failed"
  | "refunded";

export type BillingCycle = "monthly" | "yearly" | "one_time";

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete";

export type ReviewAction =
  | "approved"
  | "rejected"
  | "suspended"
  | "reinstated"
  | "payment_verified"
  | "payment_rejected";

export type AttributeFieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "multiselect"
  | "url"
  | "phone"
  | "email";

export type LaunchPhase = "active" | "coming_soon" | "roadmap";

export type EmailEvent =
  | "registration_welcome"
  | "submission_received"
  | "payment_confirmed"
  | "bank_proof_submitted"
  | "bank_proof_rejected"
  | "listing_approved"
  | "listing_rejected"
  | "listing_suspended"
  | "listing_reinstated";

// ─── Taxonomy Layer ───────────────────────────────────────────────────────────

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  launch_phase: LaunchPhase;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  industry_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  // Relations
  industry?: Industry;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface AttributeDefinition {
  id: string;
  industry_id: string | null;  // null = applies to all industries
  category_id: string | null;  // null = applies to whole industry
  key: string;                 // machine key: "halal_certified"
  label: string;               // display: "Halal Certified?"
  field_type: AttributeFieldType;
  options: SelectOption[] | null;  // for select/multiselect fields
  placeholder: string | null;
  hint: string | null;
  is_required: boolean;
  display_order: number;
}

// ─── User Layer ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Package Layer ────────────────────────────────────────────────────────────

export interface Package {
  id: string;
  name: string;
  slug: string;
  price: number;              // in MYR
  billing_cycle: BillingCycle;
  description: string | null;
  features: string[];         // stored as JSONB array in DB
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  stripe_price_id: string | null;
  created_at: string;
}

// ─── Business Profile Layer ───────────────────────────────────────────────────

/**
 * Custom attributes are dynamic per industry/category.
 * Values can be string, number, boolean, or array of strings (multiselect).
 * The shape is defined by AttributeDefinition rows for the selected category.
 *
 * Example for F&B catering:
 * {
 *   halal_certified: true,
 *   delivery_available: false,
 *   min_pax: 50,
 *   event_types: ["corporate", "wedding"]
 * }
 */
export type CustomAttributes = Record<string, string | number | boolean | string[] | null>;

export interface BusinessProfile {
  id: string;
  user_id: string;
  industry_id: string;
  category_id: string;
  subcategory_id: string | null;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  phone: string;
  email: string;
  whatsapp: string | null;
  website: string | null;
  google_business_url: string | null;
  address: string;
  city: string;
  state: string;
  postcode: string;
  custom_attributes: CustomAttributes;
  created_at: string;
  updated_at: string;
  // Relations (joined)
  industry?: Industry;
  category?: Category;
  subcategory?: Subcategory;
}

export interface ServiceArea {
  id: string;
  listing_id: string;
  state: string;
  city: string | null;
  is_national: boolean;
  created_at: string;
}

// ─── Listing Layer ────────────────────────────────────────────────────────────

export interface Listing {
  id: string;
  user_id: string;
  business_profile_id: string;
  package_id: string;
  status: ListingStatus;
  seo_slug: string | null;
  submitted_at: string | null;
  live_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  // Relations (joined)
  business_profile?: BusinessProfile;
  package?: Package;
  user?: User;
  payments?: Payment[];
  listing_reviews?: ListingReview[];
  admin_notes?: AdminNote[];
  service_areas?: ServiceArea[];
  seo_page?: SeoPage;
  subscription?: Subscription;
}

export interface ListingStatusHistory {
  id: string;
  listing_id: string;
  from_status: ListingStatus | null;  // null on initial creation
  to_status: ListingStatus;
  triggered_by: StatusTrigger;
  actor_id: string | null;            // null for system transitions
  reason: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  // Relations
  actor?: User;
}

// ─── Payment Layer ────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  listing_id: string;
  user_id: string;
  package_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;             // in MYR, always from packages.price
  currency: "MYR";
  // Stripe (null for bank transfer)
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  // Bank transfer (null for Stripe)
  reference_code: string | null;  // e.g. RMB-202604-A3BX9K
  paid_at: string | null;
  created_at: string;
  // Relations
  payment_proof?: PaymentProof;
}

export interface PaymentProof {
  id: string;
  payment_id: string;
  file_url: string;
  file_name: string | null;
  file_size_bytes: number | null;
  uploaded_at: string;
  verified_at: string | null;
  verified_by: string | null;     // admin user_id
  is_rejected: boolean;
  rejection_reason: string | null;
}

export interface Subscription {
  id: string;
  listing_id: string;
  user_id: string;
  package_id: string;
  payment_id: string | null;
  status: SubscriptionStatus;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Admin Layer ──────────────────────────────────────────────────────────────

export interface ListingReview {
  id: string;
  listing_id: string;
  reviewer_id: string;
  action: ReviewAction;
  notes: string | null;
  created_at: string;
  reviewer?: User;
}

export interface AdminNote {
  id: string;
  listing_id: string;
  admin_id: string;
  note: string;
  created_at: string;
  admin?: User;
}

export interface EmailLog {
  id: string;
  to_email: string;
  to_name: string | null;
  event: EmailEvent;
  listing_id: string | null;
  resend_id: string | null;
  status: "sent" | "failed";
  error: string | null;
  sent_at: string;
}

// ─── SEO Layer ────────────────────────────────────────────────────────────────

export interface SeoPage {
  id: string;
  listing_id: string;
  title: string;
  meta_description: string | null;
  og_image_url: string | null;
  keywords: string[] | null;
  structured_data: Record<string, unknown> | null;  // schema.org JSON-LD
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeoLocationPage {
  id: string;
  industry_id: string;
  category_id: string;
  city: string;
  state: string;
  slug: string;              // e.g. "catering-kuala-lumpur"
  page_title: string;
  meta_description: string | null;
  listing_count: number;
  last_updated: string;
  // Relations
  industry?: Industry;
  category?: Category;
}

// ─── Future Revenue Layer ─────────────────────────────────────────────────────

export interface FeaturedPlacement {
  id: string;
  listing_id: string;
  placement_type: "category_top" | "city_top" | "homepage";
  category_id: string | null;
  city: string | null;
  start_date: string;
  end_date: string;
  amount_paid: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  listing_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  source: "listing_page" | "category_page" | "direct" | null;
  created_at: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

/**
 * Multi-step submission form state.
 * Step 0: Industry selection
 * Step 1: Category + subcategory
 * Step 2: Business details + dynamic attributes
 * Step 3: Location
 * Step 4: Online presence + service areas
 * Step 5: Package selection
 * Step 6: Review + submit
 */
export interface SubmissionFormData {
  // Step 0: Industry
  industry_id: string;

  // Step 1: Type
  category_id: string;
  subcategory_id: string;

  // Step 2: Business details
  name: string;
  description: string;
  phone: string;
  email: string;
  whatsapp: string;
  logo_url: string;
  custom_attributes: CustomAttributes;

  // Step 3: Location
  address: string;
  city: string;
  state: string;
  postcode: string;

  // Step 4: Online presence
  website: string;
  google_business_url: string;
  service_areas: string[];        // array of state names

  // Step 5: Package
  package_id: string;
}

// ─── Dashboard / Admin Types ──────────────────────────────────────────────────

export interface AdminStats {
  total_listings: number;
  pending_review: number;
  pending_payment_verification: number;  // bank transfers awaiting admin confirm
  live: number;
  rejected: number;
  suspended: number;
  total_revenue_myr: number;
}

export interface DashboardListing {
  id: string;
  name: string;
  status: ListingStatus;
  package_name: string;
  industry_name: string;
  category_name: string;
  city: string;
  submitted_at: string | null;
  live_at: string | null;
}
