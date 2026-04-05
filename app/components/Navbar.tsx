import Link from "next/link";
import Logo from "./brand/Logo";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/listings"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Listings
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/dashboard/submit"
            className="bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            Get Listed
          </Link>
        </div>
        <Link
          href="/dashboard/submit"
          className="sm:hidden bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
        >
          Get Listed
        </Link>
      </div>
    </nav>
  );
}
