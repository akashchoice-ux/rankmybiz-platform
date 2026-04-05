import type { ListingStatus } from "@/types";

// ============================================================
// RankMyBiz — Listing Data
//
// PUBLIC listings: status = "live", is_demo = false
//   → shown on homepage, directory, category pages, sitemap
//   → ONLY add listings here with fully verified real details
//
// DEMO listings: is_demo = true
//   → used for admin panel testing and internal design checks
//   → NEVER shown on public pages, NEVER in sitemap
//
// Replace with Supabase queries once the database is wired.
// ============================================================

export interface SeedListing {
  id: string;
  slug: string;
  name: string;
  industry: string;
  category: string;
  categorySlug: string;
  city: string;
  state: string;
  address: string;
  postcode: string;
  description: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  website: string | null;
  google_business_url: string | null;
  logo_url: string | null;
  custom_attributes: Record<string, string | number | boolean | string[] | null>;
  service_areas: string[];
  package_id: string;
  package_name: string;
  status: ListingStatus;
  submitted_at: string;
  live_at: string | null;
  /** If true, this listing is for internal testing only — never shown publicly. */
  is_demo: boolean;
}

// ─── VERIFIED PUBLIC LISTINGS ────────────────────────────────────────────────
// Add real businesses here ONLY after confirming every detail with the owner.
// Set status = "live" and is_demo = false.
//
// To add Muhibbah F&B or Romax Build Works:
//   1. Get their real phone, WhatsApp, email, address, website, description
//   2. Update the placeholder entries below with real data
//   3. Change status from "draft" to "live"
//   4. They will immediately appear on all public pages and sitemap

const VERIFIED_LISTINGS: SeedListing[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // Muhibbah F&B Sdn Bhd — AWAITING REAL DETAILS
  // Status: draft (will not appear publicly until changed to "live")
  // TODO: Replace all placeholder values with verified real information
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "lst_001",
    slug: "muhibbah-fnb-catering-kuala-lumpur",
    name: "Muhibbah F&B Sdn Bhd",
    industry: "fnb",
    category: "Catering",
    categorySlug: "catering",
    city: "Kuala Lumpur",
    state: "Kuala Lumpur",
    address: "PLACEHOLDER — replace with real address",
    postcode: "50400",
    description:
      "PLACEHOLDER — replace with real description provided by the business owner.",
    phone: "PLACEHOLDER",
    whatsapp: null,
    email: "PLACEHOLDER@example.com",
    website: null,
    google_business_url: null,
    logo_url: null,
    custom_attributes: {
      halal_certified: true,
      delivery_available: true,
      price_range: "mid_range",
      min_pax: 50,
      max_pax: 2000,
    },
    service_areas: ["Kuala Lumpur", "Selangor"],
    package_id: "pkg_pro",
    package_name: "Pro",
    status: "draft", // ← change to "live" after verifying all details
    submitted_at: "2026-03-15T10:00:00Z",
    live_at: null,
    is_demo: false,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Romax Build Works — AWAITING REAL DETAILS
  // Status: draft (will not appear publicly until changed to "live")
  // TODO: Replace all placeholder values with verified real information
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "lst_002",
    slug: "romax-build-works-kajang",
    name: "Romax Build Works",
    industry: "renovation",
    category: "Shoplot Renovation",
    categorySlug: "shoplot-renovation",
    city: "Kajang",
    state: "Selangor",
    address: "PLACEHOLDER — replace with real address",
    postcode: "43000",
    description:
      "PLACEHOLDER — replace with real description provided by the business owner.",
    phone: "PLACEHOLDER",
    whatsapp: null,
    email: "PLACEHOLDER@example.com",
    website: null,
    google_business_url: null,
    logo_url: null,
    custom_attributes: {
      cidb_registered: true,
      license_grade: "G3",
      specialisation: ["shoplot-renovation", "electrical"],
    },
    service_areas: ["Selangor", "Kuala Lumpur"],
    package_id: "pkg_growth",
    package_name: "Growth",
    status: "draft", // ← change to "live" after verifying all details
    submitted_at: "2026-03-20T09:00:00Z",
    live_at: null,
    is_demo: false,
  },
];

