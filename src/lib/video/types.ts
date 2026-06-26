// Provider-agnostic video host contract.
// Swapping Mux → Vimeo OTT / Bunny Stream means implementing this interface;
// nothing in the app imports a provider SDK directly.

export interface PlaybackToken {
  /** Opaque playback identifier the player needs (e.g. Mux playback id). */
  playbackId: string;
  /** Signed token / JWT, when the asset requires signed playback. */
  token?: string;
  /** Signed token for the poster/thumbnail, if the provider needs one. */
  thumbnailToken?: string;
  /** Signed token for the storyboard, if the provider needs one. */
  storyboardToken?: string;
  /** Seconds until the token expires. */
  expiresIn: number;
  provider: VideoProviderName;
}

export interface UploadTicket {
  /** Direct, time-limited URL the client PUTs the source file to. */
  uploadUrl: string;
  /** Provider id to poll/store while the asset processes. */
  uploadId: string;
  provider: VideoProviderName;
}

export type VideoProviderName = "mux" | "vimeo" | "bunny";

export interface VideoProvider {
  readonly name: VideoProviderName;
  /** Mint a (signed) playback token for an asset the viewer is cleared to watch. */
  getPlaybackToken(
    videoRef: string,
    opts?: { audience?: "video" | "thumbnail" | "gif"; ttlSeconds?: number },
  ): Promise<PlaybackToken>;
  /** Create a direct-upload ticket for the admin to push a new master file.
   *  `passthrough` is echoed back on the asset webhook to link it to a film. */
  getUploadUrl(opts?: {
    corsOrigin?: string;
    passthrough?: string;
  }): Promise<UploadTicket>;
}
