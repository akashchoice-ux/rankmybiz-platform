import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { PACKAGES } from "@/lib/constants";

export const metadata = {
  title: "Pricing — RankMyBiz",
  description:
    "Simple, transparent pricing for F&B and catering businesses in Malaysia. No hidden fees.",
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
              Simple, honest pricing
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              No setup fees. No hidden charges. Cancel anytime.
              <br />
              All prices in Malaysian Ringgit (MYR).
            </p>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
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
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">
                      RM{pkg.price}
                    </span>
                    <span className="text-slate-400 text-sm">/ month</span>
                  </div>
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

                <Link
                  href={`/auth/register?package=${pkg.slug}`}
                  className={[
                    "w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center transition-colors",
                    pkg.is_popular
                      ? "bg-brand text-white hover:bg-brand-dark"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  ].join(" ")}
                >
                  Get Started with {pkg.name}
                </Link>
              </div>
            ))}
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
                q: "Can I pay by bank transfer?",
                a: "Yes. When you proceed to payment, you can choose online payment (card or FPX) or bank transfer. For bank transfers, upload your proof and we'll verify it within 1–2 business days.",
              },
              {
                q: "When does my listing go live?",
                a: "After payment is confirmed, our team reviews your listing within 24–48 hours. Once approved, it goes live immediately.",
              },
              {
                q: "What happens after I sign up?",
                a: "You'll be guided through a simple 5-step form to set up your business profile. Then choose your package and pay. Our team reviews and publishes your listing.",
              },
              {
                q: "Can I upgrade my plan later?",
                a: "Yes, you can upgrade at any time from your dashboard. You'll only be charged the difference for the remaining period.",
              },
              {
                q: "Is there a contract or minimum commitment?",
                a: "No contracts, no minimum commitment. You can cancel your subscription anytime from your dashboard.",
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
              Ready to get more customers?
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Sign up in minutes. No credit card required to start.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center h-12 px-8 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors text-sm"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
