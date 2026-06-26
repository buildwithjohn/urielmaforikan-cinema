"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MuxUploader from "@mux/mux-uploader-react";
import { CheckCircle2, Film, Loader2 } from "lucide-react";

/**
 * Studio film uploader. Uploads the master file DIRECTLY to Mux (never through
 * our server). When Mux finishes processing, the `video.asset.ready` webhook
 * writes the playback id onto this film — so after upload we just tell the
 * admin it's processing.
 */
export function FilmUploader({
  filmId,
  hasVideo,
}: {
  filmId: string;
  hasVideo: boolean;
}) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  // mux-uploader calls this to fetch a fresh, one-time upload URL.
  const endpoint = async () => {
    const res = await fetch("/api/admin/mux-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filmId }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(error);
    }
    const { url } = await res.json();
    return url as string;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-cream-dim">
        <Film className="size-4 text-gold/70" />
        {hasVideo ? (
          <span>
            A film is attached. Uploading a new file replaces it once processed.
          </span>
        ) : (
          <span>No film attached yet. Upload the master file below.</span>
        )}
      </div>

      {done ? (
        <div className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-5">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" />
          <div className="text-sm text-cream">
            <p className="font-medium">Uploaded — now processing at Mux.</p>
            <p className="mt-1 text-cream-dim">
              Captions and adaptive quality are being generated. The film&apos;s
              playback link appears automatically when ready (usually a few
              minutes). Refresh this page shortly.
            </p>
            <button
              onClick={() => router.refresh()}
              className="mt-3 inline-flex items-center gap-2 text-gold underline-offset-4 hover:underline"
            >
              <Loader2 className="size-4" /> Refresh status
            </button>
          </div>
        </div>
      ) : (
        <MuxUploader
          endpoint={endpoint}
          onSuccess={() => setDone(true)}
          style={
            {
              // Brand the uploader to match the studio.
              "--uploader-background-color": "#000000",
              "--uploader-font-color": "#f4efe4",
              "--button-background-color": "#c79a4b",
              "--button-color": "#000000",
              "--progress-bar-fill-color": "#c79a4b",
              borderRadius: "12px",
              border: "1px solid rgba(199,154,75,0.2)",
            } as React.CSSProperties
          }
        />
      )}
    </div>
  );
}
