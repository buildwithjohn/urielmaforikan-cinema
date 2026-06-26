import type { Metadata } from "next";
import Link from "next/link";
import { LightShafts } from "@/components/brand/light-shafts";
import { Reveal, RevealGroup, RevealItem } from "@/components/brand/reveal";
import { IllustrationSlot } from "@/components/brand/illustration-slot";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import {
  Camera,
  DoorOpen,
  HandHeart,
  Compass,
  Eye,
  Clapperboard,
  Sparkles,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Evangelists who carry cameras. The story, mission, and vision behind Uriel Maforikan Productions.",
  openGraph: {
    title: "About · Uriel Maforikan Productions",
    description: "Evangelists who carry cameras.",
    images: [
      "/api/og?title=Evangelists%20who%20carry%20cameras&subtitle=The%20story%20behind%20the%20films&badge=About",
    ],
  },
};

const VALUES = [
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
    icon: Clapperboard,
    title: "The Audience",
    body: "We gather people to watch together — premieres that open at a set hour, so the whole audience meets the story at once.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-deep to-navy-deep" />
        <LightShafts density={4} />
        <div className="container relative grid items-center gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="animate-fade-up">
            <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-10 bg-gold/50" />
              Our story
            </div>
            <h1 className="text-balance font-serif text-5xl leading-[1.05] sm:text-6xl">
              <span className="text-cream">Evangelists who </span>
              <span className="text-gilded">carry cameras.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-dim">
              We believe a story can go where a sermon sometimes can&apos;t — past
              the defenses, into the heart, in the dark of a cinema. So we make
              films, and we keep the doors open for whoever the light reaches.
            </p>
          </div>
          <Reveal direction="left">
            <IllustrationSlot
              icon={Camera}
              alt="A figure holding a camera that casts a beam of gold light into the dark — carrying light into dark places."
              aspect="aspect-square"
            />
          </Reveal>
        </div>
      </section>

      {/* ── The why ──────────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right" className="order-2 lg:order-1">
            <IllustrationSlot
              icon={DoorOpen}
              alt="An open cinema door with gold light pouring out into a dark street."
            />
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Why film"
              title="Light into dark is the whole idea."
              description="It's our look — gold shafts drifting through deep navy — but it's also our theology. Christ is the light that the darkness has never overcome. Film is simply our way of carrying a little of that light into a dark room, and trusting it to do what light does."
            />
            <p className="mt-4 leading-relaxed text-cream-dim">
              We are not trying to make people watch forever. We are trying to make
              a film end <em className="text-cream">well</em> — so that when the
              lights come up, there is a next step waiting, and a real person to
              take it with.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-gold/10 bg-navy">
        <LightShafts density={2} className="opacity-60" />
        <div className="container relative py-20">
          <Reveal>
            <SectionHeading
              eyebrow="What we carry"
              title="Four convictions behind every frame."
              align="center"
            />
          </Reveal>
          <RevealGroup className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <RevealItem
                key={title}
                className="flex gap-4 rounded-xl border border-gold/10 bg-navy-deep/40 p-6"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/5">
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

      {/* ── The hand-off, illustrated ────────────────────────────── */}
      <section className="container py-20">
        <Reveal>
          <SectionHeading
            eyebrow="The hand-off"
            title="The most important moment isn't the movie."
            description="It's the second after. Here's what happens when one of our films reaches someone."
          />
        </Reveal>
        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              step: "01",
              title: "The film ends",
              body: "No autoplay, no next-up. The screen turns to a single, personal invitation written for that story.",
            },
            {
              icon: HandHeart,
              step: "02",
              title: "Someone responds",
              body: "A request for prayer. A decision to follow Jesus. A simple 'can we talk?' — anonymously if they wish.",
            },
            {
              icon: Heart,
              step: "03",
              title: "A person reaches back",
              body: "Not an autoresponder. A real member of our team prays with them and walks the next step alongside them.",
            },
          ].map(({ icon: Icon, step, title, body }) => (
            <RevealItem
              key={step}
              className="card-gold-edge p-7"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-6 text-gold" strokeWidth={1.5} />
                <span className="font-serif text-3xl text-gold/30">{step}</span>
              </div>
              <h3 className="mt-5 font-serif text-2xl text-cream">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="container pb-24">
        <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gold/20 bg-navy p-10 text-center shadow-glow sm:p-14">
          <LightShafts density={2} />
          <div className="relative">
            <h2 className="text-balance font-serif text-3xl text-cream sm:text-4xl">
              Come and see — then carry the light further.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream-dim">
              Watch a film, join the audience, or help fund the next story.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/films">Enter the cinema</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/giving">Partner with us</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
