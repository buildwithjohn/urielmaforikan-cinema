import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCredits, getFilmBySlug } from "@/lib/data/films";
import { getViewer, tierSatisfies } from "@/lib/auth";
import { LightShafts } from "@/components/brand/light-shafts";
import { Trailer } from "@/components/films/trailer";
import { RespondSection } from "@/components/films/respond-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Play, Lock, Clock, Users } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const film = await getFilmBySlug(slug);
  if (!film) return { title: "Film not found" };
  return {
    title: film.title,
    description: film.logline ?? film.synopsis ?? undefined,
    openGraph: {
      title: film.title,
      description: film.logline ?? undefined,
      images: film.poster_url ? [film.poster_url] : undefined,
    },
  };
}

function runtime(seconds?: number | null) {
  if (!seconds) return null;
  const m = Math.round(seconds / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
}

export default async function FilmDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const film = await getFilmBySlug(slug);
  if (!film) notFound();

  const [credits, viewer] = await Promise.all([getCredits(film.id), getViewer()]);
  const cast = credits.filter((c) => c.role === "cast");
  const crew = credits.filter((c) => c.role === "crew");

  const playable = film.status === "now_showing" && !!film.video_ref;
  const cleared = viewer
    ? tierSatisfies(viewer.access_tier, film.required_tier)
    : film.required_tier === "free";

  return (
    <>
      {/* Backdrop hero */}
      <section className="relative isolate overflow-hidden">
        {film.backdrop_url && (
          <Image
            src={film.backdrop_url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/80 to-navy-deep" />
        <LightShafts density={3} />

        <div className="container relative grid gap-10 py-16 md:grid-cols-[300px_1fr] md:py-24">
          {/* Poster */}
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-xl border border-gold/20 shadow-poster">
            {film.poster_url ? (
              <Image
                src={film.poster_url}
                alt={`${film.title} poster`}
                fill
                sizes="300px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-navy-700">
                {film.title}
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="animate-fade-up">
            <Badge variant={film.status === "now_showing" ? "solid" : "muted"}>
              {film.status === "now_showing"
                ? "Now Showing"
                : film.status === "coming_soon"
                  ? "Coming Soon"
                  : "From the Archive"}
            </Badge>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl">
              {film.title}
            </h1>
            {film.logline && (
              <p className="mt-4 max-w-2xl text-pretty text-lg italic text-gold-light">
                {film.logline}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream-muted">
              {film.release_date && (
                <span>{formatDate(film.release_date)}</span>
              )}
              {runtime(film.duration_seconds) && (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" /> {runtime(film.duration_seconds)}
                </span>
              )}
              <span className="flex items-center gap-1.5 capitalize">
                <Users className="size-4" /> {film.required_tier} access
              </span>
            </div>

            {film.synopsis && (
              <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-cream-dim">
                {film.synopsis}
              </p>
            )}

            {/* Gated watch CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {!playable ? (
                <Button size="lg" disabled>
                  <Clock /> Coming soon
                </Button>
              ) : cleared ? (
                <Button asChild size="lg">
                  <Link href={`/watch/${film.slug}`}>
                    <Play /> Watch now
                  </Link>
                </Button>
              ) : viewer ? (
                <Button asChild size="lg" variant="outline">
                  <Link href="/giving">
                    <Lock /> Become a supporter to watch
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href={`/auth/sign-in?next=/films/${film.slug}`}>
                    <Lock /> Sign in to watch
                  </Link>
                </Button>
              )}
              {film.trailer_ref && (
                <span className="text-sm text-cream-muted">
                  Trailer below ↓
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-16 py-16">
        {/* Trailer */}
        {film.trailer_ref && (
          <section className="mx-auto max-w-4xl">
            <Trailer
              trailerRef={film.trailer_ref}
              posterUrl={film.backdrop_url ?? film.poster_url}
              title={film.title}
            />
          </section>
        )}

        {/* Cast & crew */}
        {credits.length > 0 && (
          <section>
            <h2 className="mb-8 font-serif text-2xl text-cream">Cast & Crew</h2>
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...cast, ...crew].map((c) => (
                <div key={c.id} className="flex gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-gold/20 bg-navy-700">
                    {c.photo_url && (
                      <Image
                        src={c.photo_url}
                        alt={c.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-cream">{c.name}</p>
                    {c.character_or_title && (
                      <p className="text-sm text-gold-light">
                        {c.character_or_title}
                      </p>
                    )}
                    {c.bio && (
                      <p className="mt-1 text-xs leading-relaxed text-cream-muted">
                        {c.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* The ministry hand-off */}
        <section className="mx-auto max-w-4xl">
          <RespondSection
            filmId={film.id}
            responseContent={film.response_content}
          />
        </section>
      </div>
    </>
  );
}
