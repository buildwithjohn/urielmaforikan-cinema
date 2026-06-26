import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Film } from "@/types/db";
import { PlayCircle } from "lucide-react";

const STATUS_LABEL: Record<Film["status"], string> = {
  now_showing: "Now Showing",
  coming_soon: "Coming Soon",
  archive: "From the Archive",
};

export function FilmCard({ film }: { film: Film }) {
  return (
    <Link
      href={`/films/${film.slug}`}
      className="card-gold-edge group block focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {film.poster_url ? (
          <Image
            src={film.poster_url}
            alt={`${film.title} poster`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy-700 text-cream-muted">
            {film.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge variant={film.status === "now_showing" ? "solid" : "muted"}>
            {STATUS_LABEL[film.status]}
          </Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <PlayCircle className="size-14 text-gold drop-shadow-lg" strokeWidth={1} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-xl leading-tight text-cream transition-colors group-hover:text-gold-light">
          {film.title}
        </h3>
        {film.logline && (
          <p className="mt-1.5 line-clamp-2 text-sm text-cream-dim">
            {film.logline}
          </p>
        )}
        {film.release_date && (
          <p className="mt-3 text-xs uppercase tracking-wider text-cream-muted">
            {formatDate(film.release_date)}
          </p>
        )}
      </div>
    </Link>
  );
}
