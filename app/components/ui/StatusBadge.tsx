import { LISTING_STATUS_CONFIG } from "@/lib/constants";
import type { ListingStatus } from "@/types";

interface StatusBadgeProps {
  status: ListingStatus;
  showDot?: boolean;
}

export default function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const config = LISTING_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text-", "bg-")}`}
        />
      )}
      {config.label}
    </span>
  );
}
