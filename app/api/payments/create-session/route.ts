import { NextResponse } from "next/server";

// POST /api/payments/create-session
// Creates a Stripe Checkout session for listing payment.
// Returns the checkout URL to redirect the user to.

export async function POST(req: Request) {
  try {
    const { listingId, packageId } = await req.json();

    if (!listingId || !packageId) {
      return NextResponse.json(
        { error: "listingId and packageId are required" },
        { status: 400 }
      );
    }

    // TODO: Server-side auth check — verify the listingId belongs to the authenticated user

    // TODO:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const pkg = await getPackageById(packageId); // from Supabase
    //
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription', // or 'payment' for one_time
    //   payment_method_types: ['card', 'fpx'],
    //   line_items: [{
    //     price: pkg.stripe_price_id,
    //     quantity: 1,
    //   }],
    //   metadata: { listing_id: listingId },
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/submit/success?listing_id=${listingId}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/submit/payment?listing_id=${listingId}&cancelled=1`,
    // });
    //
    // return NextResponse.json({ url: session.url });

    // Placeholder response
    return NextResponse.json({
      url: `https://checkout.stripe.com/demo?listing_id=${listingId}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