// ─── DEMO LISTINGS (INTERNAL ONLY) ─────────────────────────────────────────
// These exist so admin panel, dashboard, and internal testing have data.
// They NEVER appear on public pages, directory, category pages, or sitemap.

const DEMO_LISTINGS: SeedListing[] = [
  {
    id: "demo_001",
    slug: "demo-warung-pak-ali",
    name: "Warung Pak Ali",
    industry: "fnb",
    category: "Restaurant",
    categorySlug: "restaurant",
    city: "Petaling Jaya",
    state: "Selangor",
    address: "Demo address",
    postcode: "47300",
    description: "Demo listing for internal testing. Traditional nasi campur restaurant.",
    phone: "+60 00-000 0000",
    whatsapp: null,
    email: "demo@rankmybiz.ai",
    website: null,
    google_business_url: null,
    logo_url: null,
    custom_attributes: { halal_certified: true, price_range: "budget" },
    service_areas: ["Selangor"],
    package_id: "pkg_starter",
    package_name: "Starter",
    status: "live",
    submitted_at: "2026-03-10T08:00:00Z",
    live_at: "2026-03-12T10:00:00Z",
    is_demo: true,
  },
  {
    id: "demo_002",
    slug: "demo-bean-there-coffee",
    name: "Bean There Coffee",
    industry: "fnb",
    category: "Café",
    categorySlug: "cafe",
    city: "Kuala Lumpur",
    state: "Kuala Lumpur",
    address: "Demo address",
    postcode: "59100",
    description: "Demo listing for internal testing. Specialty coffee house.",
    phone: "+60 00-000 0000",
    whatsapp: null,
    email: "demo@rankmybiz.ai",
    website: null,
    google_business_url: null,
    logo_url: null,
    custom_attributes: { halal_certified: false, price_range: "mid_range" },
    service_areas: ["Kuala Lumpur"],
    package_id: "pkg_growth",
    package_name: "Growth",
    status: "live",
    submitted_at: "2026-03-18T11:00:00Z",
    live_at: "2026-03-20T09:00:00Z",
    is_demo: true,
  },
  {
    id: "demo_003",
    slug: "demo-roti-segar-bakery",
    name: "Roti Segar Bakery",
    industry: "fnb",
    category: "Bakery",
    categorySlug: "bakery",
    city: "Shah Alam",
    state: "Selangor",
    address: "Demo address",
    postcode: "40000",
    description: "Demo listing for internal testing. Artisan bakery.",
    phone: "+60 00-000 0000",
    whatsapp: null,
    email: "demo@rankmybiz.ai",
    website: null,
    google_business_url: null,
    logo_url: null,
    custom_attributes: { halal_certified: true, price_range: "mid_range" },
    service_areas: ["Selangor"],
    package_id: "pkg_growth",
    package_name: "Growth",
    status: "pending_review",
    submitted_at: "2026-03-22T07:00:00Z",
    live_at: null,
    is_demo: true,
  },
  {
    id: "demo_004",
    slug: "demo-kl-electrical",
    name: "KL Electrical Services",
    industry: "renovation",
    category: "Electrical",
    categorySlug: "electrical",
    city: "Kuala Lumpur",
    state: "Kuala Lumpur",
    address: "Demo address",
    postcode: "51100",
    description: "Demo listing for internal testing. Licensed electrical contractor.",
    phone: "+60 00-000 0000",
    whatsapp: null,
    email: "demo@rankmybiz.ai",
    website: null,
    google_business_url: null,
    logo_url: null,
    custom_attributes: { cidb_registered: true, license_grade: "ST Wireman" },
    service_areas: ["Kuala Lumpur", "Selangor"],
    package_id: "pkg_starter",
    package_name: "Starter",
    status: "live",
    submitted_at: "2026-03-26T10:00:00Z",
    live_at: "2026-03-28T14:00:00Z",
    is_demo: true,
  },
  {
    id: "demo_005",
    slug: "demo-binaan-prima",
    name: "Binaan Prima Contractor",
    industry: "renovation",
    category: "General Contractor",
    categorySlug: "general-contractor",
    city: "Petaling Jaya",
    state: "Selangor",
    address: "Demo address",
    postcode: "46300",
    description: "Demo listing for internal testing. General renovation contractor.",
    phone: "+60 00-000 0000",
    whatsapp: null,
    email: "demo@rankmybiz.ai",
    website: null,
    google_business_url: null,
    logo_url: null,
    custom_attributes: { cidb_registered: true, license_grade: "G4" },
    service_areas: ["Selangor", "Kuala Lumpur"],
    package_id: "pkg_pro",
    package_name: "Pro",
    status: "pending_payment",
    submitted_at: "2026-03-19T09:00:00Z",
    live_at: null,
    is_demo: true,
  },
];

