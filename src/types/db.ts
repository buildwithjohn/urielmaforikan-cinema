// Domain types — mirror the Supabase schema in supabase/migrations.
// Kept hand-authored (rather than generated) so the app reads cleanly;
// regenerate with `supabase gen types typescript` when the schema grows.

export type FilmStatus = "coming_soon" | "now_showing" | "archive";
export type CreditRole = "cast" | "crew";
export type AccessTier = "free" | "registered" | "supporter";
export type PremiereStatus = "scheduled" | "live" | "ended" | "canceled";
export type ResponseType = "prayer" | "decision" | "contact_request";
export type GiftRecurrence = "one_time" | "monthly";
export type GiftStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Film {
  id: string;
  title: string;
  slug: string;
  logline: string | null;
  synopsis: string | null;
  status: FilmStatus;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_ref: string | null; // YouTube id / Mux playback id for trailer
  video_ref: string | null; // Mux playback id (signed) for the feature
  duration_seconds: number | null;
  release_date: string | null;
  required_tier: AccessTier;
  response_content: string | null; // the ministry hand-off shown after the film
  featured: boolean;
  created_at: string;
}

export interface Credit {
  id: string;
  film_id: string;
  name: string;
  role: CreditRole;
  character_or_title: string | null;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
}

export interface Viewer {
  id: string;
  auth_user_id: string | null;
  email: string;
  name: string | null;
  access_tier: AccessTier;
  consent_email: boolean;
  consent_terms: boolean;
  created_at: string;
}

export interface Premiere {
  id: string;
  film_id: string;
  title: string | null;
  scheduled_open_at: string;
  status: PremiereStatus;
  created_at: string;
  film?: Film;
  rsvp_count?: number;
}

export interface PremiereRsvp {
  id: string;
  premiere_id: string;
  viewer_id: string;
  created_at: string;
}

export interface Response {
  id: string;
  viewer_id: string | null;
  film_id: string | null;
  type: ResponseType;
  message: string | null;
  contact_email: string | null;
  contact_name: string | null;
  handled: boolean;
  created_at: string;
}

export interface Gift {
  id: string;
  viewer_id: string | null;
  amount: number; // minor units
  currency: string;
  recurrence: GiftRecurrence;
  designated_film_id: string | null;
  designated_fund: string | null;
  processor: string;
  processor_ref: string | null;
  status: GiftStatus;
  donor_email: string | null;
  donor_name: string | null;
  created_at: string;
}
