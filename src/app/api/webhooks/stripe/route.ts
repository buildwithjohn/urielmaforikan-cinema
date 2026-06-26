import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe webhook. Verifies the signature, then flips the matching pending Gift
 * to its terminal status. Configure the endpoint URL in the Stripe dashboard
 * and set STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get("stripe-signature");
  if (!secret || !sig) {
    return NextResponse.json({ error: "Not configured" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await supabase
        .from("gifts")
        .update({
          status: "succeeded",
          donor_email: session.customer_details?.email ?? undefined,
        })
        .eq("processor_ref", session.id);
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await supabase
        .from("gifts")
        .update({ status: "failed" })
        .eq("processor_ref", session.id);
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const ref = charge.payment_intent;
      if (typeof ref === "string") {
        await supabase
          .from("gifts")
          .update({ status: "refunded" })
          .eq("processor_ref", ref);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
