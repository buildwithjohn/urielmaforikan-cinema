import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Mux from "@mux/mux-node";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Mux webhook — closes the upload loop. When an asset finishes processing,
 * Mux sends `video.asset.ready`; we read the signed playback id + duration and
 * write them onto the film identified by `passthrough` (the film id we set at
 * upload time). Configure the endpoint in Mux → Settings → Webhooks and set
 * MUX_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.MUX_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 400 });
  }

  const body = await request.text();
  const hdrs = await headers();
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
    webhookSecret: secret,
  });

  // Verify the signature, then parse.
  let event: { type: string; data: Record<string, unknown> };
  try {
    mux.webhooks.verifySignature(
      body,
      Object.fromEntries(hdrs.entries()),
      secret,
    );
    event = JSON.parse(body);
  } catch (err) {
    console.error("[mux webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "video.asset.ready") {
    const asset = event.data as {
      id?: string;
      passthrough?: string;
      duration?: number;
      playback_ids?: { id: string; policy: string }[];
    };
    const filmId = asset.passthrough;
    const signed =
      asset.playback_ids?.find((p) => p.policy === "signed") ??
      asset.playback_ids?.[0];

    if (filmId && signed?.id) {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("films")
        .update({
          video_ref: signed.id,
          duration_seconds: asset.duration
            ? Math.round(asset.duration)
            : null,
        })
        .eq("id", filmId);
      if (error) console.error("[mux webhook] film update failed", error);
    }
  }

  return NextResponse.json({ received: true });
}
