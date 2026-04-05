import Link from "next/link";
import Card from "@/app/components/ui/Card";
import StatusBadge from "@/app/components/ui/StatusBadge";
import { LISTING_STATUS_CONFIG } from "@/lib/constants";
import { SEED_LISTINGS } from "@/lib/seed-data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DashboardListingDetailPage({ params }: Props) {
  const { id } = await params;

  // In production: query listing where id = $id AND user_id = current user
  const listing = SEED_LISTINGS.find((l) => l.id === id && !l.is_demo);

  if (!listing) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Listing not found</h1>
        <p className="text-slate-500 text-sm mb-6">
          This listing doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Link
          href="/dashboard/listings"
          className="text-brand text-sm font-semibold hover:underline"
        >
          ← Back to My Listings
        </Link>
      </div>
    );
  }

  const statusConfig = LISTING_STATUS_CONFIG[listing.status];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-brand transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/listings" className="hover:text-brand transition-colors">
          My Listings
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{listing.name}</span>
      </div>

      {/* Status banner */}
      <div className={`rounded-2xl px-5 py-4 mb-6 ${statusConfig.bgColor}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-semibold text-sm ${statusConfig.color}`}>
              {statusConfig.label}
            </p>
            <p className={`text-xs mt-0.5 ${statusConfig.color} opacity-75`}>
              {statusConfig.description}
            </p>
          </div>
          <StatusBadge status={listing.status} />
        </div>
      </div>

      {/* Business details */}
      <Card padding="lg" shadow>
        <h2 className="font-semibold text-slate-900 mb-5">Business Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Business Name
            </p>
            <p className="text-sm text-slate-900 font-medium">{listing.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </p>
              <p className="text-sm text-slate-700">{listing.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Industry
              </p>
              <p className="text-sm text-slate-700 capitalize">{listing.industry}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {listing.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Location
              </p>
              <p className="text-sm text-slate-700">
                {listing.city}, {listing.state} {listing.postcode}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Phone
              </p>
              <p className="text-sm text-slate-700">{listing.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="text-sm text-slate-700">{listing.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Package
              </p>
              <p className="text-sm text-slate-700">{listing.package_name}</p>
            </div>
          </div>

          {listing.service_areas.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Service Areas
              </p>
              <div className="flex flex-wrap gap-2">
                {listing.service_areas.map((area) => (
                  <span
                    key={area}
                    className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        {listing.status === "draft" && (
          <Link
            href="/dashboard/submit/payment"
            className="inline-flex items-center justify-center h-10 px-5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            Complete Payment
          </Link>
        )}
        {listing.status === "live" && listing.slug && (
          <Link
            href={`/listings/${listing.slug}`}
            className="inline-flex items-center justify-center h-10 px-5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            View Public Listing
          </Link>
        )}
        <Link
          href="/dashboard/listings"
          className="inline-flex items-center justify-center h-10 px-5 border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:border-slate-300 transition-colors"
        >
          Back to Listings
        </Link>
      </div>
    </div>
  );
}
