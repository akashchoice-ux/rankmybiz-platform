import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "RankMyBiz privacy policy — how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[73px]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: April 2026</p>

          <div className="text-slate-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
              <p>When you submit a business listing, we collect: business name, SSM registration number, contact details (phone, email, WhatsApp), business address, description, and any optional information you provide such as keywords and service areas.</p>
              <p className="mt-3">When a customer submits an enquiry through a listing, we collect their name, phone number, and optional message.</p>
              <p className="mt-3">We also use Google Analytics to collect anonymised usage data such as page views and interactions.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To create and display your business listing on RankMyBiz</li>
                <li>To verify your business identity via SSM number</li>
                <li>To forward customer enquiries to your business email</li>
                <li>To send you notifications about your listing status</li>
                <li>To improve our platform and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Data Sharing</h2>
              <p>Your business listing information (name, description, contact details, location) is displayed publicly on RankMyBiz. This is the purpose of the platform.</p>
              <p className="mt-3">We do not sell your personal data to third parties. Customer enquiry details are shared only with the relevant business listing owner.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Data Storage</h2>
              <p>Your data is stored securely on Supabase (PostgreSQL) servers. We use industry-standard security practices including encryption in transit and at rest.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Your Rights</h2>
              <p>You may request to update or delete your listing at any time by contacting us. We will process your request within 7 business days.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Contact</h2>
              <p>For privacy-related enquiries, email us at <strong>admin@rankmybiz.ai</strong>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
