import type { MetadataRoute } from "next";
import { getLiveListings } from "@/lib/seed-data";
import { ALL_CATEGORIES_STATIC } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rankmybiz.ai";
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/listings`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Live listing detail pages
  const listings = getLiveListings();
  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${baseUrl}/listings/${l.slug}`,
    lastModified: l.live_at ?? now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Category × city pages — generate for every listing's unique category+city combo
  const categoryCity = new Set<string>();
  for (const l of listings) {
    const citySlug = l.city.toLowerCase().replace(/\s+/g, "-");
    categoryCity.add(`${l.categorySlug}/${citySlug}`);
  }
  const categoryCityPages: MetadataRoute.Sitemap = Array.from(categoryCity).map(
    (path) => ({
      url: `${baseUrl}/${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...listingPages, ...categoryCityPages];
}
