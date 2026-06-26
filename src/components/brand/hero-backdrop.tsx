"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

/**
 * Cinematic hero backdrop. Renders a still image immediately, then fades a
 * looping background video over it once it can play. If the video is missing
 * (404) or the user prefers reduced motion, the still image simply stays.
 *
 * Drop your generated loop at `public/media/hero-loop.mp4` (+ optional .webm).
 */
export function HeroBackdrop({
  videoSrc = "/media/hero-loop.mp4",
  webmSrc = "/media/hero-loop.webm",
  imageSrc,
  className = "opacity-30",
}: {
  videoSrc?: string;
  webmSrc?: string;
  imageSrc?: string | null;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [canPlay, setCanPlay] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduce) return;
    // Nudge autoplay on browsers that need an explicit play() call.
    ref.current?.play().catch(() => {});
  }, [reduce]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${className}`}
        />
      )}
      {!reduce && (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setCanPlay(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            canPlay ? "opacity-40" : "opacity-0"
          }`}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
