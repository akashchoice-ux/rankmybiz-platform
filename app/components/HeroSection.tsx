import Link from "next/link";
import TrackedCTA from "./TrackedCTA";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-20 sm:pt-36 sm:pb-24 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8">
          Get Found by Customers on{" "}
          <span className="text-indigo-400">Google &amp; AI Search</span>
        </h1>
        <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          Your business deserves to show up when customers search online. List
          for free and let us handle the rest.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <TrackedCTA
            href="/dashboard/submit"
            label="Hero — Get Listed Free"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-10 py-5 rounded-xl text-lg transition-colors shadow-lg shadow-indigo-500/25"
          >
            Get Listed Free
          </TrackedCTA>
          <Link
            href="/pricing"
            className="text-slate-300 hover:text-white font-medium px-10 py-5 rounded-xl border border-slate-700 hover:border-slate-500 text-lg transition-colors"
          >
            Compare Plans
          </Link>
        </div>
        <p className="mt-6 text-base text-slate-500">
          Free forever · SSM-verified businesses only · No credit card needed
        </p>
      </div>
    </section>
  );
}
