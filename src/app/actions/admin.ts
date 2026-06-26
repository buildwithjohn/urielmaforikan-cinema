"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function assertAdmin() {
  if (!(await isAdmin())) throw new Error("Forbidden");
}

const filmSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(1),
  slug: z.string().optional(),
  logline: z.string().optional(),
  synopsis: z.string().optional(),
  status: z.enum(["coming_soon", "now_showing", "archive"]),
  poster_url: z.string().url().optional().or(z.literal("")),
  backdrop_url: z.string().url().optional().or(z.literal("")),
  trailer_ref: z.string().optional(),
  video_source: z.enum(["mux", "youtube"]).default("mux"),
  video_ref: z.string().optional(),
  release_date: z.string().optional(),
  required_tier: z.enum(["free", "registered", "supporter"]),
  response_content: z.string().optional(),
  featured: z.union([z.literal("on"), z.boolean()]).optional(),
});

export async function upsertFilm(formData: FormData) {
  await assertAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = filmSchema.parse(raw);

  const slug = parsed.slug?.trim() || slugify(parsed.title);
  const row = {
    title: parsed.title,
    slug,
    logline: parsed.logline || null,
    synopsis: parsed.synopsis || null,
    status: parsed.status,
    poster_url: parsed.poster_url || null,
    backdrop_url: parsed.backdrop_url || null,
    trailer_ref: parsed.trailer_ref || null,
    video_source: parsed.video_source,
    video_ref: parsed.video_ref || null,
    release_date: parsed.release_date || null,
    required_tier: parsed.required_tier,
    response_content: parsed.response_content || null,
    featured: parsed.featured === "on" || parsed.featured === true,
  };

  const supabase = createAdminClient();
  if (parsed.id) {
    await supabase.from("films").update(row).eq("id", parsed.id);
  } else {
    await supabase.from("films").insert(row);
  }

  revalidatePath("/admin/films");
  revalidatePath("/films");
  revalidatePath("/");
}

export async function deleteFilm(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminClient();
  await supabase.from("films").delete().eq("id", id);
  revalidatePath("/admin/films");
}

const premiereSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  film_id: z.string().uuid(),
  title: z.string().optional(),
  scheduled_open_at: z.string().min(1),
  status: z.enum(["scheduled", "live", "ended", "canceled"]),
});

export async function upsertPremiere(formData: FormData) {
  await assertAdmin();
  const parsed = premiereSchema.parse(
    Object.fromEntries(formData) as Record<string, string>,
  );
  const row = {
    film_id: parsed.film_id,
    title: parsed.title || null,
    scheduled_open_at: new Date(parsed.scheduled_open_at).toISOString(),
    status: parsed.status,
  };

  const supabase = createAdminClient();
  if (parsed.id) {
    await supabase.from("premieres").update(row).eq("id", parsed.id);
  } else {
    await supabase.from("premieres").insert(row);
  }
  revalidatePath("/admin/premieres");
  revalidatePath("/premieres");
}

export async function setResponseHandled(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const handled = formData.get("handled") === "true";
  const supabase = createAdminClient();
  await supabase.from("responses").update({ handled }).eq("id", id);
  revalidatePath("/admin/responses");
}
