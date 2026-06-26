import "server-only";
import { stripeProvider } from "./stripe";
import type { PaymentsProvider, PaymentsProviderName } from "./types";

export * from "./types";

const providers: Partial<Record<PaymentsProviderName, PaymentsProvider>> = {
  stripe: stripeProvider,
  // paystack: paystackProvider,   // Nigerian rails — implement & register here
  // flutterwave: flutterwaveProvider,
};

export function getPaymentsProvider(): PaymentsProvider {
  const name = (process.env.PAYMENTS_PROVIDER ?? "stripe") as PaymentsProviderName;
  const provider = providers[name];
  if (!provider) {
    throw new Error(
      `Payments provider "${name}" is not implemented. Available: ${Object.keys(
        providers,
      ).join(", ")}`,
    );
  }
  return provider;
}
