import type { Metadata } from "next";
import { getFilms } from "@/lib/data/films";
import { FilmCard } from "@/components/films/film-card";
import { SectionHeading } from "@/components/site/section-heading";
import { LightShafts } from "@/components/brand/light-shafts";
import type { Film } from "@/types/db";

export const metadata: Metadata = {
  title: "Films",
  description: "The complete cinema of Uriel Maforikan Productions.",
};

const GROUPS: { status: Film["status"]; label: string; blurb: string }[] = [
  { status: "now_showing", label: "Now Showing", blurb: "Open to the audience." },
  { status: "coming_soon", label: "Coming Soon", blurb: "In production or scheduled." },
  { status: "archive", label: "From the Archive", blurb: "Past releases, still telling." },
];

export default async function FilmsPage() {
  const films = await getFilms();

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/10 bg-navy">
        <LightShafts density={3} />
        <div className="container relative py-20">
          <SectionHeading
            eyebrow="The Cinema"
            title="Every film we've made."
            description="From premieres to the archive — each story ends with an open door."
          />
        </div>
      </section>

      <div className="container space-y-16 py-16">
        {GROUPS.map(({ status, label, blurb }) => {
          const group = films.filter((f) => f.status === status);
          if (group.length === 0) return null;
          return (
            <section key={status}>
              <div className="mb-6 flex items-baseline gap-4">
                <h2 className="font-serif text-2xl text-cream">{label}</h2>
                <span className="text-sm text-cream-muted">{blurb}</span>
              </div>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {group.map((film) => (
                  <FilmCard key={film.id} film={film} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
