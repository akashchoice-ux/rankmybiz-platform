import type { ListingStatus, Package, LaunchPhase } from "@/types";

// ============================================================
// RankMyBiz — Application Constants
//
// What lives here:
//   - UI display config (status labels, colors)
//   - Package definitions (static until Stripe is wired)
//   - Platform config (bank details, Malaysian states)
//   - Submission form step config
//   - F&B seed config (for reference / fallback rendering)
//
// What does NOT live here:
//   - Category/subcategory lists → fetched from Supabase
//   - Attribute definitions → fetched from Supabase
//   - Industry metadata → fetched from Supabase
// ============================================================

// ─── Listing Status Display Config ────────────────────────────────────────────
// Generic — works for any industry. Labels are SME-facing.

export const LISTING_STATUS_CONFIG: Record<
  ListingStatus,
  {
    label: string;
    description: string;  // shown to SME in dashboard
    adminLabel: string;   // shown in admin panel (can be more technical)
    color: string;        // text color Tailwind class
    bgColor: string;      // background Tailwind class
    dotColor: string;     // for animated dot indicators
  }
> = {
  draft: {
    label: "Draft",
    description: "Your listing is saved but not yet submitted.",
    adminLabel: "Draft",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    dotColor: "bg-slate-400",
  },
  pending_payment: {
    label: "Awaiting Payment",
    description: "Complete your payment to submit your listing for review.",
    adminLabel: "Pending Payment",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    dotColor: "bg-orange-400",
  },
  pending_review: {
    label: "Under Review",
    description: "Our team is reviewing your listing. We'll notify you within 24–48 hours.",
    adminLabel: "Pending Review",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    dotColor: "bg-violet-400",
  },
  live: {
    label: "Live",
    description: "Your listing is live and visible to customers.",
    adminLabel: "Live",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    dotColor: "bg-emerald-500",
  },
  rejected: {
    label: "Not Approved",
    description: "Your listing was not approved. Review the reason below and resubmit.",
    adminLabel: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-50",
    dotColor: "bg-red-400",
  },
  suspended: {
    label: "Suspended",
    description: "Your listing has been temporarily suspended. Contact support for help.",
    adminLabel: "Suspended",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    dotColor: "bg-slate-400",
  },
};

// ─── Status groups for admin filtering ───────────────────────────────────────

export const ADMIN_STATUS_GROUPS = {
  needsAction: ["pending_payment", "pending_review"] as ListingStatus[],
  paymentQueue: ["pending_payment"] as ListingStatus[],  // bank transfer proofs pending verification
  reviewQueue: ["pending_review"] as ListingStatus[],
  live: ["live"] as ListingStatus[],
  inactive: ["rejected", "suspended", "draft"] as ListingStatus[],
} as const;

// ─── Packages ─────────────────────────────────────────────────────────────────
// Industry-agnostic — features describe platform capabilities, not F&B specifics.
// These should eventually be fetched from Supabase packages table.
// Kept here as static fallback and for pricing page rendering before DB is wired.

export const PACKAGES: Package[] = [
  {
    id: "pkg_starter",
    name: "Starter",
    slug: "starter",
    price: 99,
    billing_cycle: "monthly",
    description: "For local businesses taking their first step online.",
    features: [
      "1 verified business listing",
      "Google Maps profile optimisation",
      "Automated review requests (50/month)",
      "Basic performance dashboard",
      "Email support",
    ],
    is_popular: false,
    is_active: true,
    sort_order: 1,
    stripe_price_id: null,
    created_at: "",
  },
  {
    id: "pkg_growth",
    name: "Growth",
    slug: "growth",
    price: 199,
    billing_cycle: "monthly",
    description: "For businesses serious about dominating local search.",
    features: [
      "1 verified business listing",
      "Full local SEO optimisation",
      "Automated review requests (unlimited)",
      "Advanced analytics + competitor tracking",
      "WhatsApp integration",
      "Priority search placement",
      "Priority email + chat support",
    ],
    is_popular: true,
    is_active: true,
    sort_order: 2,
    stripe_price_id: null,
    created_at: "",
  },
  {
    id: "pkg_pro",
    name: "Pro",
    slug: "pro",
    price: 399,
    billing_cycle: "monthly",
    description: "Full-service for operators managing multiple locations.",
    features: [
      "Up to 3 verified business listings",
      "Full local SEO optimisation",
      "Automated review requests (unlimited)",
      "Dedicated SEO landing pages per listing",
      "Lead capture forms",
      "Monthly performance reports",
      "Dedicated account manager",
      "Phone + WhatsApp support",
    ],
    is_popular: false,
    is_active: true,
    sort_order: 3,
    stripe_price_id: null,
    created_at: "",
  },
];

