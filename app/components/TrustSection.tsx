import Link from "next/link";
import { fetchLiveListings, type DbListing } from "@/lib/listings-db";

export default async function TrustSection() {
  const liveListings = await fetchLiveListings();
  const liveCount = liveListings.length;

  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6">
        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base text-slate-400 mb-10">
          {liveCount > 0 && (
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {liveCount} verified business{liveCount !== 1 ? "es" : ""} live
            </span>
          )}
          <span>SSM-verified only</span>
          <span>Built in Malaysia</span>
          <span>Free to list</span>
        </div>

        {/* Featured businesses — only shown if there are live listings */}
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

        {liveListings.length === 0 && (
          <div className="bg-brand-light border border-indigo-200 rounded-2xl p-8 text-center max-w-lg mx-auto mb-10">
            <p className="text-lg font-semibold text-brand mb-2">
              Now accepting business listings
            </p>
            <p className="text-sm text-indigo-600 mb-4">
              Be among the first verified businesses on RankMyBiz.
            </p>
            <Link
              href="/dashboard/submit"
              className="inline-flex items-center justify-center h-11 px-6 bg-brand text-white font-semibold rounded-xl text-sm hover:bg-brand-dark transition-colors"
            >
              Submit Your Business
            </Link>
          </div>
        )}

        {/* Industries — show only active, no SOON/PLANNED clutter */}
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-4">
            Currently serving
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-light border border-indigo-200 text-brand text-base font-medium">
              🍽️ Food &amp; Beverage
            </span>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-light border border-indigo-200 text-brand text-base font-medium">
              🔨 Renovation
            </span>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-400 text-base">
              More industries coming soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ listing }: { listing: DbListing }) {
  const isReno = listing.industry === "renovation";
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-brand/30 hover:shadow-sm transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
        <span className="text-xl">{isReno ? "🔨" : "🍽️"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-900 text-base group-hover:text-brand transition-colors truncate">
            {listing.name}
          </p>
          <span className="shrink-0 bg-success-light text-success text-xs font-bold px-2 py-0.5 rounded-full">
            Verified
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-0.5">
          {listing.category} · {listing.city}, {listing.state}
        </p>
        <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {listing.description.slice(0, 140)}
          {listing.description.length > 140 ? "..." : ""}
        </p>
      </div>
    </Link>
  );
}
