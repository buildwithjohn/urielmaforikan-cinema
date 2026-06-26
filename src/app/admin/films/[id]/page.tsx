import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FilmForm } from "@/components/admin/film-form";
import { FilmUploader } from "@/components/admin/film-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { Film } from "@/types/db";

export default async function EditFilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("films").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const film = data as Film;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/admin/films">
          <ArrowLeft /> All films
        </Link>
      </Button>
      <h1 className="mb-6 font-serif text-3xl text-cream">Edit “{film.title}”</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Film file</CardTitle>
        </CardHeader>
        <CardContent>
          <FilmUploader filmId={film.id} hasVideo={!!film.video_ref} />
        </CardContent>
      </Card>

      <FilmForm film={film} />
    </div>
  );
}
