"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { addToAudience, sendWelcomeEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  name: z.string().trim().max(120).optional(),
  consent: z
    .union([z.literal("on"), z.boolean()])
    .optional()
    .transform((v) => v === "on" || v === true),
});

export type AudienceState = {
  ok: boolean;
  message: string;
};

/** Join the audience: upsert a Viewer, add to Resend, send welcome. */
export async function joinAudience(
  _prev: AudienceState,
  formData: FormData,
): Promise<AudienceState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") || undefined,
    consent: formData.get("consent") ?? undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const { email, name, consent } = parsed.data;
  const supabase = createAdminClient();

  // Upsert by lower(email) — the audience list is unique per person.
  const { error } = await supabase.from("viewers").upsert(
    {
      email: email.toLowerCase(),
      name: name ?? null,
      access_tier: "free",
      consent_email: consent,
      consent_terms: true,
    },
    { onConflict: "email", ignoreDuplicates: false },
  );

  if (error) {
    console.error("[joinAudience]", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  // Fire-and-forget the email side-effects (don't block the response).
  await Promise.allSettled([
    addToAudience(email, name),
    sendWelcomeEmail(email, name),
  ]);

  return {
    ok: true,
    message: "Welcome to the audience. Check your inbox — the doors are open.",
  };
}
