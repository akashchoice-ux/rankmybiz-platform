import Link from "next/link";
import Card from "@/app/components/ui/Card";
import StatusBadge from "@/app/components/ui/StatusBadge";
import { SEED_LISTINGS, getAdminStats } from "@/lib/seed-data";

const stats = getAdminStats();

// Format date for display
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Recent submissions — sorted by submitted_at desc, take first 6
const recentListings = [...SEED_LISTINGS]
  .sort(
    (a, b) =>
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  )
  .slice(0, 6);

export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Admin Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review listings, verify payments, and manage the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Listings", value: stats.total_listings, color: "text-slate-900" },
          { label: "Pending Review", value: stats.pending_review, color: "text-brand", urgent: stats.pending_review > 0 },
          { label: "Pending Payment", value: stats.pending_payment_verification, color: "text-warning", urgent: stats.pending_payment_verification > 0 },
          { label: "Live", value: stats.live, color: "text-success" },
          { label: "Revenue (MYR)", value: `RM ${stats.total_revenue_myr.toLocaleString()}`, color: "text-slate-900" },
        ].map((stat) => (
          <Card key={stat.label} padding="md" shadow>
            <p className="text-xs text-slate-500 font-medium mb-1 leading-tight">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            {stat.urgent && (
              <span className="inline-block w-2 h-2 rounded-full bg-warning animate-pulse mt-1" />
            )}
          </Card>
        ))}
      </div>

      {/* Action queues */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card padding="none" border shadow>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Needs Review</h2>
              <p className="text-xs text-slate-400">Listings awaiting your approval</p>
            </div>
            <span className="bg-brand-light text-brand text-xs font-bold px-2.5 py-1 rounded-full">
              {stats.pending_review}
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {SEED_LISTINGS
              .filter((l) => l.status === "pending_review")
              .map((l) => (
                <Link
                  key={l.id}
                  href={`/admin/listings/${l.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-900 group-hover:text-brand">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.package_name} · {fmtDate(l.submitted_at)}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            {stats.pending_review === 0 && (
              <div className="px-5 py-6 text-center text-slate-400 text-xs">All clear — no pending reviews.</div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <Link href="/admin/listings?status=pending_review" className="text-sm text-brand font-semibold hover:underline">
              View all pending →
            </Link>
          </div>
        </Card>

        <Card padding="none" border shadow>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Payment Verification</h2>
              <p className="text-xs text-slate-400">Bank transfers awaiting confirmation</p>
            </div>
            <span className="bg-warning-light text-warning text-xs font-bold px-2.5 py-1 rounded-full">
              {stats.pending_payment_verification}
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {SEED_LISTINGS
              .filter((l) => l.status === "pending_payment")
              .map((l) => (
                <Link
                  key={l.id}
                  href={`/admin/listings/${l.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-900 group-hover:text-brand">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.package_name} · {fmtDate(l.submitted_at)}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            {stats.pending_payment_verification === 0 && (
              <div className="px-5 py-6 text-center text-slate-400 text-xs">No pending payments.</div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <Link href="/admin/payments" className="text-sm text-brand font-semibold hover:underline">
              View all payments →
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent listings table */}
      <Card padding="none" border shadow>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Submissions</h2>
          <Link href="/admin/listings" className="text-sm text-brand font-semibold hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Business</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Package</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentListings.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-900">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{l.category}</td>
                  <td className="px-5 py-3.5 text-slate-500">{l.package_name}</td>
                  <td className="px-5 py-3.5 text-slate-400">{fmtDate(l.submitted_at)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/listings/${l.id}`}
                      className="text-brand text-xs font-semibold hover:underline"
                    >
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
