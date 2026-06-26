"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const clamp = Math.max(0, ms);
  return {
    days: Math.floor(clamp / 86400000),
    hours: Math.floor((clamp / 3600000) % 24),
    minutes: Math.floor((clamp / 60000) % 60),
    seconds: Math.floor((clamp / 1000) % 60),
  };
}

/** Live countdown to a premiere's open time. Renders "doors open" at zero. */
export function Countdown({
  target,
  onOpen,
}: {
  target: string;
  onOpen?: () => void;
}) {
  const targetMs = new Date(target).getTime();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const next = targetMs - Date.now();
      setRemaining(next);
      if (next <= 0) onOpen?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs, onOpen]);

  // Avoid hydration mismatch — render nothing until mounted.
  if (remaining === null) {
    return <div className="h-[58px]" aria-hidden />;
  }

  if (remaining <= 0) {
    return (
      <span className="inline-flex items-center gap-2 text-gold">
        <span className="size-2 animate-pulse rounded-full bg-gold" />
        The doors are open
      </span>
    );
  }

  const t = parts(remaining);
  const units: [string, number][] = [
    ["Days", t.days],
    ["Hrs", t.hours],
    ["Min", t.minutes],
    ["Sec", t.seconds],
  ];

  return (
    <div className="flex gap-3" role="timer" aria-label="Time until premiere">
      {units.map(([label, value]) => (
        <div
          key={label}
          className="flex min-w-14 flex-col items-center rounded-lg border border-gold/20 bg-navy-deep/60 px-3 py-2"
        >
          <span className="font-serif text-2xl tabular-nums text-cream">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-cream-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
