import Link from "next/link";
import TrackedCTA from "./TrackedCTA";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-20 sm:pt-36 sm:pb-24 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] mb-6">
          Get More Customers Automatically from{" "}
          <span className="text-indigo-400">Google &amp; AI Search</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          When customers search for businesses like yours, they find your
          competitors. We fix that. Your business gets ranked, verified,
          and shown to customers across multiple locations — without hiring
          an agency.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <TrackedCTA
            href="/dashboard/submit"
            label="Hero — Get Listed Now"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-indigo-500/25"
          >
            Get Listed Now — From RM99/mo
          </TrackedCTA>
          <Link
            href="/listings"
            className="text-slate-300 hover:text-white font-medium px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-500 text-base transition-colors"
          >
            Browse Directory
          </Link>
        </div>
        <p className="mt-5 text-sm text-slate-500">
          No contracts · Cancel anytime · Results in days, not months
        </p>
      </div>
    </section>
  );
}
