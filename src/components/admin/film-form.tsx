import { upsertFilm } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Film } from "@/types/db";

const fieldCls =
  "flex h-11 w-full rounded-md border border-border bg-navy-deep/60 px-4 text-sm text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

/** Create/edit form for a Film. Posts to the upsertFilm server action. */
export function FilmForm({ film }: { film?: Film }) {
  return (
    <form action={upsertFilm} className="space-y-5">
      {film && <input type="hidden" name="id" value={film.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={film?.title} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (optional)</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="auto from title"
            defaultValue={film?.slug}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="logline">Logline</Label>
        <Input id="logline" name="logline" defaultValue={film?.logline ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="synopsis">Synopsis</Label>
        <Textarea id="synopsis" name="synopsis" defaultValue={film?.synopsis ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={film?.status ?? "coming_soon"}
            className={fieldCls}
          >
            <option value="coming_soon">Coming soon</option>
            <option value="now_showing">Now showing</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="required_tier">Required tier</Label>
          <select
            id="required_tier"
            name="required_tier"
            defaultValue={film?.required_tier ?? "registered"}
            className={fieldCls}
          >
            <option value="free">Free</option>
            <option value="registered">Registered</option>
            <option value="supporter">Supporter</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="release_date">Release date</Label>
          <Input
            id="release_date"
            name="release_date"
            type="date"
            defaultValue={film?.release_date ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="poster_url">Poster URL</Label>
          <Input id="poster_url" name="poster_url" defaultValue={film?.poster_url ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="backdrop_url">Backdrop URL</Label>
          <Input id="backdrop_url" name="backdrop_url" defaultValue={film?.backdrop_url ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="trailer_ref">Trailer ref (YouTube id)</Label>
          <Input id="trailer_ref" name="trailer_ref" defaultValue={film?.trailer_ref ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="video_source">Video source</Label>
          <select
            id="video_source"
            name="video_source"
            defaultValue={film?.video_source ?? "mux"}
            className={fieldCls}
          >
            <option value="mux">Mux — signed feature (upload above)</option>
            <option value="youtube">YouTube — public short / series</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="video_ref">
            Video ref — Mux playback id, or YouTube id for YouTube source
          </Label>
          <Input id="video_ref" name="video_ref" defaultValue={film?.video_ref ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="response_content">Response / hand-off text</Label>
        <Textarea
          id="response_content"
          name="response_content"
          defaultValue={film?.response_content ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-cream-dim">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={film?.featured}
          className="accent-gold"
        />
        Feature on the home page
      </label>

      <Button type="submit">{film ? "Save changes" : "Create film"}</Button>
    </form>
  );
}
