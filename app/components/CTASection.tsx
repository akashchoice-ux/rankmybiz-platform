import Link from "next/link";
import TrackedCTA from "./TrackedCTA";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
          Your customers are searching. Can they find you?
        </h2>
        <p className="text-xl text-indigo-200 mb-10 leading-relaxed max-w-xl mx-auto">
          List your business for free and start getting found by customers
          searching online. Setup takes under 5 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <TrackedCTA
            href="/dashboard/submit"
            label="Bottom CTA — Get Listed Free"
            className="inline-block bg-white text-indigo-700 font-semibold px-10 py-5 rounded-xl text-lg hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Get Listed Free
          </TrackedCTA>
          <Link
            href="/pricing"
            className="inline-block text-indigo-200 hover:text-white font-medium px-10 py-5 rounded-xl border border-indigo-400/40 hover:border-indigo-300 text-lg transition-colors"
          >
            Compare Plans
          </Link>
        </div>
        <p className="mt-6 text-base text-indigo-300">
          Free forever · Premium from RM49/mo · No credit card needed
        </p>
      </div>
    </section>
  );
}
