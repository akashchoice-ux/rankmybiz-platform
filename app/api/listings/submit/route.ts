import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendSubmissionNotification, sendSubmissionConfirmation } from "@/lib/email";

function generateSlug(name: string, city: string): string {
  return `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ["name", "ssm_number", "description", "phone", "email", "address", "city", "state", "postcode", "category_id", "industry_id"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createServerSupabaseClient();
    const slug = generateSlug(body.name, body.city);

    const { data, error } = await supabase
      .from("listings")
      .insert({
        name: body.name,
        ssm_number: body.ssm_number,
        slug,
        industry: body.industry_id,
        category: body.category_label ?? body.category_id,
        category_slug: body.category_id,
        subcategory: body.subcategory_id || null,
        description: body.description,
        phone: body.phone,
        email: body.email,
        whatsapp: body.whatsapp || null,
        website: body.website || null,
        google_business_url: body.google_business_url || null,
        keywords: body.keywords || null,
        custom_attributes: body.custom_attributes ?? {},
        address: body.address,
        city: body.city,
        state: body.state,
        postcode: body.postcode,
        service_areas: body.service_areas ?? [],
        package_id: body.package_id ?? "pkg_free",
        package_name: body.package_name ?? "Free",
        status: "pending_review",
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit listing. Please try again." },
        { status: 500 }
      );
    }

    // Send emails (non-blocking — don't fail the request if email fails)
    sendSubmissionNotification({
      name: body.name,
      category: body.category_label ?? body.category_id,
      city: body.city,
      email: body.email,
      phone: body.phone,
      ssm_number: body.ssm_number,
      package_name: body.package_name ?? "Free",
    });

    sendSubmissionConfirmation({
      name: body.name,
      email: body.email,
      package_name: body.package_name ?? "Free",
    });

    return NextResponse.json({
      success: true,
      listing_id: data.id,
      slug: data.slug,
    });
  } catch (err) {
    console.error("Listing submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
