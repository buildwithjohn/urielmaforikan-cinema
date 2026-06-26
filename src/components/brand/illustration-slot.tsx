import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A framed slot for a brand illustration. If `src` points at a generated
 * illustration (see docs/BRAND_ASSETS.md §5), it renders it; otherwise it shows
 * an elegant gold-on-navy placeholder with an icon so the layout looks intentional
 * before art exists. Swap in the image by setting `src` — no layout change.
 */
export function IllustrationSlot({
  src,
  alt,
  icon: Icon,
  className,
  aspect = "aspect-[4/3]",
}: {
  src?: string | null;
  alt: string;
  icon: LucideIcon;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gold/20 bg-navy",
        aspect,
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* light-shaft wash */}
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(199,154,75,0.15),transparent_70%)]" />
          <div className="absolute left-1/2 top-0 h-full w-1/3 -translate-x-1/2 rotate-6 bg-gradient-to-b from-transparent via-gold/10 to-transparent blur-2xl" />
          <Icon
            className="relative size-16 text-gold/70"
            strokeWidth={1}
            aria-hidden
          />
          <span className="sr-only">{alt}</span>
        </div>
      )}
    </div>
  );
}
