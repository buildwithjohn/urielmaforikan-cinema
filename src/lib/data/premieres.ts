import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Premiere } from "@/types/db";

export async function getPremieres(): Promise<Premiere[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("premieres")
    .select("*, film:films(*)")
    .neq("status", "canceled")
    .order("scheduled_open_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Premiere[];
}

export async function getPremiereById(id: string): Promise<Premiere | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("premieres")
    .select("*, film:films(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as Premiere) ?? null;
}
