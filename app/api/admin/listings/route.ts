import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getSession } from "@/lib/auth";

/**
 * PATCH /api/admin/listings — Update listing status (approve, reject, suspend)
 * Requires admin auth.
 */
export async function PATCH(request: Request) {
  // Verify admin
  const user = await getSession();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { listing_id, action, reason } = await request.json();

    if (!listing_id || !action) {
      return NextResponse.json(
        { error: "listing_id and action are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    let newStatus: string;
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    switch (action) {
      case "approve":
        newStatus = "live";
        updates.live_at = new Date().toISOString();
        break;
      case "reject":
        newStatus = "rejected";
        updates.rejection_reason = reason ?? "Does not meet listing requirements.";
        break;
      case "suspend":
        newStatus = "suspended";
        break;
      case "reinstate":
        newStatus = "live";
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    updates.status = newStatus;

    const { error } = await supabase
      .from("listings")
      .update(updates)
      .eq("id", listing_id);

    if (error) {
      console.error("Admin update error:", error);
      return NextResponse.json(
        { error: "Failed to update listing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("Admin action error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
