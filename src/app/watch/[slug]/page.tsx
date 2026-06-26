import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getFilmBySlug } from "@/lib/data/films";
import { getViewer, tierSatisfies } from "@/lib/auth";
import { getPlaybackToken } from "@/lib/video";
import { WatchExperience } from "@/components/films/watch-experience";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import type { PlaybackToken } from "@/lib/video/types";

export const metadata: Metadata = { title: "Watch", robots: { index: false } };

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const film = await getFilmBySlug(slug);
  if (!film) notFound();

  // ── Access control ──────────────────────────────────────────
  const viewer = await getViewer();
  if (!viewer && film.required_tier !== "free") {
    redirect(`/auth/sign-in?next=/watch/${slug}`);
  }
  const cleared = viewer
    ? tierSatisfies(viewer.access_tier, film.required_tier)
    : film.required_tier === "free";
  if (!cleared) redirect(`/films/${slug}`);

  if (film.status !== "now_showing" || !film.video_ref) {
    redirect(`/films/${slug}`);
  }

  // ── Mint a signed playback token (provider-agnostic) ────────
  let token: PlaybackToken | null = null;
  let tokenError: string | null = null;
  try {
    token = await getPlaybackToken(film.video_ref);
  } catch (err) {
    tokenError =
      err instanceof Error ? err.message : "Could not start playback.";
    console.error("[watch] token error", err);
  }

  return (
    <div className="container max-w-5xl py-10">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href={`/films/${slug}`}>
          <ArrowLeft /> Back to film
        </Link>
      </Button>

      <h1 className="mb-6 font-serif text-3xl text-cream">{film.title}</h1>

      {token ? (
        <WatchExperience
          token={token}
          filmId={film.id}
          title={film.title}
          responseContent={film.response_content}
        />
      ) : (
        <div className="flex items-start gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
          <AlertTriangle className="mt-0.5 size-6 shrink-0 text-amber-400" />
          <div>
            <p className="font-medium text-cream">Playback isn&apos;t configured yet</p>
            <p className="mt-1 text-sm text-cream-dim">
              The video host couldn&apos;t mint a signed token. Set your{" "}
              <code className="text-gold">MUX_*</code> keys and a real{" "}
              <code className="text-gold">video_ref</code> for this film.
            </p>
            {tokenError && (
              <p className="mt-2 font-mono text-xs text-cream-muted">
                {tokenError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
