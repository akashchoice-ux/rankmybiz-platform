import Link from "next/link";
import { ALL_CATEGORIES_STATIC } from "@/lib/constants";
import { fetchLiveListings } from "@/lib/listings-db";

export default async function FeaturedListings() {
  const listings = (await fetchLiveListings()).slice(0, 6);

  if (listings.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Businesses already growing with RankMyBiz
          </h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Real businesses. Verified listings. No fake reviews.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => {
            const catMeta = ALL_CATEGORIES_STATIC.find(
              (c) => c.slug === l.category_slug
            );
            const attrs = l.custom_attributes as Record<string, unknown>;
            const isHalal = attrs.halal_certified === true;
            const isCidb = attrs.cidb_registered === true;

            return (
              <Link
                key={l.id}
                href={`/listings/${l.slug}`}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-brand/30 hover:shadow-sm transition-all group block"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100">
                    <span className="text-base">{catMeta?.icon ?? "📋"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm group-hover:text-brand transition-colors truncate">
                      {l.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {l.category} · {l.city}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {l.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {isHalal && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Halal
                    </span>
                  )}
                  {isCidb && (
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      CIDB
                    </span>
                  )}
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {l.state}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:underline"
          >
            View all listings
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
