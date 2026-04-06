import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rankmybiz.ai"),
  title: {
    default:
      "RankMyBiz — Business Listing Malaysia | Get More Customers from Google & AI Search",
    template: "%s | RankMyBiz",
  },
  description:
    "List your business on RankMyBiz for free and get found on Google, AI search, and local directories across Malaysia. SSM-verified listings, lead generation, and multi-location SEO — no agency needed.",
  keywords: [
    "business listing Malaysia",
    "get customers online Malaysia",
    "local SEO Malaysia",
    "Google business listing",
    "AI search optimization",
    "SME marketing Malaysia",
  ],
  openGraph: {
    type: "website",
    locale: "en_MY",
    siteName: "RankMyBiz",
    url: "https://rankmybiz.ai",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rankmybiz",
  },
  alternates: {
    canonical: "https://rankmybiz.ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
