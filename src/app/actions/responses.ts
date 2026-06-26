"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getViewer } from "@/lib/auth";
import type { ResponseType } from "@/types/db";

const schema = z.object({
  filmId: z.string().uuid().optional(),
  type: z.enum(["prayer", "decision", "contact_request"]),
  message: z.string().trim().max(4000).optional(),
  name: z.string().trim().max(120).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export type ResponseState = { ok: boolean; message: string };

/** Record a Response — the ministry hand-off after a film. May be anonymous. */
export async function submitResponse(
  _prev: ResponseState,
  formData: FormData,
): Promise<ResponseState> {
  const parsed = schema.safeParse({
    filmId: formData.get("filmId") || undefined,
    type: formData.get("type"),
    message: formData.get("message") || undefined,
    name: formData.get("name") || undefined,
    email: formData.get("email") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "Please choose how we can pray with you." };
  }

  const { filmId, type, message, name, email } = parsed.data;
  const viewer = await getViewer();
  const supabase = createAdminClient();

  const { error } = await supabase.from("responses").insert({
    viewer_id: viewer?.id ?? null,
    film_id: filmId ?? null,
    type: type as ResponseType,
    message: message ?? null,
    contact_name: name ?? viewer?.name ?? null,
    contact_email: email || viewer?.email || null,
  });

  if (error) {
    console.error("[submitResponse]", error);
    return { ok: false, message: "We couldn't send that. Please try again." };
  }

  return {
    ok: true,
    message:
      "Thank you. A real person from our team will reach out. You are seen.",
  };
}
