"use client";

import Link from "next/link";
import { trackCTAClick } from "@/lib/analytics";

interface TrackedCTAProps {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}

export default function TrackedCTA({
  href,
  label,
  className,
  children,
}: TrackedCTAProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackCTAClick(label)}
    >
      {children}
    </Link>
  );
}
