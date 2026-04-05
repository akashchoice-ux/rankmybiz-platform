import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Stripe webhook handler
// This route receives events from Stripe and updates payment/listing status automatically.
// In production: set STRIPE_WEBHOOK_SECRET in Vercel environment variables.

export async function POST(req: Request) {
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    const body = await req.text();

    // TODO: const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // Placeholder parse for schema completeness
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle relevant events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const listingId = session.metadata?.listing_id;

      if (listingId) {
        // TODO with Supabase admin client:
        // 1. Update payments: status = 'paid', paid_at = now(), stripe_session_id = session.id
        // 2. Update listings: status = 'pending_review'
        // 3. Send confirmation email via Resend
        console.log(`Payment confirmed for listing: ${listingId}`);
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      const listingId = session.metadata?.listing_id;

      if (listingId) {
        // TODO: Update payments: status = 'failed'
        // Listing stays at 'pending_payment' — user can retry
        console.log(`Payment expired for listing: ${listingId}`);
      }
      break;
    }

    case "invoice.payment_succeeded": {
      // Handle recurring subscription renewal
      // TODO: Extend subscription validity
      break;
    }

    case "customer.subscription.deleted": {
      // Handle subscription cancellation / expiry
      // TODO: Update listing status to 'suspended'
      break;
    }

    default:
      // Ignore unhandled events
      break;
  }

  return NextResponse.json({ received: true });
}
