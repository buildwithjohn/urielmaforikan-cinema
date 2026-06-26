import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Credit, Film } from "@/types/db";

export async function getFilms(opts?: {
  status?: Film["status"];
}): Promise<Film[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  let query = supabase
    .from("films")
    .select("*")
    .order("featured", { ascending: false })
    .order("release_date", { ascending: false, nullsFirst: false });
  if (opts?.status) query = query.eq("status", opts.status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Film[];
}

export async function getFeaturedFilm(): Promise<Film | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("films")
    .select("*")
    .eq("featured", true)
    .limit(1)
    .maybeSingle();
  return (data as Film) ?? null;
}

export async function getFilmBySlug(slug: string): Promise<Film | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("films")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Film) ?? null;
}

export async function getCredits(filmId: string): Promise<Credit[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("credits")
    .select("*")
    .eq("film_id", filmId)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Credit[];
}
