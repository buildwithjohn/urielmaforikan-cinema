import Link from "next/link";
import { cn } from "@/lib/utils";

/** The ministry wordmark — serif name over the tagline, gold rule. */
export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex flex-col", className)}>
      <span className="font-serif text-lg leading-none tracking-wide text-cream transition-colors group-hover:text-gold-light sm:text-xl">
        Uriel Maforikan
        <span className="text-gold"> Productions</span>
      </span>
      {!compact && (
        <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-cream-muted">
          Evangelists who carry cameras
        </span>
      )}
    </Link>
  );
}
