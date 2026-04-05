import Link from "next/link";
import Card from "@/app/components/ui/Card";
import StatusBadge from "@/app/components/ui/StatusBadge";
import { SEED_LISTINGS } from "@/lib/seed-data";

// In production: query listings where user_id = current user
const myListings = SEED_LISTINGS.filter((l) => !l.is_demo);
const liveCount = myListings.filter((l) => l.status === "live").length;
const reviewCount = myListings.filter((l) => l.status === "pending_review").length;
const draftCount = myListings.filter((l) => l.status === "draft" || l.status === "pending_payment").length;

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your listings and track your growth.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Listings", value: String(myListings.length), color: "text-slate-900" },
          { label: "Live Now", value: String(liveCount), color: "text-success" },
          { label: "Under Review", value: String(reviewCount), color: "text-brand" },
          { label: "Action Needed", value: String(draftCount), color: "text-warning" },
        ].map((stat) => (
          <Card key={stat.label} padding="md" shadow>
            <p className="text-xs text-slate-500 font-medium mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Listings */}
      <Card padding="none" border shadow>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">My Listings</h2>
          <Link
            href="/dashboard/submit"
            className="text-sm text-brand font-semibold hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Listing
          </Link>
        </div>

        {myListings.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">No listings yet</h3>
            <p className="text-slate-500 text-sm mb-5">
              Submit your first business listing to get found by customers.
            </p>
            <Link
              href="/dashboard/submit"
              className="inline-flex items-center justify-center h-10 px-5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
            >
              Submit a Listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/dashboard/listings/${listing.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-brand transition-colors">
                    {listing.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {listing.category} · {listing.city} · {listing.package_name}
                  </p>
                </div>
                <StatusBadge status={listing.status} />
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Help callout */}
      <div className="mt-6 bg-brand-light border border-indigo-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Need help?</p>
          <p className="text-sm text-slate-500 mt-0.5">
            Our team is available via WhatsApp and email to guide you through the process.
          </p>
        </div>
      </div>
    </div>
  );
}
