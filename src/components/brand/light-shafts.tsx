"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The signature: gold light shafts drifting through the dark.
 * Light-into-dark is the brand. Honors prefers-reduced-motion by holding
 * the beams still (they remain as a static gradient wash).
 */
export function LightShafts({
  className,
  density = 3,
}: {
  className?: string;
  density?: number;
}) {
  const reduce = useReducedMotion();
  const shafts = Array.from({ length: density });

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {shafts.map((_, i) => {
        const left = 8 + (i * 78) / Math.max(density - 1, 1);
        const rotate = -14 + i * 5;
        return (
          <motion.div
            key={i}
            className="light-shaft"
            style={{ left: `${left}%`, rotate: `${rotate}deg` }}
            initial={{ opacity: 0.3 }}
            animate={
              reduce
                ? { opacity: 0.22 }
                : {
                    opacity: [0.25, 0.55, 0.3],
                    x: [0, 22, 0],
                  }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 9 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.8,
                  }
            }
          />
        );
      })}
      <div className="grain" />
    </div>
  );
}
