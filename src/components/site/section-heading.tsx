import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-gold/50" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty leading-relaxed text-cream-dim">
          {description}
        </p>
      )}
    </div>
  );
}
