// Provider-agnostic giving contract. Stripe today; Paystack / Flutterwave
// (Nigerian rails) implement the same interface and register in index.ts.

export type PaymentsProviderName = "stripe" | "paystack" | "flutterwave";

export interface CheckoutRequest {
  amountMinor: number; // cents / kobo
  currency: string; // "usd" | "ngn" ...
  recurrence: "one_time" | "monthly";
  email?: string;
  name?: string;
  designatedFilmId?: string | null;
  designatedFund?: string | null;
  successUrl: string;
  cancelUrl: string;
  /** Free-form metadata stored on the processor + echoed back via webhook. */
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  /** URL to redirect the donor to in order to complete payment. */
  url: string;
  /** Processor reference for reconciliation (session/intent id). */
  reference: string;
  provider: PaymentsProviderName;
}

export interface PaymentsProvider {
  readonly name: PaymentsProviderName;
  createCheckout(req: CheckoutRequest): Promise<CheckoutSession>;
}
