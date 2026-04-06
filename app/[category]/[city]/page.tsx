import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildCategoryPageTitle,
  buildCategoryPageDescription,
  ALL_CATEGORIES_STATIC,
} from "@/lib/constants";
import { fetchListingsForCategoryCity } from "@/lib/listings-db";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// ISR — revalidate when a listing in this category/city goes live or is removed
export const revalidate = 3600;

const VALID_CATEGORY_SLUGS = new Set<string>(
  ALL_CATEGORIES_STATIC.map((c) => c.slug)
);

function cityParamToLabel(cityParam: string): string {
  return cityParam
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getCategoryMeta(slug: string) {
  return ALL_CATEGORIES_STATIC.find((c) => c.slug === slug) ?? null;
}

type Props = {
  params: Promise<{ category: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, city } = await params;

  if (!VALID_CATEGORY_SLUGS.has(category)) return {};

  const catMeta = getCategoryMeta(category);
  const cityLabel = cityParamToLabel(city);
  const listings = await fetchListingsForCategoryCity(category, city);

  const title = buildCategoryPageTitle(catMeta?.label ?? category, cityLabel);
  const description = buildCategoryPageDescription(
    catMeta?.label ?? category,
    cityLabel,
    listings.length
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${category}/${city}`,
    },
    openGraph: { title, description, url: `/${category}/${city}`, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function CategoryCityPage({ params }: Props) {
  const { category, city } = await params;

  if (!VALID_CATEGORY_SLUGS.has(category)) notFound();

  const catMeta = getCategoryMeta(category);
  const cityLabel = cityParamToLabel(city);
  const listings = await fetchListingsForCategoryCity(category, city);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: buildCategoryPageTitle(catMeta?.label ?? category, cityLabel),
    description: buildCategoryPageDescription(
      catMeta?.label ?? category,
      cityLabel,
      listings.length
    ),
    url: `https://rankmybiz.ai/${category}/${city}`,
    numberOfItems: listings.length,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listings.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.name,
        url: `https://rankmybiz.ai/listings/${l.slug}`,
      })),
    },
  };

  // Related categories from the same industry
  const sameCatIndustry = catMeta?.industry;
  const relatedCats = ALL_CATEGORIES_STATIC
    .filter((c) => c.industry === sameCatIndustry && c.slug !== category)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-[73px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Listings", href: "/listings" },
                { label: catMeta?.label ?? category, href: `/listings?category=${category}` },
                { label: cityLabel },
              ]}
            />
          </div>
        </div>

        {/* Hero */}
        <div className="bg-white border-b border-slate-100 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{catMeta?.icon ?? "📋"}</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {catMeta?.label ?? category} in {cityLabel}
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  {listings.length > 0
                    ? `${listings.length} verified provider${listings.length !== 1 ? "s" : ""}`
                    : "Be the first to list here"}
                </p>
              </div>
            </div>
            {relatedCats.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {relatedCats.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/${city}`}
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    {c.icon} {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
              <p className="text-slate-400 text-sm mb-4">
                No verified {catMeta?.label.toLowerCase() ?? category} businesses
                found in {cityLabel} yet.
              </p>
              <Link
                href="/dashboard/submit"
                className="inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-dark transition-colors"
              >
                List Your Business →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {listings.map((l, idx) => {
                const isHalal = l.custom_attributes.halal_certified === true;
                const isCidb = l.custom_attributes.cidb_registered === true;
                const minPax = l.custom_attributes.min_pax as number | null;

                return (
                  <Link
                    key={l.id}
                    href={`/listings/${l.slug}`}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-brand/30 hover:shadow-md transition-all block group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0 text-brand font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-semibold text-slate-900 group-hover:text-brand transition-colors">
                            {l.name}
                          </h2>
                          {l.package_name === "Pro" && (
                            <span className="bg-accent/10 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {l.city}, {l.state}
                        </p>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {l.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {isHalal && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                              ✓ Halal
                            </span>
                          )}
                          {isCidb && (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                              CIDB Registered
                            </span>
                          )}
                          {minPax && (
                            <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
                              Min {minPax} pax
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              <div className="bg-brand-light border border-indigo-200 rounded-2xl p-5 mt-2">
                <p className="text-sm font-semibold text-brand mb-1">
                  Are you a {catMeta?.label.toLowerCase() ?? "business"} in {cityLabel}?
                </p>
                <p className="text-xs text-indigo-600 mb-3">
                  Get your business listed and found by local customers.
                </p>
                <Link
                  href="/dashboard/submit"
                  className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                >
                  List Your Business →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
