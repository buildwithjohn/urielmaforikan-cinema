-- ─────────────────────────────────────────────────────────────
-- Seed: The Witness (featured) + sample films, credits, premieres.
-- Idempotent on slug. Run via `supabase db reset` or psql.
-- Poster/backdrop use Unsplash placeholders — replace with real art.
-- video_ref / trailer_ref are placeholder Mux playback ids.
-- ─────────────────────────────────────────────────────────────

insert into admin_emails (email) values ('hello@urielmaforikan.org')
  on conflict do nothing;

-- The Witness ---------------------------------------------------
insert into films (title, slug, logline, synopsis, status, poster_url, backdrop_url,
  trailer_ref, video_ref, duration_seconds, release_date, required_tier,
  response_content, featured)
values (
  'The Witness',
  'the-witness',
  'A man who saw everything must decide whether silence is safety — or surrender.',
  'In a city that has learned to look away, Daniel is the only one who remembers what he saw. As pressure mounts to forget, an old street preacher reminds him that a witness was never meant to stay quiet. The Witness is a story about the cost — and the freedom — of telling the truth you cannot un-see.',
  'now_showing',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=2000&auto=format&fit=crop',
  'dQw4w9WgXcQ',
  'SIGNED_PLAYBACK_ID_THE_WITNESS',
  4920,
  '2026-05-30',
  'registered',
  'You just watched a man decide to speak. Maybe something stirred while you watched — a question, a memory, a quiet pull. That is not an accident. If you''d like prayer, if you''re ready to make a decision to follow Jesus, or if you simply want someone to talk to, we are here. Tell us, and a real person from our team will respond.',
  true
)
on conflict (slug) do nothing;

-- Living Water --------------------------------------------------
insert into films (title, slug, logline, synopsis, status, poster_url, backdrop_url,
  trailer_ref, required_tier, release_date, response_content)
values (
  'Living Water',
  'living-water',
  'A drought-stricken village and a stranger with an impossible promise.',
  'When the wells run dry, a wandering woman arrives speaking of water that never runs out. A short film retelling of an ancient encounter, set against the cracked earth of the present day.',
  'now_showing',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop',
  'dQw4w9WgXcQ',
  'free',
  '2026-03-14',
  'Thirsty for more than water? We''d love to pray with you.'
)
on conflict (slug) do nothing;

-- The Prodigal Road ---------------------------------------------
insert into films (title, slug, logline, synopsis, status, poster_url, backdrop_url,
  trailer_ref, required_tier, release_date, response_content)
values (
  'The Prodigal Road',
  'the-prodigal-road',
  'He spent everything to get away. The hardest journey is the road back.',
  'A feature in development following two brothers, one inheritance, and a father who keeps the porch light on. Coming soon to the cinema.',
  'coming_soon',
  'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop',
  'dQw4w9WgXcQ',
  'registered',
  '2026-11-01',
  'This story is still being made. Join the audience and you''ll be first through the doors.'
)
on conflict (slug) do nothing;

-- Credits for The Witness --------------------------------------
insert into credits (film_id, name, role, character_or_title, bio, photo_url, sort_order)
select f.id, c.name, c.role::credit_role, c.cot, c.bio, c.photo, c.ord
from films f
join (values
  ('Daniel Okafor', 'cast', 'Daniel — The Witness', 'A stage actor stepping into his first lead film role.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', 0),
  ('Grace Adeyemi', 'cast', 'Mama Ruth', 'Known across the region for her work in faith-based theatre.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop', 1),
  ('Uriel Maforikan', 'crew', 'Director & Writer', 'Founder of the ministry — an evangelist who carries a camera.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', 2),
  ('Samuel Eze', 'crew', 'Director of Photography', 'Chases light into dark rooms for a living.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop', 3)
) as c(name, role, cot, bio, photo, ord) on true
where f.slug = 'the-witness'
on conflict do nothing;

-- A premiere for The Prodigal Road -----------------------------
insert into premieres (film_id, title, scheduled_open_at, status)
select id, 'The Prodigal Road — World Premiere', now() + interval '21 days', 'scheduled'
from films where slug = 'the-prodigal-road'
on conflict do nothing;

-- A near-term watch-together for Living Water ------------------
insert into premieres (film_id, title, scheduled_open_at, status)
select id, 'Living Water — Audience Screening', now() + interval '3 days', 'scheduled'
from films where slug = 'living-water'
on conflict do nothing;
