import Link from "next/link";
import Card from "@/app/components/ui/Card";
import StatusBadge from "@/app/components/ui/StatusBadge";
import { SEED_LISTINGS } from "@/lib/seed-data";

export const metadata = {
  title: "My Listings",
};

// In production this will query listings where user_id = current user
// For now, show all non-demo listings
const myListings = SEED_LISTINGS.filter((l) => !l.is_demo);

export default function DashboardListingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Listings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your submitted business listings.
          </p>
        </div>
        <Link
          href="/dashboard/submit"
          className="inline-flex items-center gap-1.5 h-10 px-5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Listing
        </Link>
      </div>

      {myListings.length === 0 ? (
        <Card padding="lg" shadow>
          <div className="py-12 text-center">
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
        </Card>
      ) : (
        <Card padding="none" border shadow>
          <div className="divide-y divide-slate-100">
            {myListings.map((l) => (
              <Link
                key={l.id}
                href={`/dashboard/listings/${l.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-brand transition-colors">
                    {l.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {l.category} · {l.city}, {l.state} · {l.package_name}
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
