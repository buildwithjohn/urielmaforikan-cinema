import "server-only";
import Mux from "@mux/mux-node";
import type { PlaybackToken, UploadTicket, VideoProvider } from "./types";

/**
 * Mux provider. Uses signed playback policy: every play requires a JWT minted
 * here with the account's signing key, so a leaked playback id is useless.
 *
 * Requires: MUX_TOKEN_ID, MUX_TOKEN_SECRET, MUX_SIGNING_KEY_ID,
 * MUX_SIGNING_KEY_PRIVATE (base64 of the PEM private key).
 */
function muxClient() {
  return new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  });
}

const DEFAULT_TTL = 60 * 60 * 4; // 4h — comfortably longer than a feature film

export const muxProvider: VideoProvider = {
  name: "mux",

  async getPlaybackToken(videoRef, opts): Promise<PlaybackToken> {
    const ttl = opts?.ttlSeconds ?? DEFAULT_TTL;
    const mux = muxClient();

    const sign = (type: "video" | "thumbnail" | "storyboard" | "gif") =>
      mux.jwt.signPlaybackId(videoRef, {
        type,
        keyId: process.env.MUX_SIGNING_KEY_ID,
        keySecret: process.env.MUX_SIGNING_KEY_PRIVATE,
        expiration: `${ttl}s`,
      });

    const [token, thumbnailToken, storyboardToken] = await Promise.all([
      sign("video"),
      sign("thumbnail"),
      sign("storyboard"),
    ]);

    return {
      playbackId: videoRef,
      token,
      thumbnailToken,
      storyboardToken,
      expiresIn: ttl,
      provider: "mux",
    };
  },

  async getUploadUrl(opts): Promise<UploadTicket> {
    const mux = muxClient();
    const upload = await mux.video.uploads.create({
      cors_origin: opts?.corsOrigin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "*",
      new_asset_settings: {
        playback_policy: ["signed"],
        encoding_tier: "smart",
      },
    });
    return {
      uploadUrl: upload.url,
      uploadId: upload.id,
      provider: "mux",
    };
  },
};
