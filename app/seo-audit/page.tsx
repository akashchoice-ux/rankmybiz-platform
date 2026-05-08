import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AuditClient from "./AuditClient";

export const metadata = {
  title:
    "Free SEO & AI Audit Tool — Test Your Site for Google + ChatGPT Visibility",
  description:
    "Run a free SEO and AI gap audit on any website. Catches the same issues Google Search Console flags — page indexing, image, video, link crawl errors — plus AI search readiness for ChatGPT, Claude, Perplexity, and Google AI Overviews.",
  alternates: { canonical: "/seo-audit" },
  openGraph: {
    title: "Free SEO & AI Audit Tool — RankMyBiz",
    description:
      "Test any website for Google Search Console crawl issues and AI search visibility gaps. Free, instant, no signup.",
    url: "https://rankmybiz.ai/seo-audit",
    type: "website",
  },
};

const toolJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RankMyBiz SEO & AI Audit",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: "https://rankmybiz.ai/seo-audit",
  description:
    "Free SEO and AI gap audit. Tests Google Search Console crawl issues (pages, images, videos, links) and AI search visibility (GPTBot, ClaudeBot, Perplexity, Google-Extended).",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "MYR",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the SEO audit really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. No signup, no email, no credit card. The audit runs server-side and returns results instantly.",
      },
    },
    {
      "@type": "Question",
      name: "What does the audit check?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On-page SEO (title, meta, H1), crawl rules (robots.txt, sitemap, canonical, noindex), structured data (JSON-LD, Open Graph, Twitter), images (alt text, dimensions), videos (schema, captions), links (internal/external/broken), AI readiness (llms.txt, AI bot allowlist, semantic HTML), and performance (TTFB, payload size).",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from Google Search Console?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Search Console only shows issues for sites you've verified ownership of, and findings can take days to appear. This audit runs on any public URL in seconds — and adds AI-search checks (ChatGPT, Claude, Perplexity, Google AI Overviews) that Search Console doesn't cover.",
      },
    },
    {
      "@type": "Question",
      name: "Do you store the URLs I audit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The audit endpoint runs the checks and returns the results — we don't log or persist the URL.",
      },
    },
  ],
};

export default function SeoAuditPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([toolJsonLd, faqJsonLd]),
        }}
      />
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-[73px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <AuditClient />

          {/* FAQ visible content (matches FAQ schema for AI parity) */}
          <section className="mt-16">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is the SEO audit really free?",
                  a: "Yes. No signup, no email, no credit card. The audit runs server-side and returns results instantly.",
                },
                {
                  q: "What does the audit check?",
                  a: "On-page SEO (title, meta, H1), crawl rules (robots.txt, sitemap, canonical, noindex), structured data (JSON-LD, Open Graph, Twitter), images (alt text, dimensions), videos (schema, captions), links (internal/external/broken), AI readiness (llms.txt, AI bot allowlist, semantic HTML), and performance (TTFB, payload size).",
                },
                {
                  q: "How is this different from Google Search Console?",
                  a: "Search Console only shows issues for sites you've verified ownership of, and findings can take days to appear. This audit runs on any public URL in seconds — and adds AI-search checks (ChatGPT, Claude, Perplexity, Google AI Overviews) that Search Console doesn't cover.",
                },
                {
                  q: "Do you store the URLs I audit?",
                  a: "No. The audit endpoint runs the checks and returns the results — we don't log or persist the URL.",
                },
              ].map((item) => (
                <details
                  key={item.q}
                  className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 group"
                >
                  <summary className="font-semibold text-slate-900 cursor-pointer flex items-center justify-between gap-3 list-none">
                    <span>{item.q}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
