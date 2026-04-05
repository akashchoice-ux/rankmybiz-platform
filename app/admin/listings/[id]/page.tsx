import Link from "next/link";
import Card from "@/app/components/ui/Card";
import StatusBadge from "@/app/components/ui/StatusBadge";
import AdminReviewPanel from "./AdminReviewPanel";
import type { ListingStatus } from "@/types";
import { LISTING_STATUS_CONFIG } from "@/lib/constants";

// Mock data — replace with Supabase query
function getMockListing(id: string) {
  return {
    id,
    name: "Kakak's Catering",
    status: "pending_review" as ListingStatus,
    package: "Growth",
    package_price: 199,
    submitted: "5 Apr 2026",
    user: {
      full_name: "Siti Rahimah Binti Ramli",
      email: "kakak@email.com",
      phone: "+60 12-345 6789",
    },
    business: {
      category: "Catering",
      description:
        "We specialize in corporate catering and private events across Klang Valley. Over 10 years of experience serving Malay, Chinese, and Western cuisine. Fully halal certified.",
      phone: "+60 12-345 6789",
      whatsapp: "+60 12-345 6789",
      email: "kakak@email.com",
      address: "No. 12, Jalan Ampang 2, Chow Kit",
      city: "Kuala Lumpur",
      state: "Kuala Lumpur",
      postcode: "50350",
      google_business_url: "https://maps.google.com/...",
      website: "",
    },
    service_areas: ["Kuala Lumpur", "Selangor", "Putrajaya"],
    payment: {
      method: "bank_transfer",
      status: "pending_verification",
      amount: 199,
      reference: "RMB-KAK001",
      proof_url: "/demo-proof.jpg",
    },
    admin_notes: [] as string[],
  };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminListingReviewPage({ params }: Props) {
  const { id } = await params;
  const listing = getMockListing(id);
  const statusConfig = LISTING_STATUS_CONFIG[listing.status];

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
                  {listing.business.category} · {listing.business.city}, {listing.business.state}
                </p>
              </div>
              <StatusBadge status={listing.status} />
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
                <p className="text-sm text-slate-600 leading-relaxed">{listing.business.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone" value={listing.business.phone} />
                <Field label="WhatsApp" value={listing.business.whatsapp} />
                <Field label="Email" value={listing.business.email} />
                <Field label="Website" value={listing.business.website || "—"} />
                <Field
                  label="Address"
                  value={`${listing.business.address}, ${listing.business.city}, ${listing.business.state} ${listing.business.postcode}`}
                  colSpan
                />
                <Field
                  label="Google Business"
                  value={listing.business.google_business_url ? "Provided" : "Not provided"}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Service Areas</p>
                <div className="flex flex-wrap gap-2">
                  {listing.service_areas.map((area) => (
                    <span key={area} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Account info */}
          <Card padding="lg" shadow>
            <h2 className="font-semibold text-slate-900 mb-4">Account Owner</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={listing.user.full_name} />
              <Field label="Email" value={listing.user.email} />
              <Field label="Phone" value={listing.user.phone} />
            </div>
          </Card>
        </div>

        {/* Right panel: payment + actions */}
        <div className="flex flex-col gap-6">
          {/* Payment card */}
          <Card padding="lg" shadow>
            <h2 className="font-semibold text-slate-900 mb-4">Payment</h2>
            <div className="space-y-3">
              <Field label="Plan" value={`${listing.package} — RM${listing.package_price}/mo`} />
              <Field label="Method" value={listing.payment.method === "bank_transfer" ? "Bank Transfer" : "Online (Stripe)"} />
              <Field label="Reference" value={listing.payment.reference} />
              <Field
                label="Status"
                value={listing.payment.status === "pending_verification" ? "Awaiting verification" : listing.payment.status}
              />
            </div>
            {listing.payment.proof_url && (
              <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-500">Payment Proof</p>
                </div>
                <div className="p-3">
                  <a
                    href={listing.payment.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand font-medium hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View proof
                  </a>
                </div>
              </div>
            )}
          </Card>

          {/* Admin action panel */}
          <AdminReviewPanel
            listingId={listing.id}
            currentStatus={listing.status}
            paymentMethod={listing.payment.method}
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
