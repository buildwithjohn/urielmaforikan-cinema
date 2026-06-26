import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AccessTier, Viewer } from "@/types/db";

const TIER_RANK: Record<AccessTier, number> = {
  free: 0,
  registered: 1,
  supporter: 2,
};

/** True if `have` satisfies the `need` access tier. */
export function tierSatisfies(have: AccessTier, need: AccessTier) {
  return TIER_RANK[have] >= TIER_RANK[need];
}

/** The signed-in Supabase auth user, or null. */
export async function getAuthUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * The viewer row for the signed-in user, creating it on first sight.
 * Anonymous visitors get null.
 */
export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("viewers")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existing) return existing as Viewer;

  // First sign-in — provision a registered viewer.
  const { data: created } = await supabase
    .from("viewers")
    .insert({
      auth_user_id: user.id,
      email: user.email!,
      name: (user.user_metadata?.name as string) ?? null,
      access_tier: "registered",
      consent_email: true,
      consent_terms: true,
    })
    .select("*")
    .single();

  return (created as Viewer) ?? null;
}

/** Admin gate — allow-list by email via ADMIN_EMAILS. */
export async function isAdmin(): Promise<boolean> {
  const user = await getAuthUser();
  if (!user?.email) return false;
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(user.email.toLowerCase());
}
