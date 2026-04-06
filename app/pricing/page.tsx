import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TrackedCTA from "@/app/components/TrackedCTA";
import { PACKAGES } from "@/lib/constants";

export const metadata = {
  title: "Pricing — Free Business Listing & Premium Plans",
  description:
    "List your business on RankMyBiz for free. Upgrade to Premium (RM49/mo) for photos and multi-city SEO, or Ultra Premium (RM149/mo) for a dedicated products & services page.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Header */}
        <section className="pt-32 pb-16 bg-slate-950 text-white text-center px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Start free. Upgrade when you&apos;re ready.
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Every business gets a free verified listing. Add photos and
              multi-city ranking with Premium. Get a full online presence
              with Ultra Premium.
            </p>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={[
                  "relative rounded-2xl border p-8 flex flex-col",
                  pkg.is_popular
                    ? "border-brand shadow-lg shadow-brand/10 bg-white"
                    : "border-slate-200 bg-white",
                ].join(" ")}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">{pkg.name}</h2>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="mb-8">
                  {pkg.price === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-success">Free</span>
                      <span className="text-slate-400 text-sm">forever</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        RM{pkg.price}
                      </span>
                      <span className="text-slate-400 text-sm">/ month</span>
                    </div>
                  )}
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 text-success shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <TrackedCTA
                  href="/dashboard/submit"
                  label={`Pricing — ${pkg.name}`}
                  className={[
                    "w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center transition-colors",
                    pkg.is_popular
                      ? "bg-brand text-white hover:bg-brand-dark"
                      : pkg.price === 0
                      ? "bg-success text-white hover:bg-emerald-600"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  ].join(" ")}
                >
                  {pkg.price === 0 ? "List Your Business Free" : `Get ${pkg.name}`}
                </TrackedCTA>
              </div>
            ))}
          </div>
        </section>

        {/* Payment info */}
        <section className="py-10 px-6 max-w-3xl mx-auto">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
            <h3 className="font-semibold text-slate-900 mb-2">How payment works</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Free listings require no payment. For Premium and Ultra Premium,
              payment is via <strong>bank transfer</strong> to our Malaysian bank
              account. Upload your transfer proof and we&apos;ll verify within 1–2
              business days. No credit card needed.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="flex flex-col divide-y divide-slate-100">
            {[
              {
                q: "Is the Free listing really free?",
                a: "Yes. You get a fully SEO-optimized listing page with WhatsApp, phone, and enquiry form — forever free. No credit card, no trial period, no catch.",
              },
              {
                q: "How do I verify my business?",
                a: "You'll need to provide your SSM (Suruhanjaya Syarikat Malaysia) registration number when submitting your listing. Our team verifies it before your listing goes live.",
              },
              {
                q: "How do I pay for Premium or Ultra Premium?",
                a: "Via bank transfer to our Maybank account. After submitting your listing, you'll see the bank details and upload your transfer proof. We verify within 1–2 business days.",
              },
              {
                q: "When does my listing go live?",
                a: "After we verify your SSM number (for Free) or payment proof (for Premium/Ultra), our team reviews your listing within 24–48 hours. Once approved, it goes live immediately.",
              },
              {
                q: "What's the difference between Premium and Ultra Premium?",
                a: "Premium adds up to 5 photos and multi-city SEO pages. Ultra Premium adds everything in Premium plus a dedicated Products & Services page for your business, up to 10 photos, and top placement in search results.",
              },
              {
                q: "Can I upgrade later?",
                a: "Yes. Start with Free, see the results, then upgrade to Premium or Ultra Premium anytime from your dashboard.",
              },
            ].map((item, i) => (
              <div key={i} className="py-5">
                <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-6 bg-brand-light text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Get your business found — starting today
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              No credit card. No contracts. Free forever.
            </p>
            <TrackedCTA
              href="/dashboard/submit"
              label="Pricing Bottom — Get Listed Free"
              className="inline-flex items-center justify-center h-12 px-8 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors text-sm"
            >
              Get Listed Free
            </TrackedCTA>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
