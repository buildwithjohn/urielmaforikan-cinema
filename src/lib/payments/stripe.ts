import "server-only";
import Stripe from "stripe";
import type { CheckoutSession, PaymentsProvider } from "./types";

let _stripe: Stripe | null = null;
export function stripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

export const stripeProvider: PaymentsProvider = {
  name: "stripe",

  async createCheckout(req): Promise<CheckoutSession> {
    const recurring = req.recurrence === "monthly";
    const metadata = {
      designated_film_id: req.designatedFilmId ?? "",
      designated_fund: req.designatedFund ?? "general",
      recurrence: req.recurrence,
      donor_name: req.name ?? "",
      ...req.metadata,
    };

    const session = await stripe().checkout.sessions.create({
      mode: recurring ? "subscription" : "payment",
      customer_email: req.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: req.currency,
            unit_amount: req.amountMinor,
            recurring: recurring ? { interval: "month" } : undefined,
            product_data: {
              name: req.designatedFilmId
                ? "Fund the next production"
                : "Partner with the ministry",
              description:
                req.designatedFund && req.designatedFund !== "general"
                  ? `Designated: ${req.designatedFund}`
                  : undefined,
            },
          },
        },
      ],
      success_url: req.successUrl,
      cancel_url: req.cancelUrl,
      metadata,
      ...(recurring ? { subscription_data: { metadata } } : {}),
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return { url: session.url, reference: session.id, provider: "stripe" };
  },
};
