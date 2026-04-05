import Link from "next/link";
import { PLATFORM_INDUSTRIES } from "@/lib/constants";
import { getLiveListings, type SeedListing } from "@/lib/seed-data";

const liveListings = getLiveListings();
const liveCount = liveListings.length;

export default function TrustSection() {
  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6">
        {/* Trust line */}
        <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mb-10">
          {liveCount > 0 && (
            <>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {liveCount} verified business{liveCount !== 1 ? "es" : ""} live
              </span>
              <span className="hidden sm:inline text-slate-200">|</span>
            </>
          )}
          <span className="hidden sm:inline">Multi-industry platform</span>
          <span className="hidden sm:inline text-slate-200">|</span>
          <span>Built in Malaysia, for Malaysia</span>
        </div>

        {/* Featured businesses — only shown if there are verified live listings */}
        {liveListings.length >= 2 && (
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <FeaturedCard listing={liveListings[0]} />
            <FeaturedCard listing={liveListings[1]} />
          </div>
        )}

        {liveListings.length === 1 && (
          <div className="max-w-md mx-auto mb-10">
            <FeaturedCard listing={liveListings[0]} />
          </div>
        )}

        {/* Platform launch message — shown when no verified listings yet */}
        {liveListings.length === 0 && (
          <div className="bg-brand-light border border-indigo-200 rounded-2xl p-6 text-center mb-10 max-w-lg mx-auto">
            <p className="text-sm font-semibold text-brand mb-1">
              Now accepting business listings
            </p>
            <p className="text-xs text-indigo-600">
              Be among the first verified businesses on RankMyBiz. Early
              listers get priority placement.
            </p>
          </div>
        )}

        {/* Industries */}
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Industries we serve
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PLATFORM_INDUSTRIES.map((ind) => {
              const isActive = ind.phase === "active";
              return (
                <span
                  key={ind.slug}
                  className={[
                    "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm",
                    isActive
                      ? "bg-brand-light border-indigo-200 text-brand font-medium"
                      : "bg-slate-50 border-slate-100 text-slate-400",
                  ].join(" ")}
                >
                  {ind.icon} {ind.name}
                  {!isActive && (
                    <span className="text-[10px] font-bold ml-0.5">
                      {ind.phase === "coming_soon" ? "SOON" : "PLANNED"}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ listing }: { listing: SeedListing }) {
  const isReno = listing.industry === "renovation";
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-brand/30 hover:shadow-sm transition-all group"
    >
      <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
        <span className="text-lg">{isReno ? "🔨" : "🎪"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-900 text-sm group-hover:text-brand transition-colors truncate">
            {listing.name}
          </p>
          <span className="shrink-0 bg-success-light text-success text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            Live
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {listing.category} · {listing.city}, {listing.state}
        </p>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {listing.description.slice(0, 120)}
          {listing.description.length > 120 ? "..." : ""}
        </p>
      </div>
    </Link>
  );
}
