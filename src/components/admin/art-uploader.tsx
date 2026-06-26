"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUp, Loader2 } from "lucide-react";

/**
 * Studio image field with drag-or-click upload to Supabase Storage. The
 * resolved public URL is bound to a real form input (`name`) so the existing
 * upsertFilm action reads it unchanged. You can also paste a URL directly.
 */
export function ArtUploader({
  name,
  kind,
  label,
  defaultValue,
  aspect = "aspect-video",
}: {
  name: string;
  kind: "poster" | "backdrop";
  label: string;
  defaultValue?: string | null;
  aspect?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/admin/upload-art", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex gap-4">
        {/* Preview */}
        <div
          className={`relative ${aspect} w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-navy-deep`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-cream-muted">
              <ImageUp className="size-6" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-fit"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <ImageUp /> Upload image
              </>
            )}
          </Button>
          {/* Real form field — also editable as a URL */}
          <Input
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="…or paste an image URL"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
