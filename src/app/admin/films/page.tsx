import Link from "next/link";
import { getFilms } from "@/lib/data/films";
import { deleteFilm } from "@/app/actions/admin";
import { FilmForm } from "@/components/admin/film-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

export default async function AdminFilmsPage() {
  const films = await getFilms();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 font-serif text-3xl text-cream">Films</h1>
        <div className="space-y-3">
          {films.map((film) => (
            <div
              key={film.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-navy p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="truncate font-medium text-cream">
                    {film.title}
                  </span>
                  <Badge variant="muted">{film.status}</Badge>
                  {film.featured && <Badge>Featured</Badge>}
                </div>
                <p className="truncate text-xs text-cream-muted">/{film.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/admin/films/${film.id}`} aria-label="Edit">
                    <Pencil />
                  </Link>
                </Button>
                <form action={deleteFilm}>
                  <input type="hidden" name="id" value={film.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                  >
                    <Trash2 className="text-red-400" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a film</CardTitle>
        </CardHeader>
        <CardContent>
          <FilmForm />
        </CardContent>
      </Card>
    </div>
  );
}
