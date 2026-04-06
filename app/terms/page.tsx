import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Terms of Service",
  description: "RankMyBiz terms of service — rules and guidelines for using our platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[73px]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: April 2026</p>

          <div className="text-slate-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p>By using RankMyBiz (&quot;the Platform&quot;), you agree to these Terms of Service. If you do not agree, please do not use the Platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Eligibility</h2>
              <p>To create a business listing, you must be a registered business in Malaysia with a valid SSM (Suruhanjaya Syarikat Malaysia) registration number. You must be authorised to represent the business you are listing.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Listing Content</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All information you provide must be accurate and truthful</li>
                <li>You must not list businesses you do not own or represent</li>
                <li>Content must not be misleading, offensive, or illegal</li>
                <li>RankMyBiz reserves the right to reject, edit, or remove any listing at our discretion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Verification and Approval</h2>
              <p>All listings undergo manual review before going live. We verify your SSM number and review your listing content. Approval is at our sole discretion.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Free and Paid Plans</h2>
              <p>The Free plan is available at no cost with no time limit. Premium and Ultra Premium plans require monthly payment via bank transfer. Plans may be cancelled at any time.</p>
              <p className="mt-3">Payments are non-refundable once a listing has been approved and published. If your listing is rejected, you may request a refund within 14 days.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">6. No Guarantees</h2>
              <p>RankMyBiz provides SEO-optimized listing pages designed to improve your online visibility. However, we do not guarantee specific search engine rankings, traffic volumes, or lead generation results. Search rankings depend on many factors outside our control.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">7. Suspension and Termination</h2>
              <p>We may suspend or remove your listing if you violate these terms, provide false information, or if your business ceases to operate. We will notify you before taking such action where possible.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">8. Limitation of Liability</h2>
              <p>RankMyBiz is provided &quot;as is&quot;. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">9. Changes to Terms</h2>
              <p>We may update these terms from time to time. Continued use of the Platform after changes constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">10. Contact</h2>
              <p>For questions about these terms, email us at <strong>admin@rankmybiz.ai</strong>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
