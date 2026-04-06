import { createServerSupabaseClient } from "./supabase-server";

export interface DbListing {
  id: string;
  name: string;
  slug: string;
  industry: string;
  category: string;
  category_slug: string;
  description: string;
  phone: string;
  email: string;
  whatsapp: string | null;
  website: string | null;
  google_business_url: string | null;
  keywords: string | null;
  custom_attributes: Record<string, unknown>;
  address: string;
  city: string;
  state: string;
  postcode: string;
  service_areas: string[];
  package_id: string;
  package_name: string;
  status: string;
  live_at: string | null;
  submitted_at: string;
}

/** Fetch all live listings from Supabase. */
export async function fetchLiveListings(): Promise<DbListing[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "live")
      .order("live_at", { ascending: false });

    if (error) {
      console.error("Error fetching live listings:", error);
      return [];
    }
    return (data ?? []) as DbListing[];
  } catch {
    return [];
  }
}

/** Fetch a single listing by slug (only if live). */
export async function fetchListingBySlug(slug: string): Promise<DbListing | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .eq("status", "live")
      .single();

    if (error || !data) return null;
    return data as DbListing;
  } catch {
    return null;
  }
}

/** Fetch live listings for a category + city combination. */
export async function fetchListingsForCategoryCity(
  categorySlug: string,
  city: string
): Promise<DbListing[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "live")
      .eq("category_slug", categorySlug)
      .ilike("city", city.replace(/-/g, " "))
      .order("package_id", { ascending: false });

    if (error) {
      console.error("Error fetching category/city listings:", error);
      return [];
    }
    return (data ?? []) as DbListing[];
  } catch {
    return [];
  }
}

/** Fetch filtered live listings. */
export async function fetchFilteredListings(filters: {
  category?: string;
  state?: string;
  industry?: string;
}): Promise<DbListing[]> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("listings")
      .select("*")
      .eq("status", "live")
      .order("live_at", { ascending: false });

    if (filters.category) query = query.eq("category_slug", filters.category);
    if (filters.state) query = query.eq("state", filters.state);
    if (filters.industry) query = query.eq("industry", filters.industry);

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching filtered listings:", error);
      return [];
    }
    return (data ?? []) as DbListing[];
  } catch {
    return [];
  }
}

/** Fetch ALL listings for admin (all statuses). */
export async function fetchAllListingsForAdmin(): Promise<DbListing[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin listings:", error);
      return [];
    }
    return (data ?? []) as DbListing[];
  } catch {
    return [];
  }
}