// ─── Malaysian States ─────────────────────────────────────────────────────────

export const MY_STATES: { value: string; label: string }[] = [
  { value: "Johor", label: "Johor" },
  { value: "Kedah", label: "Kedah" },
  { value: "Kelantan", label: "Kelantan" },
  { value: "Kuala Lumpur", label: "Kuala Lumpur" },
  { value: "Labuan", label: "Labuan" },
  { value: "Melaka", label: "Melaka" },
  { value: "Negeri Sembilan", label: "Negeri Sembilan" },
  { value: "Pahang", label: "Pahang" },
  { value: "Perak", label: "Perak" },
  { value: "Perlis", label: "Perlis" },
  { value: "Pulau Pinang", label: "Pulau Pinang" },
  { value: "Putrajaya", label: "Putrajaya" },
  { value: "Sabah", label: "Sabah" },
  { value: "Sarawak", label: "Sarawak" },
  { value: "Selangor", label: "Selangor" },
  { value: "Terengganu", label: "Terengganu" },
];

// ─── Bank Transfer Details ────────────────────────────────────────────────────

export const BANK_TRANSFER_DETAILS = {
  bank_name: "Maybank",
  account_name: "RankMyBiz Sdn Bhd",
  account_number: "5621 2345 6789",
  swift_code: "MBBEMYKL",
  reference_prefix: "RMB",
} as const;

// ─── Submission Form Steps ────────────────────────────────────────────────────
// Multi-industry aware — Step 0 is now industry/category selection

export const SUBMISSION_STEPS = [
  {
    step: 0,
    title: "Business Type",
    description: "What kind of business are you?",
    fields: ["industry_id", "category_id", "subcategory_id"],
  },
  {
    step: 1,
    title: "Business Details",
    description: "Tell us about your business",
    fields: ["name", "description", "phone", "email", "whatsapp", "custom_attributes"],
  },
  {
    step: 2,
    title: "Location",
    description: "Where are you based?",
    fields: ["address", "city", "state", "postcode"],
  },
  {
    step: 3,
    title: "Online Presence",
    description: "Your digital footprint",
    fields: ["website", "google_business_url", "service_areas"],
  },
  {
    step: 4,
    title: "Choose Plan",
    description: "Select the right plan for you",
    fields: ["package_id"],
  },
  {
    step: 5,
    title: "Review & Submit",
    description: "Confirm your details",
    fields: [],
  },
] as const;

export const TOTAL_SUBMISSION_STEPS = SUBMISSION_STEPS.length;

// ─── Platform Industries Config ────────────────────────────────────────────────
// Static config for rendering the industry grid on homepage / registration.
// The canonical data lives in Supabase — this is a UI-layer reference only.
// Keep in sync with the seed data in supabase/schema.sql.

