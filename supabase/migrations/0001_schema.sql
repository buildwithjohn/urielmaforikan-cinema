-- ─────────────────────────────────────────────────────────────
-- Uriel Maforikan Productions — core schema
-- ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- Enums ---------------------------------------------------------
create type film_status   as enum ('coming_soon', 'now_showing', 'archive');
create type credit_role   as enum ('cast', 'crew');
create type access_tier   as enum ('free', 'registered', 'supporter');
create type premiere_status as enum ('scheduled', 'live', 'ended', 'canceled');
create type response_type as enum ('prayer', 'decision', 'contact_request');
create type gift_recurrence as enum ('one_time', 'monthly');
create type gift_status   as enum ('pending', 'succeeded', 'failed', 'refunded');

-- Films ---------------------------------------------------------
create table films (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  logline          text,
  synopsis         text,
  status           film_status not null default 'coming_soon',
  poster_url       text,
  backdrop_url     text,
  trailer_ref      text,
  video_ref        text,
  duration_seconds integer,
  release_date     date,
  required_tier    access_tier not null default 'registered',
  response_content text,
  featured         boolean not null default false,
  created_at       timestamptz not null default now()
);
create index films_status_idx on films (status);

-- Credits (cast & crew) ----------------------------------------
create table credits (
  id                 uuid primary key default gen_random_uuid(),
  film_id            uuid not null references films(id) on delete cascade,
  name               text not null,
  role               credit_role not null,
  character_or_title text,
  bio                text,
  photo_url          text,
  sort_order         integer not null default 0
);
create index credits_film_idx on credits (film_id);

-- Viewers (audience) -------------------------------------------
create table viewers (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique references auth.users(id) on delete set null,
  email         text not null,
  name          text,
  access_tier   access_tier not null default 'registered',
  consent_email boolean not null default false,
  consent_terms boolean not null default false,
  created_at    timestamptz not null default now()
);
create unique index viewers_email_idx on viewers (lower(email));

-- Premieres -----------------------------------------------------
create table premieres (
  id                uuid primary key default gen_random_uuid(),
  film_id           uuid not null references films(id) on delete cascade,
  title             text,
  scheduled_open_at timestamptz not null,
  status            premiere_status not null default 'scheduled',
  created_at        timestamptz not null default now()
);
create index premieres_open_idx on premieres (scheduled_open_at);

create table premiere_rsvps (
  id           uuid primary key default gen_random_uuid(),
  premiere_id  uuid not null references premieres(id) on delete cascade,
  viewer_id    uuid not null references viewers(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (premiere_id, viewer_id)
);

-- Responses (the ministry hand-off) ----------------------------
create table responses (
  id            uuid primary key default gen_random_uuid(),
  viewer_id     uuid references viewers(id) on delete set null,
  film_id       uuid references films(id) on delete set null,
  type          response_type not null,
  message       text,
  contact_email text,
  contact_name  text,
  handled       boolean not null default false,
  created_at    timestamptz not null default now()
);
create index responses_film_idx on responses (film_id);
create index responses_handled_idx on responses (handled);

-- Gifts (giving) -----------------------------------------------
create table gifts (
  id                 uuid primary key default gen_random_uuid(),
  viewer_id          uuid references viewers(id) on delete set null,
  amount             integer not null,             -- minor units
  currency           text not null default 'usd',
  recurrence         gift_recurrence not null default 'one_time',
  designated_film_id uuid references films(id) on delete set null,
  designated_fund    text,
  processor          text not null default 'stripe',
  processor_ref      text unique,
  status             gift_status not null default 'pending',
  donor_email        text,
  donor_name         text,
  created_at         timestamptz not null default now()
);
create index gifts_status_idx on gifts (status);

-- Helper: is the current auth user an admin? Reads a GUC set per request,
-- falling back to a table of admin emails kept in sync with ADMIN_EMAILS.
create table admin_emails (
  email text primary key
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public, auth as $$
  select exists (
    select 1 from admin_emails a
    join auth.users u on lower(u.email) = lower(a.email)
    where u.id = auth.uid()
  );
$$;
