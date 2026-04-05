import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/app/components/ui/StatusBadge";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ALL_CATEGORIES_STATIC, MY_STATES, PLATFORM_INDUSTRIES } from "@/lib/constants";
import { getFilteredListings } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "Business Listings — Verified Malaysian Businesses",
  description:
    "Browse verified business listings across Malaysia. Find trusted F&B, renovation, and service providers — all verified by RankMyBiz.",
  alternates: { canonical: "/listings" },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ListingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryFilter = (params?.category as string) ?? "";
  const stateFilter = (params?.state as string) ?? "";
  const industryFilter = (params?.industry as string) ?? "";

  const filtered = getFilteredListings({
    category: categoryFilter || undefined,
    state: stateFilter || undefined,
    industry: industryFilter || undefined,
  });

  // Group categories by industry for the sidebar
  const activeIndustries = PLATFORM_INDUSTRIES.filter((i) => i.phase === "active");

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 pt-[73px]">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 pt-3 pb-6">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Business Listings" }]} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Business Listings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Verified businesses across Malaysia
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sticky top-6">
              {/* Industry filter */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Industry
              </p>
              <div className="flex flex-col gap-1 mb-5">
                <FilterLink
                  href="/listings"
                  label="All Industries"
                  active={!industryFilter && !categoryFilter}
                />
                {activeIndustries.map((ind) => (
                  <FilterLink
                    key={ind.slug}
                    href={`/listings?industry=${ind.slug}`}
                    label={`${ind.icon} ${ind.name}`}
                    active={industryFilter === ind.slug}
                  />
                ))}
              </div>

              {/* Category filter */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Category
              </p>
              <div className="flex flex-col gap-1 mb-5">
                {ALL_CATEGORIES_STATIC
                  .filter((c) => !industryFilter || c.industry === industryFilter)
                  .map((cat) => (
                    <FilterLink
                      key={cat.slug}
                      href={`/listings?category=${cat.slug}${stateFilter ? `&state=${stateFilter}` : ""}`}
                      label={cat.label}
                      active={categoryFilter === cat.slug}
                    />
                  ))}
              </div>

              {/* State filter */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                State
              </p>
              <div className="flex flex-col gap-1">
                <FilterLink
                  href="/listings"
                  label="All States"
                  active={!stateFilter && !categoryFilter && !industryFilter}
                />
                {MY_STATES.slice(0, 8).map(({ value, label }) => (
                  <FilterLink
                    key={value}
                    href={`/listings?state=${value}${categoryFilter ? `&category=${categoryFilter}` : ""}${industryFilter ? `&industry=${industryFilter}` : ""}`}
                    label={label}
                    active={stateFilter === value}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
                <p className="text-slate-400 text-sm">
                  No listings found for this filter.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-slate-400 font-medium">
                  {filtered.length} business{filtered.length !== 1 ? "es" : ""} found
                </p>
                {filtered.map((l) => {
                  const catMeta = ALL_CATEGORIES_STATIC.find(
                    (c) => c.slug === l.categorySlug
                  );
                  const isHalal = l.custom_attributes.halal_certified === true;
                  const minPax = l.custom_attributes.min_pax as number | null;
                  const isCidb = l.custom_attributes.cidb_registered === true;

                  return (
                    <Link
                      key={l.id}
                      href={`/listings/${l.slug}`}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-brand/30 hover:shadow-md transition-all block group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                          <span className="text-xl">{catMeta?.icon ?? "📋"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="font-semibold text-slate-900 group-hover:text-brand transition-colors">
                              {l.name}
                            </h2>
                            <StatusBadge status="live" showDot={false} />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {l.category} · {l.city}, {l.state}
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
                            {l.package_name === "Pro" && (
                              <span className="bg-accent/10 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-lg text-sm transition-colors",
        active
          ? "bg-brand-light text-brand font-semibold"
          : "text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
