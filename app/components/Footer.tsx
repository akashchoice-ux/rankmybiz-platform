import Link from "next/link";
import Logo from "./brand/Logo";
import { FNB_CATEGORIES_STATIC, RENOVATION_CATEGORIES_STATIC } from "@/lib/constants";

// High-value category × city combinations for internal linking
// These are the pages that actually have listings or high search intent
const POPULAR_SEARCHES = [
  { label: "Catering in Kuala Lumpur", href: "/catering/kuala-lumpur" },
  { label: "Catering in Petaling Jaya", href: "/catering/petaling-jaya" },
  { label: "Restaurant in Petaling Jaya", href: "/restaurant/petaling-jaya" },
  { label: "Café in Kuala Lumpur", href: "/cafe/kuala-lumpur" },
  { label: "Bakery in Shah Alam", href: "/bakery/shah-alam" },
  { label: "Food Truck in Cyberjaya", href: "/food-truck/cyberjaya" },
  { label: "Hawker in Georgetown", href: "/hawker/georgetown" },
  { label: "Shoplot Renovation in Kajang", href: "/shoplot-renovation/kajang" },
  { label: "Electrical in Kuala Lumpur", href: "/electrical/kuala-lumpur" },
  { label: "Interior Design in Kuala Lumpur", href: "/interior-design/kuala-lumpur" },
  { label: "General Contractor in Petaling Jaya", href: "/general-contractor/petaling-jaya" },
  { label: "Cloud Kitchen in Subang Jaya", href: "/cloud-kitchen/subang-jaya" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-500">
      {/* SEO link section */}
      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* F&B categories */}
            <div>
              <p className="text-slate-300 font-semibold text-xs uppercase tracking-wider mb-3">
                Food &amp; Beverage
              </p>
              <ul className="space-y-2">
                {FNB_CATEGORIES_STATIC.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/listings?category=${cat.slug}`}
                      className="text-sm hover:text-slate-300 transition-colors"
                    >
                      {cat.icon} {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Renovation categories */}
            <div>
              <p className="text-slate-300 font-semibold text-xs uppercase tracking-wider mb-3">
                Renovation
              </p>
              <ul className="space-y-2">
                {RENOVATION_CATEGORIES_STATIC.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/listings?category=${cat.slug}`}
                      className="text-sm hover:text-slate-300 transition-colors"
                    >
                      {cat.icon} {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular searches */}
            <div>
              <p className="text-slate-300 font-semibold text-xs uppercase tracking-wider mb-3">
                Popular Searches
              </p>
              <ul className="space-y-2">
                {POPULAR_SEARCHES.slice(0, 8).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 pb-8 border-b border-slate-800">
          <div className="max-w-xs">
            <Logo variant="light" />
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Helping Malaysian businesses get found on Google &amp; AI search.
              List your business and get more customers automatically.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2.5">
              <span className="text-slate-300 font-semibold text-xs uppercase tracking-wider">
                Platform
              </span>
              <Link href="/listings" className="hover:text-slate-300 transition-colors">
                Directory
              </Link>
              <Link href="/pricing" className="hover:text-slate-300 transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard/submit" className="hover:text-slate-300 transition-colors">
                List Your Business
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-slate-300 font-semibold text-xs uppercase tracking-wider">
                Account
              </span>
              <Link href="/auth/login" className="hover:text-slate-300 transition-colors">
                Log In
              </Link>
              <Link href="/auth/register" className="hover:text-slate-300 transition-colors">
                Sign Up
              </Link>
              <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
                Dashboard
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-slate-300 font-semibold text-xs uppercase tracking-wider">
                Company
              </span>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                Home
              </Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p>&copy; {new Date().getFullYear()} RankMyBiz. All rights reserved.</p>
          <p className="text-slate-600 text-xs">
            Business listing platform for Malaysian SMEs
          </p>
        </div>
      </div>
    </footer>
  );
}
