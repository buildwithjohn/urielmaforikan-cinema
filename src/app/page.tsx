import Link from "next/link";
import Image from "next/image";
import { getFeaturedFilm, getFilms } from "@/lib/data/films";
import { LightShafts } from "@/components/brand/light-shafts";
import { HeroBackdrop } from "@/components/brand/hero-backdrop";
import { Reveal, RevealGroup, RevealItem } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { FilmCard } from "@/components/films/film-card";
import { JoinAudienceForm } from "@/components/site/join-audience-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Compass, Eye, HandHeart, ArrowRight, Clapperboard } from "lucide-react";

export default async function HomePage() {
  const [featured, nowShowing] = await Promise.all([
    getFeaturedFilm(),
    getFilms({ status: "now_showing" }),
  ]);

  return (
    <>
      {/* ── Cinematic hero ──────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <HeroBackdrop imageSrc={featured?.backdrop_url} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/85 to-navy-deep" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
        <LightShafts density={4} />

        <div className="container relative grid items-center gap-10 py-16 sm:py-20 lg:min-h-[88vh] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-fade-up">
            <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-10 bg-gold/50" />
              Evangelists who carry cameras
            </div>
            <h1 className="text-balance font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              <span className="text-cream">Light into </span>
              <span className="text-gilded">dark.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-dim">
              A virtual cinema for the films of Uriel Maforikan Productions.
              Every story is told to the very end — and when the lights come up,
              there is always a next step waiting.
            </p>

            {featured && (
              <div className="mt-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="lg" className="group">
                    <Link href={`/films/${featured.slug}`}>
                      {featured.status === "now_showing" && featured.video_ref ? (
                        <>
                          <Play className="transition-transform group-hover:scale-110" />
                          Watch {featured.title}
                        </>
                      ) : (
                        <>
                          <Clapperboard />
                          Discover {featured.title}
                          <ArrowRight className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/films">Browse the cinema</Link>
                  </Button>
                </div>
                {featured.status === "coming_soon" && (
                  <p className="mt-4 text-sm text-cream-muted">
                    <span className="text-gold">In production.</span>{" "}
                    <Link href="/#join" className="underline-offset-4 hover:text-cream hover:underline">
                      Join the audience
                    </Link>{" "}
                    to be first through the doors.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Featured poster */}
          {featured?.poster_url && (
            <Link
              href={`/films/${featured.slug}`}
              className="group relative mx-auto block w-full max-w-[15rem] sm:max-w-xs lg:max-w-sm"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-gold/20 shadow-poster">
                <Image
                  src={featured.poster_url}
                  alt={`${featured.title} poster`}
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <Badge variant="solid" className="mb-3">
                    {featured.status === "coming_soon"
                      ? "In Production"
                      : featured.status === "archive"
                        ? "From the Archive"
                        : "Featured Film"}
                  </Badge>
                  <h2 className="font-serif text-3xl text-cream">
                    {featured.title}
                  </h2>
                  {featured.logline && (
                    <p className="mt-2 max-w-xs text-sm text-cream-dim">
                      {featured.logline}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ── Now Showing ─────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="The Cinema"
            title="Now Showing"
            description="Films currently open to the audience. Sign in to watch in full."
          />
          <Button asChild variant="link" className="hidden sm:inline-flex">
            <Link href="/films">All films →</Link>
          </Button>
        </div>

        {nowShowing.length > 0 ? (
          <RevealGroup className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {nowShowing.map((film) => (
              <RevealItem key={film.id}>
                <FilmCard film={film} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="mt-10 text-cream-muted">
            No films are open right now — a premiere is on the way.
          </p>
        )}
      </section>

      {/* ── Mission & Vision ────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-gold/10 bg-navy">
        <LightShafts density={2} className="opacity-60" />
        <div className="container relative grid gap-12 py-20 md:grid-cols-3">
          <SectionHeading
            eyebrow="Our Calling"
            title="We make films the way evangelists carry cameras."
            className="md:col-span-1"
          />
          <RevealGroup className="grid gap-8 md:col-span-2 sm:grid-cols-2">
            {[
              {
                icon: Compass,
                title: "Mission",
                body: "To tell true, beautiful stories that carry the gospel into rooms a sermon may never reach — and to walk with everyone the story moves.",
              },
              {
                icon: Eye,
                title: "Vision",
                body: "A generation that meets Christ in the dark of a cinema and steps into the light changed — film as the first word, not the last.",
              },
              {
                icon: HandHeart,
                title: "The Hand-off",
                body: "Every film ends in an invitation. Prayer, a decision, a real conversation — a person on our team responds to each one.",
              },
              {
                icon: Play,
                title: "The Audience",
                body: "We gather people to watch together — premieres that open at a set hour, so the whole audience meets the story at once.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <RevealItem key={title} className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/5 transition-transform duration-300 hover:scale-110 hover:border-gold/60">
                  <Icon className="size-5 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-cream">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream-dim">
                    {body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Join the audience ───────────────────────────────────── */}
      <section id="join" className="container py-24">
        <Reveal className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gold/20 bg-navy p-8 shadow-glow sm:p-12">
          <LightShafts density={2} />
          <div className="relative">
            <SectionHeading
              eyebrow="Join the audience"
              title="Be first through the doors."
              description="Get premiere invites and word when a new film opens. No noise — only when the lights are about to go down."
            />
            <div className="mt-8">
              <JoinAudienceForm />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
