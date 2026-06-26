"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getPaymentsProvider } from "@/lib/payments";
import { createAdminClient } from "@/lib/supabase/admin";
import { getViewer } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";

const schema = z.object({
  amount: z.coerce.number().min(1).max(100000), // whole currency units
  currency: z.string().default("usd"),
  recurrence: z.enum(["one_time", "monthly"]).default("one_time"),
  designatedFilmId: z.string().uuid().optional().or(z.literal("")),
  designatedFund: z.string().max(120).optional(),
  email: z.string().email().optional().or(z.literal("")),
  name: z.string().max(120).optional(),
});

/** Create a giving checkout session and redirect the donor to the processor. */
export async function createGiftCheckout(formData: FormData) {
  const parsed = schema.safeParse({
    amount: formData.get("amount"),
    currency: formData.get("currency") || "usd",
    recurrence: formData.get("recurrence") || "one_time",
    designatedFilmId: formData.get("designatedFilmId") || undefined,
    designatedFund: formData.get("designatedFund") || undefined,
    email: formData.get("email") || undefined,
    name: formData.get("name") || undefined,
  });

  if (!parsed.success) {
    redirect("/giving?error=invalid");
  }

  const data = parsed.data;
  const viewer = await getViewer();
  const provider = getPaymentsProvider();

  const session = await provider.createCheckout({
    amountMinor: Math.round(data.amount * 100),
    currency: data.currency,
    recurrence: data.recurrence,
    email: data.email || viewer?.email || undefined,
    name: data.name || viewer?.name || undefined,
    designatedFilmId: data.designatedFilmId || null,
    designatedFund: data.designatedFund || "general",
    successUrl: absoluteUrl("/giving/thank-you?session_id={CHECKOUT_SESSION_ID}"),
    cancelUrl: absoluteUrl("/giving?canceled=1"),
    metadata: { viewer_id: viewer?.id ?? "" },
  });

  // Record a pending gift for reconciliation; the webhook flips it to succeeded.
  const supabase = createAdminClient();
  await supabase.from("gifts").insert({
    viewer_id: viewer?.id ?? null,
    amount: Math.round(data.amount * 100),
    currency: data.currency,
    recurrence: data.recurrence,
    designated_film_id: data.designatedFilmId || null,
    designated_fund: data.designatedFund || "general",
    processor: provider.name,
    processor_ref: session.reference,
    status: "pending",
    donor_email: data.email || viewer?.email || null,
    donor_name: data.name || viewer?.name || null,
  });

  redirect(session.url);
}
