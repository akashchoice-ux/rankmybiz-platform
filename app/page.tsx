import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrustSection from "./components/TrustSection";
import HowItWorks from "./components/HowItWorks";
import BenefitsSection from "./components/BenefitsSection";
import FeaturedListings from "./components/FeaturedListings";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

// Organization + WebSite structured data for homepage
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RankMyBiz",
  url: "https://rankmybiz.ai",
  description:
    "Business listing platform helping Malaysian SMEs get found on Google and AI search.",
  foundingDate: "2026",
  areaServed: {
    "@type": "Country",
    name: "Malaysia",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RankMyBiz",
  url: "https://rankmybiz.ai",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://rankmybiz.ai/listings?category={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
        }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <HowItWorks />
        <BenefitsSection />
        <FeaturedListings />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
