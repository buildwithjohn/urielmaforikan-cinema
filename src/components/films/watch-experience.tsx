"use client";

import { useRef, useState } from "react";
import { CinemaPlayer } from "./cinema-player";
import { YouTubePlayer } from "./youtube-player";
import { RespondSection } from "./respond-section";
import type { PlaybackToken } from "@/lib/video/types";
import { ChevronDown } from "lucide-react";

type Media =
  | { kind: "mux"; token: PlaybackToken }
  | { kind: "youtube"; youtubeId: string };

/** Player + post-roll hand-off. The response prompt fades in when the film ends. */
export function WatchExperience({
  media,
  filmId,
  title,
  responseContent,
}: {
  media: Media;
  filmId: string;
  title: string;
  responseContent?: string | null;
}) {
  const [ended, setEnded] = useState(false);
  const respondRef = useRef<HTMLDivElement>(null);

  const handleEnded = () => {
    setEnded(true);
    setTimeout(
      () => respondRef.current?.scrollIntoView({ behavior: "smooth" }),
      400,
    );
  };

  return (
    <div className="space-y-10">
      {media.kind === "mux" ? (
        <CinemaPlayer token={media.token} title={title} onEnded={handleEnded} />
      ) : (
        <YouTubePlayer
          youtubeId={media.youtubeId}
          title={title}
          onEnded={handleEnded}
        />
      )}

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
