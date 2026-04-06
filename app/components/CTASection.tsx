import Link from "next/link";
import TrackedCTA from "./TrackedCTA";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Your competitors are already ranking. Are you?
        </h2>
        <p className="text-indigo-200 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
          Every day without a listing, potential customers find your competitors
          instead. Get your business listed in under 5 minutes — completely free.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <TrackedCTA
            href="/dashboard/submit"
            label="Bottom CTA — Get Listed Free"
            className="inline-block bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl text-base hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Get Listed Free
          </TrackedCTA>
          <Link
            href="/pricing"
            className="inline-block text-indigo-200 hover:text-white font-medium px-8 py-4 rounded-xl border border-indigo-400/40 hover:border-indigo-300 text-base transition-colors"
          >
            Compare Plans
          </Link>
        </div>
        <p className="mt-5 text-indigo-300 text-sm">
          Free forever · Premium from RM49/mo · No credit card needed
        </p>
      </div>
    </section>
  );
}
