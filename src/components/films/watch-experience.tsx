"use client";

import { useRef, useState } from "react";
import { CinemaPlayer } from "./cinema-player";
import { RespondSection } from "./respond-section";
import type { PlaybackToken } from "@/lib/video/types";
import { ChevronDown } from "lucide-react";

/** Player + post-roll hand-off. The response prompt fades in when the film ends. */
export function WatchExperience({
  token,
  filmId,
  title,
  responseContent,
}: {
  token: PlaybackToken;
  filmId: string;
  title: string;
  responseContent?: string | null;
}) {
  const [ended, setEnded] = useState(false);
  const respondRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-10">
      <CinemaPlayer
        token={token}
        title={title}
        onEnded={() => {
          setEnded(true);
          // gently bring the hand-off into view
          setTimeout(
            () => respondRef.current?.scrollIntoView({ behavior: "smooth" }),
            400,
          );
        }}
      />

      {!ended && (
        <p className="flex items-center justify-center gap-2 text-sm text-cream-muted">
          <ChevronDown className="size-4 animate-bounce text-gold/60" />
          When the film ends, there&apos;s a next step waiting below.
        </p>
      )}

      <div
        ref={respondRef}
        className={`transition-all duration-700 ${
          ended ? "opacity-100" : "opacity-60"
        }`}
      >
        <RespondSection filmId={filmId} responseContent={responseContent} />
      </div>
    </div>
  );
}
