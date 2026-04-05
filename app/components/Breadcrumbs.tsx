import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit for the current (last) page
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Reusable breadcrumb component with schema.org BreadcrumbList JSON-LD.
 * Usage: <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Listings", href: "/listings" }, { label: "Business Name" }]} />
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href
        ? { item: `https://rankmybiz.ai${item.href}` }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-400 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-slate-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-slate-600 font-medium" : ""}>
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
