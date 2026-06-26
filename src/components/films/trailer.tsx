"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Lightweight trailer embed. Treats trailer_ref as a YouTube id by default
 * (swap the iframe src if your trailers live on Mux/Vimeo). Click-to-load
 * so we don't ship a third-party player on first paint.
 */
export function Trailer({
  trailerRef,
  posterUrl,
  title,
}: {
  trailerRef: string;
  posterUrl?: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-gold/20">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${trailerRef}?autoplay=1&rel=0`}
          title={`${title} — trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-gold/20"
      style={
        posterUrl
          ? {
              backgroundImage: `url(${posterUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      aria-label={`Play ${title} trailer`}
    >
      <div className="absolute inset-0 bg-navy-deep/55 transition-colors group-hover:bg-navy-deep/35" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-gold/60 bg-navy-deep/60 backdrop-blur transition-transform group-hover:scale-110">
          <Play className="ml-1 size-7 text-gold" fill="currentColor" />
        </span>
      </div>
      <span className="absolute bottom-4 left-4 text-xs uppercase tracking-widest text-cream">
        Watch the trailer
      </span>
    </button>
  );
}
