import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_CATEGORIES_STATIC } from "@/lib/constants";
import { getListingBySlug, getLiveListings } from "@/lib/seed-data";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import WhatsAppLink from "@/app/components/WhatsAppLink";
import { LeadFormClient } from "./LeadFormClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return {};

  const title = `${listing.name} — ${listing.category} in ${listing.city}`;
  const desc = `${listing.name} is a verified ${listing.category.toLowerCase()} business in ${listing.city}, ${listing.state}. ${listing.description.slice(0, 120)}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/listings/${slug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `/listings/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: desc,
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing || listing.status !== "live") notFound();

  const catMeta = ALL_CATEGORIES_STATIC.find(
    (c) => c.slug === listing.categorySlug
  );
  const attrs = listing.custom_attributes;
  const isRenovation = listing.industry === "renovation";

  // schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isRenovation ? "HomeAndConstructionBusiness" : "FoodEstablishment",
    name: listing.name,
    description: listing.description,
    telephone: listing.phone,
    email: listing.email,
    url: listing.website ?? `https://rankmybiz.ai/listings/${slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.postcode,
      addressCountry: "MY",
    },
    areaServed: listing.service_areas.map((area) => ({
      "@type": "State",
      name: area,
    })),
  };

  const priceRangeLabels: Record<string, string> = {
    budget: "Budget (< RM20/pax)",
    mid_range: "Mid-range (RM20–60/pax)",
    premium: "Premium (RM60+/pax)",
  };

  // Related listings — same category, different listing
  const related = getLiveListings()
    .filter((l) => l.categorySlug === listing.categorySlug && l.id !== listing.id)
    .slice(0, 3);

  const citySlug = listing.city.toLowerCase().replace(/\s+/g, "-");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <div className="min-h-screen bg-slate-50 pt-[73px]">
        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Listings", href: "/listings" },
                { label: listing.category, href: `/${listing.categorySlug}/${citySlug}` },
                { label: listing.city, href: `/${listing.categorySlug}/${citySlug}` },
                { label: listing.name },
              ]}
            />
            <span className="text-xs bg-success-light text-success font-semibold px-2.5 py-1 rounded-full shrink-0 ml-3">
              Verified
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Business header */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                    <span className="text-2xl">{catMeta?.icon ?? "📋"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {listing.name}
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {listing.category} · {listing.city}, {listing.state}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {attrs.halal_certified === true && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                          ✓ Halal
                        </span>
                      )}
                      {attrs.delivery_available === true && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                          Delivery Available
                        </span>
                      )}
                      {attrs.cidb_registered === true && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                          CIDB Registered
                        </span>
                      )}
                      {attrs.price_range && (
                        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {priceRangeLabels[attrs.price_range as string] ??
                            String(attrs.price_range)}
                        </span>
                      )}
                      {attrs.license_grade && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {String(attrs.license_grade)}
                        </span>
                      )}
                      {listing.package_name === "Pro" && (
                        <span className="bg-accent/10 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-semibold text-slate-900 mb-3">About</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Capacity / project info */}
              {(attrs.min_pax || attrs.max_pax || attrs.min_project_value) && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">
                    {isRenovation ? "Project Details" : "Capacity"}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {attrs.min_pax && (
                      <StatBlock label="Min Pax" value={String(attrs.min_pax)} />
                    )}
                    {attrs.max_pax && (
                      <StatBlock label="Max Pax" value={String(attrs.max_pax)} />
                    )}
                    {attrs.min_project_value && (
                      <StatBlock
                        label="Min Project"
                        value={`RM ${Number(attrs.min_project_value).toLocaleString()}`}
                      />
                    )}
                    {attrs.warranty_months && (
                      <StatBlock
                        label="Warranty"
                        value={`${attrs.warranty_months} months`}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Specialisations (renovation) */}
              {attrs.specialisation &&
                Array.isArray(attrs.specialisation) &&
                (attrs.specialisation as string[]).length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-900 mb-3">
                      Specialisations
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(attrs.specialisation as string[]).map((s) => (
                        <span
                          key={s}
                          className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg capitalize"
                        >
                          {s.replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Event types (catering) */}
              {attrs.event_types &&
                Array.isArray(attrs.event_types) &&
                (attrs.event_types as string[]).length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-900 mb-3">
                      Event Types
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(attrs.event_types as string[]).map((e) => (
                        <span
                          key={e}
                          className="bg-brand-light text-brand text-xs font-medium px-2.5 py-1 rounded-lg capitalize"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Service Areas */}
              {listing.service_areas.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-3">
                    Service Areas
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.service_areas.map((area) => (
                      <span
                        key={area}
                        className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related listings */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">
                    More {listing.category} Businesses
                  </h2>
                  <div className="flex flex-col gap-3">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/listings/${r.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0 text-base">
                          {catMeta?.icon ?? "📋"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 group-hover:text-brand truncate">
                            {r.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {r.city}, {r.state}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-slate-300 group-hover:text-brand shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-semibold text-slate-900 mb-4">
                  Contact Business
                </h2>
                <div className="flex flex-col gap-3">
                  {listing.whatsapp && (
                    <WhatsAppLink
                      phone={listing.whatsapp}
                      listingId={listing.id}
                      listingName={listing.name}
                      className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </WhatsAppLink>
                  )}
                  <a
                    href={`tel:${listing.phone}`}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-300 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"
                      />
                    </svg>
                    {listing.phone}
                  </a>
                  {listing.website && (
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-300 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Visit Website
                    </a>
                  )}
                </div>
              </div>

              {/* Lead form */}
              <LeadFormClient listingId={listing.id} listingName={listing.name} />

              {/* Location */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-semibold text-slate-900 mb-2">Location</h2>
                <p className="text-sm text-slate-600">
                  {listing.address}
                  <br />
                  {listing.city}, {listing.state} {listing.postcode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