export const PLATFORM_INDUSTRIES: {
  slug: string;
  name: string;
  icon: string;
  phase: LaunchPhase;
  tagline: string;
}[] = [
  {
    slug: "fnb",
    name: "Food & Beverage",
    icon: "🍽️",
    phase: "active",
    tagline: "Restaurants, cafés, catering, bakeries",
  },
  {
    slug: "renovation",
    name: "Renovation",
    icon: "🔨",
    phase: "active",
    tagline: "Contractors, electrical, plumbing, interior design",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    phase: "coming_soon",
    tagline: "Clinics, specialists, dental, pharmacy",
  },
  {
    slug: "beauty",
    name: "Beauty & Wellness",
    icon: "💇",
    phase: "coming_soon",
    tagline: "Salons, spas, barbershops, wellness studios",
  },
  {
    slug: "professional",
    name: "Professional Services",
    icon: "💼",
    phase: "roadmap",
    tagline: "Legal, accounting, consulting, finance",
  },
  {
    slug: "retail",
    name: "Retail",
    icon: "🛍️",
    phase: "roadmap",
    tagline: "Shops, boutiques, specialty stores",
  },
];

// ─── F&B Seed Reference ───────────────────────────────────────────────────────
// Static reference for UI that loads before Supabase data is available.
// Matches the seed data in supabase/schema.sql exactly.
// Used as a fallback; real data should always come from DB queries.

export const FNB_CATEGORIES_STATIC = [
  { slug: "restaurant",    label: "Restaurant",     icon: "🍴" },
  { slug: "cafe",          label: "Café",           icon: "☕" },
  { slug: "catering",      label: "Catering",       icon: "🎪" },
  { slug: "bakery",        label: "Bakery",         icon: "🥐" },
  { slug: "food-truck",    label: "Food Truck",     icon: "🚚" },
  { slug: "hawker",        label: "Hawker / Stall", icon: "🏪" },
  { slug: "cloud-kitchen", label: "Cloud Kitchen",  icon: "📦" },
] as const;

export const RENOVATION_CATEGORIES_STATIC = [
  { slug: "shoplot-renovation", label: "Shoplot Renovation", icon: "🏗️" },
  { slug: "electrical",         label: "Electrical",         icon: "⚡" },
  { slug: "plumbing",           label: "Plumbing",           icon: "🔧" },
  { slug: "interior-design",    label: "Interior Design",    icon: "🎨" },
  { slug: "general-contractor", label: "General Contractor", icon: "🏠" },
  { slug: "painting",           label: "Painting",           icon: "🖌️" },
] as const;

/**
 * All categories across all active industries, flattened.
 * Used for directory filtering, SEO page validation, etc.
 */
export const ALL_CATEGORIES_STATIC = [
  ...FNB_CATEGORIES_STATIC.map((c) => ({ ...c, industry: "fnb" as const })),
  ...RENOVATION_CATEGORIES_STATIC.map((c) => ({ ...c, industry: "renovation" as const })),
];

// ─── SEO Helpers ──────────────────────────────────────────────────────────────

/**
 * Generates a SEO-friendly page title for category × city pages.
 * Example: "Best Catering Services in Kuala Lumpur | RankMyBiz"
 */
export function buildCategoryPageTitle(categoryName: string, city: string): string {
  return `Best ${categoryName} in ${city} | RankMyBiz`;
}

/**
 * Generates a meta description for category × city pages.
 * Example: "Find top Catering businesses in Kuala Lumpur..."
 */
export function buildCategoryPageDescription(
  categoryName: string,
  city: string,
  count: number
): string {
  return `Find trusted ${categoryName.toLowerCase()} businesses in ${city}. ${count} verified provider${count !== 1 ? "s" : ""} — compare, review, and get a quote.`;
}

/**
 * Generates a SEO slug for a location page.
 * Example: ("catering", "Kuala Lumpur") → "catering-kuala-lumpur"
 */
export function buildLocationSlug(categorySlug: string, city: string): string {
  return `${categorySlug}-${city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
}

/**
 * Generates a unique bank transfer reference code.
 * Format: RMB-YYYYMM-{6 random uppercase alphanumeric chars}
 * Example: RMB-202604-A3BX9K
 */
export function generateReferenceCode(): string {
  const date = new Date();
  const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  const random = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${BANK_TRANSFER_DETAILS.reference_prefix}-${yyyymm}-${random}`;
}
