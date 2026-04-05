"use client";

import { trackWhatsAppClick } from "@/lib/analytics";

interface WhatsAppLinkProps {
  phone: string;
  listingId: string;
  listingName: string;
  className?: string;
  children: React.ReactNode;
}

export default function WhatsAppLink({
  phone,
  listingId,
  listingName,
  className,
  children,
}: WhatsAppLinkProps) {
  const cleanNumber = phone.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackWhatsAppClick({ listing_id: listingId, listing_name: listingName })
      }
    >
      {children}
    </a>
  );
}