// ─── Combined (used only by admin pages) ────────────────────────────────────

export const SEED_LISTINGS: SeedListing[] = [
  ...VERIFIED_LISTINGS,
  ...DEMO_LISTINGS,
];

// ─── Public Helper Functions ────────────────────────────────────────────────
// These ONLY return verified, non-demo, live listings.

/** All verified live listings — safe for public pages and sitemap. */
export function getLiveListings(): SeedListing[] {
  return SEED_LISTINGS
    .filter((l) => l.status === "live" && !l.is_demo)
    .sort(
      (a, b) => new Date(b.live_at!).getTime() - new Date(a.live_at!).getTime()
    );
}

/** Get a verified listing by slug. Returns null for demo listings. */
export function getListingBySlug(slug: string): SeedListing | null {
  const listing = SEED_LISTINGS.find((l) => l.slug === slug);
  if (!listing || listing.is_demo) return null;
  return listing;
}

/** Verified live listings for a category × city page. */
export function getListingsForCategoryCity(
  categorySlug: string,
  cityParam: string
): SeedListing[] {
  return getLiveListings().filter(
    (l) =>
      l.categorySlug === categorySlug &&
      l.city.toLowerCase().replace(/\s+/g, "-") === cityParam.toLowerCase()
  );
}

/** Verified live listings matching optional filters. */
export function getFilteredListings(filters: {
  category?: string;
  state?: string;
  industry?: string;
}): SeedListing[] {
  return getLiveListings().filter((l) => {
    if (filters.category && l.categorySlug !== filters.category) return false;
    if (filters.state && l.state !== filters.state) return false;
    if (filters.industry && l.industry !== filters.industry) return false;
    return true;
  });
}

// ─── Admin Helper Functions ────────────────────────────────────────────────
// These include ALL listings (verified + demo) for admin dashboard testing.

/** All listings including demo — for admin panel only. */
export function getAllListingsForAdmin(): SeedListing[] {
  return SEED_LISTINGS;
}

/** Stats derived from ALL seed data (including demo) for admin dashboard. */
export function getAdminStats() {
  const all = SEED_LISTINGS;
  return {
    total_listings: all.length,
    pending_review: all.filter((l) => l.status === "pending_review").length,
    pending_payment_verification: all.filter((l) => l.status === "pending_payment").length,
    live: all.filter((l) => l.status === "live").length,
    rejected: all.filter((l) => l.status === "rejected").length,
    suspended: all.filter((l) => l.status === "suspended").length,
    total_revenue_myr: all
      .filter((l) => l.status === "live")
      .reduce((sum, l) => {
        const prices: Record<string, number> = {
          pkg_starter: 99,
          pkg_growth: 199,
          pkg_pro: 399,
        };
        return sum + (prices[l.package_id] ?? 0);
      }, 0),
  };
}
