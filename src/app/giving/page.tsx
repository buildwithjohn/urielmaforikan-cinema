import type { Metadata } from "next";
import { getFilms } from "@/lib/data/films";
import { LightShafts } from "@/components/brand/light-shafts";
import { SectionHeading } from "@/components/site/section-heading";
import { GiftForm } from "@/components/giving/gift-form";
import { Film, Globe, HandHeart } from "lucide-react";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Fund the next production and partner with the ministry behind the films.",
};

export default async function GivingPage({
  searchParams,
}: {
  searchParams: Promise<{ film?: string }>;
}) {
  const [films, sp] = await Promise.all([getFilms(), searchParams]);
  const fundable = films
    .filter((f) => f.status !== "archive")
    .map((f) => ({ id: f.id, title: f.title }));

  return (
    <section className="relative isolate overflow-hidden">
      <LightShafts density={3} />
      <div className="container relative grid gap-12 py-20 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Partner with us"
            title="Fund the next production."
            description="Every film is made on faith and given freely to whoever the lights reach. Your gift pays for cameras, crew, and the people who respond when the credits roll."
          />

          <div className="mt-10 space-y-6">
            {[
              {
                icon: Film,
                title: "Fund a film",
                body: "Designate your gift to a specific production in the works.",
              },
              {
                icon: HandHeart,
                title: "Resource the hand-off",
                body: "Support the team who pray with and follow up every responder.",
              },
              {
                icon: Globe,
                title: "Become a monthly partner",
                body: "Steady support lets us plan, cast, and shoot the next story.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/5">
                  <Icon className="size-5 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-serif text-lg text-cream">{title}</p>
                  <p className="text-sm text-cream-dim">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gold/20 bg-navy p-7 sm:p-9">
          <h2 className="mb-6 font-serif text-2xl text-cream">Make a gift</h2>
          <GiftForm films={fundable} defaultFilmId={sp.film} />
        </div>
      </div>
    </section>
  );
}
