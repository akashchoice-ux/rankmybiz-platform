import Card from "@/app/components/ui/Card";
import StatusBadge from "@/app/components/ui/StatusBadge";
import Link from "next/link";
import type { ListingStatus } from "@/types";

// Mock data — replace with Supabase query for bank transfer payments
const pendingProofs = [
  {
    id: "p1",
    listing_id: "2",
    listing_name: "The Nasi Lemak Co.",
    amount: 99,
    reference: "RMB-NAS001",
    uploaded: "4 Apr 2026",
    status: "pending_payment" as ListingStatus,
  },
  {
    id: "p2",
    listing_id: "5",
    listing_name: "Mak Long Catering",
    amount: 199,
    reference: "RMB-MAK001",
    uploaded: "3 Apr 2026",
    status: "pending_payment" as ListingStatus,
  },
];

export default function AdminPaymentsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">
          Verify bank transfer proofs and manage payment statuses.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Awaiting Verification", value: pendingProofs.length, color: "text-warning" },
          { label: "Verified Today", value: 3, color: "text-success" },
          { label: "Revenue This Month", value: "RM 2,786", color: "text-slate-900" },
        ].map((s) => (
          <Card key={s.label} padding="md" shadow>
            <p className="text-xs text-slate-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Pending verifications */}
      <Card padding="none" border shadow>
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Pending Bank Transfer Verification</h2>
          <p className="text-xs text-slate-400 mt-0.5">Review uploaded proofs and confirm payment.</p>
        </div>
        {pendingProofs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No pending verifications. All clear!
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {pendingProofs.map((p) => (
              <div key={p.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{p.listing_name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ref: {p.reference} · Uploaded {p.uploaded}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900">RM{p.amount}</span>
                  <StatusBadge status={p.status} />
                  <Link
                    href={`/admin/listings/${p.listing_id}`}
                    className="text-brand text-xs font-semibold hover:underline whitespace-nowrap"
                  >
                    Review →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
