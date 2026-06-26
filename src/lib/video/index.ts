import "server-only";
import { muxProvider } from "./mux";
import type { VideoProvider, VideoProviderName } from "./types";

export * from "./types";

/**
 * Resolve the active video provider from VIDEO_PROVIDER.
 * To add Vimeo OTT / Bunny Stream: implement the VideoProvider interface in a
 * sibling file and register it in the map below — nothing else changes.
 */
const providers: Partial<Record<VideoProviderName, VideoProvider>> = {
  mux: muxProvider,
  // vimeo: vimeoProvider,
  // bunny: bunnyProvider,
};

export function getVideoProvider(): VideoProvider {
  const name = (process.env.VIDEO_PROVIDER ?? "mux") as VideoProviderName;
  const provider = providers[name];
  if (!provider) {
    throw new Error(
      `Video provider "${name}" is not implemented. Available: ${Object.keys(
        providers,
      ).join(", ")}`,
    );
  }
  return provider;
}

/** Convenience wrappers used by server actions / route handlers. */
export function getPlaybackToken(
  videoRef: string,
  opts?: Parameters<VideoProvider["getPlaybackToken"]>[1],
) {
  return getVideoProvider().getPlaybackToken(videoRef, opts);
}

export function getUploadUrl(
  opts?: Parameters<VideoProvider["getUploadUrl"]>[0],
) {
  return getVideoProvider().getUploadUrl(opts);
}
