-- ─────────────────────────────────────────────────────────────
-- Films can be hosted on Mux (signed, gated — main features) OR on
-- YouTube (public embed — shorts & series). Default existing rows to mux.
-- ─────────────────────────────────────────────────────────────
create type video_source as enum ('mux', 'youtube');

alter table films
  add column video_source video_source not null default 'mux';

comment on column films.video_source is
  'Where the feature plays from. mux = signed playback (video_ref is a Mux playback id); youtube = public embed (video_ref is a YouTube id).';
