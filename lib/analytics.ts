/**
 * RankMyBiz — Analytics Event Tracking
 *
 * Centralized GA4 event helper. All business-critical events go through here.
 * This keeps event names, categories, and payloads consistent across the app.
 *
 * Usage:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("start_listing", { label: "/dashboard/submit" });
 */

type EventParams = {
  label?: string;
  value?: number;
  page?: string;
  [key: string]: string | number | undefined;
};

export function trackEvent(
  eventName: string,
  params: EventParams = {}
) {
  if (typeof window === "undefined") return;

  const payload = {
    event_category: "conversion",
    page: params.page ?? window.location.pathname,
    ...params,
  };

  window.gtag?.("event", eventName, payload);
}

// ─── Pre-defined event helpers ──────────────────────────────────────────────
// These enforce consistent naming across the codebase.

/** User lands on /dashboard/submit — start of listing funnel */
export function trackStartListing() {
  trackEvent("start_listing", {
    label: "Listing submission started",
  });
}

/** Stripe payment completed successfully */
export function trackPurchase(params: {
  listing_id?: string;
  package_name: string;
  value: number;
  currency?: string;
}) {
  trackEvent("purchase", {
    event_category: "ecommerce",
    label: params.package_name,
    value: params.value,
    currency: params.currency ?? "MYR",
    listing_id: params.listing_id,
  });
}

/** Bank transfer proof uploaded */
export function trackBankTransferSubmit(params: {
  listing_id?: string;
  package_name: string;
  value: number;
}) {
  trackEvent("bank_transfer_submit", {
    event_category: "ecommerce",
    label: params.package_name,
    value: params.value,
    listing_id: params.listing_id,
  });
}

/** WhatsApp click on listing page */
export function trackWhatsAppClick(params: {
  listing_id: string;
  listing_name: string;
}) {
  trackEvent("whatsapp_click", {
    event_category: "engagement",
    label: params.listing_name,
    listing_id: params.listing_id,
  });
}

/** Lead enquiry form submitted */
export function trackLeadSubmit(params: {
  listing_id: string;
  listing_name: string;
}) {
  trackEvent("lead_submit", {
    event_category: "conversion",
    label: params.listing_name,
    listing_id: params.listing_id,
  });
}

/** CTA button clicked */
export function trackCTAClick(label: string) {
  trackEvent("cta_click", {
    event_category: "engagement",
    label,
  });
}
