import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendLeadNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { listing_id, name, phone, message } = await request.json();

    if (!listing_id || !name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Save the lead
    const { error } = await supabase.from("leads").insert({
      listing_id,
      name,
      phone,
      message: message || null,
      source: "listing_page",
    });

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit enquiry." },
        { status: 500 }
      );
    }

    // Get the listing owner's email to notify them
    const { data: listing } = await supabase
      .from("listings")
      .select("email, name")
      .eq("id", listing_id)
      .single();

    if (listing?.email) {
      sendLeadNotification({
        business_email: listing.email,
        business_name: listing.name,
        lead_name: name,
        lead_phone: phone,
        lead_message: message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
