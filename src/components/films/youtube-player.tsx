"use client";

import { useEffect, useRef } from "react";

// Minimal typing for the YouTube IFrame API we use.
declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: unknown) => unknown;
      PlayerState: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * YouTube-hosted feature player. Uses the IFrame API so we can detect when the
 * film ends and trigger the post-roll ministry hand-off — same as the Mux path.
 */
export function YouTubePlayer({
  youtubeId,
  title,
  onEnded,
}: {
  youtubeId: string;
  title: string;
  onEnded?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player: { destroy?: () => void } | null = null;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !hostRef.current || !window.YT) return;
      player = new window.YT.Player(hostRef.current, {
        videoId: youtubeId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e: { data: number }) => {
            if (e.data === window.YT?.PlayerState.ENDED) onEnded?.();
          },
        },
      }) as { destroy?: () => void };
    });

    return () => {
      cancelled = true;
      player?.destroy?.();
    };
  }, [youtubeId, onEnded]);

  return (
    <div className="overflow-hidden rounded-xl border border-gold/20 shadow-poster">
      <div className="aspect-video w-full bg-navy-deep">
        {/* The API replaces this node with the iframe. */}
        <div ref={hostRef} className="h-full w-full" aria-label={`${title} player`} />
      </div>
    </div>
  );
}
