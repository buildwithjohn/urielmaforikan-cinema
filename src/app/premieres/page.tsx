import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPremieres } from "@/lib/data/premieres";
import { getViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LightShafts } from "@/components/brand/light-shafts";
import { SectionHeading } from "@/components/site/section-heading";
import { Countdown } from "@/components/premieres/countdown";
import { RsvpButton } from "@/components/premieres/rsvp-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Clapperboard } from "lucide-react";

export const metadata: Metadata = {
  title: "Premieres",
  description: "Watch together — films that open at a set hour for the whole audience.",
};

export default async function PremieresPage() {
  const [premieres, viewer] = await Promise.all([getPremieres(), getViewer()]);

  // Which premieres has this viewer already reserved?
  let rsvpedIds = new Set<string>();
  if (viewer) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("premiere_rsvps")
      .select("premiere_id")
      .eq("viewer_id", viewer.id);
    rsvpedIds = new Set((data ?? []).map((r) => r.premiere_id));
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/10 bg-navy">
        <LightShafts density={3} />
        <div className="container relative py-20">
          <SectionHeading
            eyebrow="Watch together"
            title="Premieres"
            description="A premiere opens at a set hour. Reserve a seat and meet the whole audience the moment the lights go down."
          />
        </div>
      </section>

      <div className="container space-y-8 py-16">
        {premieres.length === 0 && (
          <div className="rounded-xl border border-border bg-navy p-12 text-center">
            <Clapperboard className="mx-auto mb-4 size-10 text-gold/60" strokeWidth={1.2} />
            <p className="text-cream-dim">
              No premieres scheduled right now.{" "}
              <Link href="/#join" className="text-gold underline-offset-4 hover:underline">
                Join the audience
              </Link>{" "}
              to hear about the next one.
            </p>
          </div>
        )}

        {premieres.map((p) => {
          const film = p.film;
          return (
            <article
              key={p.id}
              className="card-gold-edge grid gap-6 p-6 md:grid-cols-[200px_1fr] md:p-8"
            >
              <div className="relative mx-auto aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg border border-gold/15">
                {film?.poster_url ? (
                  <Image
                    src={film.poster_url}
                    alt={`${film.title} poster`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-navy-700 text-cream-muted">
                    {film?.title}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <Badge variant="muted" className="w-fit">
                  {formatDate(p.scheduled_open_at)} ·{" "}
                  {new Date(p.scheduled_open_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </Badge>

                <h2 className="mt-3 font-serif text-3xl text-cream">
                  {p.title ?? film?.title}
                </h2>
                {film?.logline && (
                  <p className="mt-2 max-w-xl text-pretty text-cream-dim">
                    {film.logline}
                  </p>
                )}

                <div className="mt-6">
                  <Countdown target={p.scheduled_open_at} />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <RsvpButton
                    premiereId={p.id}
                    signedIn={!!viewer}
                    alreadyRsvped={rsvpedIds.has(p.id)}
                  />
                  {film && (
                    <Button asChild variant="ghost">
                      <Link href={`/films/${film.slug}`}>About the film →</Link>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
