/** True when the public Supabase env is present. Lets the app render its
 *  design without a backend (data helpers return empty results instead of
 *  throwing) — useful for previews and styling work. */
export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
