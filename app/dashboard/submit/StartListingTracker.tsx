"use client";

import { useEffect } from "react";
import { trackStartListing } from "@/lib/analytics";

export default function StartListingTracker() {
  useEffect(() => {
    trackStartListing();
  }, []);

  return null;
}
