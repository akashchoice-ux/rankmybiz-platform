import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/app/components/ui/Card";
import StatusBadge from "@/app/components/ui/StatusBadge";
import AdminReviewPanel from "./AdminReviewPanel";
import type { ListingStatus } from "@/types";
import { LISTING_STATUS_CONFIG } from "@/lib/constants";
import { createServerSupabaseClient } from "@/lib/supabase-server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminListingReviewPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!listing) notFound();

  const statusConfig = LISTING_STATUS_CONFIG[listing.status as ListingStatus] ?? LISTING_STATUS_CONFIG.draft;

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-MY", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/admin/listings" className="hover:text-brand transition-colors">
          Listings
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{listing.name}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Header card */}
          <Card padding="lg" shadow>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{listing.name}</h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  {listing.category} · {listing.city}, {listing.state}
                </p>
              </div>
              <StatusBadge status={listing.status as ListingStatus} />
            </div>
            <div className="mt-4 bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500">
              {statusConfig.description}
            </div>
          </Card>

          {/* Business profile */}
          <Card padding="lg" shadow>
            <h2 className="font-semibold text-slate-900 mb-5">Business Profile</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-slate-600 leading-relaxed">{listing.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="SSM Number" value={listing.ssm_number} />
                <Field label="Phone" value={listing.phone} />
                <Field label="WhatsApp" value={listing.whatsapp || "—"} />
                <Field label="Email" value={listing.email} />
                <Field label="Website" value={listing.website || "—"} />
                <Field label="Package" value={listing.package_name} />
                <Field
                  label="Address"
                  value={`${listing.address}, ${listing.city}, ${listing.state} ${listing.postcode}`}
                  colSpan
                />
              </div>
              {listing.keywords && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Keywords</p>
                  <p className="text-sm text-slate-600">{listing.keywords}</p>
                </div>
              )}
              {listing.service_areas && listing.service_areas.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Service Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.service_areas.map((area: string) => (
                      <span key={area} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Submitted</p>
                <p className="text-sm text-slate-600">{fmtDate(listing.submitted_at)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right panel: actions */}
        <div className="flex flex-col gap-6">
          <AdminReviewPanel
            listingId={listing.id}
            currentStatus={listing.status as ListingStatus}
            paymentMethod={listing.package_id === "pkg_free" ? "free" : "bank_transfer"}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  colSpan = false,
}: {
  label: string;
  value: string;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-slate-700 font-medium">{value}</p>
    </div>
  );
}
