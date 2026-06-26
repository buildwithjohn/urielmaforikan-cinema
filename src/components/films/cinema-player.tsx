"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { PlaybackToken } from "@/lib/video/types";

// Mux player is client-only and heavy — load it lazily.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-gold/20 bg-navy-deep text-cream-muted">
      Loading the cinema…
    </div>
  ),
});

/**
 * Branded signed-playback player. Calls onEnded so the page can reveal the
 * post-roll response prompt.
 */
export function CinemaPlayer({
  token,
  title,
  onEnded,
}: {
  token: PlaybackToken;
  title: string;
  onEnded?: () => void;
}) {
  const [ended, setEnded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-gold/20 shadow-poster">
      <MuxPlayer
        playbackId={token.playbackId}
        tokens={{
          playback: token.token,
          thumbnail: token.thumbnailToken,
          storyboard: token.storyboardToken,
        }}
        metadata={{ video_title: title }}
        streamType="on-demand"
        accentColor="#c79a4b"
        style={{ aspectRatio: "16 / 9", width: "100%" }}
        onEnded={() => {
          if (!ended) {
            setEnded(true);
            onEnded?.();
          }
        }}
      />
    </div>
  );
}
