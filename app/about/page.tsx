import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TrackedCTA from "@/app/components/TrackedCTA";

export const metadata = {
  title: "About RankMyBiz — Business Listing Platform for Malaysian SMEs",
  description:
    "RankMyBiz helps Malaysian businesses get found on Google and AI search with free, verified business listings. Learn about our mission and how we help SMEs grow.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[73px]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">
            About RankMyBiz
          </h1>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
            <p className="text-lg">
              RankMyBiz is a business listing platform built specifically for
              Malaysian SMEs. We help businesses get found when customers search
              online — on Google, AI search tools, and local directories.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mt-10">The Problem We Solve</h2>
            <p>
              Most small businesses in Malaysia have limited online presence. A
              Facebook page, maybe an incomplete Google Business Profile. When
              customers search for &quot;catering in Kuala Lumpur&quot; or &quot;renovation
              contractor Kajang&quot;, these businesses don&apos;t show up.
            </p>
            <p>
              Meanwhile, SEO agencies charge RM2,000–RM10,000 per month — far
              beyond what a hawker stall or small contractor can afford.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mt-10">How We Help</h2>
            <p>
              RankMyBiz gives every business a free, SEO-optimized listing page
              with structured data that Google and AI search tools can read.
              When someone searches for your type of business in your area, your
              listing has the technical foundation to appear in results.
            </p>
            <p>
              Each listing includes a WhatsApp button, phone link, and enquiry
              form — so customers can contact you directly. No middleman.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mt-10">Our Approach</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Free listings for all verified businesses</strong> — we
                believe every legitimate business deserves online visibility
              </li>
              <li>
                <strong>SSM verification</strong> — every business must provide
                their SSM registration number, ensuring only real businesses are listed
              </li>
              <li>
                <strong>Manual review</strong> — our team reviews every listing
                before it goes live to maintain quality
              </li>
              <li>
                <strong>No fake reviews</strong> — we don&apos;t fabricate reviews or
                badges. What you see is real.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 mt-10">Industries We Serve</h2>
            <p>
              We currently support Food &amp; Beverage and Renovation businesses,
              with more industries launching soon including Healthcare, Beauty
              &amp; Wellness, and Professional Services.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mt-10">Based in Malaysia</h2>
            <p>
              RankMyBiz is built and operated in Malaysia, for Malaysian
              businesses. We understand the local market, payment methods, and
              what SME owners need.
            </p>
          </div>

          <div className="mt-12 text-center">
            <TrackedCTA
              href="/dashboard/submit"
              label="About — Get Listed Free"
              className="inline-flex items-center justify-center h-12 px-8 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors"
            >
              Get Your Business Listed — Free
            </TrackedCTA>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
