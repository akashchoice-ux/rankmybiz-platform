import Link from "next/link";
import Card from "@/app/components/ui/Card";
import StatusBadge from "@/app/components/ui/StatusBadge";
import type { ListingStatus } from "@/types";
import { SEED_LISTINGS } from "@/lib/seed-data";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending_review", label: "Pending Review" },
  { value: "pending_payment", label: "Pending Payment" },
  { value: "live", label: "Live" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminListingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const statusFilter = (params?.status as ListingStatus) || "";

  const filtered = statusFilter
    ? SEED_LISTINGS.filter((l) => l.status === statusFilter)
    : SEED_LISTINGS;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Listings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review, approve, and manage all business listing submissions.
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((f) => {
          const isActive = statusFilter === f.value;
          const count = f.value
            ? SEED_LISTINGS.filter((l) => l.status === f.value).length
            : SEED_LISTINGS.length;
          return (
            <Link
              key={f.value}
              href={f.value ? `/admin/listings?status=${f.value}` : "/admin/listings"}
              className={[
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors",
                isActive
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300",
              ].join(" ")}
            >
              {f.label}
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <Card padding="none" border shadow>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Business</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Package</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Submitted</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No listings found.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{l.name}</p>
                      <p className="text-xs text-slate-400">{l.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{l.category}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.package_name}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.city}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
