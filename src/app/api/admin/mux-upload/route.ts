import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getUploadUrl } from "@/lib/video";

/**
 * Mints a one-time Mux direct-upload URL for the studio uploader.
 * Admin-only. The film id is passed as `passthrough` so the Mux webhook can
 * write the resulting playback id back onto the right film.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { filmId } = (await request.json().catch(() => ({}))) as {
    filmId?: string;
  };
  if (!filmId) {
    return NextResponse.json({ error: "Missing filmId" }, { status: 400 });
  }

  try {
    const ticket = await getUploadUrl({ passthrough: filmId });
    return NextResponse.json({ url: ticket.uploadUrl, id: ticket.uploadId });
  } catch (err) {
    console.error("[mux-upload]", err);
    return NextResponse.json(
      { error: "Could not create upload. Check MUX_* keys." },
      { status: 500 },
    );
  }
}
