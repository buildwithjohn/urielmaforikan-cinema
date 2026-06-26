"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getViewer } from "@/lib/auth";
import { sendPremiereInvite } from "@/lib/email";
import { getPremiereById } from "@/lib/data/premieres";
import { absoluteUrl, formatDate } from "@/lib/utils";

export type RsvpState = { ok: boolean; message: string };

/** RSVP the signed-in viewer to a premiere (idempotent) and email a reminder. */
export async function rsvpToPremiere(
  _prev: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const premiereId = String(formData.get("premiereId") ?? "");
  if (!premiereId) return { ok: false, message: "Missing premiere." };

  const viewer = await getViewer();
  if (!viewer) {
    return { ok: false, message: "Please sign in to reserve your seat." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("premiere_rsvps")
    .upsert(
      { premiere_id: premiereId, viewer_id: viewer.id },
      { onConflict: "premiere_id,viewer_id", ignoreDuplicates: true },
    );

  if (error) {
    console.error("[rsvpToPremiere]", error);
    return { ok: false, message: "Couldn't reserve your seat. Try again." };
  }

  const premiere = await getPremiereById(premiereId);
  if (premiere?.film) {
    await sendPremiereInvite({
      to: viewer.email,
      name: viewer.name,
      filmTitle: premiere.film.title,
      premiereUrl: absoluteUrl("/premieres"),
      opensAt: formatDate(premiere.scheduled_open_at) ?? "soon",
    }).catch(() => {});
  }

  revalidatePath("/premieres");
  return { ok: true, message: "Your seat is reserved. We'll hold the doors." };
}
